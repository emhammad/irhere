import React, { useEffect, useState, useCallback } from 'react';
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

    const fetchData = async () => {
        if (!user.access_token) {
            navigate('/');
            return;
        }

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
        // Center and fit bounds on the map
        const bounds = new window.google.maps.LatLngBounds();
        locationData.forEach((item) => {
            bounds.extend({ lat: Number(item.lat), lng: Number(item.long) });
        });
        map.fitBounds(bounds);
    }, [locationData]);

    const containerStyle = {
        width: '100%',
        height: '100%'
    };

    const center = {
        lat: 0,
        lng: 0
    };
    console.log(locationData);
    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={2} // Adjust zoom level if needed
            onLoad={onLoad}
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
