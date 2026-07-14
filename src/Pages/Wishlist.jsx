import { useContext } from 'react';
import { AppContext } from '../Context/AppContext';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, moveWishlistToCart } = useContext(AppContext);

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">My Saved Wishlist ({wishlist.length})</h2>
      {wishlist.length === 0 ? (
        <div className="text-center py-5 bg-white rounded shadow-sm">
          <i className="bi bi-heart text-muted fs-1"></i>
          <h5 className="mt-3">Your wishlist is empty!</h5>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-4 g-4">
          {wishlist.map(book => {
            // Safety fallback for the price field
            const displayedPrice = book.pricing || book.price || 0;
            
            return (
              <div className="col" key={book._id}>
                <div className="card h-100 border-0 shadow-sm justify-content-between">
                  <div className="p-3 text-center bg-light" style={{ height: '160px' }}>
                    <img src={book.cover_image_url || book.cover_year_url} className="h-100" style={{ objectFit: 'contain' }} alt={book.name} />
                  </div>
                  <div className="card-body p-3">
                    <h6 className="fw-bold text-truncate mb-1">{book.name}</h6>
                    <p className="text-muted small mb-3">${Number(displayedPrice).toFixed(2)}</p>
                    <div className="d-grid gap-2">
                      <button className="btn btn-warning btn-sm fw-bold" onClick={() => moveWishlistToCart(book)}>
                        Move to Cart
                      </button>
                      {/* FIXED: Passing the correct object mapping reference */}
                      <button className="btn btn-outline-danger btn-sm" onClick={() => removeFromWishlist(book._id, book.name)}>
                        Remove Item
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
  );
};

export default Wishlist;