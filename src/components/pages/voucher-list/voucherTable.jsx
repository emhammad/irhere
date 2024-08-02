import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Table = () => {
    const user = useSelector((state) => state.user?.user || []);
    const [voucher, setVoucher] = useState([]);
    const url = process.env.REACT_APP_SERVER_DOMAIN;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPagesLength, setTotalPagesLength] = useState(0);
    const [stats, setStats] = useState(0);

    const itemsPerPage = 10;

    const [searchTerms, setSearchTerms] = useState({
        code: '',
        expired: '',
        is_used: '',
    });

    useEffect(() => {
        const fetchVoucher = async () => {
            const token = user?.access_token;
            try {
                const params = {};

                if (searchTerms.code) params.code = searchTerms.code;
                if (searchTerms.expired) {
                    params.expired = 0;
                } else if (searchTerms.is_used) {
                    params.is_used = 0;
                }

                console.log(currentPage);

                const response = await axios.get(`${url}/api/get_voucher/page/${currentPage}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    params: Object.keys(params).length ? params : undefined,
                });

                setVoucher(response.data.Data || []);

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
    }, [currentPage, user, url, searchTerms]);

    const nextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPagesLength));
    };

    const prevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log("Name: " + name);
        console.log("Value: " + value);

        setSearchTerms(prevData => ({
            ...prevData,
            expired: '',
            is_used: ''
        }));

        if (value === "expired") {
            setSearchTerms(prevData => ({
                ...prevData,
                expired: '0',
            }));
        } else if (value === "is_used") {
            setSearchTerms(prevData => ({
                ...prevData,
                is_used: '0'
            }));
        }
    };

    const handleExportCSV = () => {
        const csvContent = voucher.map(item => [
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
        const [datePart, timePart] = dateString.split(' ');
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
                            <h5 className="card-title mb-0">Vouchers List</h5>
                        </div>
                        <div className="dt-action-buttons text-end pt-3 pt-md-0">
                            <div className="dt-buttons">
                                <button className="dt-button buttons-collection btn btn-label-primary me-2 waves-effect waves-light"
                                    onClick={handleExportCSV} aria-controls="DataTables_Table_0" type="button" aria-haspopup="dialog" aria-expanded="false">
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
                                    {voucher.map(item => (
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
                                    ))}
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
