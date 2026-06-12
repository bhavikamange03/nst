import { Link } from "react-router-dom";
import AddToCartButton from '../AddToCartButton/AddToCartButton'
import { useWishlist } from '../../context/WishlistContext'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function ProductCard({product}){
    const { toggle, isInWishlist } = useWishlist();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    function handleWishlist(){
        if (!isLoggedIn){
            alert('Please login to add items to your wishlist');
            navigate('/login');
            return;
        }
        toggle(product);
    }

    return (
        <div className="card">
            <Link to = {`/products/${product.id}`}>
            <img 
                src = {product.images[0]}
                alt = {product.name}
                width = "250"
            />
            </Link>

            <h3> {product.name}</h3>

            <p>₹{product.price}</p>

                        <div className="card-actions">
                            <AddToCartButton product={product} initialQty={1} />
                            <button className={`wishlist-btn ${isInWishlist(product) ? 'active' : ''}`} onClick={handleWishlist}>
                                {isInWishlist(product) ? '♥ In Wishlist' : '♡ Wishlist'}
                            </button>
                        </div>
        </div>
    )
}

export default ProductCard;