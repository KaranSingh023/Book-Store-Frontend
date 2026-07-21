import { useParams, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../Context/AppContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { books, loading, addToCart, addToWishlist } = useContext(AppContext);

  if (loading) {
    return (
      <div className="text-center my-5 p-5">
        <div className="spinner-border text-warning" />
        <p className="mt-2 text-muted small">Loading product details...</p>
      </div>
    );
  }

  const book = books.find(b => b._id?.toString() === id?.toString());

  if (!book) {
    return (
      <div className="container p-5 text-center">
        <h5 className="text-danger fw-bold">Product Not Found</h5>
        <p className="text-muted small">We couldn't locate a book with ID "{id}".</p>
        <button className="btn btn-warning mt-3 btn-sm fw-bold px-4" onClick={() => navigate('/')}>
          Back to Shop
        </button>
      </div>
    );
  }

  const rawCoverUrl = book.cover_image_url || book.cover_year_url;
  const coverUrl = rawCoverUrl && rawCoverUrl.includes('openlibrary.org')
    ? `${rawCoverUrl}${rawCoverUrl.includes('?') ? '&' : '?'}default=false`
    : rawCoverUrl;

  return (
    <div className="container py-5">
      <button className="btn btn-outline-dark mb-4 btn-sm" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="row g-5 bg-white p-4 rounded shadow-sm">
        {/* Book Image Frame */}
        <div className="col-12 col-md-5 text-center bg-light rounded p-4">
          <img
            src={coverUrl || 'https://via.placeholder.com/150'}
            alt={book.name}
            className="img-fluid rounded shadow"
            style={{ maxHeight: '400px', objectFit: 'contain' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/300x400?text=${encodeURIComponent(book.name || 'No Cover')}`;
            }}
          />
        </div>

        {/* Book Descriptions */}
        <div className="col-12 col-md-7">
          <span className="badge bg-secondary text-uppercase mb-2">{book.type}</span>
          <h1 className="fw-bold mb-1">{book.name}</h1>
          <p className="fs-4 text-muted mb-4">By {book.author}</p>

          <div className="d-flex align-items-center mb-4">
            <span className="fs-2 fw-bold text-dark me-4">
              ${book.pricing ? book.pricing.toFixed(2) : '0.00'}
            </span>
            <div className="badge bg-warning text-dark px-3 py-2 fs-6">
              ★ {book.rating || '0.0'} / 5.0
            </div>
          </div>

          <table className="table table-sm table-borderless text-muted my-4" style={{ width: 'auto' }}>
            <tbody>
              <tr>
                <td className="pe-3" style={{ width: '1%', whiteSpace: 'nowrap' }}><strong>Publisher:</strong></td>
                <td>{book.publisher || 'N/A'}</td>
              </tr>
              <tr>
                <td className="pe-3" style={{ width: '1%', whiteSpace: 'nowrap' }}><strong>Release Year:</strong></td>
                <td>{book.release_year || 'N/A'}</td>
              </tr>
              <tr>
                <td className="pe-3" style={{ width: '1%', whiteSpace: 'nowrap' }}><strong>Likes Count:</strong></td>
                <td>{book.likes ? book.likes.toLocaleString() : '0'}</td>
              </tr>
            </tbody>
          </table>

          {/* Checkout/Wishlist Action Links */}
          <div className="d-flex gap-3 mt-4">
            <button className="btn btn-warning btn-lg fw-bold px-5" onClick={() => addToCart(book)}>
              <i className="bi bi-cart-fill me-2"></i> Add to Cart
            </button>
            <button className="btn btn-outline-danger btn-lg px-4" onClick={() => addToWishlist(book)}>
              <i className="bi bi-heart-fill me-2"></i> Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;