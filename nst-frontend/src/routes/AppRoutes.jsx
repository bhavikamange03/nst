import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Products from "../pages/Products/Products";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Wishlist from "../pages/Wishlist/Wishlist";
import Cart from "../pages/Cart/Cart";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

function AppRoutes(){
    return (
        <Routes>
            <Route path="/" element = {<Home />} />
            <Route path="/products" element = {<Products/>}/>
            <Route path="/products/:id" element = {<ProductDetails/>}/>
            <Route path="/wishlist" element = {<Wishlist/>} />
            <Route path="/cart" element = {<Cart/>} />
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />} />
        </Routes>
    );
}

export default AppRoutes;