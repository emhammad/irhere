
import { Link } from "react-router-dom";
import "./notFound.css";

const NotFound = () => {
    return (
        <>
            {/* <div className='container'>
                <h3>404 page not found</h3>
                <p>We are sorry but the page you are looking for does not exist.</p>
                <button className="btn btn-primary login-button-hm-custom d-grid"></button>
            </div> */}
            <div class="misc-wrapper">
                <h2 class="mb-1 mt-4">Page Not Found :(</h2>
                <p class="mb-4 mx-2">Oops! 😖 The requested URL was not found on this server.</p>
                <Link to={'/'} class="btn btn-primary mb-4 waves-effect waves-light">Back to home</Link>
            </div>
        </>
    )
}

export default NotFound;