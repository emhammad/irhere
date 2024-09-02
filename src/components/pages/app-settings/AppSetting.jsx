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
  const navigate = useNavigate();

  useEffect(() => {
    fetchTerms();
    // eslint-disable-next-line
  }, [user]);

  const fetchTerms = async () => {
    try {
      const token = user?.access_token;
      if (!token) {
        navigate('/login');
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
      const token = user?.access_token;
      if (!token) {
        navigate('/login');
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
