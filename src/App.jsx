import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Main from './Pages/Main';
import ProductListing from './Pages/ProductListing';
import ProductDetail from './Pages/ProductDetail';
import Wishlist from './Pages/Wishlist';
import CartPage from './Pages/CartPage';
import UserProfile from './Pages/UserProfile';
import OrderSummary from './Pages/OrderSummary';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
        <Navbar />

        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/order-summary" element={<OrderSummary />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;