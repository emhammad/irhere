import axios from 'axios';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';


function MyVerticallyCenteredModal({ item, ...props }) {
    const user = useSelector((state) => state.user?.user || {});
    const url = process.env.REACT_APP_SERVER_DOMAIN;
    const token = user?.access_token;
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_no: '',
    });

    useEffect(() => {
        if (item) {
            setFormData({
                name: item.name || '',
                email: item.email || '',
                phone_no: item.phone_no || ''
            })
            console.log("item: ", item);

        }
    }, [item])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async () => {
        try {

            const payload = {
                user_id: Number(item.user_id),
                ...formData
            };

            const response = await axios.post(`${url}/api/update_user_info_app`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            window.location.reload(); // Refresh the page
            props.onHide();
            toast.success(response.data.desc)
        } catch (error) {
            props.onHide();
            console.error('Error updating user info:', error);
            toast.error('Error updating user info')
        }

    };

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
                            type="email"
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
                            name='phone_no'
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
