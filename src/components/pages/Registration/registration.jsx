import React from 'react'
import QR from '../../../assets/irhere_images/qr.png';

const Registration = () => {

    const data = [{
        head: 'Name',
        name: 'Asad Javaid',
        verification: 'verified'
    },
    {
        head: 'Email',
        name: 'asadjaved@gmail.com',
        verification: 'verified'
    },
    {
        head: 'Phone',
        name: '+61 465455 656',
        verification: 'verified'
    }
    ]

    return (
        <div className='card h-100 d-flex justify-content-center align-items-center'>
            <div className="card-body  hm-registration-container hm-border-bottom">
                <div className='d-flex flex-column text-center align-items-center'>
                    <div className="p-3" style={{borderRadius : "100%" , backgroundColor : "rgb(178 255 199 / 40%)"}}> 
                        <div className="p-3 m-1" style={{borderRadius : "100%" , backgroundColor : "rgb(101 225 134 / 31%)"}}> 
                            <span className="badge bg-success rounded-pill p-2" style={{ width: 'min-content' }}>
                                <i className="ti ti-check" style={{ fontSize: 100 }}></i>
                            </span>
                        </div>
                    </div>
                    <h4 className='text-success'>Success !</h4>
                </div>
                <div className="mt-4 justify-content-center text-center d-flex flex-column hm-registration-container-data m-auto">
                    <h5 className='text-primary'>IRhere Registration </h5>
                    {data.map((item, index) => (
                        <div key={index} className="table-row d-flex justify-content-between my-2 border-bottom">
                            <div className="w-50 d-flex flex-column text-start my-2">
                                <span className='fw-bold text-black'>{item.head}</span>
                                <span className='text-black'>{item.name}</span>
                            </div>
                            <div className="d-flex align-items-center w">
                                <span className={`badge ${item.verification === 'verified' ? 'bg-label-success' : 'bg-label-danger'} me-1`}>{item.verification}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='d-flex flex-column text-center mt-5'>
                    <div className='my-2'>
                        <h5 className='text-black m-0 fw-lighter'>This certifies that</h5>
                        <span className='text-black fw-bold'>Asad javaid</span>
                    </div>
                    <div className='my-2'>
                        <h5 className='text-black m-0 fw-lighter'>is registered on</h5>
                        <span className='text-black fw-bold'>IRhere</span>
                    </div>
                </div>
            </div>
            <div className="card-footer mt-4 d-flex justify-content-center align-items-center flex-column">
                <img src={QR} alt="" style={{ width: "150px" }} />
                <div className="d-flex align-items-center mt-3 fw-bold text-black">
                    <span className="bg-success rounded-3 text-white me-2">
                        <i className="ti ti-check ti-xs"></i>
                    </span>
                    Validated by IRhere using V+V Technology
                </div>
            </div>
        </div>
    )
}

export default Registration