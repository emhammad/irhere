
import { Link } from "react-router-dom";
import "./style.css";
import IRhere_Logo from '../../../assets/irhere_images/Group 389.png';

const NotFound = () => {
    return (
        <>
            <div class="home-page">
                <div className='logo d-flex align-items-center gap-3'>
                    <img src={IRhere_Logo} alt="auth-login-cover" className="rounded-2" />
                </div>
                <h6 className="">Webiste is Under Maintenance</h6>
                <h1 className="fw-bold mt-3 mb-4">We're <span className="launching">Launching</span> Soon.</h1>
                <h6 class="mb-5 mt-2">If you are admin, login to portal  by clicking  on button bellow.</h6>
                <Link to={'/portal/login'} class="btn btn-primary mb-4 waves-effect waves-light">Click here to login</Link>
            </div>

        </>
    )
}

export default NotFound;