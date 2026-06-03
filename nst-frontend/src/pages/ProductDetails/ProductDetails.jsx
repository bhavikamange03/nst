import { useParams } from "react-router-dom";
import { useState } from "react";
import products from "../../data/product.js";

function ProductDetails() {
    const {id} = useParams();

    const product = products.find(
        p => p.id == Number(id)
    );

    const [selectedImage, setSelectedImage] = 
        useState(product.images[0]);
    
    return(
        <div style={{
            display: "flex",
            gap: "40px"
        }}>
            <div>
                <img src = {selectedImage} alt="" width="450" />
                <div style={{
                    display: "flex",
                    gap : "10px",
                    marginTop: "10px"
                }}>
                    {product.images.map(image => (
                        <img key = {image} src = {image} width= "80"
                            onClick={() => setSelectedImage(image)} 
                       
                        style = {{cursor : "pointer"}}
                        />
                    ))}
                </div>
            </div>
            <div>
                <h1>{product.name}</h1>
                <h3>{product.category}</h3>

                <h2>₹{product.price}</h2>

                <p>{product.description}</p>

                <button>
                Add To Cart
                </button>

                <button>
                Wishlist
                </button>
            </div>
        </div>
    );
}

export default ProductDetails;