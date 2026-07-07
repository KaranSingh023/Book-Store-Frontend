import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault(); 
    if (searchQuery.trim() === '') return;
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`); 
  };

  return (
    <header className="bg-warning">
      <nav className="navbar navbar-expand-lg fw-semibold navbar-light">
        <div className="container-fluid">
          <Link className="navbar-brand ms-4 fw-bold" to="/">
            A to Z Book Store
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-center" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link active ms-1" to="/">
                  Home
                </Link>
              </li>
              
              {/* Fixed: Wrapped the dropdown menu properly inside an inline nav item structure */}
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle text-dark ms-1" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  Explore
                </a>
                <ul className="dropdown-menu border-0 shadow-sm">
                  <li>
                    <Link className="dropdown-item fw-semibold" to="/category">
                      Category
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item fw-semibold" to="/toprated">
                      Top Rating Books
                    </Link>
                  </li>
                </ul>
              </li>
              
              <li className="nav-item">
                <Link className="nav-link text-dark ms-1" to="/toplikes">
                  Top Likes
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark ms-1" to="/bestselling">
                  Best Selling
                </Link>
              </li>
            </ul>
          </div>

          {/* Form matches search parameters and passes inputs cleanly */}
          <form className="d-flex ms-auto me-4" role="search" onSubmit={handleSearch}>
            <input
              className="form-control me-2 border-0 bg-white shadow-sm"
              type="search"
              placeholder="Search books, authors..."
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-outline-dark fw-semibold" type="submit">
              Search
            </button>
          </form>
        </div>
      </nav>
    </header>
  );
};

export default Header;