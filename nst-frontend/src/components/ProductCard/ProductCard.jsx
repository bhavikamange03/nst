import { Link } from "react-router-dom";
import AddToCartButton from '../AddToCartButton/AddToCartButton'
import { useWishlist } from '../../context/WishlistContext'

function ProductCard({product}){
    const { toggle, isInWishlist } = useWishlist();

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
                            <button className={`wishlist-btn ${isInWishlist(product) ? 'active' : ''}`} onClick={() => toggle(product)}>
                                {isInWishlist(product) ? '♥ In Wishlist' : '♡ Wishlist'}
                            </button>
                        </div>
        </div>
    )
}

export default ProductCard;