"use client"

import {
    GoogleMap,
    Marker,
    useJsApiLoader,
} from "@react-google-maps/api"
import { useCallback, useRef, useState } from "react"

const containerStyle = {
    width: "100%",
    height: "300px",
}

const defaultCenter = { lat: 14.88, lng: 102.0 }

export default function GoogleMapSelector({
    onSelect,
}: {
    onSelect: (lat: number, lng: number) => void
}) {
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null)
    const mapRef = useRef<google.maps.Map | null>(null)

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: ["places"], // ✅ reference เดิม ไม่เปลี่ยนทุก render
    })

    const handleMapClick = useCallback(
        (e: google.maps.MapMouseEvent) => {
            if (!e.latLng) return
            const lat = e.latLng.lat()
            const lng = e.latLng.lng()
            setPosition({ lat, lng })
            onSelect(lat, lng)
        },
        [onSelect]
    )

    const handleCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords
            const newPos = { lat: latitude, lng: longitude }
            setPosition(newPos)
            onSelect(latitude, longitude)

            if (mapRef.current) {
                mapRef.current.panTo(newPos)
            }
        })
    }

    if (!isLoaded) return <p>กำลังโหลดแผนที่...</p>

    return (
        <div className="relative">
            <button
                type="button"
                onClick={handleCurrentLocation}
                className="absolute top-2 right-2 z-10 bg-white border px-3 py-1 rounded shadow"
            >
                📍 ตำแหน่งปัจจุบัน
            </button>

            <GoogleMap
                mapContainerStyle={containerStyle}
                center={position || defaultCenter}
                zoom={15}
                onLoad={(map) => {
                    mapRef.current = map
                }}
                onClick={handleMapClick}
                options={{
                    clickableIcons: false,
                    disableDefaultUI: true,
                }}
            >
                {position && <Marker position={position} />}
            </GoogleMap>
        </div>
    )
}
