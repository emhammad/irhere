import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Table = () => {
  const [transaction, setTransaction] = useState([]);
  const user = useSelector((state) => state.user?.user || []);
  const url = process.env.REACT_APP_SERVER_DOMAIN;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPagesLength, setTotalPagesLength] = useState(0);
  const itemsPerPage = 10;

  const [searchTerms, setSearchTerms] = useState({
    id: "",
    name: "",
    email: "",
    amount: "",
  });

  useEffect(() => {
    const transactionData = async () => {
      const token = user?.access_token;
      if (!token) {
        toast.error("No access token available");
        return;
      }

      try {
        const response = await axios.get(
          `${url}/api/get_transaction_history/page/${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            // params: {
            //   id: searchTerms.id,
            //   name: searchTerms.name,
            //   email: searchTerms.email,
            //   amount: searchTerms.amount,
            // },
          }
        );

        console.log(response);

        if (Array.isArray(response.data?.Data)) {
          setTransaction(response.data.Data);
          setTotalItems(response.data.Page?.TotalItems || response.data.Data.length);
          setTotalPagesLength(response.data.Page?.TotalPages || 1);
        } else {
          setTransaction([]);
          setTotalItems(0);
          setTotalPagesLength(1);
        }
      } catch (error) {
        if (error.response) {
          console.error("Response error:", error);
        } else if (error.request) {
          console.error("Request error:", error);
        } else {
          console.error("Error:", error);
        }
      }
    };

    transactionData();
  }, [user, currentPage, url, searchTerms]);

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPagesLength));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const filterData = transaction.filter((item) => {
    return (
      item &&
      item.id &&
      item.name &&
      item.email &&
      item.amount &&
      (item.id.toLowerCase().includes(searchTerms.id.toLowerCase()) &&
        item.name.toLowerCase().includes(searchTerms.name.toLowerCase()) &&
        item.email.toLowerCase().includes(searchTerms.email.toLowerCase()) &&
        item.amount.toLowerCase().includes(searchTerms.amount.toLowerCase()))
    );
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchTerms((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setCurrentPage(1); // Reset to first page when search terms change
  };

  const handleExportCSV = () => {
    if (!transaction.length) return;

    const csvContent = transaction
      .map(
        (item) =>
          `${item.id},${formatDate(item.date)},${formatDate(
            item.valid_date
          )},${item.amount},${item.is_used ? "Expired" : "Used"}`
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "table_data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "";
    }
    const [datePart, timePart] = dateString.split(" ");
    if (!datePart || !timePart) {
      return dateString;
    }
    const [month, day, year] = datePart.split("-");
    const [hour, minute, second] = timePart.split(":");
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  };

  return (
    <div>
      <div className="card">
        <div className="card-datatable pt-0">
          <div
            id="DataTables_Table_0_wrapper"
            className="dataTables_wrapper dt-bootstrap5 no-footer"
          >
            <div className="card-header header-flex d-flex justify-content-between p-3">
              <div className="head-label d-flex align-items-center">
                <h5 className="card-title mb-0">Transaction List</h5>
              </div>
              <div className="dt-action-buttons text-end pt-3 pt-md-0">
                <div className="dt-buttons">
                  <button
                    className="dt-button buttons-collection  btn btn-label-primary me-2 waves-effect waves-light"
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
                  <button
                    className="dt-button create-new btn btn-primary waves-effect waves-light"
                    aria-controls="DataTables_Table_0"
                    type="button"
                  >
                    <span>
                      <i className="menu-icon tf-icons ti ti-calendar"></i>
                      <span className="d-none d-sm-inline-block">
                        Search By Dates
                      </span>
                    </span>
                  </button>
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
                    <th>Debit/Credit</th>
                    <th style={{ width: "17%" }}>Location</th>
                    <th>Balance</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="table-border-bottom-0 table-striped text-center">
                  <tr>
                    <td>
                      <div className="input-group input-group-merge">
                        <span
                          className="input-group-text p-2"
                          id="basic-addon-search"
                        >
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
                        <span
                          className="input-group-text p-2"
                          id="basic-addon-search"
                        >
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
                        <span
                          className="input-group-text p-2"
                          id="basic-addon-search"
                        >
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
                        <span
                          className="input-group-text p-2"
                          id="basic-addon-search"
                        >
                          <i className="ti ti-search"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          name="amount"
                          placeholder="Amount..."
                          value={searchTerms.amount}
                          onChange={handleChange}
                        />
                      </div>
                    </td>
                    <td>
                      <select
                        className="form-select rounded"
                        name="Card"
                        value={searchTerms.Card}
                        onChange={handleChange}
                      >
                        <option value="">Accounts</option>
                        <option value="debit">Debit</option>
                        <option value="credit">Credit</option>
                      </select>
                    </td>
                    <td>
                      <div className="input-group input-group-merge">
                        <span
                          className="input-group-text p-2"
                          id="basic-addon-search"
                        >
                          <i className="ti ti-search"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          name="descrip"
                          placeholder="Location..."
                        // value={searchTerms.descrip}
                        // onChange={handleChange}
                        />
                      </div>
                    </td>
                    <td>

                    </td>
                  </tr>
                  {filterData && filterData.map((item) => (
                    <tr key={item.id}>
                      <td><small>{item.id}</small></td>
                      <td><small>{item.name}</small></td>
                      <td><small>{item.email}</small></td>
                      <td><small>{item.amount}</small></td>
                      <td>
                        <span
                          className={`badge ${item.Card === "Credit"
                            ? "bg-label-success"
                            : "bg-label-danger"
                            }`}
                        >
                          {item.Card === "Credit" ? "Credit" : "Debit"}
                        </span>
                      </td>
                      <td className=""><small>{item.descrip}</small></td>
                      <td><small>{item.balance}</small></td>
                      <td>
                        <div className="dropdown">
                          <button
                            className="btn p-0"
                            type="button"
                            id="earningReportsId"
                            data-bs-toggle="dropdown"
                          >
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
            <div className="row mt-3 mb-3 me-3">
              <div className="d-flex align-items-center justify-content-end">
                <div
                  className="dataTables_paginate paging_simple_numbers d-flex align-items-center gap-4"
                  id="DataTables_Table_0_paginate"
                >
                  <p className="m-0">{`${(currentPage - 1) * itemsPerPage + 1
                    }-${Math.min(
                      currentPage * itemsPerPage,
                      currentPage * totalItems
                    )} of ${totalPagesLength}`}</p>
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
