import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Products from "../pages/Products/Products";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Wishlist from "../pages/Wishlist/Wishlist";
import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";
import Orders from "../pages/Orders/Orders";
import OrderDetail from "../pages/Orders/OrderDetail";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import AdminUsers from "../pages/Admin/Users";
import AdminProducts from "../pages/Admin/Products";
import AdminOrders from "../pages/Admin/Orders";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function AppRoutes(){
    const { isAdmin } = useAuth();
    return (
        <Routes>
            <Route path="/" element = {<Home />} />
            <Route path="/products" element = {<Products/>}/>
            <Route path="/products/:id" element = {<ProductDetails/>}/>
            <Route path="/wishlist" element = {<Wishlist/>} />
            <Route path="/cart" element = {<Cart/>} />
            <Route path="/checkout" element = {<Checkout/>} />
            <Route path="/orders" element = {<Orders/>} />
            <Route path="/orders/:id" element = {<OrderDetail/>} />
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={isAdmin ? <AdminUsers/> : <Navigate to="/login" replace />} />
            <Route path="/admin/users" element={isAdmin ? <AdminUsers/> : <Navigate to="/login" replace />} />
            <Route path="/admin/products" element={isAdmin ? <AdminProducts/> : <Navigate to="/login" replace />} />
            <Route path="/admin/orders" element={isAdmin ? <AdminOrders/> : <Navigate to="/login" replace />} />
        </Routes>
    );
}

export default AppRoutes;