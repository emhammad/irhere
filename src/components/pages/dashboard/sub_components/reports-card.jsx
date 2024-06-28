import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../style.css';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Reportscharts = () => {

  const user = useSelector((state) => state.user?.user || []);
  const url = process.env.REACT_APP_SERVER_DOMAIN;
  const [chartValue, setChartValue] = useState([]);

  useEffect(() => {
    const glanceData = async () => {
      const token = user?.access_token;
      try {
        const formData = new FormData();
        formData.append("apikey", "68685dc6-5fb7-46c6-8cd5-228fc33b5485");

        const response = await axios.get(`${url}/api/average_revenue_by_month`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        });
        // Transform the data
        const transformedData = response.data.avg_revenue_by_month.map(item => {
          const date = new Date(item.month);
          const monthName = date.toLocaleString('default', { month: 'short' });
          return { name: monthName, uv: item.avg_revenue };
        });

        setChartValue(transformedData);

      } catch (error) {
        console.log(error.message);
      }
    }
    glanceData();
  }, [url, user]);


  const renderCustomBarLabel = ({ payload, x, y, width, height, value }) => {
    return <text x={x + width / 2} y={y} fill="#666" textAnchor="middle" dy={-6}>{`${value}k`}</text>;
  };

  return (
    <>
      <div className="card h-100">
        <div className="card-header d-flex justify-content-between">
          <div className="card-title mb-0">
            <h5 className="m-0 me-2">Earning Reports</h5>
            <small className="text-muted">Weekly Earnings Overview</small>
          </div>

          {/* <div className="dropdown">
            <button className="btn p-0" type="button" id="earningReports" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i className="ti ti-dots-vertical ti-sm text-muted"></i>
            </button>
            <div className="dropdown-menu dropdown-menu-end" aria-labelledby="earningReports">
              <Link className="dropdown-item" to="">Refresh</Link>
            </div>
          </div> */}

        </div>

        <div className="card-body chart">
          <BarChart width={600} height={300} data={chartValue}>
            <XAxis dataKey="name" stroke='' />
            <YAxis stroke='' />
            <Bar dataKey="uv" barSize={30} fill="#5C81E4 " label={renderCustomBarLabel} />
          </BarChart>
        </div>

      </div>
    </>
  );
};

export default Reportscharts;
