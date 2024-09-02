import ReactMap from './ReactMap';

const MapView = () => {

    return (
        <div className="container-xxl m-0 flex-grow-1">
            <div className='row pb-4 px-4'>
                <div className="col-12">
                    <h4 className='text-primary m-0'>Your Recent Validations</h4>
                    <p className='text-black m-0'>This is the view of Validations on Google Map.</p>
                </div>
            </div>
            <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
                <ReactMap />
            </div>
        </div>
    );
}

export default MapView;
