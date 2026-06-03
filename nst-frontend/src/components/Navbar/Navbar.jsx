import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"

function Navbar(){
    const isLoggedIn = false;
    const navigate = useNavigate();

    const handleWishlistClick = (e) => {
        if (!isLoggedIn){
            e.preventDefault();
            navigate("/login");
        }
    }

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to = "/">
                    <h2> Nst Clothing</h2>
                </Link>
            </div>

            <div className="navbar-links">
                <Link to = "/">Home</Link>
                <Link to = "/products">Products</Link>

                <Link to = "/wishlist" onClick={handleWishlistClick}> ❤️ Wishlist</Link>
                <Link to = "/cart">🛒 Cart</Link>
                
                {!isLoggedIn ? (
                    <>
                    <Link to = "/login">Login</Link>
                    <Link to ="/register"> Register</Link>
                    </>
                ) : (
                    <>
                    <Link to = "/profile"> Profile</Link>
                    <Link to = "/orders">My Orders</Link>
                    <Link to = "/logout">Logout</Link>
                    </>
                )}

                
            </div>
        </nav>
    )
}

export default Navbar;