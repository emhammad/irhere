
import { Link } from "react-router-dom";
import "./notFound.css";

const NotFound = () => {
    return (
        <>
            <div class="misc-wrapper">
                <h2 class="mb-1 mt-4">Page Not Found :(</h2>
                <p class="mb-4 mx-2">Oops! 😖 The requested URL was not found on this server.</p>
                <Link to={'/login'} class="btn btn-primary mb-4 waves-effect waves-light">Back to home</Link>
            </div>
        </>
    )
}

export default NotFound;