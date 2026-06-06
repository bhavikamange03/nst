import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import { CartProvider } from './context/CartContext'

function App(){
  return (
    <CartProvider>
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
    </CartProvider>
  );
}

export default App;