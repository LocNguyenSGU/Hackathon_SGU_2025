import React, { useEffect, useState } from 'react'
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    useMap,
} from 'react-leaflet'
import { MapPin, Navigation, Clock, DollarSign, X } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Sửa lỗi cho icon marker mặc định trong react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Component điều khiển kiểu bản đồ
const MapStyleController = ({ style, onChange }) => {
    const map = useMap()
    useEffect(() => {
        const tiles = {
            light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
            dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            satellite:
                'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        }
        map.eachLayer((layer) => {
            if (layer instanceof L.TileLayer) {
                map.removeLayer(layer)
            }
        })
        new L.TileLayer(tiles[style], {
            maxZoom: 19,
            subdomains: 'abcd',
        }).addTo(map)
    }, [style, map])
    return null
}

// Điều khiển bay đến marker
const FlyToMarker = ({ position, zoom }) => {
    const map = useMap()
    useEffect(() => {
        if (position) {
            map.flyTo(position, zoom, {
                duration: 1,
            })
        }
    }, [position, zoom, map])
    return null
}

// Hàm trợ giúp - PHẢI được định nghĩa trước component MapView
const getTypeColor = (type) => {
    const colors = {
        Adventure: '#FF6B6B',
        Cultural: '#4ECDC4',
        Relaxation: '#95E1D3',
        Food: '#FFA500',
        Shopping: '#9B59B6',
    }
    return colors[type] || '#95A5A6'
}

const getTypeIcon = (type) => {
    const icons = {
        Adventure: '🎢',
        Cultural: '🏛️',
        Relaxation: '🌳',
        Food: '🍜',
        Shopping: '🛍️',
    }
    return icons[type] || '📍'
}

const formatPrice = (price) => {
    if (price === 0) return 'Miễn phí'
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(price)
}

// Component chính
const MapView = () => {
    const [hoveredMarker, setHoveredMarker] = useState(null)
    const [selectedMarker, setSelectedMarker] = useState(null)
    const [mapStyle, setMapStyle] = useState('light')
    const [flyToPosition, setFlyToPosition] = useState(null)
    // Added state to toggle VR view
    const [showVR, setShowVR] = useState(false)

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    let apiData
    const tourRouteStr = localStorage.getItem('tourRoute');

    if (tourRouteStr) {
        const tourRoute = JSON.parse(tourRouteStr);
        console.log("tourRoute", tourRoute.route);
        apiData = tourRoute
    } else {
        console.warn("Không có dữ liệu tourRoute trong localStorage");
    }

    // Xử lý các điểm đến với thuộc tính bổ sung
    const destinations = apiData.route.map((dest, index) => ({
        ...dest,
        color: getTypeColor(dest.type),
        icon: getTypeIcon(dest.type),
        image: dest.images[0] || 'https://via.placeholder.com/100',
        order: index + 1,
    }))

    const handleSelectDestination = (dest) => {
        // Reset VR view when selecting/deselecting a destination
        setShowVR(false)
        setSelectedMarker(dest.id === selectedMarker ? null : dest.id)
        if (dest.id !== selectedMarker) {
            setFlyToPosition([dest.latitude, dest.longitude])
        }
    }

    const selectedDestination = destinations.find((d) => d.id === selectedMarker)
    const hoveredDestination = destinations.find((d) => d.id === hoveredMarker)

    // Tạo tọa độ đường đi cho tuyến đường
    const routeCoordinates = destinations.map((dest) => [
        dest.latitude,
        dest.longitude,
    ])

    return (
        <div className="relative w-full h-screen bg-gray-100 ">
            {/* Container bản đồ */}
            <MapContainer
                center={[10.7769, 106.7009]}
                zoom={13}
                className="absolute inset-0 w-full h-full z-0"
                zoomControl={false}
                attributionControl={false}
                dragging={true}
                touchZoom={true}
                doubleClickZoom={true}
                scrollWheelZoom={true}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    maxZoom={19}
                    subdomains="abcd"
                />
                {/* Điều khiển kiểu bản đồ */}
                <MapStyleController style={mapStyle} onChange={setMapStyle} />
                {/* Điều khiển bay đến vị trí */}
                {flyToPosition && <FlyToMarker position={flyToPosition} zoom={16} />}
                {/* Đường đi */}
                <Polyline
                    positions={routeCoordinates}
                    pathOptions={{
                        color: '#3498db',
                        weight: 3,
                        opacity: 0.6,
                        dashArray: '10, 10',
                        lineJoin: 'round',
                    }}
                />
                
                {/* Các marker */}
                {destinations.map((dest) => {
                    // Tạo icon tùy chỉnh
                    const customIcon = L.divIcon({
                        html: `
              <div class="custom-marker-wrapper">
                <div class="custom-marker" style="
                  width: 48px;
                  height: 48px;
                  background: white;
                  border: 3px solid ${dest.color};
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 20px;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                  cursor: pointer;
                  position: relative;
                  transition: all 0.3s ease;
                  ${hoveredMarker === dest.id || selectedMarker === dest.id ? 'transform: scale(1.1);' : ''}
                ">
                  <img src="${dest.image}" alt="${dest.name}" style="
                    width: 48px;
                    height: 48px;
                    background: white;
                    border: 3px solid ${dest.color};
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    cursor: pointer;
                    position: relative;
                    transition: all 0.3s ease;
                  ">
                  <div style="
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    width: 24px;
                    height: 24px;
                    background: ${dest.color};
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: bold;
                    border: 2px solid white;
                  ">${dest.order}</div>
                </div>
                <div style="
                  position: absolute;
                  left: 50%;
                  bottom: -8px;
                  transform: translateX(-50%);
                  width: 0;
                  height: 0;
                  border-left: 8px solid transparent;
                  border-right: 8px solid transparent;
                  border-top: 8px solid ${dest.color};
                "></div>
              </div>
            `,
                        className: 'custom-leaflet-marker',
                        iconSize: [48, 56],
                        iconAnchor: [24, 56],
                    })
                    return (
                        <Marker
                            key={dest.id}
                            position={[dest.latitude, dest.longitude]}
                            icon={customIcon}
                            eventHandlers={{
                                click: () => handleSelectDestination(dest),
                                mouseover: () => setHoveredMarker(dest.id),
                                mouseout: () => setHoveredMarker(null),
                            }}
                        >
                            <Popup>
                                <div className="text-sm font-medium">{dest.name}</div>
                                <div className="text-xs text-gray-600">{dest.type}</div>
                            </Popup>
                        </Marker>
                    )
                })}
            </MapContainer>

            {/* Danh sách điểm đến */}
            <div className="absolute bottom-16 left-4 md:left-6 bg-white rounded-xl shadow-xl max-w-sm max-h-[400px] overflow-y-auto z-[1000]">
                <div className='p-6'>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-bold text-gray-900">Lộ trình của bạn</h2>
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                {destinations.length} địa điểm
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-gray-50 rounded-lg p-2">
                            <div className="text-gray-500 text-xs">Tổng thời gian</div>
                            <div className="font-bold text-gray-900">
                                {Math.floor(
                                    apiData.route.reduce(
                                        (sum, d) => sum + d.visit_time + d.travel_time,
                                        0,
                                    ) / 60,
                                )}
                                giờ{' '}
                                {apiData.route.reduce(
                                    (sum, d) => sum + d.visit_time + d.travel_time,
                                    0,
                                ) % 60}
                                phút
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                            <div className="text-gray-500 text-xs">Tổng chi phí</div>
                            <div className="font-bold text-gray-900">
                                {formatPrice(apiData.route.reduce((sum, d) => sum + d.price, 0))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 rounded-t-xl">
                    <h3 className="font-semibold text-gray-900">Các điểm dừng</h3>
                </div>
                <div className=" divide-gray-100 h-[400px]">
                    {destinations.map((dest) => (
                        <div
                            key={dest.id}
                            onClick={() => handleSelectDestination(dest)}
                            onMouseEnter={() => setHoveredMarker(dest.id)}
                            onMouseLeave={() => setHoveredMarker(null)}
                            className={`p-3 cursor-pointer transition-all ${hoveredMarker === dest.id || selectedMarker === dest.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className="flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center overflow-hidden"
                                    style={{
                                        borderColor: dest.color,
                                        backgroundColor: `${dest.color}20`,
                                    }}
                                >
                                    <img
                                        src={dest.image}
                                        alt={dest.name}
                                        className="w-full h-full object-cover rounded-full"
                                        style={{
                                            border: `3px solid ${dest.color}`,
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                            cursor: "pointer",
                                            transition: "all 0.3s ease",
                                        }}
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="font-semibold text-sm text-gray-900 truncate">
                                            {dest.order}. {dest.name}
                                        </h4>
                                        <span className="flex-shrink-0 text-xs font-semibold text-gray-600">
                                            {formatPrice(dest.price)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {dest.visit_time} phút
                                        </span>
                                        <span
                                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                                            style={{
                                                backgroundColor: `${dest.color}20`,
                                                color: dest.color,
                                            }}
                                        >
                                            {dest.type}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Điều khiển zoom */}
            <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-xl overflow-hidden z-[1000]">
                <button
                    onClick={() =>
                        document.querySelector('.leaflet-control-zoom-in')?.click()
                    }
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 border-b border-gray-200 transition-colors"
                >
                    <span className="text-2xl font-bold text-gray-700">+</span>
                </button>
                <button
                    onClick={() =>
                        document.querySelector('.leaflet-control-zoom-out')?.click()
                    }
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                    <span className="text-2xl font-bold text-gray-700">−</span>
                </button>
            </div>

            {/* Chuyển đổi kiểu bản đồ */}
            <div className="absolute bottom-6 left-4 md:left-6 bg-white rounded-lg shadow-xl p-2 z-[1000]">
                <div className="flex gap-2">
                    <button
                        onClick={() => setMapStyle('light')}
                        className={`px-3 py-2 rounded text-xs font-medium transition-colors ${mapStyle === 'light' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Sáng
                    </button>
                    <button
                        onClick={() => setMapStyle('dark')}
                        className={`px-3 py-2 rounded text-xs font-medium transition-colors ${mapStyle === 'dark' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Tối
                    </button>
                    <button
                        onClick={() => setMapStyle('satellite')}
                        className={`px-3 py-2 rounded text-xs font-medium transition-colors ${mapStyle === 'satellite' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Vệ tinh
                    </button>
                </div>
            </div>

            {/* Modal chi tiết */}
            {selectedDestination && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-[2000]">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl mx-4">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                            <h3 className="text-xl font-bold text-gray-900">
                                {selectedDestination.name}
                            </h3>
                            <button
                                onClick={() => {
                                    // Close modal and also ensure VR is closed
                                    setSelectedMarker(null)
                                    setShowVR(false)
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-8 space-y-4">
                            <div
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold"
                                style={{
                                    backgroundColor: `${selectedDestination.color}20`,
                                    color: selectedDestination.color,
                                }}
                            >
                                <span className="text-lg">{selectedDestination.icon}</span>
                                {selectedDestination.type}
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            Địa chỉ
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {selectedDestination.location_address}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            Giờ mở cửa
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {selectedDestination.opening_hours}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <DollarSign className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            Giá vé
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {formatPrice(selectedDestination.price)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Navigation className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            Thời gian tham quan
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {selectedDestination.visit_time} phút
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-900 mb-2">
                                    Tiện ích
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedDestination.facilities.map((facility, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                                        >
                                            {facility}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* VR Button + iframe */}
                            <div>
                                <button
                                    onClick={() => setShowVR((v) => !v)}
                                    disabled={!selectedDestination.images?.[1]}
                                    className="w-full py-3 rounded-lg font-semibold transition-all hover:shadow-lg mb-2"
                                    style={{
                                        backgroundColor: selectedDestination.images?.[1] ? selectedDestination.color : '#cccccc',
                                        color: 'white',
                                    }}
                                >
                                    {selectedDestination.images?.[1] ? (showVR ? 'Đóng VR' : 'Xem VR') : 'VR không có'}
                                </button>

                                {showVR && selectedDestination.images?.[1] && (
                                    <div className="w-full flex justify-center">
                                        <iframe
                                            src={selectedDestination.images?.[1]} // lấy link embed từ phần tử thứ 2 của mảng
                                            style={{ border: 0, width: '100%', height: 480 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title="VR Experience"
                                        />
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => {
                                    window.open(
                                        `https://www.google.com/maps/dir/?api=1&destination=${selectedDestination.latitude},${selectedDestination.longitude}`,
                                        '_blank',
                                    )
                                }}
                                className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
                                style={{
                                    backgroundColor: selectedDestination.color,
                                }}
                            >
                                Chỉ đường
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <style jsx global>{`
        .custom-leaflet-marker {
          background: transparent !important;
          border: none !important;
        }
        .custom-marker-wrapper {
          position: relative;
        }
        .custom-marker:hover {
          transform: scale(1.1);
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        ::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        .leaflet-container {
          width: 100%;
          height: 100%;
          z-index: 0;
        }
      `}</style>
        </div>
    )
}

export default MapView

