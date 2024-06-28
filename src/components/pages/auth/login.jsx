import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FiEye, FiEyeOff } from "react-icons/fi";
import '../../../assets/css/demo.css';
import '../../../assets/vendor/css/core.css';
import '../../../assets/vendor/css/theme-default.css';
import '../../../assets/vendor/css/pages/page-auth.css';
import IRhere_Logo from '../../../assets/irhere_images/Vector.png';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../store/Slices/UserSlice';

const Login = () => {

  const navigate = useNavigate();
  const dispatch=useDispatch()
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();


    const formData = new FormData();

    // Assuming 'data' is an object containing your form fields
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',

      }
    };
    try {
      const url = process.env.REACT_APP_SERVER_DOMAIN;
      const response = await axios.post(`${url}/api/login_admin`, formData, config);

      if (response.data.code === "1") {
        // Successful login
        dispatch(setUser(response.data));
        toast.success("Login Success");
        navigate('/dashboard');
      } else {
        // Show error for incorrect username/password or other errors
        toast.error(response.data.desc || "An error occurred");
      }
    } catch (error) {
      // Error occurred while making the request
      console.error('Error posting data:', error.message);
      // Show error message based on error type
      if (error.response && error.response.status === 401) {
        toast.error("Incorrect username/password");
      } else {
        toast.error("An error occurred");
      }
    }


  }
  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  return (
    <>
      <div className="login">
        <div className="authentication-wrapper authentication-cover authentication-bg">
          <div className="authentication-inner row">

            <div className="auth-bg-color-hm d-none d-lg-flex col-lg-7 p-0">
              <div className="auth-cover-bg auth-cover-bg-color d-flex justify-content-center align-items-center main-bg">
                <div className='logo_bg'>
                  <div className='logo_bg_1'>
                    <div className='logo_bg_2'>
                      <img src={IRhere_Logo} alt="auth-login-cover" className="img-fluid my-4 auth-illustration" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex col-12 col-lg-5 align-items-center p-sm-5 p-4">
              <div className="w-px-400 mx-auto">
                <h3 className="mb-1">Welcome to IRhere! 👋🏻</h3>
                <p className="mb-4">Please sign-in to your account and start the adventure</p>

                <form id="formAuthentication" className="mb-3" onSubmit={handleSubmit} >

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email or Username</label>
                    <input type="email" className="form-control" id="email" name="email" placeholder="Enter your email or username" onChange={handleChange} />
                  </div>

                  <div className="mb-3 form-password-toggle">
                    <label className="form-label" htmlFor="password">Password</label>
                    <div className="input-group input-group-merge">
                      <input type={passwordVisible ? 'text' : 'password'} id="password" className="form-control" name="password" onChange={handleChange} placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;" aria-describedby="password" />
                      <span className="input-group-text cursor-pointer" onClick={togglePasswordVisibility}>
                        {passwordVisible ? <FiEye /> : <FiEyeOff />}
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="form-check d-flex justify-content-between" >
                      <div>
                        <input className="form-check-input" type="checkbox" id="remember-me" />
                        <label className="form-check-label" htmlFor="remember-me"> Remember Me </label>
                      </div>
                      <div>
                        <Link to="">
                          <small>Forgot Password?</small>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <button className="btn btn-primary login-button-hm-custom d-grid w-100">Login</button>
                </form>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>

  );
}

export default Login;