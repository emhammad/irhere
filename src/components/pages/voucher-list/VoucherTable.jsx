import * as XLSX from 'xlsx';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { FaCaretDown } from "react-icons/fa";
import SearchByDate from './modal/search-by-date';
import toast from 'react-hot-toast';

const Table = () => {
    const user = useSelector((state) => state.user?.user || {});
    const [loading, setLoading] = useState(true);
    const [voucher, setVoucher] = useState([]);
    const url = process.env.REACT_APP_SERVER_DOMAIN;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPagesLength, setTotalPagesLength] = useState(0);
    const [stats, setStats] = useState(0);
    const [modalShow, setModalShow] = React.useState(false);
    const [searchDateActive, setSearchDateActive] = useState(false);
    const [exportLoading, setExportLoad] = useState(false);
    const navigate = useNavigate()
    const itemsPerPage = 10;

    const [searchTerms, setSearchTerms] = useState({
        code: '',
        expired: '',
        is_used: '',
    });

    const token = user?.access_token;

    const handleSearchByDate = (start_date, end_date) => {
        setSearchTerms((prevTerms) => ({
            ...prevTerms,
            start_date,
            end_date,
        }));
    };

    useEffect(() => {
        if (!token) {
            navigate('/portal/login');
            return;
        }

        const fetchVoucher = async () => {
            try {
                const params = {};

                if (searchTerms.code) params.code = searchTerms.code;
                if (searchTerms.expired) params.expired = 1;
                if (searchTerms.is_used) params.is_used = 1;

                // Include start_date and end_date in the request if they exist
                if (searchTerms.start_date) params.start_date = searchTerms.start_date;
                if (searchTerms.end_date) params.end_date = searchTerms.end_date;

                const response = await axios.get(`${url}/api/get_voucher/page/${currentPage}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    params: params
                });
                setVoucher(response.data.Data);

                if (response.status === 200) {
                    setLoading(false);
                }

                if (response.status === 200) {
                    setTotalPagesLength(response.data.Page?.TotalPages || 1);
                    setStats(response.data.Page?.TotalRecords || 0);
                } else {
                    setTotalPagesLength(1);
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchVoucher();

        if (searchTerms.start_date === null || searchTerms.end_date === null) {
            setSearchDateActive(false)
        }
    }, [currentPage, user, url, searchTerms, token, navigate]);



    const nextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPagesLength));
    };

    const prevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setSearchTerms(prevData => ({
            ...prevData,
            [name]: value,
            ...(name === "status" && value === "expired" ? { expired: 1, is_used: '' } : {}),
            ...(name === "status" && value === "is_used" ? { is_used: 1, expired: '' } : {}),
            ...(name === "status" && value === "Select by expired & used" ? { expired: '', is_used: '' } : {})
        }));
    };

    const handleExportExcel = async () => {
        const { start_date, end_date } = searchTerms;

        if (!start_date || !end_date) {
            toast.error('Please select start and end dates to export the records.');
            return;
        }

        setExportLoad(true)

        try {
            const token = user?.access_token;
            const response = await axios.get(`${url}/api/export_voucher_list`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                params: {
                    start_date,
                    end_date,
                },
            });

            if (response.status === 200 && response.data) {
                const exportData = response.data; // Assuming this is an array of objects

                // Prepare the data rows
                const worksheetData = exportData.map(item => ({
                    voucher_code: item.voucher_code,
                    date: new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                    valid_date: new Date(item.valid_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                    amount: item.amount,
                    status: new Date(item.valid_date) < new Date() ? "Expired" : item.is_used === "0" ? "Not Used" : "Used"
                }));

                // Create a worksheet and workbook
                const worksheet = XLSX.utils.json_to_sheet(worksheetData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Vouchers List');

                // Generate file and trigger download
                const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

                const downloadUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = `Vouchers List - ${new Intl.DateTimeFormat('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric'
                }).format(new Date(start_date))} to ${new Intl.DateTimeFormat('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric'
                }).format(new Date(end_date))}.xlsx`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(downloadUrl);
                setExportLoad(false)
            } else {
                toast.error('Failed to export records. Please try again.');
                setExportLoad(false)
            }
        } catch (error) {
            setExportLoad(false)
            console.error('Error exporting data:', error);
            toast.error('Error exporting data.');
        }
    };

    return (
        <div className="card">
            <div className="card-datatable pt-0">
                <div id="DataTables_Table_0_wrapper" className="dataTables_wrapper dt-bootstrap5 no-footer">
                    <div className="card-header header-flex d-flex justify-content-between p-3 flex-wrap">
                        <div className="head-label d-flex align-items-center">
                            <h5 className="card-title mb-0">Vouchers List</h5>
                        </div>
                        <div className="dt-action-buttons text-end pt-3 pt-md-0">
                            <div className="dt-buttons">
                                <button className="dt-button buttons-collection btn btn-label-primary me-2 waves-effect waves-light"
                                    onClick={handleExportExcel} aria-controls="DataTables_Table_0" type="button" aria-haspopup="dialog" aria-expanded="false">
                                    <span>
                                        {exportLoading === false ? <i className="ti ti-upload me-1"></i> : ''}
                                        <span className="d-none d-sm-inline-block">{exportLoading === false ? 'Export' : 'Loading'}</span>
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
                                <SearchByDate show={modalShow} onHide={() => setModalShow(false)} onSearch={handleSearchByDate} />
                            </div>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-striped text-center">
                                <thead className='table-bg'>
                                    <tr>
                                        <th>Voucher Code</th>
                                        <th>Date</th>
                                        <th>Expiry Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan="3">
                                            <div className="input-group input-group-merge">
                                                <span className="input-group-text p-2" id={`basic-addon-search}`}><i className="ti ti-search"></i></span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Search by Voucher Code..."
                                                    name="code"
                                                    value={searchTerms.code}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </td>
                                        <td colSpan="2">
                                            <select
                                                className="form-select rounded"
                                                name="status"
                                                onChange={handleChange}
                                            >
                                                <option value="">Select by expired & used</option>
                                                <option value="expired">Expired</option>
                                                <option value="is_used">Used</option>
                                            </select>
                                        </td>
                                    </tr>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6">Loading ...</td>
                                        </tr>
                                    ) : voucher.length === 0 ? (
                                        <tr>
                                            <td colSpan="6">No records found</td>
                                        </tr>
                                    ) : (
                                        voucher?.map(item => (
                                            <tr key={item.voucher_code}>
                                                <td><small>{item.voucher_code}</small></td>
                                                <td>   <small>{new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })}</small></td>
                                                <td>   <small>{new Date(item.valid_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })}</small></td>
                                                <td><small>{item.amount}</small></td>
                                                <td>
                                                    {new Date(item.valid_date) < new Date() ? (
                                                        <span className="badge bg-label-danger">Expired</span>
                                                    ) : item.is_used === "0" ? (
                                                        <span className="badge bg-label-success">Not Used</span>
                                                    ) : item.is_used !== "0" && (
                                                        <span className="badge bg-label-info">Used</span>
                                                    )}
                                                </td>
                                            </tr>
                                        )))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-3 mb-3 me-3 d-flex justify-content-end align-items-center flex-wrap" style={{ color: "#5d596c" }}>
                            <div className="">
                                <div
                                    className="dataTables_paginate paging_simple_numbers d-flex align-items-center gap-4"
                                    id="DataTables_Table_0_paginate"
                                >
                                    <p className="m-0">{`${(currentPage - 1) * itemsPerPage + 1}-${Math.min((currentPage * itemsPerPage), stats)} of ${stats}`}</p>
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
                                        <i className={`fas fa-angle-right cursor-pointer ${currentPage === totalPagesLength ? 'text-muted' : ''}`}></i>
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
