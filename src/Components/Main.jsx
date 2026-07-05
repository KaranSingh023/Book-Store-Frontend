import { useEffect, useState } from 'react';

const Main = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:3000/books');
        if (!response.ok) throw new Error(`Something went wrong: ${response.status}`);
        const data = await response.json();

        // Shuffle and pick 6 random books
        const shuffled = data.sort(() => Math.random() - 0.5);
        setBooks(shuffled.slice(0, 6));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="text-center">
          <div className="spinner-border text-warning mb-3" role="status" />
          <p className="text-muted fw-semibold">Loading books...</p>
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

  return (
    <>
      <main>
        <section className="my-4 mx-2 mx-md-5">
          
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-0">Featured Books</h2>
              <p className="text-muted mb-0 small">
                Showing {books.length} of our top picks
              </p>
            </div>
            <a href="/allbooks" className="btn btn-outline-dark btn-sm fw-semibold">
              View All →
            </a>
          </div>

          
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {books.map((book) => (
              <div className="col" key={book._id}>
                <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden position-relative">
                  
                  {/* Fixed-Height Frame for Image Uniformity */}
                  <div 
                    className="bg-light d-flex align-items-center justify-content-center p-3"
                    style={{ height: '280px' }} 
                  >
                    <img
                      src={book.cover_image_url || 'https://placehold.co/300x400?text=No+Cover'}
                      className="img-fluid h-100 rounded"
                      alt={book.name}
                      style={{ objectFit: 'contain' }} 
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = 'https://placehold.co/300x400?text=No+Cover';
                      }}
                    />
                    
                    
                    <span className="position-absolute top-0 end-0 m-3 badge bg-dark rounded-2">
                      {book.type}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="card-body d-flex flex-column px-3 pt-3 pb-2">
                    <h5 className="card-title fw-bold mb-1 fs-6 text-truncate">
                      {book.name}
                    </h5>
                    <p className="text-muted mb-2 small">
                      by {book.author}
                    </p>

                    {/* Rating & Likes */}
                    <div className="d-flex gap-3 mb-3 small">
                      <span>
                        ⭐ <strong>{book.rating}</strong>
                      </span>
                      <span>
                        ❤️ <strong>{book.likes ? book.likes.toLocaleString() : 0}</strong>
                      </span>
                    </div>

                    {/* Price + Button */}
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <span className="fw-bold fs-5">${book.pricing}</span>
                      <button className="btn btn-warning btn-sm fw-semibold px-3 rounded-2">
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="card-footer bg-white border-0 px-3 pb-3">
                    <small className="text-secondary opacity-75">
                      📦 {book.publisher}
                    </small>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default Main;