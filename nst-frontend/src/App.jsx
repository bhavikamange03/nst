import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'

function App(){
  return (
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
  );
}

export default App;