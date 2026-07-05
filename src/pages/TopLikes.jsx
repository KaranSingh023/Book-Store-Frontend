import { useEffect, useState } from 'react';
import Header from "../Components/Header";
import Footer from "../Components/Footer";

function TopLikes() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopLikes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:3000/books/top-likes');
        if (!response.ok) throw new Error(`Something went wrong: ${response.status}`);
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTopLikes();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="text-center">
          <div className="spinner-border text-danger mb-3" role="status" />
          <p className="text-muted fw-semibold">Loading most liked books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="text-center">
          <p className="fs-1">⚠️</p>
          <p className="text-danger fw-semibold">{error}</p>
          <button className="btn btn-outline-danger" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="text-center">
          <p className="fs-1">📚</p>
          <p className="text-muted fw-semibold">No books found with likes above 100000.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-light min-vh-100">
        <div className="container pb-5">
             <h2 className="fw-bold mb-4 mt-4">Top Likes Books</h2>
          <p className="text-muted mb-4 fw-semibold"> books Likes by more then 100000 peoples.</p>
          
          <div className="row row-cols-auto g-4 justify-content-start">
            {books.map((book, index) => (
              <div className="col" key={book._id}>
                <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden" style={{ width: '220px' }}>
                  
                  
                  <div 
                    className="bg-light d-flex align-items-center justify-content-center p-2 position-relative"
                    style={{ height: '260px' }}
                  >
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
                    
                    {/* Rank Badge */}
                    <span className="position-absolute top-0 start-0 m-2 badge bg-danger rounded-2">
                      #{index + 1}
                    </span>
                    
                    {/* Category Badge */}
                    <span className="position-absolute top-0 end-0 m-2 badge bg-dark rounded-2">
                      {book.type}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="card-body d-flex flex-column p-3">
                    <h5 className="card-title fw-bold mb-1 fs-6 text-truncate" title={book.name}>
                      {book.name}
                    </h5>
                    <p className="text-muted mb-2 text-truncate small" title={book.author}>
                      by {book.author}
                    </p>

                    {/* Likes Bar Status Indicator */}
                    <div className="mb-2">
                      <div className="d-flex justify-content-between mb-1">
                        <small className="text-muted small" style={{ fontSize: '0.75rem' }}>Likes</small>
                        <small className="fw-bold text-danger small" style={{ fontSize: '0.75rem' }}>
                          ❤️ {book.likes.toLocaleString()}
                        </small>
                      </div>
                      <div className="progress rounded-pill" style={{ height: '5px' }}>
                        <div
                          className="progress-bar bg-danger rounded-pill"
                          style={{ width: `${Math.min((book.likes / 200000) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Rating & Publisher Metadata */}
                    <div className="d-flex justify-content-between align-items-center mb-3 text-secondary" style={{ fontSize: '0.8rem' }}>
                      <span>⭐ <strong>{book.rating}</strong></span>
                      <span className="text-truncate ps-2" title={book.publisher}>📦 {book.publisher}</span>
                    </div>

                    {/* Price and Call-to-Action Action row */}
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <span className="fw-bold fs-6">${book.pricing}</span>
                      <button className="btn btn-danger btn-sm fw-semibold px-2 rounded-2" style={{ fontSize: '0.8rem' }}>
                        Add to Cart
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default TopLikes;