import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaCaretDown } from "react-icons/fa";
import SearchByDate from './search-by-date';

const Table = () => {
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.user?.user || {});
    const url = process.env.REACT_APP_SERVER_DOMAIN;
    const [tableData, setTableData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPagesLength, setTotalPagesLength] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [modalShow, setModalShow] = React.useState(false);
    const navigate = useNavigate();

    const itemsPerPage = 10;

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

        if (name === "true_status") {
            setSearchTerms(prevData => ({
                ...prevData,
                [name]: value === "1" ? true : value === "0" ? false : ''
            }));
        } else {
            setSearchTerms(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const mapFields = [
        { id: 1, name: "ver_id", placeholder: "VID...", type: "text" },
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
                    // Add status only if it's true or false
                    params['true_status'] = searchTerms[key];
                } else {
                    params[key.toLowerCase()] = searchTerms[key];
                }
            }
        });
        if (!token) {
            navigate('/')
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

                setTotalPages(response.data.Page.TotalPages);

                if (response.status === 200) {
                    const dataArray = Object.values(response.data.Data);
                    setTableData(dataArray);
                    setFilteredData(dataArray);
                    setLoading(false);
                    setTotalItems(response.data.Page?.TotalItems || response.data.Data.length);
                    setTotalPagesLength(response.data.Page?.TotalPages || 1);

                } else {
                    setTotalItems(0);
                    setTotalPagesLength(1);
                }

            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, url, currentPage, searchTerms]);

    const nextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPagesLength));
    };

    const prevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleExportCSV = () => {
        const headers = ['VID', 'Name', 'Email/Phone', 'Date', 'Status'];
        const rows = tableData.map(item => [
            item.ver_id,
            item.name,
            item.email,
            item.date || '', // Include the date as it is, handle empty dates
            item.status === "True" ? "Verified" : "Unverified"
        ]);

        const csvContent = [
            headers.join(','), // Add headers
            ...rows.map(row => row.join(',')) // Add rows
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Validation list.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

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
                                <button className="dt-button buttons-collection btn btn-label-primary me-2 waves-effect waves-light" onClick={handleExportCSV} aria-controls="DataTables_Table_0" type="button" aria-haspopup="dialog" aria-expanded="false">
                                    <span>
                                        <i className="ti ti-upload me-1"></i>
                                        <span className="d-none d-sm-inline-block">Export</span>
                                    </span>
                                </button>
                                <button
                                    onClick={() => setModalShow(true)}
                                    className="dt-button create-new btn btn-primary waves-effect waves-light"
                                    aria-controls="DataTables_Table_0"
                                    type="button"
                                >
                                    <i className="menu-icon tf-icons ti ti-calendar"></i>
                                    <span className="d-none d-sm-inline-block">Search By Dates</span>
                                </button>
                                <SearchByDate show={modalShow} onHide={() => setModalShow(false)} />
                            </div>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-striped text-center">
                                <thead className='table-bg'>
                                    <tr>
                                        <th>VID</th>
                                        <th>Name</th>
                                        <th>Email/Phone</th>
                                        <th>Date</th>
                                        <th>Address</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr className='input-row'>
                                        {mapFields.map(field => (
                                            <th key={field.id}>
                                                {field.type === "text" || field.type === "date" ? (
                                                    <div className="input-group input-group-merge">
                                                        <span className="input-group-text p-2" id={`basic-addon-search-${field.name}`}><i className="ti ti-search"></i></span>
                                                        <input
                                                            type={field.type}
                                                            className="form-control"
                                                            placeholder={field.placeholder}
                                                            name={field.name}
                                                            value={searchTerms[field.name]}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="input-group input-group-merge">
                                                        <span className="input-group-text p-2" id={`basic-addon-search-${field.name}`}><i className="ti ti-search"></i></span>
                                                        <select
                                                            className="form-select"
                                                            name="true_status"
                                                            // value={searchTerms.status}
                                                            onChange={handleChange}
                                                        >
                                                            {field.options.map(option => (
                                                                <option key={option.value} value={option.value} >{option.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6">Loading ...</td>
                                        </tr>
                                    ) : (
                                        filteredData.length > 0 ? filteredData.map((item, i) => (
                                            <tr key={i}>
                                                <td><small>{item.ver_id}</small></td>
                                                <td><small>{item.name}</small></td>
                                                <td><small>{item.email}</small></td>
                                                <td><small>
                                                    {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString()}
                                                </small></td>
                                                <td><small>{item.address}</small></td>
                                                <td>
                                                    <span className={`badge ${item.status === "True" ? "bg-label-success" : "bg-label-danger"}`}>
                                                        {item.status === "True" ? "verified" : "unverified"}
                                                    </span>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="5">No records found</td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-3 mb-3 me-3 d-flex justify-content-end align-items-center flex-wrap" style={{ color: "#5d596c" }}>
                            <div className="">
                                <div className=' d-flex justify-content-end align-items-center'>
                                    <div class="dataTables_length d-flex" id="DataTables_Table_1_length pe-3">
                                        <span className="d-flex align-items-center">Rows per page:</span>
                                        <div class="btn-group">
                                            <button type="button" style={{ color: "#5d596c" }} class="bg-transparent border-0  waves-effect waves-light px-3 d-flex align-items-center gap-1" name="DataTables_Table_1_length" aria-controls="DataTables_Table_1" data-bs-toggle="dropdown" aria-expanded="false">
                                                10 <FaCaretDown />
                                            </button>
                                            <ul class="dropdown-menu" style={{ minWidth: "max-content" }}>
                                                <li class="dropdown-item">15</li>
                                                <li class="dropdown-item">20</li>
                                                <li class="dropdown-item">25</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="">
                                <div className="d-flex align-items-center justify-content-end">
                                    <div
                                        className="dataTables_paginate paging_simple_numbers d-flex align-items-center gap-4"
                                        id="DataTables_Table_0_paginate"
                                    >
                                        <p className="m-0" style={{ whiteSpace: "nowrap" }}>{`${(currentPage - 1) * itemsPerPage + 1
                                            }-${Math.min(
                                                currentPage * itemsPerPage,
                                                totalItems
                                            )} of ${totalPages}`}</p>
                                        <button
                                            className={`p-2 border-0 bg-transparent`}
                                            onClick={prevPage}
                                            disabled={currentPage === 1}
                                        >
                                            <i className={`fas fa-angle-left cursor-pointer ${currentPage === 1 ? 'text-muted' : ''}`}></i>
                                        </button>
                                        <button
                                            className={`p-2 border-0 bg-transparent`}
                                            onClick={nextPage}
                                            disabled={currentPage === totalPagesLength}
                                        >
                                            <i className={`fas fa-angle-right cursor-pointer  ${currentPage === totalPagesLength ? 'text-muted' : ''}`}></i>
                                        </button>
                                    </div>
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
