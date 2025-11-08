import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface HotspotConfig {
	x: number;
	y: number;
	z: number;
	target: string;
	label: string;
}

interface RoomConfig {
	id: string;
	name: string;
	image: string;
	hotspots: HotspotConfig[];
}

const rooms: RoomConfig[] = [
	{
		id: "room1",
		name: "Phòng khách",
		image: "/gallery/treetop_balcony.jpg",
		hotspots: [
			{ x: 40, y: 0, z: -30, target: "room2", label: "🚪 Đi tới phòng ngủ" },
			{ x: -40, y: 0, z: 30, target: "room3", label: "🚪 Đi ra ngoài trời" },
		],
	},
	{
		id: "room2",
		name: "Phòng ngủ",
		image: "/gallery/room2.jpg",
		hotspots: [
			{ x: -50, y: 0, z: 0, target: "room1", label: "🔙 Quay về phòng khách" },
		],
	},
	{
		id: "room3",
		name: "Ngoài trời",
		image: "/gallery/room1.jpg",
		hotspots: [
			{ x: 50, y: 0, z: 0, target: "room1", label: "🔙 Quay về phòng khách" },
		],
	},
];

export default function VRGalleryTour() {
	const mountRef = useRef<HTMLDivElement | null>(null);
	const [currentRoom, setCurrentRoom] = useState("room1");
	const [tooltip, setTooltip] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	// ✅ FIX: Dùng ref để tránh re-render lag
	const isInteractingRef = useRef(false);
	const mouseRef = useRef({ x: 0, y: 0 });

	useEffect(() => {
		const mount = mountRef.current!;
		if (!mount) return;

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			75,
			mount.clientWidth / mount.clientHeight,
			0.1,
			1000
		);
		camera.position.set(0, 0, 0.1);

		const renderer = new THREE.WebGLRenderer({
			antialias: false, // ✅ TẮT antialias để tăng FPS
			alpha: false,
			powerPreference: "high-performance", // ✅ GPU performance
		});
		renderer.setSize(mount.clientWidth, mount.clientHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // ✅ Giảm từ 2 → 1.5
		(renderer as any).outputColorSpace = THREE.SRGBColorSpace;
		mount.appendChild(renderer.domElement);

		// ✅ Giảm segments: 128 → 60
		const RADIUS = 500;
		const geometry = new THREE.SphereGeometry(RADIUS, 60, 60);
		geometry.scale(-1, 1, 1);
		const material = new THREE.MeshBasicMaterial();
		const sphere = new THREE.Mesh(geometry, material);
		scene.add(sphere);

		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2();
		const hotspotMeshes: THREE.Mesh[] = [];

		function loadRoom(id: string) {
			const room = rooms.find((r) => r.id === id);
			if (!room) return;

			setCurrentRoom(id);
			setLoading(true);

			const loader = new THREE.TextureLoader();
			loader.load(
				room.image,
				(texture) => {
					(texture as any).colorSpace = THREE.SRGBColorSpace;
					texture.minFilter = THREE.LinearFilter;
					texture.magFilter = THREE.LinearFilter;
					texture.anisotropy = 4; // ✅ Giảm từ max → 4

					material.map = texture;
					material.needsUpdate = true;
					setLoading(false);
				},
				undefined,
				(error) => {
					console.error("Error loading texture:", error);
					setLoading(false);
				}
			);

			hotspotMeshes.forEach((m) => {
				scene.remove(m);
				m.geometry.dispose();
				(m.material as THREE.Material).dispose();
			});
			hotspotMeshes.length = 0;

			room.hotspots.forEach((h) => {
				const hotspotGeom = new THREE.SphereGeometry(3, 12, 12); // ✅ 16 → 12
				const hotspotMat = new THREE.MeshBasicMaterial({
					color: 0xff3b30,
					transparent: true,
					opacity: 0.8,
				});
				const hotspot = new THREE.Mesh(hotspotGeom, hotspotMat);
				hotspot.position.set(h.x, h.y, h.z);
				hotspot.userData = { target: h.target, label: h.label };

				const ringGeom = new THREE.RingGeometry(4, 5, 24); // ✅ 32 → 24
				const ringMat = new THREE.MeshBasicMaterial({
					color: 0xffffff,
					side: THREE.DoubleSide,
					transparent: true,
					opacity: 0.6,
				});
				const ring = new THREE.Mesh(ringGeom, ringMat);
				ring.lookAt(camera.position);
				hotspot.add(ring);

				scene.add(hotspot);
				hotspotMeshes.push(hotspot);
			});
		}

		loadRoom(currentRoom);

		let lon = 0, lat = 0;
		let onPointerDownLon = 0, onPointerDownLat = 0;
		let onPointerDownMouseX = 0, onPointerDownMouseY = 0;

		function onPointerDown(event: MouseEvent) {
			isInteractingRef.current = true;
			onPointerDownMouseX = event.clientX;
			onPointerDownMouseY = event.clientY;
			onPointerDownLon = lon;
			onPointerDownLat = lat;
		}

		// ✅ THROTTLE mousemove để giảm tải
		let lastMoveTime = 0;
		function onPointerMove(event: MouseEvent) {
			const now = Date.now();

			if (isInteractingRef.current) {
				lon = (onPointerDownMouseX - event.clientX) * 0.1 + onPointerDownLon;
				lat = (event.clientY - onPointerDownMouseY) * 0.1 + onPointerDownLat;
			}

			// ✅ Chỉ update raycasting mỗi 50ms
			if (now - lastMoveTime < 50) return;
			lastMoveTime = now;

			const rect = renderer.domElement.getBoundingClientRect();
			mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
			mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

			mouseRef.current = { x: event.clientX, y: event.clientY };
			setMousePosition({ x: event.clientX, y: event.clientY });

			raycaster.setFromCamera(mouse, camera);
			const intersects = raycaster.intersectObjects(hotspotMeshes);

			if (intersects.length > 0) {
				renderer.domElement.style.cursor = "pointer";
				setTooltip(intersects[0].object.userData.label);
			} else {
				renderer.domElement.style.cursor = isInteractingRef.current ? "grabbing" : "grab";
				setTooltip(null);
			}
		}

		function onPointerUp() {
			isInteractingRef.current = false;
		}

		function onClick() {
			raycaster.setFromCamera(mouse, camera);
			const intersects = raycaster.intersectObjects(hotspotMeshes);

			if (intersects.length > 0) {
				const target = intersects[0].object.userData.target;
				if (target) {
					loadRoom(target);
				}
			}
		}

		renderer.domElement.addEventListener("mousedown", onPointerDown);
		renderer.domElement.addEventListener("mousemove", onPointerMove);
		renderer.domElement.addEventListener("mouseup", onPointerUp);
		renderer.domElement.addEventListener("click", onClick);
		renderer.domElement.style.cursor = "grab";

		// ✅ Tối ưu animation loop
		let animationFrameId: number;
		const clock = new THREE.Clock();

		function animate() {
			animationFrameId = requestAnimationFrame(animate);

			lat = Math.max(-85, Math.min(85, lat));

			const phi = THREE.MathUtils.degToRad(90 - lat);
			const theta = THREE.MathUtils.degToRad(lon);

			const x = 500 * Math.sin(phi) * Math.cos(theta);
			const y = 500 * Math.cos(phi);
			const z = 500 * Math.sin(phi) * Math.sin(theta);

			camera.lookAt(x, y, z);

			// ✅ Tối ưu: chỉ animate hotspot khi có
			if (hotspotMeshes.length > 0) {
				const time = clock.getElapsedTime();
				const scale = 1 + Math.sin(time * 3) * 0.1; // Dùng clock thay Date.now()
				hotspotMeshes.forEach((hotspot) => {
					hotspot.scale.setScalar(scale);
				});
			}

			renderer.render(scene, camera);
		}
		animate();

		function onWindowResize() {
			camera.aspect = mount.clientWidth / mount.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(mount.clientWidth, mount.clientHeight);
		}
		window.addEventListener("resize", onWindowResize);

		return () => {
			cancelAnimationFrame(animationFrameId);
			window.removeEventListener("resize", onWindowResize);
			renderer.domElement.removeEventListener("mousedown", onPointerDown);
			renderer.domElement.removeEventListener("mousemove", onPointerMove);
			renderer.domElement.removeEventListener("mouseup", onPointerUp);
			renderer.domElement.removeEventListener("click", onClick);

			// ✅ Cleanup đúng cách
			hotspotMeshes.forEach((m) => {
				scene.remove(m);
				m.geometry.dispose();
				(m.material as THREE.Material).dispose();
			});

			if (mount.contains(renderer.domElement)) {
				mount.removeChild(renderer.domElement);
			}

			geometry.dispose();
			material.dispose();
			if (material.map) material.map.dispose();
			renderer.dispose();
		};
	}, []);

	const currentRoomData = rooms.find((r) => r.id === currentRoom);

	return (
		<div className="relative w-full h-screen bg-black">
			<div ref={mountRef} className="w-full h-full" />

			{loading && (
				<div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50">
					<div className="text-white text-xl">
						<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
						Đang tải...
					</div>
				</div>
			)}

			{tooltip && (
				<div
					className="absolute pointer-events-none bg-black/90 text-white px-4 py-2 rounded-lg text-sm shadow-lg z-40"
					style={{
						left: `${mousePosition.x + 15}px`,
						top: `${mousePosition.y + 15}px`,
					}}
				>
					{tooltip}
				</div>
			)}

			<div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 z-30">
				<h1 className="text-white text-2xl font-bold">
					📍 {currentRoomData?.name}
				</h1>
				<p className="text-white/70 text-sm mt-1">
					Kéo để xoay • Click vào điểm đỏ để di chuyển
				</p>
			</div>

			<div className="absolute top-20 right-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-4 z-30 max-w-xs">
				<p className="font-bold text-gray-800 mb-3 flex items-center gap-2">
					🗺️ Sơ đồ phòng
				</p>
				<div className="space-y-2">
					{rooms.map((room) => (
						<button
							key={room.id}
							onClick={() => setCurrentRoom(room.id)}
							className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${currentRoom === room.id
									? "bg-blue-500 text-white shadow-lg scale-105"
									: "bg-gray-100 text-gray-700 hover:bg-gray-200"
								}`}
						>
							<div className="font-medium">{room.name}</div>
							<div className="text-xs opacity-75 mt-1">
								{room.hotspots.length} điểm di chuyển
							</div>
						</button>
					))}
				</div>
			</div>

			<div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-3 rounded-lg text-sm z-30 backdrop-blur-sm">
				<div className="flex items-center gap-3">
					<span>🖱️ Kéo chuột: Xoay</span>
					<span className="text-gray-400">|</span>
					<span>🔴 Click điểm đỏ: Di chuyển</span>
				</div>
			</div>

			<div className="absolute bottom-4 right-4 w-16 h-16 bg-white/90 rounded-full shadow-lg flex items-center justify-center z-30">
				<div className="text-2xl">🧭</div>
			</div>
		</div>
	);
}