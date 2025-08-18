import React, { useState, useEffect } from 'react';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import 'remixicon/fonts/remixicon.css';

const containerStyle = {
    width: '100%',
    height: '100%',
};

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
};

const MapLoadingComponent = () => (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gray-100">
        <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Finding your location...</p>
    </div>
);

const MapErrorComponent = ({ message }) => (
    <div className="h-full w-full flex flex-col items-center justify-center bg-red-50 text-center p-4">
        <i className="ri-map-pin-user-line text-4xl text-red-500 mb-4"></i>
        <h3 className="font-bold text-red-700">Location Error</h3>
        <p className="text-red-600">{message}</p>
    </div>
);

const LiveTracking = () => {
    const [currentPosition, setCurrentPosition] = useState(null);
    const [mapState, setMapState] = useState({
        loading: true,
        error: null,
    });

    useEffect(() => {
        let watchId;

        const handleSuccess = (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({ lat: latitude, lng: longitude });
            if (mapState.loading) {
                setMapState({ loading: false, error: null });
            }
        };

        const handleError = (error) => {
            let errorMessage = 'An unknown error occurred.';
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Location access denied. Please enable it in your browser settings to use this feature.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Location information is unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'The request to get user location timed out.';
                    break;
            }
            setMapState({ loading: false, error: errorMessage });
        };

        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            });
        } else {
            setMapState({ loading: false, error: "Geolocation is not supported by this browser." });
        }

        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [mapState.loading]);

    if (mapState.loading) {
        return <MapLoadingComponent />;
    }

    if (mapState.error) {
        return <MapErrorComponent message={mapState.error} />;
    }

    return (
        <LoadScript
            googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_API}
            loadingElement={<MapLoadingComponent />}
        >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={currentPosition}
                zoom={16}
                options={mapOptions}
            >
                {currentPosition && <Marker position={currentPosition} />}
            </GoogleMap>
        </LoadScript>
    );
};

export default LiveTracking;
