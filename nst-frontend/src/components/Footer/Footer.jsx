import { Link } from "react-router-dom";

import "./Footer.css";

function Footer(){
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3> NST Clothing</h3>
                    <p>
                        Premium Indian Ethnic &
                        Casual Wear
                    </p>
                </div>

                {/* Quick Links */}
                <div className="footer-section">
                    <h4>Quick Links</h4>

                    <Link to="/"> Home </Link >
                    <Link to="/products">Products</Link>
                    <Link to ="/login">Login</Link>
                    <Link to ="/register"> Register</Link>

                </div>

                {/* Account */}
                <div className="footer-section">
                    <h4>Account</h4>

                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                    <Link to="/profile">Profile</Link>
                    <Link to="/orders">My Orders</Link>
                </div>

                {/* Customer Service */}
                <div className="footer-section">
                    <h4>Customer Service</h4>

                    <Link to="/contact">Contact Us</Link>
                    <Link to="/shipping-policy">Shipping Policy</Link>
                    <Link to="/return-policy">Return Policy</Link>
                    <Link to="/privacy-policy">Privacy Policy</Link>
                </div>

                {/* Contact */}
                <div className="footer-section">
                    <h4>Contact</h4>

                    <p>support@nst.com</p>
                    <p>+91 9876543210</p>
                </div>
            </div>

            <hr/>

            <p className="footer-copyright">
                © 2026 NST Clothing Store
            </p>
        </footer>
    )
}

export default Footer;