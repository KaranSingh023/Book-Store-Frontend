import { useState, useEffect, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../Context/AppContext';

const ProductListing = () => {
  const {
    books,
    loading,
    addToCart,
    addToWishlist,
    searchQuery,
  } = useContext(AppContext);

  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [priceSort, setPriceSort] = useState('');

  const categoriesList = useMemo(() => {
    if (!books || !Array.isArray(books)) return [];
    const allCats = books
      .map((b) => b.type || b.category || b.genre)
      .filter(Boolean)
      .map((c) => c.toLowerCase().trim());

    return [...new Set(allCats)];
  }, [books]);

  useEffect(() => {
    if (!books || !Array.isArray(books)) {
      setFilteredBooks([]);
      return;
    }

    let result = [...books];

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((b) => {
        const title = (b.name || '').toLowerCase();
        const author = (b.author || '').toLowerCase();
        return title.includes(query) || author.includes(query);
      });
    }

    if (selectedCategories.length > 0) {
      result = result.filter((b) => {
        const itemCat = (b.type || b.category || b.genre || '').toLowerCase().trim();
        return selectedCategories.includes(itemCat);
      });
    }

    result = result.filter((b) => {
      const parsedRating = parseFloat(b.rating);
      const bookRating = isNaN(parsedRating) ? 0 : parsedRating;
      return bookRating >= minRating;
    });

    if (priceSort === 'lowToHigh') {
      result.sort(
        (a, b) =>
          parseFloat(a.pricing || a.price || 0) -
          parseFloat(b.pricing || b.price || 0)
      );
    } else if (priceSort === 'highToLow') {
      result.sort(
        (a, b) =>
          parseFloat(b.pricing || b.price || 0) -
          parseFloat(a.pricing || a.price || 0)
      );
    }

    setFilteredBooks(result);
  }, [books, selectedCategories, minRating, priceSort, searchQuery]);

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setMinRating(0);
    setPriceSort('');
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading products...</span>
        </div>
        <p className="mt-2 text-muted fw-bold">Loading product catalog...</p>
      </div>
    );
  }

  if (!books || !Array.isArray(books) || books.length === 0) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-exclamation-triangle-fill text-danger display-4 d-block mb-3"></i>
        <h4 className="fw-bold">No products available</h4>
        <p className="text-muted small">
          We couldn't load the catalog right now. Please check your connection or try again shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <style>
        {`
          .product-card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }

          .product-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.12);
          }

          .product-title {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            line-height: 1.4;
            min-height: 2.8em;
            word-break: break-word;
          }

          .product-author {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            line-height: 1.3;
            min-height: 2.6em;
            overflow-wrap: anywhere;
            word-break: break-word;
          }

          .product-image-wrap {
            height: 180px;
          }

          .product-image {
            max-height: 100%;
            object-fit: contain;
          }

          .filter-sticky {
            position: sticky;
            top: 20px;
          }

          @media (max-width: 767.98px) {
            .filter-sticky {
              position: static;
            }

            .product-image-wrap {
              height: 160px;
            }
          }
        `}
      </style>

      <div className="row g-4">
        <div className="col-12 col-md-4 col-lg-3">
          <div className="card border-0 shadow-sm p-3 bg-white filter-sticky">
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <h5 className="fw-bold mb-0">
                <i className="bi bi-sliders me-2"></i>Filters
              </h5>
              <button
                onClick={handleClearFilters}
                className="btn btn-sm btn-link text-danger text-decoration-none fw-bold p-0"
              >
                Clear All
              </button>
            </div>

            <div className="mb-4">
              <h6 className="text-muted text-uppercase fw-bold small mb-2">Sort By Price</h6>
              <div className="form-check mb-1">
                <input
                  className="form-check-input"
                  type="radio"
                  name="priceSortGroup"
                  id="sortLowHigh"
                  checked={priceSort === 'lowToHigh'}
                  onChange={() => setPriceSort('lowToHigh')}
                />
                <label className="form-check-label small" htmlFor="sortLowHigh">
                  Price: Low to High
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="priceSortGroup"
                  id="sortHighLow"
                  checked={priceSort === 'highToLow'}
                  onChange={() => setPriceSort('highToLow')}
                />
                <label className="form-check-label small" htmlFor="sortHighLow">
                  Price: High to Low
                </label>
              </div>
            </div>

            <div className="mb-4">
              <h6 className="text-muted text-uppercase fw-bold small mb-2">Category</h6>
              {categoriesList.length === 0 ? (
                <div className="text-muted small">No categories found.</div>
              ) : (
                categoriesList.map((cat, idx) => (
                  <div className="form-check mb-1" key={idx}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`catCheck-${idx}`}
                      checked={selectedCategories.includes(cat)}
                      onChange={(e) =>
                        e.target.checked
                          ? setSelectedCategories([...selectedCategories, cat])
                          : setSelectedCategories(
                              selectedCategories.filter((c) => c !== cat)
                            )
                      }
                    />
                    <label
                      className="form-check-label small text-capitalize"
                      htmlFor={`catCheck-${idx}`}
                    >
                      {cat}
                    </label>
                  </div>
                ))
              )}
            </div>

            <div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="text-muted text-uppercase fw-bold small mb-0">Minimum Rating</h6>
                <span className="badge bg-warning text-dark fw-bold">
                  {minRating.toFixed(1)} ★
                </span>
              </div>

              <input
                type="range"
                className="form-range"
                min="0"
                max="5"
                step="0.5"
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
              />

              <div className="d-flex justify-content-between text-muted" style={{ fontSize: '10px' }}>
                <span>0.0★</span>
                <span>2.5★</span>
                <span>5.0★</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-8 col-lg-9">
          {filteredBooks.length === 0 ? (
            <div className="text-center py-5 px-4 bg-white rounded shadow-sm border">
              <i className="bi bi-search text-muted display-4 d-block mb-3"></i>
              <h4 className="fw-bold">No results match your criteria</h4>
              <p className="text-muted small">
                Try changing the search or lowering the filter conditions.
              </p>
              <button className="btn btn-dark btn-sm mt-2 fw-bold" onClick={handleClearFilters}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3">
              {filteredBooks.map((book, index) => {
                const actualPrice = parseFloat(book.pricing || book.price || 0);
                const actualRating = parseFloat(book.rating || 0);

                return (
                  <div className="col" key={book._id || index}>
                    <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden position-relative bg-white d-flex flex-column product-card">
                      <button
                        onClick={() => addToWishlist(book)}
                        className="btn btn-light position-absolute rounded-circle shadow-sm border d-flex align-items-center justify-content-center p-0"
                        style={{ top: '12px', right: '12px', width: '34px', height: '34px', zIndex: 2 }}
                        title="Add to Wishlist"
                      >
                        <i className="bi bi-heart-fill text-danger fs-6"></i>
                      </button>

                      <Link
                        to={`/product/${book._id}`}
                        className="text-decoration-none text-center p-3 bg-light d-block"
                      >
                        <div className="d-flex align-items-center justify-content-center product-image-wrap">
                          <img
                            src={book.cover_image_url || book.cover_year_url}
                            alt={book.name}
                            className="img-fluid product-image"
                          />
                        </div>
                      </Link>

                      <div className="card-body p-3 d-flex flex-column" style={{ minWidth: 0 }}>
                        <h6 className="fw-bold mb-1 text-dark product-title" title={book.name}>
                          {book.name}
                        </h6>

                        <p className="text-muted small mb-2 product-author">
                          By {book.author || 'Unknown Author'}
                        </p>

                        <div className="d-flex justify-content-between align-items-center mt-auto mb-3">
                          <span className="fw-bold fs-5 text-dark">${actualPrice.toFixed(2)}</span>
                          <span className="badge bg-light text-warning border fw-bold">
                            <i className="bi bi-star-fill me-1"></i>
                            {actualRating ? actualRating.toFixed(1) : '0.0'}
                          </span>
                        </div>

                        <div className="d-grid gap-2">
                          <button
                            className="btn btn-warning btn-sm fw-bold d-flex align-items-center justify-content-center gap-2 py-2"
                            onClick={() => addToCart(book)}
                          >
                            <i className="bi bi-cart-plus-fill"></i> Add to Cart
                          </button>

                          <button
                            className="btn btn-outline-secondary btn-sm fw-bold d-flex align-items-center justify-content-center gap-2 py-1"
                            onClick={() => addToWishlist(book)}
                          >
                            <i className="bi bi-heart"></i> Add to Wishlist
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListing;