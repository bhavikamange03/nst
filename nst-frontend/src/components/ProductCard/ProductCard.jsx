import { Link } from "react-router-dom";

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

            <button>Add to cart</button>
            <button>Wishlist</button>
        </div>
    )
}   

export default ProductCard;