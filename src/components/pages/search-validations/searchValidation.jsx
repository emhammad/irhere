import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SearchValidation = () => {
    const [searchInput, setSearchInput] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const user = useSelector((state) => state.user?.user || []);
    const url = process.env.REACT_APP_SERVER_DOMAIN;
    const navigate = useNavigate();

    const handleSearchInputChange = async (e) => {
        const value = e.target.value;
        setSearchInput(value);

        if (value.length > 0) {
            try {
                setLoading(true);
                setError("");

                const token = user?.access_token;
                if (!token) {
                    toast.error("No access token available");
                    navigate('/')
                }

                const formData = new FormData();
                formData.append("search_ver_id", value);

                const response = await axios.post(
                    `${url}/api/search_certificate_list_ver_id`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                setData(response.data.Data);
            } catch (err) {
                setError("Error fetching data");
            } finally {
                setLoading(false);
            }
        } else {
            setData([]);
        }
    };

    const handleExportCSV = () => {
        const csvContent = data && data?.length >= 0 && data?.map(item => [
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
        if (!dateString) return "Invalid date";

        const [datePart, timePart] = dateString.split(' ');
        if (!datePart || !timePart) return "Invalid date";

        const [month, day, year] = datePart.split('-');
        const [hour, minute, second] = timePart.split(':');
        if (!month || !day || !year || !hour || !minute || !second) return "Invalid date";

        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    };

    return (
        <>
            <div className="container-xxl flex-grow-1">
                <div className="Inputcontainer card">
                    <div className="searchInputWrapper">
                        <input
                            className="searchInput"
                            type="text"
                            placeholder="Focus here to search"
                            value={searchInput}
                            onChange={handleSearchInputChange}
                        />
                        <i className="searchInputIcon fa fa-search"></i>
                    </div>
                </div>
                <div className="card my-4">
                    <div className="card-datatable pt-0">
                        <div
                            id="DataTables_Table_0_wrapper"
                            className="dataTables_wrapper dt-bootstrap5 no-footer"
                        >
                            <div className="card-header header-flex d-flex justify-content-between p-3">
                                <div className="head-label d-flex align-items-center">
                                    <h5 className="card-title mb-0">Validation List</h5>
                                </div>
                                <div className="dt-action-buttons text-end pt-3 pt-md-0">
                                    <div className="dt-buttons">
                                        <button
                                            className="dt-button buttons-collection btn btn-label-primary me-2 waves-effect waves-light"
                                            aria-controls="DataTables_Table_0"
                                            type="button"
                                            aria-haspopup="dialog"
                                            aria-expanded="false"
                                            onClick={handleExportCSV}
                                        >
                                            <span>
                                                <i className="ti ti-upload me-1 ti-xs"></i>
                                                <span className="d-none d-sm-inline-block">Export</span>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="table table-responsive">
                                <table className="table table-striped">
                                    <thead className="border-bottom table-bg text-center">
                                        <tr>
                                            <th>VID</th>
                                            <th>Name</th>
                                            <th>Email/Phone</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-border-bottom-0 table-striped text-center">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="5">Loading...</td>
                                            </tr>
                                        ) : error ? (
                                            <tr>
                                                <td colSpan="5">{error}</td>
                                            </tr>
                                        ) : data.length > 0 ? (
                                            data.map((item) => (
                                                <tr key={item.ver_id}>
                                                    <td><small>{item.ver_id}</small></td>
                                                    <td><small>{item.name}</small></td>
                                                    <td><small>{item.email}</small></td>
                                                    <td><small>{item.date}</small></td>
                                                    <td>
                                                        <span className={`badge ${item.status ? "bg-label-success" : "bg-label-danger"}`}>
                                                            {item.status ? "verified" : "unverified"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5">No records found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SearchValidation;