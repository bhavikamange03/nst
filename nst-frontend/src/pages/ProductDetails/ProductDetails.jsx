import { useParams } from "react-router-dom";
import { useState } from "react";
import products from "../../data/product.js";
import './ProductDetails.css'

function ProductDetails() {
    const {id} = useParams();

    const product = products.find(
        p => p.id == Number(id)
    );

    const [selectedImage, setSelectedImage] = 
        useState(product.images[0]);
    
    const images = product.images;

    const handlePrev = () => {
        const idx = images.indexOf(selectedImage);
        const prev = (idx - 1 + images.length) % images.length;
        setSelectedImage(images[prev]);
    }

    const handleNext = () => {
        const idx = images.indexOf(selectedImage);
        const next = (idx + 1) % images.length;
        setSelectedImage(images[next]);
    }

    return(
        <div className="product-details">
            <div className="product-images">
                <div className="image-wrapper">
                    <img className="main-image" src={selectedImage} alt={`${product.name} main`} />

                    <button className="nav-arrow prev" onClick={handlePrev} aria-label="Previous image">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>

                    <button className="nav-arrow next" onClick={handleNext} aria-label="Next image">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                </div>

                <div className="thumbnails">
                    {product.images.map((image, idx) => (
                        <button
                            key={image}
                            className={`thumbnail ${selectedImage === image ? 'selected' : ''}`}
                            onClick={() => setSelectedImage(image)}
                            aria-label={`Show image ${idx + 1}`}
                        >
                            <img src={image} alt={`${product.name} thumbnail ${idx + 1}`} />
                        </button>
                    ))}
                </div>
            </div>
            <div className="product-info">
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