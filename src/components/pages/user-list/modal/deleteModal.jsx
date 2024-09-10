import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';


function MyVerticallyCenteredModal({ item, ...props }) {
    const user = useSelector((state) => state.user?.user || {});
    const url = process.env.REACT_APP_SERVER_DOMAIN;
    const token = user?.access_token;

    const handleSubmit = async () => {
        try {
            const formData = { user_id: Number(item.user_id) };
            const response = await axios.post(`${url}/api/delete_user`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            props.onHide();
            window.location.reload(); // Refresh the page
            toast.success(response.data.desc)
        } catch (error) {
            props.onHide();
            console.error('Error deleting user:', error);
            toast.error('Error while deleting user')
        }
    };

    const handleCloseModal = () => {
        props.onHide();
    }

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vtop"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <h3 className='text-black fw-bolder mb-0'>Delete User</h3>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <span className='text-black ps-1 fs-5'>Are you sure you want to delete this user?</span>
            </Modal.Body>
            <Modal.Footer className='d-flex justify-content-end'>
                <Button className='bg-dark' onClick={handleCloseModal}>Back</Button>
                <Button onClick={handleSubmit}>Yes</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default MyVerticallyCenteredModal;
