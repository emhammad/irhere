import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FiEye, FiEyeOff } from "react-icons/fi";
import '../../../assets/css/demo.css';
import '../../../assets/vendor/css/core.css';
import '../../../assets/vendor/css/theme-default.css';
import '../../../assets/vendor/css/pages/page-auth.css';
import IRhere_Logo from '../../../assets/irhere_images/Vector.png';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../../store/Slices/UserSlice';

const Login = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user || []);
  const [loader, setLoader] = useState(false);
  const location = useLocation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: ""
  })

  useEffect(() => {
    const token = user?.access_token;
    if (token && location.pathname === "/portal/login") {
      navigate("/portal/dashboard");
      return; 
    }
  }, [location.pathname, navigate, user])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true)
    const formData = new FormData();

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
        navigate('/portal/dashboard');
      }
    } catch (error) {
      toast.error(error.response.data.desc);
      setLoader(false)
    }
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  return (
    <>
      <div className="login">
        <div className="authentication-wrapper authentication-cover authentication-bg">
          <div className="authentication-inner row m-0">

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

            <div className="d-flex col-md-12 col-lg-5 align-items-center p-0">
              <div className=" login-mobile">
                {/* Logo for mobile view */}
                <div className='logo mobile-view'>
                  <div className="auth-bg-color-hm d-lg-flex col-lg-7 p-0 w-100">
                    <div className="auth-cover-bg auth-cover-bg-color d-flex justify-content-center align-items-center main-bg h-100 m-0 py-3">
                      <div className='logo_bg'>
                        <div className='logo_bg_1'>
                          <div className='logo_bg_2'>
                            <img src={IRhere_Logo} alt="auth-login-cover" className="img-fluid my-4 auth-illustration" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Logo for mobile view */}

                <div className='p-4 w-px-400 mx-auto'>
                  <h3 className="mb-1">Welcome to IRhere! 👋🏻</h3>
                  <p className="mb-4">Please sign-in to your account and start the adventure</p>

                  <form id="formAuthentication" className="mb-3" onSubmit={handleSubmit}>

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
                        {/* <div>
                        <Link to="">
                          <small>Forgot Password?</small>
                        </Link>
                      </div> */}
                      </div>
                    </div>

                    <button className="btn btn-primary login-button-hm-custom d-grid w-100">
                      {loader === true ?
                        'Loading...'
                        : 'Login'}
                    </button>

                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>

  );
}

export default Login;