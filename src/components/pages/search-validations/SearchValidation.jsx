import React, { useState } from "react";
import axios from "axios";
import * as XLSX from 'xlsx';
import { useSelector } from "react-redux";
import IRhere_Logo from '../../../assets/irhere_images/Group 389.png';
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const SearchValidation = () => {
    const [searchInput, setSearchInput] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [emptyData, setEmptyData] = useState(false);
    const user = useSelector((state) => state.user?.user || []);
    const url = process.env.REACT_APP_SERVER_DOMAIN;
    const token = user?.access_token;


    const handleSearchInputChange = async (e) => {
        const value = e.target.value;
        setSearchInput(value);
        if (value === "") { setEmptyData(false) }
    };

    const handleSubmit = async (e) => {
        if (searchInput === '') {
            toast.error("Enter Validation Number before search.")
        } else {
            try {
                setEmptyData(true)
                setLoading(true);
                setError("");

                const formData = new FormData();
                formData.append("search_ver_id", searchInput);

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
        }
    }

    const handleExportExcel = () => {
        const headers = ["Validation No", "Name", "Address", "Date", "Status"];

        // Prepare the data for the Excel sheet
        const excelData = [
            headers,
            ...data.map(item => [
                item.ver_id,
                item.name,
                item.address,
                item.date,
                item.status ? "verified" : "unverified"
            ])
        ];

        // Create a new workbook and a worksheet
        const ws = XLSX.utils.aoa_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Search Validation');

        // Export the Excel file
        const excelFileName = `Search Validation ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/\s/g, '-')}.xlsx`;

        XLSX.writeFile(wb, excelFileName);
    };

    return (
        <>
            <div className="container-xxl flex-grow-1 d-flex justify-content-center">
                <div className="searchvalidation">
                    <div className='logo d-flex align-items-center gap-3'>
                        <Link to="/portal">
                            <img src={IRhere_Logo} alt="auth-login-cover" className="rounded-2" />
                        </Link>
                    </div>
                    <div className="Inputcontainer card">
                        <div className="searchInputWrapper">
                            <input
                                className="searchInput"
                                type="text"
                                placeholder="Type the Validation Number here to search"
                                value={searchInput}
                                onChange={handleSearchInputChange}
                            />
                            <i className="searchInputIcon fa fa-search ti-md" style={{ cursor: "pointer" }} onClick={handleSubmit}></i>
                        </div>
                    </div>
                    {/* {searchInput !== '' ? */}
                    <div className="card p-4 pt-2 my-4 w-100">
                        <div className="card-datatable pt-0">
                            <div
                                id="DataTables_Table_0_wrapper"
                                className="dataTables_wrapper dt-bootstrap5 no-footer"
                            >
                                <div className="card-header d-flex justify-content-between p-3">
                                    <div className="head-label d-flex align-items-center" style={{ width: "max-content" }}>
                                        <h5 className="card-title mb-0">Validation List</h5>
                                    </div>
                                    <div className="dt-action-buttons text-end pt-md-0" style={{ width: "max-content" }}>
                                        <div className="dt-buttons">
                                            <button
                                                className="dt-button buttons-collection btn btn-label-primary me-2 waves-effect waves-light"
                                                aria-controls="DataTables_Table_0"
                                                type="button"
                                                aria-haspopup="dialog"
                                                aria-expanded="false"
                                                onClick={handleExportExcel}
                                            >
                                                <span>
                                                    <i className="ti ti-upload me-1"></i>
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
                                                <th>Validation Number</th>
                                                <th>Name</th>
                                                <th>Address</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="table-border-bottom-0 table-striped text-center">
                                            {loading ? (
                                                <tr className="bg-transparent">
                                                    <td>Loading...</td> {/* Adjust colSpan to cover all table columns */}
                                                </tr>
                                            ) : error ? (
                                                <tr>
                                                    <td>{error}</td> {/* Adjust colSpan to cover all table columns */}
                                                </tr>
                                            ) : emptyData === false ? (
                                                <tr className="bg-transparent">
                                                    <td>Enter Validation Number to search.</td> {/* Adjust colSpan to cover all table columns */}
                                                </tr>
                                            ) : data.length === 0 ? (
                                                <tr className="bg-transparent">
                                                    <td>No records found</td> {/* Adjust colSpan to cover all table columns */}
                                                </tr>
                                            ) : (
                                                data.map((item) => (
                                                    <tr key={item.ver_id}>
                                                        <td><small>{item.ver_id}</small></td>
                                                        <td><small>{item.name}</small></td>
                                                        <td><small>{item.address}</small></td>
                                                        <td>
                                                            <small>
                                                                {new Date(item.date).toLocaleDateString('en-GB', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric'
                                                                })}{' '}
                                                                {new Date(item.date).toLocaleTimeString('en-GB', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                })}
                                                            </small>
                                                        </td>
                                                        <td>
                                                            {console.log(item.status)}
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
                            </div>
                        </div>
                    </div>

                </div>
            </div >
        </>
    );
};

export default SearchValidation;