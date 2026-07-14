import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Main from './Pages/Main';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Wishlist from './pages/Wishlist';
import CartPage from './pages/CartPage';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <Router>
      <Navbar />
    
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
        <Footer/>
    </Router>
  );
}

export default App;