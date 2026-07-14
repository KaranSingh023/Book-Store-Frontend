import { useContext } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../Context/AppContext';

const Navbar = () => {
  const { cart, wishlist, searchQuery, setSearchQuery } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (val.trim() !== '' && location.pathname !== '/products') {
      navigate('/products');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-2 px-md-5 shadow sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold fs-4 text-warning" to="/">
          A to Z Book Store
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link fw-semibold ${isActive ? 'text-warning' : ''}`
                }
                to="/"
              >
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link fw-semibold ${isActive ? 'text-warning' : ''}`
                }
                to="/products"
              >
                Explore Books
              </NavLink>
            </li>
          </ul>

          <div
            className="mx-lg-auto my-2 my-lg-0 d-flex justify-content-center"
            style={{ width: '100%', maxWidth: '380px' }}
          >
            <div className="input-group">
              <span className="input-group-text bg-secondary border-0 text-white">🔍</span>
              <input
                type="text"
                className="form-control bg-light border-0 py-2 shadow-none"
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <button
                  className="btn btn-secondary border-0 text-white"
                  onClick={() => setSearchQuery('')}
                  type="button"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0 justify-content-between">
            <Link to="/wishlist" className="btn btn-outline-light border-0 position-relative p-2">
              <i className="text-danger fs-5">❤️</i>
              {wishlistCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-warning text-dark fw-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="btn btn-outline-light border-0 position-relative p-2">
              <i className="text-success fs-5">🛒</i>
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-warning text-dark fw-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link to="/profile" className="btn btn-outline-warning btn-sm px-3 rounded-pill fw-semibold">
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;