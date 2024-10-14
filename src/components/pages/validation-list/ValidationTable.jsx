import * as XLSX from 'xlsx';
import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SearchByDate from './search-by-date';

const Table = () => {
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.user?.user || {});
    const url = process.env.REACT_APP_SERVER_DOMAIN;
    const [tableData, setTableData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPagesLength, setTotalPagesLength] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [modalShow, setModalShow] = React.useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchDateActive, setSearchDateActive] = useState(false);
    const navigate = useNavigate();

    const [searchTerms, setSearchTerms] = useState({
        ver_id: '',
        Name: '',
        Email: '',
        Date: '',
        address: "",
        true_status: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setSearchTerms(prevData => {
            if (name === "true_status") {
                return {
                    ...prevData,
                    [name]: value === "1" ? true : value === "0" ? false : ''
                };
            } else if (name === "Date") {
                return {
                    ...prevData,
                    start_date: value,
                    end_date: value,
                    [name]: value
                };
            } else {
                return {
                    ...prevData,
                    [name]: value
                };
            }
        });
    };


    const mapFields = [
        { id: 1, name: "ver_id", placeholder: "Validation Number...", type: "text" },
        { id: 2, name: "Name", placeholder: "Name...", type: "text" },
        { id: 3, name: "Email", placeholder: "Email/Phone...", type: "text" },
        { id: 4, name: "Date", placeholder: "Date...", type: "date" },
        { id: 4, name: "address", placeholder: "address...", type: "text" },
        {
            id: 5, name: "true_status", placeholder: "Select Status...", type: "select", options: [
                { value: "", label: "Select Status" },
                { value: "1", label: "Verified" },
                { value: "0", label: "Unverified" }
            ]
        },
    ];

    const fetchData = async () => {
        const token = user?.access_token;
        const params = {};

        Object.keys(searchTerms).forEach(key => {
            if (searchTerms[key] !== '') {
                if (key === 'true_status') {
                    params['true_status'] = searchTerms[key];
                } else {
                    params[key.toLowerCase()] = searchTerms[key];
                }
            }
        });

        // Ensure start_date and end_date are included in the params
        if (searchTerms.start_date) {
            params['start_date'] = searchTerms.start_date;
        }
        if (searchTerms.end_date) {
            params['end_date'] = searchTerms.end_date; 
        }

        if (!token) {
            navigate('/portal/login')
        } else {
            try {
                const response = await axios.get(`${url}/api/get_certificate_list_all/page/${currentPage}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    params: {
                        user_id: 10,
                        ...params
                    },
                });

                const TotalValidations = await axios.get(`${url}/api/dashboard_stats`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                });

                setTotalPages(TotalValidations.data.total_validations);

                if (response.status === 200) {
                    const dataArray = Object.values(response.data.Data);
                    setTableData(dataArray);
                    setFilteredData(dataArray.slice(0, itemsPerPage)); // Slice the data according to itemsPerPage
                    setLoading(false);
                    setTotalPagesLength(response.data.Page?.TotalPages || 1);

                } else {
                    setTotalPagesLength(1);
                }

            } catch (error) {
                console.log(error);
            }
        }


    };


    useEffect(() => {
        fetchData();
        setItemsPerPage(10)
        if (searchTerms.start_date === null || searchTerms.end_date === null) {
            setSearchDateActive(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, url, currentPage, searchTerms, itemsPerPage]);

    const nextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPagesLength));
    };

    const prevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleExportExcel = () => {
        const headers = ['Validation Number', 'Name', 'Email/Phone', 'Date', 'Status'];
        const rows = tableData.map(item => [
            item.ver_id,
            item.name,
            item.email,
            item.date ? new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '', // Format date or handle empty dates
            item.status === "True" ? "Verified" : "Unverified"
        ]);

        // Prepare data for the worksheet
        const worksheetData = [headers, ...rows];
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        // Create a workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Validation List');

        // Get the first non-empty date from the data
        const firstDate = tableData.find(item => item.date)?.date;

        // If no date is found, fallback to today's date (optional)
        const dateToUse = firstDate ? new Date(firstDate) : new Date();

        // Format the date as "4 Feb 2024"
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(dateToUse);

        // Convert workbook to binary
        const excelFile = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

        // Create a Blob and download link for the Excel file
        const blob = new Blob([s2ab(excelFile)], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Validation List - ${formattedDate}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Helper function to convert string to array buffer
    const s2ab = (s) => {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    };

    const handleSearchByDate = (start_date, end_date) => {
        setSearchTerms((prevTerms) => ({
            ...prevTerms,
            start_date,
            end_date,
        }));
    }

    return (
        <div className="card">
            <div className="card-datatable pt-0">
                <div id="DataTables_Table_0_wrapper" className="dataTables_wrapper dt-bootstrap5 no-footer">
                    <div className="card-header header-flex d-flex justify-content-between p-3 flex-wrap">
                        <div className="head-label d-flex align-items-center">
                            <h5 className="card-title mb-0">List Of Validations</h5>
                        </div>
                        <div className="dt-action-buttons text-end pt-3 pt-md-0">
                            <div className="dt-buttons">
                                <button className="dt-button buttons-collection btn btn-label-primary me-2 waves-effect waves-light" onClick={handleExportExcel} aria-controls="DataTables_Table_0" type="button" aria-haspopup="dialog" aria-expanded="false">
                                    <span>
                                        <i className="ti ti-upload me-1"></i>
                                        <span className="d-none d-sm-inline-block">Export</span>
                                    </span>
                                </button>
                                <button
                                    onClick={() => { setSearchDateActive(true); setModalShow(true) }}
                                    className="dt-button create-new btn btn-primary waves-effect waves-light search-dates"
                                    aria-controls="DataTables_Table_0"
                                    type="button"
                                >
                                    <i className="menu-icon tf-icons ti ti-calendar"></i>
                                    <span className="d-none d-sm-inline-block">Search By Dates</span>
                                    <span className={`${searchDateActive === true ? 'search-dates-active' : ''}`}></span>
                                </button>
                                <SearchByDate show={modalShow} onHide={() => { setModalShow(false) }} onSearch={handleSearchByDate} />
                            </div>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-striped text-center">
                                <thead className='table-bg'>
                                    <tr>
                                        <th>Validation Number</th>
                                        <th>Name</th>
                                        <th>Email/Phone</th>
                                        <th>Date</th>
                                        <th>Address</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr className='input-row'>
                                        {mapFields.map((field, i) => (
                                            <th key={i}>
                                                {field.type === "text" ? (
                                                    <div className="input-group input-group-merge">
                                                        <span className="input-group-text p-2" id={`basic-addon-search-${field.name}`}><i className="ti ti-search"></i></span>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder={field.placeholder}
                                                            name={field.name}
                                                            value={searchTerms[field.name]}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                ) : field.type === "date" ? (
                                                    <div className="input-group input-group-merge">
                                                        <span className="input-group-text p-2" id={`basic-addon-search-${field.name}`}><i className="ti ti-search"></i></span>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            name={field.name}
                                                            value={searchTerms[field.name]}
                                                            onChange={handleChange}
                                                        // Format the value to 'YYYY-MM-DD' when sending to the search function
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="input-group input-group-merge">
                                                        <span className="input-group-text p-2" id={`basic-addon-search-${field.name}`}><i className="ti ti-search"></i></span>
                                                        <select
                                                            className="form-select"
                                                            name="true_status"
                                                            onChange={handleChange}
                                                        >
                                                            {field.options.map(option => (
                                                                <option key={option.value} value={option.value}>{option.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6">Loading...</td>
                                        </tr>
                                    ) : filteredData.length === 0 ? (
                                        <tr>
                                            <td colSpan="6">No records found</td>
                                        </tr>
                                    ) : (
                                        filteredData.map((item, index) => (
                                            <tr key={index}>
                                                <td><small>{item.ver_id}</small></td>
                                                <td><small>{item.name}</small></td>
                                                <td><small>{item.email}</small></td>
                                                <td>
                                                    <small>{new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</small>
                                                </td>
                                                <td><small>{item.address}</small></td>
                                                <td>
                                                    <span className={`badge ${item.status === "True" ? "bg-label-success" : "bg-label-danger"}`}>
                                                        {item.status === "True" ? "verified" : "unverified"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-3 mb-3 me-3 d-flex justify-content-end align-items-center flex-wrap" style={{ color: "#5d596c" }}>
                            {/* <div className="d-flex justify-content-end">
                                <div className="dataTables_length d-flex align-items-center gap-3" id="DataTables_Table_0_length">
                                    <label className='' style={{ whiteSpace: "nowrap" }}> Rows per page :</label>
                                    <select
                                        name="DataTables_Table_0_length"
                                        aria-controls="DataTables_Table_0"
                                        className="form-select border-0"
                                        value={itemsPerPage}
                                        onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                                    >
                                        <option value="2">2</option>
                                        <option value="4">4</option>
                                        <option value="6">6</option>
                                        <option value="8">8</option>
                                        <option value="10">10</option>
                                    </select>
                                </div>
                            </div> */}
                            <div
                                className="dataTables_paginate paging_simple_numbers d-flex align-items-center gap-4"
                                id="DataTables_Table_0_paginate"
                            >
                                <p className="m-0" style={{ whiteSpace: "nowrap" }}>{`${(currentPage - 1) * itemsPerPage + 1
                                    }-${Math.min(
                                        currentPage * itemsPerPage,
                                        totalPages
                                    )} of ${totalPages}`}</p>
                                <button
                                    className={`p - 2 border-0 bg-transparent`}
                                    onClick={prevPage}
                                    disabled={currentPage === 1}
                                >
                                    <i className={`fas fa-angle-left cursor-pointer ${currentPage === 1 ? 'text-muted' : ''}`}></i>
                                </button>
                                <button
                                    className={`p - 2 border-0 bg-transparent`}
                                    onClick={nextPage}
                                    disabled={currentPage === totalPagesLength}
                                >
                                    <i className={`fas fa-angle-right cursor-pointer ${currentPage === totalPagesLength ? 'text-muted' : ''}`}></i>
                                </button>
                            </div>

                        </div>
                    </div >
                </div >
            </div >
        </div >
    );
}

export default Table;
