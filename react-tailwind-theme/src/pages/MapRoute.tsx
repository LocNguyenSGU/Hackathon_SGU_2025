import { useEffect, useState } from "react";
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ========== GIẢ LẬP DỮ LIỆU JSON ==========
const routeData = {
	success: true,
	route: [
		{
			id: 15,
			name: "Landmark 81 Skyview",
			type: "Adventure",
			latitude: 10.7946,
			longitude: 106.7217,
			location_address:
				"720A Đ. Điện Biên Phủ, Vinhomes Tân Cảng, Bình Thạnh, TP.HCM",
			price: 250000,
			visit_time: 90,
			travel_time: 4,
			score: 0.641,
			opening_hours: "09:00-22:00",
			facilities: ["parking", "restroom", "wifi", "restaurant"],
		},
		{
			id: 7,
			name: "Bitexco Financial Tower - Saigon Skydeck",
			type: "Adventure",
			latitude: 10.7717,
			longitude: 106.7038,
			location_address: "36 Hồ Tung Mậu, Bến Nghé, Quận 1, TP.HCM",
			price: 200000,
			visit_time: 90,
			travel_time: 4,
			score: 0.641,
			opening_hours: "09:30-21:30",
			facilities: ["parking", "restroom", "wifi", "restaurant"],
		},
		{
			id: 20,
			name: "Chợ Nổi Cái Răng",
			type: "Adventure",
			latitude: 10.0377,
			longitude: 105.7835,
			location_address: "Cái Răng, Cần Thơ (Tour từ TP.HCM)",
			price: 500000,
			visit_time: 360,
			travel_time: 194,
			score: 0.573,
			opening_hours: "05:00-09:00",
			facilities: ["boat", "guide", "restaurant"],
		},
		{
			id: 13,
			name: "Chùa Vĩnh Nghiêm",
			type: "Cultural",
			latitude: 10.7981,
			longitude: 106.6833,
			location_address:
				"339 Nam Kỳ Khởi Nghĩa, Phường 7, Quận 3, TP.HCM",
			price: 0,
			visit_time: 60,
			travel_time: 194,
			score: 0.344,
			opening_hours: "06:00-18:00",
			facilities: ["parking", "restroom"],
		},
		{
			id: 23,
			name: "Nhà Thờ Tân Định",
			type: "Cultural",
			latitude: 10.789,
			longitude: 106.6918,
			location_address: "289 Hai Bà Trưng, Phường 8, Quận 3, TP.HCM",
			price: 0,
			visit_time: 45,
			travel_time: 2,
			score: 0.345,
			opening_hours: "08:00-17:00",
			facilities: ["restroom"],
		},
		{
			id: 6,
			name: "Công Viên Tao Đàn",
			type: "Relaxation",
			latitude: 10.7823,
			longitude: 106.6918,
			location_address:
				"Đường Trương Định, Phường Bến Thành, Quận 1, TP.HCM",
			price: 0,
			visit_time: 60,
			travel_time: 1,
			score: 0.344,
			opening_hours: "05:00-21:00",
			facilities: ["restroom", "parking"],
		},
		{
			id: 1,
			name: "Nhà Thờ Đức Bà",
			type: "Cultural",
			latitude: 10.7797,
			longitude: 106.699,
			location_address:
				"01 Công xã Paris, Bến Nghé, Quận 1, TP.HCM",
			price: 0,
			visit_time: 60,
			travel_time: 1,
			score: 0.344,
			opening_hours: "08:00-17:00",
			facilities: ["parking", "restroom"],
		},
		{
			id: 11,
			name: "Bưu Điện Trung Tâm Sài Gòn",
			type: "Cultural",
			latitude: 10.7798,
			longitude: 106.6995,
			location_address:
				"02 Công xã Paris, Bến Nghé, Quận 1, TP.HCM",
			price: 0,
			visit_time: 45,
			travel_time: 0,
			score: 0.345,
			opening_hours: "07:00-19:00",
			facilities: ["restroom", "wifi", "shop"],
		},
	],
};

const MapRoute = () => {
	const [positions, setPositions] = useState<[number, number][]>([]);

	useEffect(() => {
		const pts = routeData.route.map((r) => [r.latitude, r.longitude]);
		setPositions(pts);
	}, []);

	// Icon tùy theo loại địa điểm
	const createIcon = (type: string) => {
		const iconUrl =
			type === "Adventure"
				? "https://cdn-icons-png.flaticon.com/512/684/684908.png"
				: type === "Cultural"
					? "https://cdn-icons-png.flaticon.com/512/3448/3448660.png"
					: "https://cdn-icons-png.flaticon.com/512/854/854894.png";

		return L.icon({
			iconUrl,
			iconSize: [36, 36],
			iconAnchor: [18, 36],
			popupAnchor: [0, -30],
		});
	};

	return (
		<div className="w-full h-[600px] rounded-xl shadow-lg overflow-hidden">
			<MapContainer
				center={[10.78, 106.7]}
				zoom={11}
				style={{ height: "100%", width: "100%" }}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				{/* Đường nối các điểm */}
				{positions.length > 1 && (
					<Polyline positions={positions} color="#0078FF" weight={4} />
				)}

				{/* Marker các điểm */}
				{routeData.route.map((loc, index) => (
					<Marker
						key={loc.id}
						position={[loc.latitude, loc.longitude]}
						icon={createIcon(loc.type)}
					>
						<Popup>
							<div className="space-y-2 w-[200px]">
								<img
									src={`https://source.unsplash.com/200x120/?${encodeURIComponent(
										loc.name
									)}`}
									alt={loc.name}
									className="rounded-md w-full h-[120px] object-cover"
								/>
								<div>
									<h3 className="font-semibold text-gray-800">
										{index + 1}. {loc.name}
									</h3>
									<p className="text-xs text-gray-500 italic">
										{loc.location_address}
									</p>
									<p className="text-xs text-gray-400 mt-1">
										⏰ {loc.opening_hours} <br />
										💰 {loc.price.toLocaleString()} đ
									</p>
								</div>
							</div>
						</Popup>
					</Marker>
				))}
			</MapContainer>
		</div>
	);
};

export default MapRoute;
