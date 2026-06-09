import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <h1>Welcome to NST Clothing</h1>

      <p>
        Premium Indian Ethnic & Casual Wear
      </p>

      <Link to="/products" className="btn">Shop Now</Link>
    </>
  );
}

export default Home;