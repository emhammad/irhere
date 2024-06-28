import React, { useState } from 'react';

const Table = () => {
    const tableData = [
        {
            id: 1,
            TransactionId: "202",
            Name: "Asad Javaid",
            Email: "Asadjavaid.com.au",
            Card: "+0.2",
            Location: "12 Sutherland Rd, Cheltenham NSW 2119, Austrailia",
            PaymentMethod: "Apple Pay",
        },
        {
            id: 2,
            TransactionId: "203",
            Name: "syed Hammad",
            Email: "syedhammad@gmail.com",
            Card: "+0.2",
            Location: "Gulshan-e-ravi, Lahore",
            PaymentMethod: "Apple Pay",
        },
        {
            id: 3,
            TransactionId: "204",
            Name: "Asad Javaid",
            Email: "Asadjavaid.com.au",
            Card: "+0.2",
            Location: "12 Sutherland Rd, Cheltenham NSW 2119, Austrailia",
            PaymentMethod: "Apple Pay",
        },
        {
            id: 4,
            TransactionId: "205",
            Name: "Khizar Abbas",
            Email: "Asadjavaid.com.au",
            Card: "-0.2",
            Location: "12 Sutherland Rd, Cheltenham NSW 2119, Austrailia",
            PaymentMethod: "Apple Pay",
        }
    ];

    const mapFields = [
        { id: 1, name: "TransactionId", placeholder: "Transaction..." },
        { id: 2, name: "Name", placeholder: "Name..." },
        { id: 3, name: "Email", placeholder: "Email/Phone..." },
        { id: 5, name: "Card", options: [ "credit" , "debit"]  },
        { id: 6, name: "Location", placeholder: "Location..." },
        { id: 7, name: "PaymentMethod", placeholder: "Payment Method..." }
    ];

    const [searchTerms, setSearchTerms] = useState({
        TransactionId: '',
        Name: '',
        Email: '',
        Card: '',
        Location: '',
        PaymentMethod: ''
    });

    const filterData = tableData.filter((item) => {
        return (
            item.TransactionId.toLowerCase().includes(searchTerms.TransactionId.toLowerCase()) &&
            item.Name.toLowerCase().includes(searchTerms.Name.toLowerCase()) &&
            item.Email.toLowerCase().includes(searchTerms.Email.toLowerCase()) &&
            (item.Card.includes('+') ? 'credit' : 'debit').includes(searchTerms.Card) &&
            item.Location.toLowerCase().includes(searchTerms.Location.toLowerCase()) &&
            item.PaymentMethod.toLowerCase().includes(searchTerms.PaymentMethod.toLowerCase())
        );
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchTerms(prevData => ({
            ...prevData,
            [name]: value
        }));
    };
    const handleExportCSV = () => {
        const csvContent = filterData.map(item => mapFields.map(field => item[field.name]).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'table_data.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    return (
        <div>
            <div className="card">
                <div className="card-datatable pt-0">
                    <div id="DataTables_Table_0_wrapper" className="dataTables_wrapper dt-bootstrap5 no-footer">
                        <div className="card-header d-flex justify-content-between p-4">
                            <div className="head-label text-center">
                                <h5 className="card-title mb-0">Transaction List</h5>
                            </div>
                            <div className="dt-action-buttons text-end pt-3 pt-md-0">
                                <div className="dt-buttons">
                                    <button className="dt-button buttons-collection  btn btn-label-primary me-2 waves-effect waves-light" aria-controls="DataTables_Table_0" type="button" aria-haspopup="dialog" aria-expanded="false" 
                                    onClick={handleExportCSV}>
                                        <span>
                                            <i className="ti ti-upload me-1 ti-xs"></i>
                                            <span className="d-none d-sm-inline-block">Export</span>
                                        </span>
                                    </button>
                                    <button className="dt-button create-new btn btn-primary waves-effect waves-light" aria-controls="DataTables_Table_0" type="button">
                                        <span>
                                            <i className="menu-icon tf-icons ti ti-calendar"></i>
                                            <span className="d-none d-sm-inline-block">Search By Dates</span>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="table table-responsive">
                            <table className="table table-striped">
                                <thead className="border-bottom table-light text-center">
                                    <tr>
                                        <th style={{ width: "20px" }}>Transaction ID</th>
                                        <th style={{ width: "200px" }}>Name</th>
                                        <th style={{ width: "100px" }}>Email/Phone</th>
                                        <th style={{ width: "100px" }}>Debit/Credit</th>
                                        <th style={{ width: "250px" }}>Location</th>
                                        <th style={{ width: "100px" }}>Payment Method</th>
                                        <th style={{ width: "50px" }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody className='table-border-bottom-0 table-striped text-center'>
                                    <tr>
                                        {mapFields.map((field) => (
                                            <td key={field.id}>
                                                <div className="input-group input-group-merge">
                                                    <span className={`input-group-text  d-${field.name === "Card" ? "none" : "block"}`} id={`basic-addon-search${field.id}`}><i className="ti ti-search"></i></span>
                                                    {field.name === "Card" ?  (  
                                                        <select
                                                            className="form-select"
                                                            name={field.name}
                                                            value={searchTerms[field.name]}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="">Account</option>
                                                            {field.options.map(option => (
                                                                <option key={option} value={option}>{option}</option>
                                                            ))}
                                                        </select>
                                                    ) : ( 
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name={field.name}
                                                            value={searchTerms[field.name]}
                                                            placeholder={field.placeholder}
                                                            onChange={handleChange}
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                        ))}
                                        <td></td>
                                    </tr>
                                    {filterData.map((item) => (
                                        <tr key={item.id}>
                                            <td><small>{item.TransactionId}</small></td>
                                            <td><small>{item.Name}</small></td>
                                            <td><small>{item.Email}</small></td>
                                            <td>
                                                <span className={`badge ${item.Card.includes('+') ? "text-success" : "text-danger"}`}>
                                                    {item.Card}
                                                </span>
                                            </td>
                                            <td><small>{item.Location}</small></td>
                                            <td><small>{item.PaymentMethod}</small></td>
                                            <td>
                                                <div className="dropdown">
                                                    <button className="btn" type="button" id="earningReportsId" data-bs-toggle="dropdown">
                                                        <i className="ti ti-dots-vertical ti-sm text-muted"></i>
                                                    </button>
                                                    <div className="dropdown-menu dropdown-menu-end py-2 px-4 rounded bg-label-primary text-center  ">
                                                        <button className="dropdown-item p-0 m-0 w-auto text-primary d-flex align-items-center">
                                                            <i className="ti ti-currency-dollar ti-sm"></i>
                                                            Refund
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="row mt-3 mb-1">
                            <div className="col-lg-9 d-flex align-items-center justify-content-end">
                                <label className='pe-4'>Rows per page:</label>
                                <select name="DataTables_Table_0_length" aria-controls="DataTables_Table_0" className="form-select" style={{ width: "max-content" }}>
                                    <option value="7">7</option>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="75">75</option>
                                    <option value="100">100</option>
                                </select>
                            </div>
                            <div className='col-lg-3 d-flex align-items-center justify-content-center'>
                                <div className="dataTables_paginate paging_simple_numbers d-flex align-items-center" id="DataTables_Table_0_paginate">
                                    <p className='m-0'>1-10 of 15 </p>
                                    <span className="p-2"><i className="fas fa-angle-left text-muted cursor-pointer"></i></span>
                                    <span className="p-2"><i className="fas fa-angle-right cursor-pointer"></i></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Table;

