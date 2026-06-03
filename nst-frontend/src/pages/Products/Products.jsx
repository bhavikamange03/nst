import ProductCard from "../../components/ProductCard/ProductCard";
import products from "../../data/product.js";
import './Products.css';

function Products(){
    return(
        <div>
            <h1> All Products</h1>
            <div className="products-grid">
                {products.map( product => (
                    <ProductCard 
                        key = {product.id}
                        product = {product}
                    />
                ))}
            </div>
        </div>
    )
}

export default Products;