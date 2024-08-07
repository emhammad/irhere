// import axios from 'axios';
// import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
// import toast from 'react-hot-toast';
// import { useSelector } from 'react-redux';

function MyVerticallyCenteredModal(props) {
    // const user = useSelector((state) => state.user?.user || []);
    // const [vocher, setVocher] = useState({
    //     vocher_code:""
    // });
    // const url = process.env.REACT_APP_SERVER_DOMAIN;

    // useEffect(() => {
    //     const fetchVocher = async () => {
    //         try {
    //             const response = await axios.post(`${url}/api/get_voucher`, {
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //             });
    //             console.log("Response data:", response.data);
    //         } catch (error) {
    //             // toast.error(error.message);
    //             console.log(error.message);
    //         }
    //     };
    //     fetchVocher();
    //     // eslint-disable-next-line 
    // }, [user]);
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <h3 className='text-black fw-bolder mb-0'>Create Voucher</h3>
                    <span className='text-black ps-1 fs-5'>Enter the details below</span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-12 my-2">
                        <select id="largeSelect" className="form-select form-select-lg">
                            <option>Select Voucher Type</option>
                            <option value="1" className="dropdown-item">Per usr use once.</option>
                            <option value="2" className="dropdown-item">For a period of time.</option>
                            <option value="3" className="dropdown-item">1-time use only (given to a friend)</option>
                        </select>
                    </div>
                    <div className="col-12 my-2">
                        <input className="form-control form-select-lg" type="date" />
                    </div>
                    <div className="col-12 my-2">
                        <input className="form-control form-select-lg" type="text" placeholder='Enter Amount' />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className='d-flex justify-content-center'>
                <Button>Create</Button>
            </Modal.Footer>
        </Modal>
    );
}
export default MyVerticallyCenteredModal;