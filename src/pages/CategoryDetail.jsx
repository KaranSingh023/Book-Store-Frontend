import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

function CategoryDetail() {
  const { type } = useParams(); // Grabs route parameter cleanly
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchByCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        // Using lowerCase formatting to safely match backend endpoint conventions
        const response = await fetch(`http://localhost:3000/books/category/${type.toLowerCase()}`);
        if (!response.ok) throw new Error(`Something went wrong: ${response.status}`);
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (type) fetchByCategory();
  }, [type]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="d-flex justify-content-center align-items-center min-vh-50">
          <div className="text-center">
            <div className="spinner-border text-warning mb-3" role="status" />
            <p className="text-muted fw-semibold">Loading {type} books...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="d-flex justify-content-center align-items-center min-vh-50">
          <div className="text-center">
            <p className="fs-1">⚠️</p>
            <p className="text-danger fw-semibold">{error}</p>
            <button className="btn btn-outline-warning btn-sm" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-light min-vh-100 pb-5">

        {/* Categories Banner matching your original layout architecture */}
        <div className=" text-black py-4 mb-4">
          <div className="container d-flex justify-content-between align-items-center">
            <div>
              <Link to="/category" className="text-warning text-decoration-none small fw-semibold">
                ← Back to Categories
              </Link>
              <h4 className="fw-semibold display-5 mb-0 text-capitalize mt-1"> {type} Books</h4>
            </div>
            <span className="badge bg-warning text-dark fs-6 px-3 py-2 rounded-pill fw-bold">
              {books.length} Books Found
            </span>
          </div>
        </div>

        {/* Books Shelf View Area */}
        <div className="container">
          {books.length === 0 ? (
            <div className="text-center py-5 bg-white rounded-3 shadow-sm border my-4">
              <p className="fs-1 mb-2">📚</p>
              <h4 className="fw-bold text-dark">No books found in "{type}"</h4>
              <Link to="/category" className="btn btn-warning mt-3 fw-semibold px-4 rounded-pill">
                Back to Categories
              </Link>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-3 shadow-sm border mt-2">
              
              {/* Inner Component Header Container Layout */}
              <div className="mb-4 pb-2 border-bottom">
                <h3 className="fw-bold text-capitalize text-dark mb-0">
                  Full {type} Catalogue
                </h3>
              </div>

              {/* Exact 220px Card-Shelf Architecture Alignment */}
              <div className="row row-cols-auto g-4 justify-content-start">
                {books.map((book) => (
                  <div className="col" key={book._id}>
                    <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden bg-light" style={{ width: '220px' }}>
                      
                      {/* Protected Image Container Box */}
                      <div className="bg-white d-flex align-items-center justify-content-center p-2 position-relative" style={{ height: '260px' }}>
                        <img
                          src={book.cover_image_url || 'https://placehold.co/220x260?text=No+Cover'}
                          alt={book.name}
                          className="img-fluid h-100 rounded"
                          style={{ objectFit: 'contain' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/220x260?text=No+Cover';
                          }}
                        />
                      </div>

                      {/* Card Data Panels */}
                      <div className="card-body d-flex flex-column p-3">
                        <h5 className="card-title fw-bold mb-1 fs-6 text-truncate" title={book.name}>
                          {book.name}
                        </h5>
                        <p className="text-muted mb-2 text-truncate small" title={book.author}>
                          by {book.author}
                        </p>
                        
                        <div className="d-flex gap-3 mb-3 text-secondary" style={{ fontSize: '0.8rem' }}>
                          <span>⭐ <strong>{book.rating}</strong></span>
                          <span>❤️ {book.likes ? book.likes.toLocaleString() : 0}</span>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center mt-auto">
                          <span className="fw-bold fs-6">${book.pricing}</span>
                          <button className="btn btn-warning btn-sm fw-semibold px-3 rounded-2" style={{ fontSize: '0.82rem' }}>
                            Add to Cart
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default CategoryDetail;