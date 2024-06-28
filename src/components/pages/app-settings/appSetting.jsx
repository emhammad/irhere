import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import SliderCustomMarks from "./slider";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";

const AppSetting = () => {
  const user = useSelector((state) => state.user?.user || []);
  const [terms, setTerms] = useState({
    terms: "",
    bvdt: "",
    avdt: "",
  });
  const url = process.env.REACT_APP_SERVER_DOMAIN;
  const getTemsApi = `${url}/api/get_terms`;
  const updateTemsApi = `${url}/api/update_terms`;

  useEffect(() => {

    fetchTerms();
    // eslint-disable-next-line
  }, [user]);
  const fetchTerms = async () => {
    try {
      const token = user?.access_token;
      if (!token) {
        throw new Error("No access token available");
      }

      const response = await axios.post(getTemsApi, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const { terms, bvdt, avdt } = response?.data;

      setTerms({ terms, bvdt, avdt });
    } catch (error) {
      console.error("Error :", error);
      toast.error(`Error : ${error.message}`);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTerms((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const updateTerms = async () => {
    try {
      const token = user?.access_token;
      if (!token) {
        throw new Error("No access token available");
      }
      await axios.post(updateTemsApi, terms, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      toast.success("Terms are updated successfully ")
      await fetchTerms()
    } catch (error) {
      toast.error(error.message)
    }
  };

  return (
    <>
      <div className="container-xxl flex-grow-1">
        <div className="row my-4">
          <div className="col-12 mb-3">
            <h4 className="text-primary m-0">App Terms </h4>
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
                  value={terms?.terms || ""}
                  onChange={handleChange}
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
                  value={terms?.bvdt || ""}
                  onChange={handleChange}
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
                  value={terms?.avdt || ""}
                  onChange={handleChange}
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
        <div className="row">
          <div className="col-12 mb-3 mt-4">
            <h4 className="text-primary m-0">Location Settings</h4>
            <p className="text-black m-0">
              Set the location in meters from the slider below.
            </p>
          </div>
          <SliderCustomMarks />
        </div>
      </div>
    </>
  );
};

export default AppSetting;
