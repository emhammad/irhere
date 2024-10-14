import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import SliderCustomMarks from "./Slider";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AppSetting = () => {
  const user = useSelector((state) => state.user?.user || []);
  const [initialTerms, setInitialTerms] = useState({ terms: "", bvdt: "", avdt: "" });
  const [terms, setTerms] = useState("");
  const [bvdt, setBvdt] = useState("");
  const [avdt, setAvdt] = useState("");
  const url = process.env.REACT_APP_SERVER_DOMAIN;
  const getTemsApi = `${url}/api/get_terms`;
  const token = user?.access_token;
  const navigate = useNavigate();

  useEffect(() => {
    fetchTerms();
    getGesture();
    // eslint-disable-next-line
  }, [user]);

  const fetchTerms = async () => {
    try {
      const token = user?.access_token;
      if (!token) {
        navigate('/portal/login');
      }

      const response = await axios.post(getTemsApi, '', {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const { terms, bvdt, avdt } = response?.data;
      setInitialTerms({ terms, bvdt, avdt });
      setTerms(terms);
      setBvdt(bvdt);
      setAvdt(avdt);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateTerms = async () => {
    try {
      if (!token) {
        navigate('/portal/login');
      }

      let isUpdated = false;

      if (terms !== initialTerms.terms) {
        const formData = new FormData();
        formData.append('terms', terms);

        await axios.post(`${url}/api/update_terms`, formData, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        isUpdated = true;
      }

      if (bvdt !== initialTerms.bvdt) {
        const formData = new FormData();
        formData.append('terms', bvdt);

        await axios.post(`${url}/api/update_terms_bvdt`, formData, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        isUpdated = true;
      }

      if (avdt !== initialTerms.avdt) {
        const formData = new FormData();
        formData.append('terms', avdt);

        await axios.post(`${url}/api/update_terms_avdt`, formData, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        isUpdated = true;
      }

      if (isUpdated) {
        toast.success("Terms are updated successfully.");
        fetchTerms();
      } else {
        toast.info("No changes detected.");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const [number, setNumber] = useState({
    gestureCount: '',
    detectionDuration: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNumber((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getGesture = async () => {
    try {
      const response = await axios.get(`${url}/api/get_gesture_video`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setNumber({
        gestureCount: response.data.gestureCount,
        detectionDuration: response.data.detectionDuration
      })
    } catch (error) {
      toast.error(error.response.data.desc);
      console.error("Error updating gesture:", error);
    }
  };

  const updateGesture = async () => {
    try {
      const response = await axios.post(`${url}/api/update_gesture_video`, number, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(response.data.desc);
      getGesture()
      setNumber({
        gestureCount: '',
        detectionDuration: ''
      })
    } catch (error) {
      toast.error(error.response.data.desc);
      console.error("Error updating gesture:", error);
    }
  };

  return (
    <>
      <div className="container-xxl flex-grow-1">
        <div className="row my-4">
          <div className="col-12 mb-3">
            <h4 className="text-primary m-0">App Terms</h4>
            <p className="text-black m-0">
              App terms line is dummy for now will change later.
            </p>
          </div>
          <div className="card py-4 px-4">
            <div className="my-2 pt-1">
              <Box
                sx={{
                  width: "100%",
                }}
              >
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="IRhere Terms"
                  id="fullWidth"
                  name="terms"
                  value={terms || ""}
                  onChange={(e) => setTerms(e.target.value)}
                />
              </Box>
            </div>
            <div className="my-2">
              <Box
                sx={{
                  width: "100%",
                }}
              >
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Before Verification Document Terms"
                  id="fullWidth"
                  name="bvdt"
                  value={bvdt || ""}
                  onChange={(e) => setBvdt(e.target.value)}
                />
              </Box>
            </div>
            <div className="my-2">
              <Box
                sx={{
                  width: "100%",
                }}
              >
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="After Verification Document Terms"
                  id="fullWidth"
                  name="avdt"
                  value={avdt || ""}
                  onChange={(e) => setAvdt(e.target.value)}
                />
              </Box>
            </div>
            <div className="col-12 d-flex justify-content-end py-4">
              <button className="btn btn-primary" onClick={updateTerms}>
                Update
              </button>
            </div>
          </div>
        </div>
        <div className="row my-4 mt-5">
          <div className="col-12 mb-3">
            <h4 className="text-primary m-0">Validation Settings</h4>
          </div>
          <div className="card py-4 px-4">
            <div className="row">
              <div className="col-lg-6 col-md-12">
                <p className="mb-2">The number of gestures to be performed on the App.</p>
                <small className="text-muted">Please add a number between 1 and 7</small>
                <select
                  name="gestureCount"
                  className="form-select"
                  value={number.gestureCount}
                  onChange={handleChange}
                >
                  <option value="">Please add a number between 1 and 7</option>
                  {Array.from({ length: 7 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-lg-6 col-md-12">
                <p className="mb-2">Allowed time in seconds to perform gestures.</p>
                <small className="text-muted">Select time in seconds</small>
                <select
                  name="detectionDuration"
                  className="form-select"
                  value={number.detectionDuration}
                  onChange={handleChange}
                >
                  <option value="">Select time in seconds</option>
                  {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((sec) => (
                    <option key={sec} value={sec}>
                      {sec} seconds
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-12 d-flex justify-content-end pt-4">
              <button className="btn btn-primary" onClick={updateGesture}>
                Update
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 mb-3 mt-4">
            <h4 className="text-primary m-0">Location Settings</h4>
            <p className="text-black m-0">
              Set the location in meters from the slider below.
            </p>
          </div>
          <SliderCustomMarks />
        </div>
      </div>
    </>
  );
};

export default AppSetting;
