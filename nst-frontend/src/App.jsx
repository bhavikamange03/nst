import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider } from './context/AuthContext'

function App(){
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Navbar/>

          <main 
            style={{
              minHeight : "80vh",
              padding: "20px"
            }}
            >
            <AppRoutes/>
          </main>

          <Footer/>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;