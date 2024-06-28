import { useState } from 'react';

const MapView = () => {
    const [mapLoading, setMapLoading] = useState(true);
    const [mapError, setMapError] = useState(false);

    const handleMapLoad = () => {
        setMapLoading(false);
    };

    const handleMapError = () => {
        setMapLoading(false);
        setMapError(true);
    };

    const latitude = 0;
    const longitude = 0;

    const mapSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2990.274257380938!2d${longitude - 0.01}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e52963ac45bbcb%3A0xf05e8d125e82af10!2sDos%20Mas!5e0!3m2!1sen!2sus!4v1671220374408!5m2!1sen!2sus`;

    return (
        <div className="container-xxl m-0 flex-grow-1">
            <div className='row pb-4 px-4'>
                <div className="col-12">
                    <h4 className='text-primary m-0'>Your Recent Validations</h4>
                    <p className='text-black m-0'>App terms line is dummy for now will change later.</p>
                </div>
            </div>
            {mapError ? (
                <div className="text-center">
                    <p>Map couldn't be loaded. Please try again later.</p>
                </div>
            ) : (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    {mapLoading && (
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <p>Loading...</p>
                        </div>
                    )}
                    <iframe
                        src={mapSrc}
                        width="100%"
                        height="100%"
                        style={{ border: "0" }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title='MapView'
                        onLoad={handleMapLoad}
                        onError={handleMapError}
                    ></iframe>
                </div>
            )}
        </div>
    );
}

export default MapView;
