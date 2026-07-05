import { useEffect, useState } from 'react';
import Header from "../Components/Header";
import Footer from "../Components/Footer";

function Category() {
  const [groupedBooks, setGroupedBooks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndGroupBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all books from the database
        const response = await fetch('http://localhost:3000/books');
        if (!response.ok) throw new Error(`Something went wrong: ${response.status}`);
        const data = await response.json();

        // Group books dynamically by their 'type' attribute
        const groups = data.reduce((acc, book) => {
          const categoryName = book.type || 'Uncategorized';
          if (!acc[categoryName]) {
            acc[categoryName] = [];
          }
          acc[categoryName].push(book);
          return acc;
        }, {});

        setGroupedBooks(groups);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndGroupBooks();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="d-flex justify-content-center align-items-center min-vh-50">
          <div className="text-center">
            <div className="spinner-border text-warning mb-3" role="status" />
            <p className="text-muted fw-semibold">Loading categories...</p>
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
        
        {/* Page Banner
        <div className="bg-dark text-white py-4 mb-5">
          <div className="container">
            <p className="text-warning fw-semibold mb-1 text-uppercase small" style={{ letterSpacing: '2px' }}>
              Explore Collection
            </p>
            <h1 className="fw-bold display-5 mb-0">📁 Book Categories</h1>
          </div>
        </div> */}

        {/* Categories Rows */}
        <div className="container">
          {Object.keys(groupedBooks).map((category) => {
            const allBooksInCat = groupedBooks[category];
            // Slice the array to show exactly the first 5 books as requested
            const previewBooks = allBooksInCat.slice(0, 5);

            return (
              <div key={category} className="mb-5 bg-white p-4 rounded-3 shadow-sm border">
                
                
                <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                  <div>
                    <h3 className="fw-bold text-capitalize text-dark mb-0 d-inline-block me-2">
                      {category}
                    </h3>
                    <span className="badge bg-secondary rounded-pill align-middle">
                      {allBooksInCat.length} Total
                    </span>
                  </div>
                  
                  {/* Clean View All Button - Placed and styled, inactive for now */}
                  <button 
                    className="btn btn-outline-warning text-dark fw-bold px-3 rounded-pill btn-sm shadow-sm"
                    disabled
                  >
                    View All →
                  </button>
                </div>

               
                <div className="row row-cols-auto g-4 justify-content-start">
                  {previewBooks.map((book) => (
                    <div className="col" key={book._id}>
                      <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden bg-light" style={{ width: '220px' }}>
                        
                       
                        <div 
                          className="bg-white d-flex align-items-center justify-content-center p-2 position-relative"
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
                        </div>

                        {/* Card Data Content Body */}
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
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Category;