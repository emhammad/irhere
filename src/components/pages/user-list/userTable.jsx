import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";

const Table = () => {
  const user = useSelector((state) => state.user?.user || []);
  const [User, setUsers] = useState([]);
  const url = process.env.REACT_APP_SERVER_DOMAIN;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10; // Number of items to display per page
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const fetchUsers = async () => {

    try {
      const token = user?.access_token;
      if (!token) {
        throw new Error("No access token available");
      }

      const response = await axios.get(`${url}/api/get_user_list/page/${currentPage}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setUsers(response?.data);

      setTotalItems(response.data?.Data?.length);

    } catch (error) {
      console.error("Error fetching users:", error);
      console.log(`Error fetching users: ${error.message}`);
    }
  };
  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line
  }, [user, currentPage])


  const nextPage = () => {
    setCurrentPage((prevPage) => {
      return prevPage + 1
    });

  };


  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };
  const mapFields = [
    { id: 1, name: "id", placeholder: "IRhereNumber..." },
    { id: 2, name: "name", placeholder: "Name..." },
    { id: 3, name: "email", placeholder: "Email/Phone..." },
    { id: 4, name: "phone_no", placeholder: "Phone..." },
  ];

  const [searchTerms, setSearchTerms] = useState({
    id: "",
    name: "",
    email: "",
    phone_no: "",
    date: "",
  });

  const filterData =
    User &&
    User?.Data &&
    User?.Data.filter((item) => {
      return (
        item.id.toLowerCase().includes(searchTerms.id.toLowerCase()) &&
        item.name.toLowerCase().includes(searchTerms.name.toLowerCase()) &&
        item.email.toLowerCase().includes(searchTerms.email.toLowerCase()) &&
        item.phone_no
          .toLowerCase()
          .includes(searchTerms.phone_no.toLowerCase()) &&
        item.date.toLowerCase().includes(searchTerms.date.toLowerCase())
      );
    });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchTerms((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleExportCSV = () => {
    const csvContent = User && User?.length >= 1 && User?.map(item => [
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
    // Assuming the date string is in format "MM-DD-YY HH:mm:ss"
    const [datePart, timePart] = dateString.split(' ');
    const [month, day, year] = datePart.split('-');
    const [hour, minute, second] = timePart.split(':');
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
                <h5 className="card-title mb-0">User List</h5>
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
                    <th>IRhere Number</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="table-border-bottom-0 table-striped text-center">
                  <tr>
                    {mapFields.map((field) => (
                      <td key={field.id}>
                        <div className="input-group input-group-merge">
                          <span
                            className={`input-group-text p-2  d-${field.name === "Card" ? "none" : "block"
                              }`}
                            id={`basic-addon-search${field.id}`}
                          >
                            <i className="ti ti-search"></i>
                          </span>
                          {field.name === "Card" ? (
                            <select
                              className="form-select rounded"
                              name={field.name}
                              value={searchTerms[field.name]}
                              onChange={handleChange}
                            >
                              <option value="">Phones</option>
                              {field.options.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              className="form-control"
                              name={field.name}
                              value={searchTerms[field.name]}
                              placeholder={field.placeholder}
                              onChange={handleChange}
                            />
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                  {filterData &&
                    filterData.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <small>{item.id}</small>
                        </td>
                        <td>
                          <small>{item.name}</small>
                        </td>
                        <td>
                          <small>{item.email}</small>
                        </td>
                        <td>
                          <small>{item.phone_no}</small>
                        </td>
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
                            <div className="dropdown-menu dropdown-menu-end py-2 rounded text-center">
                              <button className="dropdown-item p-0 m-0 w-100 text-primary d-flex px-4 align-items-center py-2 gap-2">
                                <i className="ti ti-pencil hm-icon-size"></i>
                                Edit
                              </button>
                              <button className="dropdown-item p-0 m-0 w-100 text-primary d-flex px-4 align-items-center mt-2 py-2 gap-2">
                                <i className="ti ti-trash hm-icon-size"></i>
                                Delete
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="row mt-3 mb-3">
              <div className="col-lg-9 col-md-6 col-sm-12 d-flex align-items-center justify-content-lg-end "></div>
              <div className="col-lg-3 col-md-6 col-sm-12 d-flex align-items-center justify-content-center">
                <div
                  className="dataTables_paginate paging_simple_numbers d-flex align-items-center"
                  id="DataTables_Table_0_paginate"
                >
                  <p className="m-0">{`${(currentPage - 1) * itemsPerPage + 1
                    }-${Math.min(
                      currentPage * itemsPerPage,
                      totalItems
                    )} of ${totalItems}`}</p>
                  <span
                    className={`p-2 ${currentPage === '1' ? 'disabled' : ''}`}
                    onClick={prevPage}
                  >
                    <i className="fas fa-angle-left text-muted cursor-pointer"></i>
                  </span>
                  <span
                    className={`p-2 ${currentPage === totalPages ? 'disabled' : ''}`}
                    onClick={nextPage}

                  >
                    <i className="fas fa-angle-right cursor-pointer"></i>
                  </span>
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
