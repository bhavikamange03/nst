import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useAuth } from '../../context/AuthContext'

function Navbar(){
    const { isLoggedIn, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const { totalCount } = useCart();
    const { count: wishlistCount } = useWishlist();

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

                <Link to = "/wishlist" onClick={handleWishlistClick}> ❤️ Wishlist {wishlistCount > 0 && (<span className="cart-count">{wishlistCount}</span>)}</Link>
                <Link to = "/cart">🛒 Cart {totalCount > 0 && (<span className="cart-count">{totalCount}</span>)}</Link>
                
                {!isLoggedIn ? (
                    <>
                    <Link to = "/login">Login</Link>
                    <Link to ="/register"> Register</Link>
                    </>
                ) : (
                    <>
                    <Link to = "/profile"> Profile</Link>
                    <Link to = "/orders">My Orders</Link>
                    {isAdmin && (<Link to="/admin">Admin</Link>)}
                    <a href="#" onClick={(e) => { e.preventDefault(); logout(); }}>Logout</a>
                    </>
                )}

                
            </div>
        </nav>
    )
}

export default Navbar;