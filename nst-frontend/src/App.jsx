import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

function App(){
  return (
    <>
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
    </>
  );
}

export default App;