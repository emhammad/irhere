import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MyVerticallyCenteredModal from './modal/Modal';
import DeleteModal from './modal/deleteModal';
import SearchByDate from './search-by-date';

const Table = () => {
  const user = useSelector((state) => state.user?.user || []);
  const [User, setUsers] = useState([]);
  const url = process.env.REACT_APP_SERVER_DOMAIN;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10; // Number of items to display per page
  const [stats, setStats] = useState(0);
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const navigate = useNavigate();
  const [modalShow, setModalShow] = React.useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerms, setSearchTerms] = useState({
    id: "",
    name: "",
    email: "",
    phone_no: "",
  });

  const handleSearchByDate = (start_date, end_date) => {
    setSearchTerms((prevTerms) => ({
      ...prevTerms,
      start_date,
      end_date,
    }));
  };

  const fetchUsers = async () => {
    try {
      const token = user?.access_token;
      if (!token) {
        navigate('/login');
        return;
      }

      let params = {};
      if (Object.values(searchTerms).every(term => term)) {
        params = { ...searchTerms };
      }

      // Ensure start_date and end_date are included in the params
      if (searchTerms.start_date) {
        params['start_date'] = searchTerms.start_date;
      }
      if (searchTerms.end_date) {
        params['end_date'] = searchTerms.end_date;
      }

      const response = await axios.get(`${url}/api/get_user_list/page/${currentPage}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: params
      });

      setUsers(response?.data);
      setTotalItems(response.data?.Data?.length);

      const statistics = await axios.get(`${url}/api/dashboard_stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      setStats(statistics.data.total_users);

    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [user, currentPage, searchTerms]);

  const nextPage = () => {
    setCurrentPage((prevPage) => {
      return prevPage + 1;
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

  const filterData = User?.Data?.filter((item) => {
    return (
      item.id.toLowerCase().includes(searchTerms.id.toLowerCase()) &&
      item.name.toLowerCase().includes(searchTerms.name.toLowerCase()) &&
      item.email.toLowerCase().includes(searchTerms.email.toLowerCase()) &&
      item.phone_no.toLowerCase().includes(searchTerms.phone_no.toLowerCase())
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
    if (!User.Data) {
      toast.error("No data available to export");
      return;
    }

    const headers = ["IRhere Number", "Name", "Email/Phone", "Phone"];
    const csvContent = [headers.join(',')].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'User List.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShowEditModal = (show, item) => {
    setShowEditModal(show);
    setSelectedItem(item); // Store the selected item data
  };

  const handleShowDeleteModal = (show, item) => {
    setShowDeleteModal(show);
    setSelectedItem(item); // Store the selected item data
  };

  return (
    <div>
      <div className="card">
        <div className="card-datatable pt-0">
          <div id="DataTables_Table_0_wrapper" className="dataTables_wrapper dt-bootstrap5 no-footer">
            <div className="card-header header-flex d-flex justify-content-between p-3 flex-wrap">
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
                  <SearchByDate show={modalShow} onHide={() => setModalShow(false)} onSearch={handleSearchByDate} />
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
                            className={`input-group-text p-2 d-${field.name === "Card" ? "none" : "block"}`}
                            id={`basic-addon-search${field.id}`}
                          >
                            <i className="ti ti-search"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            name={field.name}
                            value={searchTerms[field.name]}
                            placeholder={field.placeholder}
                            onChange={handleChange}
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                  {Array.isArray(filterData) && filterData.length === 0 ? (
                    <tr>
                      <td colSpan="6">No records found</td>
                    </tr>
                  ) : (
                    <>
                      {Array.isArray(filterData) && filterData.map((item) => (
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
                                <button
                                  className="dropdown-item p-0 m-0 w-100 text-primary d-flex px-4 align-items-center mt-2 py-2 gap-2"
                                  onClick={() => handleShowEditModal(true, item)}
                                >
                                  <i className="ti ti-pencil hm-icon-size"></i>
                                  Edit
                                </button>
                                <button className="dropdown-item p-0 m-0 w-100 text-primary d-flex px-4 align-items-center mt-2 py-2 gap-2"
                                  onClick={() => handleShowDeleteModal(true, item)}
                                >
                                  <i className="ti ti-trash hm-icon-size"></i>
                                  Delete
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </>
                  )}

                  <MyVerticallyCenteredModal show={showEditModal} onHide={() => setShowEditModal(false)} item={selectedItem} />
                  <DeleteModal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} item={selectedItem} />
                </tbody>
              </table>
            </div>
            <div className="mt-3 mb-3 me-3 d-flex justify-content-end align-items-center flex-wrap" style={{ color: "#5d596c" }}>
              {/* <div className="">
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
                </div> */}
              <div className="">
                <div
                  className="dataTables_paginate paging_simple_numbers d-flex align-items-center"
                  id="DataTables_Table_0_paginate"
                >
                  <p className="m-0">{`${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, stats)} of ${stats}`}</p>
                  <span
                    className={`p-2 ${currentPage === 1 ? 'disabled' : ''}`}
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
