import React from 'react';
import Table from './voucherTable';
import MyVerticallyCenteredModal from './modal/modal';
import Button from 'react-bootstrap/Button';

const VoucherList = () => {
    const [modalShow, setModalShow] = React.useState(false);

    return (

        <div className="content-wrapper">
            <div className="container-xxl flex-grow-1">
                <div className='my-3 d-flex justify-content-end'>
                    <Button variant="primary" onClick={() => setModalShow(true)}> + Create Voucher </Button>
                    <MyVerticallyCenteredModal show={modalShow} onHide={() => setModalShow(false)} />
                </div>
                <Table />
            </div>
            <div className="content-backdrop fade"></div>
        </div>

    )
}

export default VoucherList;