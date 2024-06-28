import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const Table = () => {
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.user?.user || {});
    const url = process.env.REACT_APP_SERVER_DOMAIN;
    const [tableData, setTableData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPagesLength, setTotalPagesLength] = useState(0);
    const itemsPerPage = 10;

    const [searchTerms, setSearchTerms] = useState({
        ver_id: '',
        Name: '',
        Email: '',
        Date: '',
        true_status: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "true_status") {
            setSearchTerms(prevData => ({
                ...prevData,
                [name]: value === "1" ? true : value === "0" ? false : ''
            }));
            console.log(e.target.value);
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
        { id: 4, name: "Date", placeholder: "Date...", type: "text" },
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
                console.log("Unexpected data format");
            }
        } catch (error) {
            console.log(error);
            console.log("Failed to fetch data");
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
        const csvContent = tableData.map(item => [
            item.voucher_code,
            formatDate(item.date),
            formatDate(item.valid_date),
            item.amount,
            item.is_used ? "Expired" : "Used"
        ].join(',')).join('\n');

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

    const formatDate = (dateString) => {
        if (!dateString) return ''; // handle empty or undefined dateString

        const parts = dateString.split(' ');
        if (parts.length !== 2) return ''; // handle unexpected format

        const [datePart, timePart] = parts;
        const [month, day, year] = datePart.split('-');
        const [hour, minute, second] = timePart.split(':');
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    };

    return (
        <div className="card">
            <div className="card-datatable pt-0">
                <div id="DataTables_Table_0_wrapper" className="dataTables_wrapper dt-bootstrap5 no-footer">
                    <div className="card-header header-flex d-flex justify-content-between p-3">
                        <div className="head-label d-flex align-items-center">
                            <h5 className="card-title mb-0">List Of Validations</h5>
                        </div>
                        <div className="dt-action-buttons text-end pt-3 pt-md-0">
                            <div className="dt-buttons">
                                <button className="dt-button buttons-collection btn btn-label-primary me-2 waves-effect waves-light" onClick={handleExportCSV} aria-controls="DataTables_Table_0" type="button" aria-haspopup="dialog" aria-expanded="false">
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
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-striped text-center">
                                <thead className='table-bg'>
                                    <tr>
                                        <th>VID</th>
                                        <th>Name</th>
                                        <th>Email/Phone</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr className='input-row'>
                                        {mapFields.map(field => (
                                            <th key={field.id}>
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
                                            <td colSpan="5">Loading ...</td>
                                        </tr>
                                    ) : (
                                        filteredData.length > 0 ? filteredData.map((item, i) => (
                                            <tr key={i}>
                                                <td><small>{item.ver_id}</small></td>
                                                <td><small>{item.name}</small></td>
                                                <td><small>{item.email}</small></td>
                                                <td><small>{item.date}</small></td>
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
                        <div className="row mt-3 mb-3 me-3">
                            <div className="d-flex align-items-center justify-content-end">
                                <div
                                    className="dataTables_paginate paging_simple_numbers d-flex align-items-center gap-4"
                                    id="DataTables_Table_0_paginate"
                                >
                                    <p className="m-0">{`${(currentPage - 1) * itemsPerPage + 1
                                        }-${Math.min(
                                            currentPage * itemsPerPage,
                                            totalItems
                                        )} of ${totalItems}`}</p>
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
    );
};

export default Table;
