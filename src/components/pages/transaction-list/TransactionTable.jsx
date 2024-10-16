import React from 'react';
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SearchByDate from './search-by-date';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

const Table = () => {
  const [transaction, setTransaction] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user?.user || []);
  const url = process.env.REACT_APP_SERVER_DOMAIN;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPagesLength, setTotalPagesLength] = useState(0);
  const [modalShow, setModalShow] = React.useState(false);
  const [searchDateActive, setSearchDateActive] = useState(false);
  const [exportLoading, setExportLoad] = useState(false);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const [searchTerms, setSearchTerms] = useState({
    id: "",
    name: "",
    email: "",
    amount: "",
    descrip: "",
  });

  const handleSearchByDate = (start_date, end_date) => {
    setSearchTerms((prevTerms) => ({
      ...prevTerms,
      start_date,
      end_date,
    }));
  };

  useEffect(() => {
    const transactionData = async () => {
      const token = user?.access_token;
      if (!token) {
        navigate('/portal/login');
        return;
      }

      try {
        const params = {
          id: searchTerms.id || undefined,
          name: searchTerms.name || undefined,
          email: searchTerms.email || undefined,
          amount: searchTerms.amount || undefined,
          desc: searchTerms.descrip || undefined,
          start_date: searchTerms.start_date || undefined, // Include start date
          end_date: searchTerms.end_date || undefined,     // Include end date
        };

        const response = await axios.get(`${url}/api/get_transaction_history/page/${currentPage}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: params,
        });

        if (response.status === 200) {
          setLoading(false);
        }
        if (Array.isArray(response.data?.Data)) {
          setTransaction(response.data.Data);
          setTotalPagesLength(response.data.Page?.TotalRecords || 1);
        } else {
          setTransaction([]);
          setTotalPagesLength(1);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    transactionData();
    if (searchTerms.start_date === null || searchTerms.end_date === null) {
      setSearchDateActive(false)
    }
  }, [user, currentPage, url, searchTerms, navigate]);

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPagesLength));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const filterData = transaction.filter((item) => {
    return (
      (!searchTerms.id || item.id.toLowerCase().includes(searchTerms.id.toLowerCase())) &&
      (!searchTerms.name || item.name.toLowerCase().includes(searchTerms.name.toLowerCase())) &&
      (!searchTerms.email || item.email.toLowerCase().includes(searchTerms.email.toLowerCase())) &&
      (!searchTerms.amount || item.amount.toLowerCase().includes(searchTerms.amount.toLowerCase())) &&
      (!searchTerms.direction || item.direction.toLowerCase().includes(searchTerms.direction.toLowerCase())) &&
      (!searchTerms.descrip || item.descrip.toLowerCase().includes(searchTerms.descrip.toLowerCase()))
    );
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchTerms((prevData) => ({
      ...prevData,
      [name]: value,
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
      const response = await axios.get(`${url}/api/export_transaction_history`, {
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

        // Create headers for Excel export
        const headers = [
          { label: 'Transaction ID', key: 'id' },
          { label: 'Name', key: 'name' },
          { label: 'Email/Phone', key: 'email' },
          { label: 'Amount', key: 'amount' },
          { label: 'Location', key: 'descrip' },
          { label: 'Balance', key: 'balance' }
        ];

        // Prepare the data rows
        const worksheetData = exportData.map(item => ({
          id: item.id,
          name: item.name,
          email: item.email,
          amount: item.direction === "0" ? `- ${item.amount}` : `+ ${item.amount}`,
          descrip: item.descrip,
          balance: item.balance
        }));

        // Create a worksheet and workbook
        const worksheet = XLSX.utils.json_to_sheet(worksheetData, { header: headers.map(h => h.key) });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions List');

        // Generate file and trigger download
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `Transactions List ${new Intl.DateTimeFormat('en-GB', {
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
        setExportLoad(false)
        toast.error('Failed to export records. Please try again.');
      }
    } catch (error) {
      setExportLoad(false)
      console.error('Error exporting data:', error);
      toast.error('Error exporting data.');
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-datatable pt-0">
          <div id="DataTables_Table_0_wrapper" className="dataTables_wrapper dt-bootstrap5 no-footer">
            <div className="card-header header-flex d-flex justify-content-between p-3 flex-wrap">
              <div className="head-label d-flex align-items-center">
                <h5 className="card-title mb-0">Transactions List</h5>
              </div>
              <div className="dt-action-buttons text-end pt-3 pt-md-0">
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
            <div className="table table-responsive">
              <table className="table table-striped">
                <thead className="border-bottom table-bg text-center">
                  <tr>
                    <th>Transaction ID</th>
                    <th style={{ width: "10%" }}>Name</th>
                    <th>Email/Phone</th>
                    <th>Amount</th>
                    <th style={{ width: "17%" }}>Location</th>
                    <th>Balance</th>
                    {/* <th>Action</th> */}
                  </tr>
                </thead>
                <tbody className="table-border-bottom-0 table-striped text-center">
                  <tr>
                    <td>
                      <div className="input-group input-group-merge">
                        <span className="input-group-text p-2" id="basic-addon-search">
                          <i className="ti ti-search"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          name="id"
                          placeholder="Transaction..."
                          value={searchTerms.id}
                          onChange={handleChange}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="input-group input-group-merge">
                        <span className="input-group-text p-2" id="basic-addon-search">
                          <i className="ti ti-search"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          placeholder="Name..."
                          value={searchTerms.name}
                          onChange={handleChange}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="input-group input-group-merge">
                        <span className="input-group-text p-2" id="basic-addon-search">
                          <i className="ti ti-search"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          name="email"
                          placeholder="Email..."
                          value={searchTerms.email}
                          onChange={handleChange}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="input-group input-group-merge">
                        <span className="input-group-text p-2"><i className="ti ti-search"></i></span>
                        <input
                          type="number"
                          className="form-control"
                          name="amount"
                          placeholder="Amount..."
                          value={searchTerms.amount}
                          onChange={handleChange}
                        />
                        {/* <select
                          className="form-select"
                          name="amount"
                          
                        >
                          <option value="">Select Amount</option>
                          <option value="credit">Credit</option>
                          <option value="debit">Debit</option>
                        </select> */}
                      </div>
                    </td>
                    <td>
                      <div className="input-group input-group-merge">
                        <span className="input-group-text p-2" id="basic-addon-search">
                          <i className="ti ti-search"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          name="descrip"
                          placeholder="Location..."
                          value={searchTerms.descrip}
                          onChange={handleChange}
                        />
                      </div>
                    </td>
                    <td></td>
                  </tr>
                  {loading ? (
                    <tr>
                      <td colSpan="6">Loading ...</td>
                    </tr>
                  ) : filterData.length === 0 ? (
                    <tr>
                      <td colSpan="6">No records found</td>
                    </tr>
                  ) : (
                    filterData && filterData.map((item) => (
                      <tr key={item.id}>
                        <td><small>{item.id}</small></td>
                        <td><small>{item.name}</small></td>
                        <td><small>{item.email}</small></td>
                        <td>
                          {item.direction === "0" ?
                            <small className="text-danger">- {item.amount}</small>
                            :
                            <small className="text-success">+ {item.amount}</small>
                          }
                          <small className="text-success"></small></td>
                        <td><small>{item.descrip}</small></td>
                        <td><small>{item.balance}</small></td>
                        {/* <td>
                          <div className="dropdown">
                            <button className="btn p-0" type="button" id="earningReportsId" data-bs-toggle="dropdown">
                              <i className="ti ti-dots-vertical ti-sm text-muted"></i>
                            </button>
                            <div className="dropdown-menu dropdown-menu-end py-2 px-4 rounded bg-label-primary text-center">
                              <button className="dropdown-item p-0 m-0 w-auto text-primary d-flex align-items-center">
                                <i className="ti ti-currency-dollar ti-sm"></i>
                                Refund
                              </button>
                            </div>
                          </div>
                        </td> */}
                      </tr>
                    )))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 mb-3 me-3 d-flex justify-content-end align-items-center flex-wrap" style={{ color: "#5d596c" }}>
              <div className="">
                <div className="dataTables_paginate paging_simple_numbers d-flex align-items-center gap-4" id="DataTables_Table_0_paginate">
                  <p className="m-0">{`${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, totalPagesLength)} of ${totalPagesLength}`}</p>
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
