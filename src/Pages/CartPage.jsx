import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../Context/AppContext';

const CartPage = () => {
  const { cart, updateCartQuantity, removeFromCart, moveCartToWishlist } = useContext(AppContext);
  const navigate = useNavigate();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Safety fallback built directly into the calculations formula
  const totalPrice = cart.reduce((acc, item) => {
    const itemPrice = item.pricing || item.price || 0;
    return acc + (itemPrice * item.quantity);
  }, 0);

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="card border-0 p-5 shadow-sm bg-white">
          <i className="bi bi-cart-x text-muted fs-1"></i>
          <h4 className="mt-3 fw-bold">Your shopping basket is empty</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Shopping Cart Bag</h2>
      <div className="row g-4">
        <div className="col-12 col-md-8">
          {cart.map(item => {
            const currentPrice = item.pricing || item.price || 0;
            const rawCoverUrl = item.cover_image_url || item.cover_year_url;
            const coverUrl = rawCoverUrl && rawCoverUrl.includes('openlibrary.org')
              ? `${rawCoverUrl}${rawCoverUrl.includes('?') ? '&' : '?'}default=false`
              : rawCoverUrl;

            return (
              <div className="card border-0 shadow-sm p-3 mb-3 bg-white" key={item._id}>
                <div className="row align-items-center g-3">
                  <div className="col-3 col-md-2 text-center">
                    <img src={coverUrl} style={{ maxHeight: '80px', maxWidth: '100%' }} alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/150x200?text=${encodeURIComponent(item.name || 'No Cover')}`;
                      }}
                    />
                  </div>
                  <div className="col-9 col-md-5">
                    <h6 className="fw-bold mb-1 text-truncate">{item.name}</h6>
                    <span className="fw-bold text-dark">${Number(currentPrice).toFixed(2)}</span>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="input-group input-group-sm" style={{ maxWidth: '120px' }}>
                      <button className="btn btn-outline-secondary" onClick={() => updateCartQuantity(item._id, -1)}>-</button>
                      <span className="form-control text-center bg-white">{item.quantity}</span>
                      <button className="btn btn-outline-secondary" onClick={() => updateCartQuantity(item._id, 1)}>+</button>
                    </div>
                  </div>
                  <div className="col-6 col-md-2 text-end">
                    <div className="d-flex flex-column gap-2">
                      <button className="btn btn-sm btn-outline-danger p-1" title="Remove" onClick={() => removeFromCart(item._id, item.name)}><i className="bi bi-trash"></i></button>
                      <button className="btn btn-sm btn-outline-secondary p-1" title="Wishlist" onClick={() => moveCartToWishlist(item)}><i className="bi bi-heart"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm p-4 bg-white position-sticky" style={{ top: '20px' }}>
            <h5 className="fw-bold mb-4">Price Details</h5>
            <div className="d-flex justify-content-between mb-2 small text-muted">
              <span>Subtotal ({totalItems} items)</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3 small text-muted">
              <span>Shipping Fee</span>
              <span>$5.99</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-4 fw-bold fs-5 text-dark">
              <span>Total Bill</span>
              <span>${(totalPrice + 5.99).toFixed(2)}</span>
            </div>

            <button className="btn btn-dark w-100 fw-bold py-2" onClick={() => navigate('/order-summary')}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;