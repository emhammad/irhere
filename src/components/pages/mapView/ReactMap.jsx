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
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const mapRef = useRef(null);
    const onLoadCalled = useRef(false);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    const fetchData = async () => {
        if (!user?.access_token) {
            navigate('/');
            return;
        } else {
            try {
                const response = await axios.get(`${url}/api/get_certificate_list_all/page/${currentPage}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        "Content-Type": "application/json",
                    },
                    params: {
                        user_id: user.id
                    },
                });
                setLocationData(response.data.Data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }
    };

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyDp5X4zBiqhfXz-8eiBXGuy5XC4nYeC-lM'
    });

    const onLoad = useCallback((map) => {
        if (!onLoadCalled.current) {
            onLoadCalled.current = true;
            mapRef.current = map;

            // Center and fit bounds on the map
            const bounds = new window.google.maps.LatLngBounds();
            locationData.forEach((item) => {
                if (item.lat !== "" && item.lat !== "0.0" && item.long !== "" && item.long !== "0.0") {
                    bounds.extend({ lat: Number(item.lat), lng: Number(item.long) });
                }
            });
            map.fitBounds(bounds);
        }
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
            zoom={2} // Adjust zoom level if needed
            onLoad={onLoad}
            options={{ minZoom: 2 }} // Disable zooming out beyond level 2
        >
            {loading ? (
                <></>
            ) : (
                locationData.map((item, index) => (
                    <Marker
                        key={index}
                        position={{ lat: Number(item.lat), lng: Number(item.long) }}
                    />
                ))
            )}
        </GoogleMap>
    ) : <p>Loading...</p>;
}

export default React.memo(MyComponent);
