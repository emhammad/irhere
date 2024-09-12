import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import MuiSlider from '@mui/material/Slider';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const marks = [
  { value: 0, label: '0M' },
  { value: 10, label: '10M' },
  { value: 20, label: '20M' },
  { value: 30, label: '30M' },
  { value: 40, label: '40M' },
  { value: 50, label: '50M' },
  { value: 60, label: '60M' },
  { value: 70, label: '70M' },
  { value: 80, label: '80M' },
  { value: 90, label: '90M' },
  { value: 100, label: '100M' },
];

const Slider = styled(MuiSlider)(({ theme }) => ({
  padding: '15px 0',
  height: '2px !important',
  color: theme.palette.primary.main,
  position: 'relative',
  '& .MuiSlider-rail': {
    opacity: 0.5,
    backgroundColor: '#bfbfbf',
  },
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-mark': {
    width: 1,
    height: 15,
    backgroundColor: '#bfbfbf',
    position: 'absolute',
    top: 15,
    '& span': {
      display: 'block',
      marginTop: '-25px',
      textAlign: 'center',
    },
  },
  '& .MuiSlider-markLabel': {
    top: -15,
  },
  '& .MuiSlider-thumb': {
    width: 28,
    height: 28,
    backgroundColor: theme.palette.common.white,
    boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02) !important',
    '&:before': {
      border: 0,
    },
    '&:after': {
      width: 42,
      height: 42,
    },
    '&:focus, &:hover, &.Mui-active': {
      boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02) !important',
    },
  },
  '& .MuiSlider-valueLabel': {
    display: 'none',
  },
}));

const SliderCustomized = () => {
  const [sliderValue, setSliderValue] = useState(0);
  const user = useSelector((state) => state.user?.user || []);
  const token = user?.access_token;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate('/login');
      }

      try {
        const response = await axios.get('https://irhere.com.au/api/fetch_config_info', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const radius = Number(response.data.verification_radius);
        setSliderValue(radius);
      } catch (error) {
        console.error('Error : ', error);
      }
    };

    fetchData();
  }, [token, navigate]);

  const update = async () => {
    const formData = new FormData();
    formData.append('verification_radius', sliderValue);

    try {
      const updateRadius = await axios.post('https://irhere.com.au/api/update_config_verification_radius', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (updateRadius.status === 200) {
        toast.success("Updated Successfully.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="card mb-4 pt-5 pb-4">
      <div className="px-5">
        <Slider
          marks={marks}
          value={sliderValue}
          valueLabelDisplay="off"
          aria-labelledby="customized-slider"
          onChange={(event, newValue) => setSliderValue(newValue)}
        />
      </div>
      <div className="col-12 d-flex justify-content-end pt-2 pe-2">
        <button className="btn btn-primary" onClick={update}>Update</button>
      </div>
    </div>
  );
};

export default SliderCustomized;
