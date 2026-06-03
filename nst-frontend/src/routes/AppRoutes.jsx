import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Products from "../pages/Products/Products";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

function AppRoutes(){
    return (
        <Routes>
            <Route path="/" element = {<Home />} />
            <Route path="/products" element = {<Products/>}/>
            <Route path="/products/:id" element = {<ProductDetails/>}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />} />
        </Routes>
    );
}

export default AppRoutes;