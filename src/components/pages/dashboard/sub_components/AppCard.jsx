import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Appcard = () => {
    const user = useSelector((state) => state.user?.user || []);
    const url = process.env.REACT_APP_SERVER_DOMAIN;
    const [stats, setStats] = useState(0);
    const navigate = useNavigate()

    useEffect(() => {
        const glanceData = async () => {
            const token = user?.access_token;
            if (!user) {
                toast.error("Token Expired")
                navigate('/portal/login')
            } else {
                try {
                    const formData = new FormData();
                    formData.append("apikey", "68685dc6-5fb7-46c6-8cd5-228fc33b5485");

                    const response = await axios.get(`${url}/api/dashboard_stats`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        }
                    });
                    setStats(response.data);

                } catch (error) {
                    console.log(error.message);
                }
            }
        }
        glanceData();
    }, [url, user, navigate]);

    const data = [
        { id: 1, class: 'badge rounded bg-label-primary me-3 p-2', icon: <i className="ti ti-chart-pie-2 ti-sm"></i>, Heading: stats ? `${stats.total_validations}` : <small>Loading...</small>, title: 'Validations' },
        { id: 2, class: 'badge rounded bg-label-info me-3 p-2', icon: <i className="ti ti-users ti-sm"></i>, Heading: stats ? `${stats.total_users}` : <small>Loading...</small>, title: 'Active Users' },
        { id: 3, class: 'badge rounded bg-label-danger me-3 p-2', icon: <i className="ti ti-percentage ti-sm"></i>, Heading: stats ? `${stats.total_vouchers}` : <small>Loading...</small>, title: 'Vouchers' },
        { id: 4, class: 'badge rounded bg-label-success me-3 p-2', icon: <i className="ti ti-currency-dollar ti-sm"></i>, Heading: stats ? `${stats.total_earnings}` : <small>Loading...</small>, title: 'Revenue' },
    ];

    return (
        <div className="card h-100">
            <div className="card-header">
                <div className="d-flex justify-content-between mb-3 header-flex">
                    <h4 className="card-title mb-0">At a Glance</h4>
                </div>
            </div>
            <div className="card-body">
                <div className="row gy-3">
                    {data.map((item, i) => {
                        return (
                            <div key={item.id} className="col-sm-12 col-md-6 col-lg-3">
                                <div className="d-flex align-items-center">
                                    <div className={item.class}>
                                        {item.icon}
                                    </div>
                                    <div className="card-info">
                                        <h5 className="mb-0">{item.Heading}</h5>
                                        <span>{item.title}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Appcard;
