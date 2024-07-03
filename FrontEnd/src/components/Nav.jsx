import "./Nav.css";
import profileAvatar from "../assets/profile_avatar.png";
import { Link } from "react-router-dom";

function Nav({ avatar }) {
    return (
        <div className="nav flex justify-between items-center">
            <Link to="/" className="logo-container">
                <div className="logo-container-ff"></div>
                <div className="logo-container-ss"></div>
                <div className="circle flex justify-center">
                    <div className="triangle"></div>
                </div>
            </Link>
            <div className="actions-container flex items-center">
                <div className="profile-pic-container flex justify-center items-center">
                    <Link to="/profile">
                        <img
                            src={avatar === "" ? profileAvatar : avatar}
                            alt="profile-picture"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Nav;
