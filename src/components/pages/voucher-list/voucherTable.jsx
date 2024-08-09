import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCaretDown } from "react-icons/fa";

const Table = () => {
    const user = useSelector((state) => state.user?.user || {});
    const [loading, setLoading] = useState(true);
    const [voucher, setVoucher] = useState([]);
    const url = process.env.REACT_APP_SERVER_DOMAIN;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPagesLength, setTotalPagesLength] = useState(0);
    const [stats, setStats] = useState(0);
    const dateInputRef = useRef(null);
    const navigate = useNavigate()

    const itemsPerPage = 10;

    const [searchTerms, setSearchTerms] = useState({
        code: '',
        expired: '',
        is_used: '',
    });

    const token = user?.access_token;

    useEffect(() => {

        if (!token) {
            navigate('/');
            return;
        }
        const fetchVoucher = async () => {
            try {
                const params = {};

                if (searchTerms.code) params.code = searchTerms.code;
                if (searchTerms.expired) {
                    params.expired = 0;
                } else if (searchTerms.is_used) {
                    params.is_used = 0;
                }

                const response = await axios.get(`${url}/api/get_voucher/page/${currentPage}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    params: Object.keys(params).length ? params : undefined,
                });

                setVoucher(response.data.Data || []);
                if (response.status === 200) {
                    setLoading(false);
                }

                const statistics = await axios.get(`${url}/api/dashboard_stats`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                });
                setStats(statistics.data.total_vouchers);

                if (response.status === 200) {
                    setTotalItems(response.data.Page?.TotalItems || response.data.Data.length);
                    setTotalPagesLength(response.data.Page?.TotalPages || 1);
                } else {
                    setTotalItems(0);
                    setTotalPagesLength(1);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchVoucher();
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
            ...(name === "status" && value === "expired" ? { expired: '0', is_used: '' } : {}),
            ...(name === "status" && value === "is_used" ? { is_used: '0', expired: '' } : {}),
            ...(name === "status" && value === "Select by expired & used" ? { expired: '', is_used: '' } : {})
        }));
    };

    const handleExportCSV = () => {
        const headers = ["Voucher Code", "Date", "Expiry Date", "Amount", "Status"];
        const csvContent = [
            headers.join(','),
            ...voucher.map(item => [
                item.voucher_code,
                item.date,
                item.valid_date,
                item.amount,
                item.is_used ? "Expired" : "Used"
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Voucher List.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleButtonClick = () => {
        if (dateInputRef.current) {
            dateInputRef.current.showPicker();
        }
    }

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
                                    onClick={handleExportCSV} aria-controls="DataTables_Table_0" type="button" aria-haspopup="dialog" aria-expanded="false">
                                    <span>
                                        <i className="ti ti-upload me-1"></i>
                                        <span className="d-none d-sm-inline-block">Export</span>
                                    </span>
                                </button>
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                    <button
                                        onClick={handleButtonClick}
                                        className="dt-button create-new btn btn-primary waves-effect waves-light"
                                        aria-controls="DataTables_Table_0"
                                        type="button"
                                    >
                                        <i className="menu-icon tf-icons ti ti-calendar"></i>
                                        <span className="d-none d-sm-inline-block">Search By Dates</span>
                                    </button>

                                    <input
                                        type="date"
                                        id='datePicker'
                                        ref={dateInputRef}
                                        onClick={handleButtonClick}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            zIndex: 1112,
                                            opacity: 0,
                                        }}
                                        onChange={(e) => console.log(e.target.value)}
                                    />
                                </div>
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
                                        <td colSpan="2">
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
                                        <td colSpan="3">
                                            <select
                                                className="form-select rounded"
                                                name="status"
                                                onChange={handleChange}
                                            >
                                                <option>Select by expired & used</option>
                                                <option value="expired">Expired</option>
                                                <option value="is_used">Used</option>
                                            </select>
                                        </td>
                                    </tr>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6">Loading ...</td>
                                        </tr>
                                    ) : (
                                        voucher.map(item => (
                                            <tr key={item.voucher_code}>
                                                <td><small>{item.voucher_code}</small></td>
                                                <td><small>{item.date}</small></td>
                                                <td><small>{item.valid_date}</small></td>
                                                <td><small>{item.amount}</small></td>
                                                <td>
                                                    {item.expired ? (
                                                        <span className="badge bg-label-danger">Expired</span>
                                                    ) : item.is_used ? (
                                                        <span className="badge bg-label-success">Used</span>
                                                    ) : null}
                                                </td>
                                            </tr>
                                        )))}
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
                                <div
                                    className="dataTables_paginate paging_simple_numbers d-flex align-items-center gap-4"
                                    id="DataTables_Table_0_paginate"
                                >
                                    <p className="m-0">{`${(currentPage - 1) * itemsPerPage + 1
                                        }-${Math.min(
                                            currentPage * itemsPerPage,
                                            totalItems
                                        )} of ${stats}`}</p>
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
