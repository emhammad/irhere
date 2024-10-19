import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

function SearchByDate({ onSearch, ...props }) {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const formatDate = (date) => {
        if (!date) return '';
        return dayjs(date).format('YYYY-MM-DD');
    };

    const handleSearch = () => {
        let formattedStartDate = formatDate(startDate);
        let formattedEndDate = formatDate(endDate);
        onSearch(formattedStartDate, formattedEndDate);
        props.onHide(); // Close the modal after search
    };

    const handleClear = () => {
        setStartDate(null);
        setEndDate(null);
        onSearch(null, null);
        props.onHide();
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
                    <h3 className='text-black fw-bolder mb-0'>Search By Dates</h3>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-6 my-2">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                className='w-100'
                                label="Select start date"
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                renderInput={(params) => (
                                    <input {...params.inputProps} className="form-control my-2" />
                                )}
                            />
                        </LocalizationProvider>
                    </div>
                    <div className="col-6 my-2">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                className='w-100'
                                label="Select end date"
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
                                renderInput={(params) => (
                                    <input {...params.inputProps} className="form-control my-2" />
                                )}
                            />
                        </LocalizationProvider>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className='d-flex justify-content-end'>
                <Button variant="secondary" onClick={handleClear} className='me-2'>
                    Clear
                </Button>
                <Button onClick={handleSearch}>Search</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default SearchByDate;
