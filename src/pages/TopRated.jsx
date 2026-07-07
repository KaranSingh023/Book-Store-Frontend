import { useEffect, useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

function TopRated() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:3000/books/top-rated');
        if (!response.ok) throw new Error(`Failed to fetch top-rated books: ${response.status}`);
        
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRated();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="d-flex justify-content-center align-items-center min-vh-50">
          <div className="text-center">
            <div className="spinner-border text-warning mb-3" role="status" />
            <p className="text-muted fw-semibold">Loading top rated collection...</p>
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
            <p className="fs-1">🏆</p>
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

       
        <div className=" text-black py-4 mb-4">
          <div className="container d-flex justify-content-between align-items-center">
            <div>
              <p className="text-warning fw-semibold mb-1 text-uppercase small" style={{ letterSpacing: '2px' }}>
                Premium Choices
              </p>
              <h1 className="fw-bold display-5 mb-0"> Top Rated Books</h1>
            </div>
           
          </div>
        </div>

        {/* Content Shelf Area */}
        <div className="container">
          <div className="bg-white p-4 rounded-3 shadow-sm border mt-2">
            
            <div className="mb-4 pb-2 border-bottom">
              <h3 className="fw-bold text-dark mb-0">
                Critically Acclaimed Titles ({books.length})
              </h3>
            </div>

            {/* Main Books Grid (Matching Your Design Architecture) */}
            <div className="row row-cols-auto g-4 justify-content-start">
              {books.map((book) => (
                <div className="col" key={book._id}>
                  <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden bg-light" style={{ width: '220px' }}>
                    
                    {/* Cover Image Container */}
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
                      <span className="position-absolute top-0 end-0 m-2 badge bg-dark text-capitalize text-white opacity-85">
                        {book.type}
                      </span>
                    </div>

                    {/* Book Metadata Context */}
                    <div className="card-body d-flex flex-column p-3">
                      <h5 className="card-title fw-bold mb-1 fs-6 text-truncate" title={book.name}>
                        {book.name}
                      </h5>
                      <p className="text-muted mb-2 text-truncate small" title={book.author}>
                        by {book.author}
                      </p>
                      
                      <div className="d-flex gap-3 mb-3 text-secondary" style={{ fontSize: '0.8rem' }}>
                        <span className="text-dark font-weight-bold">⭐ <strong>{book.rating}</strong></span>
                        <span>❤️ {book.likes ? book.likes.toLocaleString() : 0}</span>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <span className="fw-bold fs-6">₹{book.pricing}</span>
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
        </div>
      </main>
      <Footer />
    </>
  );
}

export default TopRated;