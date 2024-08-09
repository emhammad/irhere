import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function SearchByDate(props) {

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <h3 className='text-black fw-bolder mb-0'>Seach By Dates</h3>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-6 my-2">
                        <label htmlFor="startDate">Start Date : </label>
                        <input class="form-control my-2" type="date" value="2021-06-18" id="html5-date-input" />
                    </div>
                    <div className="col-6 my-2">
                        <label htmlFor="endDate">End Date : </label>
                        <input class="form-control my-2" type="date" value="2021-06-18" id="html5-date-input" />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className='d-flex justify-content-center'>
                <Button>Search</Button>
            </Modal.Footer>
        </Modal>
    );
}
export default SearchByDate;