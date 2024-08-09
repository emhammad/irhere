import { useState } from 'react';
import ReactMap from './ReactMap';

const MapView = () => {
    const [mapLoading, setMapLoading] = useState(true);
    const [mapError, setMapError] = useState(false);

    return (
        <div className="container-xxl m-0 flex-grow-1">
            <div className='row pb-4 px-4'>
                <div className="col-12">
                    <h4 className='text-primary m-0'>Your Recent Validations</h4>
                    <p className='text-black m-0'>This is the view of Validations on Google Map.</p>
                </div>
            </div>
            {mapError ? (
                <div className="text-center">
                    <p>Map couldn't be loaded. Please try again later.</p>
                </div>
            ) : (
                <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
                    {mapLoading && (
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <p>Loading...</p>
                        </div>
                    )}
                    <ReactMap />
                </div>
            )}
        </div>
    );
}

export default MapView;
