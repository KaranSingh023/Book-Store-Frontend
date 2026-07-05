import { useEffect, useState } from 'react';
import Header from "../Components/Header";
import Footer from "../Components/Footer";

function AllBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:3000/books');
        if (!response.ok) throw new Error(`Something went wrong: ${response.status}`);
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllBooks();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" />
          <p className="text-muted fw-semibold">Loading library catalogue...</p>
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
          <button className="btn btn-outline-primary" onClick={() => window.location.reload()}>
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
          <p className="text-muted fw-semibold">No books found in the collection.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-light min-vh-100">
        
        {/* Banner Section */}
        <div className="bg-dark text-white py-5 mb-4 bg-gradient">
          <div className="container">
            <p className="fw-semibold mb-1 text-uppercase small text-white-50" style={{ letterSpacing: '2px' }}>
              Explore Our Collection
            </p>
            <h1 className="fw-bold display-5 mb-2">📚 All Books</h1>
            <p className="text-white-50 mb-0">
              Browse through our complete collection of literary classics, code guides, and trending reads.
            </p>
          </div>
        </div>

        {/* Books Display Grid Area */}
        <div className="container pb-5">
          <p className="text-muted mb-4 fw-semibold">
            Total: {books.length} books found
          </p>

          <div className="row row-cols-auto g-4 justify-content-start">
            {books.map((book) => (
              <div className="col" key={book._id || book.id}>
                <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden" style={{ width: '220px' }}>
                  
                  {/* Secure Image Container Box preventing vertical layout blowouts */}
                  <div 
                    className="bg-light d-flex align-items-center justify-content-center p-2 position-relative"
                    style={{ height: '260px' }}
                  >
                    <img
                      src={book.cover_image_url || book.cover_year_url || 'https://placehold.co/220x260?text=No+Cover'}
                      alt={book.name}
                      className="img-fluid h-100 rounded"
                      style={{ objectFit: 'contain' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/220x260?text=No+Cover';
                      }}
                    />
                    
                    {/* Tag Badge */}
                    <span className="position-absolute top-0 end-0 m-2 badge bg-dark rounded-2 opacity-85">
                      {book.type}
                    </span>
                  </div>

                  {/* Card Content Body */}
                  <div className="card-body d-flex flex-column p-3">
                    <h5 className="card-title fw-bold mb-1 fs-6 text-truncate" title={book.name}>
                      {book.name}
                    </h5>
                    <p className="text-muted mb-2 text-truncate small" title={book.author}>
                      by {book.author}
                    </p>

                    {/* Performance Indicators */}
                    <div className="d-flex justify-content-between align-items-center mb-2 text-secondary" style={{ fontSize: '0.8rem' }}>
                      <span>⭐ <strong>{book.rating}</strong></span>
                      <span>❤️ {book.likes ? book.likes.toLocaleString() : 0}</span>
                    </div>

                    {/* Publisher Subtitle */}
                    <p className="text-muted text-truncate mb-3 small border-top pt-2" style={{ fontSize: '0.75rem' }} title={book.publisher}>
                      📦 {book.publisher || 'Independent'}
                    </p>

                    {/* Transaction Bottom Toolbar */}
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <span className="fw-bold fs-6">${book.pricing}</span>
                      <button className="btn btn-primary btn-sm fw-semibold px-2 rounded-2" style={{ fontSize: '0.8rem' }}>
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

export default AllBooks;