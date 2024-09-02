import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

import ACTFLAG from "../../../../assets/flags/image 5.png";
import AUflag from "../../../../assets/flags/image 5 (1).png";
import BRflag from "../../../../assets/flags/image 5 (2).png";
import CNflag from "../../../../assets/flags/image 5 (3).png";
import FRflag from "../../../../assets/flags/image 5 (4).png";
import PTflag from "../../../../assets/flags/Frame 6.png";
import blah1 from "../../../../assets/irhere_images/download (10).png";
import blah2 from "../../../../assets/irhere_images/download (3).jpg";

const Dealchart = () => {
    const user = useSelector((state) => state.user?.user || {});
    const url = process.env.REACT_APP_SERVER_DOMAIN;
    const [states, setStates] = useState({});

    useEffect(() => {
        const glanceData = async () => {
            const token = user?.access_token;
            try {
                const response = await axios.get(`${url}/api/verifications_by_state`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                setStates(response.data.verification_counts);
            } catch (error) {
            }
        };
        if (user?.access_token) {
            glanceData();
        }
    }, [url, user]);

    const getStateFlag = (country) => {
        switch (country) {
            case 'ACT': return ACTFLAG;
            case 'NSW': return AUflag;
            case 'NT': return BRflag;
            case 'QLD': return CNflag;
            case 'SA': return FRflag;
            case 'TAS': return PTflag;
            case 'VIC': return blah1; // Update with correct flag
            case 'WA': return blah2;  // Update with correct flag
            default: return '';
        }
    };

    const totalDealCount = Object.values(states).reduce((acc, count) => acc + count, 0);

    const data = Object.keys(states).map((key, index) => {
        const count = states[key];
        const percentage = ((count / totalDealCount) * 100).toFixed(2);
        let status = 'text-success';
        let icon = 'ti ti-chevron-up';
        if (count === 0) {
            status = 'text-danger';
            icon = 'ti ti-chevron-down';
        }
        return {
            id: index + 1,
            flag: getStateFlag(key),
            count: count,
            country: key,
            icon: icon,
            status: status,
            per: `${percentage}%`
        };
    });

    return (
        <div className="card h-100">
            <div className="card-header d-flex justify-content-between">
                <div className="card-title mb-0">
                    <h5 className="m-0 me-2">Validations by States</h5>
                    <small className="text-muted">Monthly Overview</small>
                </div>
            </div>

            <div className="card-body">
                <ul className="p-0 m-0">
                    {data && data.length > 0 ? (
                        data.map((deal) => (
                            <li className="d-flex align-items-center mb-4" key={deal.id}>
                                <div className='pe-2'>
                                    <img src={deal.flag} alt={deal.country} style={{ width: "40px", borderRadius: "50%" }} />
                                </div>
                                <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                    <div className="me-2">
                                        <div className="d-flex align-items-center">
                                            <h6 className="mb-0 me-1">${deal.count}</h6>
                                        </div>
                                        <small className="text-muted">{deal.country}</small>
                                    </div>
                                    <div className="user-progress">
                                        <p className={`${deal.status} fw-medium mb-0 d-flex justify-content-center gap-1`}>
                                            <i className={deal.icon}></i>
                                            {deal.per}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>Loading...</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Dealchart;
