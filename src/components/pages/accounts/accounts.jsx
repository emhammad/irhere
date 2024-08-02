import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Account = () => {
    const [menu, setMenu] = useState("accounts");

    const [passwordVisible, setPasswordVisible] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    const handleAccountClick = () => {
        setMenu("accounts");
    };

    const handleSecurityClick = () => {
        setMenu("Security");
    };

    const togglePasswordVisibility = (field) => {
        setPasswordVisible((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };


    return (
        <div className="container-xxl flex-grow-1">
            <div className="row fv-plugins-icon-container">
                <div className="col-md-12">
                    <ul className="nav nav-pills flex-column flex-md-row mb-4">
                        <li className="nav-item">
                            <button onClick={handleAccountClick} className={`nav-link ${menu === "accounts" ? "active" : ""}`}>
                                <i className="ti-xs ti ti-users me-1"></i> Account
                            </button>
                        </li>
                        <li className="nav-item">
                            <button onClick={handleSecurityClick} className={`nav-link ${menu === "Security" ? "active" : ""}`}>
                                <i className="ti-xs ti ti-lock me-1"></i> Security
                            </button>
                        </li>
                    </ul>
                    {menu === "accounts" && <AccountSettings />}
                    {menu === "Security" && <SecuritySettings togglePasswordVisibility={togglePasswordVisibility} passwordVisible={passwordVisible} />}
                </div>
            </div>
        </div>
    );
};


const AccountSettings = () => {
    const user = useSelector((state) => state.user?.user || {});
    const url = process.env.REACT_APP_SERVER_DOMAIN;
    const [userData, setUserData] = useState({});
    const [initialData, setInitialData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = user?.access_token;
            if (!token) {
                toast.error('Access token expired.');
                navigate('/');
            } else {
                try {
                    const response = await axios.get(`${url}/api/fetch_admin_list`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                    const adminIds = response.data.map(admin => admin.id);
                    if (adminIds.includes(user.id)) {
                        setUserData(user);
                        setInitialData(user); // Set initial data
                    }
                } catch (error) {
                    console.log('Error fetching admin list:', error);
                }
            }
        };

        fetchUserData();
    }, [user, url, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = user?.access_token;
        const formData = new FormData();
        formData.append("user_id", user.id);

        let nameChanged = false;
        let emailChanged = false;
        let phoneChanged = false;

        if (userData.name !== initialData.name) {
            formData.append("name", userData.name);
            nameChanged = true;
        }

        if (userData.email !== initialData.email) {
            formData.append("email", userData.email);
            emailChanged = true;
        }

        if (userData.phone_no !== initialData.phone_no) {
            formData.append("phone_no", userData.phone_no);
            phoneChanged = true;
        }

        try {
            if (nameChanged || emailChanged || phoneChanged) {
                console.log(formData);
                const updateResponse = await axios.post(`${url}/api/update_user_info`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
                console.log("Update response:", updateResponse);
                toast.success("User information updated successfully");
            } else {
                toast.error("Nothing Changed");
            }
        } catch (error) {
            console.log('Error updating data:', error);
            toast.error("An error occurred while updating data");
        }
    };

    return (
        <div id='hm_account'>
            <div className="card mb-4">
                <div className="card-body">
                    <form id="formAccountSettings" className="fv-plugins-bootstrap5 fv-plugins-framework" onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="mb-3 col-md-6 fv-plugins-icon-container">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={userData.name || ''}
                                    onChange={handleChange}
                                    placeholder={initialData.Name}
                                />
                                <div className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                            </div>

                            <div className="mb-3 col-md-6">
                                <label htmlFor="email" className="form-label">E-mail</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="email"
                                    name="email"
                                    value={userData.email || ''}
                                    onChange={handleChange}
                                    placeholder={initialData.email}
                                />
                            </div>

                            <div className="mb-3 col-md-6">
                                <label className="form-label" htmlFor="phone_no">Phone Number</label>
                                <div className="input-group input-group-merge">
                                    <input
                                        type="text"
                                        id="phone_no"
                                        name="phone_no"
                                        className="form-control"
                                        value={userData.phone_no || ''}
                                        onChange={handleChange}
                                        placeholder={initialData.phone_no}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-2">
                            <button type="submit" className="btn btn-primary me-2 waves-effect waves-light">Save changes</button>
                            <button type="reset" className="btn btn-label-secondary waves-effect">Cancel</button>
                        </div>
                        <input type="hidden" />
                    </form>
                </div>
            </div>
        </div>
    );
};


const SecuritySettings = ({ togglePasswordVisibility, passwordVisible }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const url = process.env.REACT_APP_SERVER_DOMAIN;
    const user = useSelector((state) => state.user?.user || []);
    const token = user?.access_token;
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { currentPassword, newPassword, confirmPassword } = formData;

        // Check if newPassword matches confirmPassword
        if (newPassword !== confirmPassword) {
            toast.error('New password and confirm password do not match');
            return;
        }

        try {
            // Prepare data to send to the API
            const formData = new FormData();
            formData.append('user_id', user.user_id); // Assuming user_id is available in your user object
            formData.append('old_password', currentPassword);
            formData.append('new_password', confirmPassword); // Use confirmPassword here, as it should match newPassword

            // Send POST request to update password API
            console.log(formData);
            const response = await axios.post(`${url}/api/update_password_admin`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log(response);
            toast.success('Password updated successfully');
            navigate('/')
        } catch (error) {
            console.error(error);
            toast.error('Error updating password');
        }
    };

    return (
        <div id="hm_security">
            {/* Security settings component */}
            <div className="row">
                <div className="col-md-12">
                    {/* <!-- Change Password --> */}
                    <div className="card mb-4">
                        <h5 className="card-header">Change Password</h5>
                        <div className="card-body">
                            <form id="formAccountSettings" className="fv-plugins-bootstrap5 fv-plugins-framework" noValidate onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="mb-3 col-md-6 form-password-toggle fv-plugins-icon-container">
                                        <label className="form-label" htmlFor="currentPassword">Current Password</label>
                                        <div className="input-group input-group-merge has-validation">
                                            <input
                                                className="form-control"
                                                type={passwordVisible.currentPassword ? "text" : "password"}
                                                name="currentPassword"
                                                id="currentPassword"
                                                placeholder="············"
                                                value={formData.currentPassword}
                                                onChange={handleInputChange}
                                            />
                                            <span className="input-group-text cursor-pointer" onClick={() => togglePasswordVisibility("currentPassword")}>
                                                <i className={`ti ${passwordVisible.currentPassword ? 'ti-eye' : 'ti-eye-off'}`}></i>
                                            </span>
                                        </div>
                                        <div className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mb-3 col-md-6 form-password-toggle fv-plugins-icon-container">
                                        <label className="form-label" htmlFor="newPassword">New Password</label>
                                        <div className="input-group input-group-merge has-validation">
                                            <input
                                                className="form-control"
                                                type={passwordVisible.newPassword ? "text" : "password"}
                                                id="newPassword"
                                                name="newPassword"
                                                placeholder="············"
                                                value={formData.newPassword}
                                                onChange={handleInputChange}
                                            />
                                            <span className="input-group-text cursor-pointer" onClick={() => togglePasswordVisibility("newPassword")}>
                                                <i className={`ti ${passwordVisible.newPassword ? 'ti-eye' : 'ti-eye-off'}`}></i>
                                            </span>
                                        </div>
                                        <div className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                                    </div>

                                    <div className="mb-3 col-md-6 form-password-toggle fv-plugins-icon-container">
                                        <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
                                        <div className="input-group input-group-merge has-validation">
                                            <input
                                                className="form-control"
                                                type={passwordVisible.confirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                id="confirmPassword"
                                                placeholder="············"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                            />
                                            <span className="input-group-text cursor-pointer" onClick={() => togglePasswordVisibility("confirmPassword")}>
                                                <i className={`ti ${passwordVisible.confirmPassword ? 'ti-eye' : 'ti-eye-off'}`}></i>
                                            </span>
                                        </div>
                                        <div className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
                                    </div>

                                    <div className="col-12 mb-4">
                                        <h6>Password Requirements:</h6>
                                        <ul className="ps-3 mb-0">
                                            <li className="mb-1">Minimum 8 characters long - the more, the better</li>
                                            <li className="mb-1">At least one lowercase character</li>
                                            <li>At least one number, symbol, or whitespace character</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <button type="submit" className="btn btn-primary me-2 waves-effect waves-light">Save changes</button>
                                        <button type="reset" className="btn btn-label-secondary waves-effect">Cancel</button>
                                    </div>
                                </div>
                                <input type="hidden" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;







