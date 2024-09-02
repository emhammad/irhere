import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

function MyVerticallyCenteredModal(props) {
    const [voucherType, setVoucherType] = useState('');
    const [date, setDate] = useState(null); // Initialize as null for MUI DatePicker
    const [amount, setAmount] = useState('');

    const handleVoucherTypeChange = (e) => setVoucherType(e.target.value);
    const handleDateChange = (newValue) => setDate(newValue); // Update with MUI DatePicker's value
    const handleAmountChange = (e) => setAmount(e.target.value);
    const user = useSelector((state) => state.user?.user || {});
    const token = user?.access_token;

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('voucher_type', voucherType);

        if (date) {
            const formattedDate = dayjs(date).format('YYYY-MM-DD'); // Format date using dayjs
            formData.append('valid_date', formattedDate);
        }

        formData.append('amount', amount);

        const url = process.env.REACT_APP_SERVER_DOMAIN;

        try {
            const response = await axios.post(`${url}/api/create_voucher`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(response);
            if (response.data.desc === 'Missing paramets.') {
                toast.error('Please provide full details');
            }
            toast.success(response.data.desc);
            setVoucherType('');
            setDate(null); // Reset date to null for MUI DatePicker
            setAmount('');
            props.onHide();
            window.location.reload(); // Refresh the page

        } catch (error) {
            console.error("Error creating voucher:", error.message);
            toast.error("Error creating voucher");
        }
    };

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
                        <select
                            id="largeSelect"
                            className="form-select form-select-lg"
                            value={voucherType}
                            onChange={handleVoucherTypeChange}
                        >
                            <option value="">Select Voucher Type</option>
                            <option value="0">Per user use once</option>
                            <option value="1">1-time use only (given to a friend)</option>
                        </select>
                    </div>
                    <div className="col-12 my-2">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker
                                    label="Select Expiry Date"
                                    value={date}
                                    onChange={handleDateChange}
                                    className="w-100 rounded-2"
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </div>
                    <div className="col-12 my-2">
                        <input
                            className="form-control form-select-lg"
                            type="number"
                            placeholder="Enter Amount"
                            value={amount}
                            onChange={handleAmountChange}
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className='d-flex justify-content-center'>
                <Button onClick={handleSubmit}>Create</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default MyVerticallyCenteredModal;
