import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


function MyVerticallyCenteredModal({ item, ...props }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_no: ''
    });

    useEffect(() => {
        if (item) {
            setFormData({
                name: item.name || '',
                email: item.email || '',
                phone_no: item.phone_no || ''
            })
        }
    }, [item])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = () => {
        console.log(formData);
        props.onHide();
    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <h3 className='text-black fw-bolder mb-0'>Edit User</h3>
                    <span className='text-black ps-1 fs-5'>Enter the details below</span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-6 my-2">
                        <input
                            type="text"
                            className="form-control"
                            name='name'
                            placeholder='Name'
                            onChange={handleChange}
                            value={formData.name}
                        />
                    </div>
                    <div className="col-6 my-2">
                        <input
                            type="text"
                            className="form-control"
                            name='email'
                            placeholder='Email'
                            onChange={handleChange}
                            value={formData.email}
                        />
                    </div>
                    <div className="col-6 my-2">
                        <input
                            type="text"
                            className="form-control"
                            name='phone'
                            placeholder='Phone'
                            onChange={handleChange}
                            value={formData.phone_no}
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className='d-flex justify-content-center'>
                <Button onClick={handleSubmit}>Update</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default MyVerticallyCenteredModal;
