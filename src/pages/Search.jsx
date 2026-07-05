import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from "../Components/Header";
import Footer from "../Components/Footer";

function Search() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query'); 

  useEffect(() => {
    // If there is no parameter, skip unnecessary fetch calls completely
    if (!query || query.trim() === '') {
      setBooks([]);
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Encode URL to safe string representations
        const response = await fetch(`http://localhost:3000/books/search?query=${encodeURIComponent(query.trim())}`);
        
        if (!response.ok) {
          throw new Error(`Server returned status code: ${response.status}`);
        }
        
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]); 

  return (
    <>
      <Header />
      <main className="bg-light min-vh-100">
        <div className="py-4 mb-4 bg-dark text-white">
          <div className="container">
            <p className="text-warning fw-semibold mb-1 text-uppercase small" style={{ letterSpacing: '2px' }}>
              Search Results
            </p>
            <h1 className="fw-bold display-5 mb-1">"{query || ''}"</h1>
            <p className="text-white-50 mb-0">
              {loading ? "Searching..." : `${books.length} books found`}
            </p>
          </div>
        </div>

        <div className="container pb-5">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <div className="spinner-border text-warning" role="status" />
            </div>
          ) : error ? (
            <div className="text-center py-5 bg-white rounded shadow-sm my-4 border p-4">
              <p className="fs-1">⚠️</p>
              <h5 className="text-danger fw-bold">Search Fetch failed</h5>
              <p className="text-muted mb-0">{error}</p>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-5 bg-white rounded-3 shadow-sm border my-4">
              <p className="fs-1 mb-2">📚</p>
              <h4 className="fw-bold text-dark">No results found</h4>
              <p className="text-muted mb-0">Try matching by another item title, publisher, or field category instead.</p>
            </div>
          ) : (
            <div className="row row-cols-auto g-4 justify-content-start">
              {books.map((book) => (
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
                      <span className="position-absolute top-0 end-0 m-2 badge bg-dark rounded-2 opacity-85">
                        {book.type}
                      </span>
                    </div>

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
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Search;