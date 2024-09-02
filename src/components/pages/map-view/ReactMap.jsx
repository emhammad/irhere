import React, { useEffect, useState, useCallback, useRef } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

function MyComponent() {
    const [loading, setLoading] = useState(true);
    const [locationData, setLocationData] = useState([]);
    const user = useSelector((state) => state.user.user);
    const url = process.env.REACT_APP_SERVER_DOMAIN;
    const navigate = useNavigate();
    const mapRef = useRef(null);

    const fetchData = async () => {
        if (!user?.access_token) {
            navigate('/login');
            return;
        } else {
            try {
                const response = await axios.get(`${url}/api/get_map_data`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        "Content-Type": "application/json",
                    }
                });
                setLocationData(response.data.data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyDp5X4zBiqhfXz-8eiBXGuy5XC4nYeC-lM'
    });

    const onLoad = useCallback((map) => {
        mapRef.current = map;

        const bounds = new window.google.maps.LatLngBounds();
        locationData?.forEach((item) => {
            const latitude = Number(item.latitude);
            const longitude = Number(item.longitude);

            if (latitude && longitude && latitude !== 0 && longitude !== 0) {
                bounds.extend({ lat: latitude, lng: longitude });
            }
        });

        map.fitBounds(bounds);

        const listener = map.addListener('bounds_changed', () => {
            const currentZoom = map.getZoom();
            if (currentZoom > 1) {
                map.setZoom(1); // Adjust the zoom level as desired
            }
            listener.remove();
        });

    }, [locationData]);

    const containerStyle = {
        width: '100%',
        height: '100%'
    };

    const center = {
        lat: 0,
        lng: 0
    };

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={1} // Start very zoomed out
            onLoad={onLoad}
            options={{ minZoom: 2 }}
        >
            {loading ? (
                <></>
            ) : (
                locationData.map((item, index) => {
                    const latitude = Number(item.latitude);
                    const longitude = Number(item.longitude);

                    if (latitude && longitude && latitude !== 0 && longitude !== 0) {
                        return (
                            <Marker
                                key={index}
                                position={{ lat: latitude, lng: longitude }}
                            />
                        );
                    }
                    return null;
                })
            )}
        </GoogleMap>
    ) :
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <p>Loading...</p>
        </div>
        ;
}

export default React.memo(MyComponent);
