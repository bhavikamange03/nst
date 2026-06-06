import { Link } from "react-router-dom";
import AddToCartButton from '../AddToCartButton/AddToCartButton'

function ProductCard({product}){
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

            <AddToCartButton product={product} initialQty={1} />

            <button>Wishlist</button>
        </div>
    )
}   

export default ProductCard;