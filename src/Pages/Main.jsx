import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../Context/AppContext';

const Main = () => {
  const { books, loading } = useContext(AppContext);
  const [featuredCategories, setFeaturedCategories] = useState([]);

  useEffect(() => {
    if (books.length > 0) {
      // Extract clean unique categories from your book data
      const uniqueTypes = [...new Set(books.map(book => book.type?.trim().toLowerCase()).filter(Boolean))];
      
      
      const shuffled = uniqueTypes.sort(() => Math.random() - 0.5).slice(0, 6);

      
      const mappedCategories = shuffled.map(type => {
        const match = books.find(book => book.type?.trim().toLowerCase() === type);
        let coverUrl = match?.cover_image_url || match?.cover_year_url;

      
        if (coverUrl && coverUrl.includes('openlibrary.org')) {
          coverUrl = `${coverUrl}?default=false`;
        } else if (!coverUrl) {
          coverUrl = `https://placehold.co/300x400?text=${encodeURIComponent(type)}`;
        }

        return { name: type, imageUrl: coverUrl };
      });

      setFeaturedCategories(mappedCategories);
    }
  }, [books]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center my-5 py-5">
        <div className="spinner-border text-warning" role="status" />
      </div>
    );
  }

  return (
    <main className="container py-5">
      {/* Hero Welcome Banner */}
      <section className="bg-light p-5 rounded-3 mb-5 text-center shadow-sm border">
        <h1 className="display-4 fw-bold text-dark mb-2">Welcome to A to Z BookStore</h1>
        <p className="lead text-muted mb-4">Discover your next favorite read from our curated collections.</p>
        <Link to="/products" className="btn btn-warning btn-lg fw-bold px-4 shadow-sm">
          Browse All Books
        </Link>
      </section>

      {/* Featured Categories Layout Grid */}
      <section>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-0">Featured Categories</h2>
            <p className="text-muted mb-0 small">Explore collections curated according to genres</p>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {featuredCategories.map((category) => (
            <div className="col" key={category.name}>
              {/* Clicking a category routes to the dynamic book filter listings */}
              <Link to="/products" className="text-decoration-none text-dark h-100 d-block">
                <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden position-relative card-hover justify-content-between bg-white">
                  
                  {/* Category Image Box Setup */}
                  <div className="bg-light d-flex align-items-center justify-content-center p-3" style={{ height: '240px' }}>
                    <img
                      src={category.imageUrl}
                      className="h-100 rounded shadow-sm"
                      alt={category.name}
                      style={{ objectFit: 'contain', maxWidth: '100%' }}
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = `https://placehold.co/300x400?text=${encodeURIComponent(category.name)}`;
                        e.target.style.objectFit = 'cover';
                      }}
                    />
                  </div>
                  
                  {/* Card Label Body */}
                  <div className="card-body p-3">
                    <h5 className="card-title fw-bold text-capitalize mb-1">
                      {category.name}
                    </h5>
                    <span className="text-warning fw-semibold small d-flex align-items-center gap-1 mt-2">
                     Explore Genre
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Main;