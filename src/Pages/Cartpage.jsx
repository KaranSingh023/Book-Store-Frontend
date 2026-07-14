import { useContext, useState } from 'react';
import { AppContext } from '../Context/AppContext';

const CartPage = () => {
  const { 
    cart, updateCartQuantity, removeFromCart, moveCartToWishlist, 
    addresses, placeOrder 
  } = useContext(AppContext);

  const [checkoutStep, setCheckoutStep] = useState(false);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  // Safety fallback built directly into the calculations formula
  const totalPrice = cart.reduce((acc, item) => {
    const itemPrice = item.pricing || item.price || 0;
    return acc + (itemPrice * item.quantity);
  }, 0);

  const activeAddress = addresses.find(a => a.isDefault) || addresses[0];

  const handleFinalOrder = () => {
    if (!activeAddress) {
      alert("Please configure an active address profile first!");
      return;
    }
    placeOrder({
      itemsCount: totalItems,
      totalPaid: totalPrice + 5.99,
      deliveredTo: activeAddress.street
    });
    setCheckoutStep(false);
  };

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
      <h2 className="fw-bold mb-4">{checkoutStep ? "Confirm Order Details" : "Shopping Cart Bag"}</h2>
      <div className="row g-4">
        <div className="col-12 col-md-8">
          {cart.map(item => {
            const currentPrice = item.pricing || item.price || 0;
            
            return (
              <div className="card border-0 shadow-sm p-3 mb-3 bg-white" key={item._id}>
                <div className="row align-items-center g-3">
                  <div className="col-3 col-md-2 text-center">
                    <img src={item.cover_image_url || item.cover_year_url} style={{ maxHeight: '80px', maxWidth: '100%' }} alt={item.name} />
                  </div>
                  <div className="col-9 col-md-5">
                    <h6 className="fw-bold mb-1 text-truncate">{item.name}</h6>
                    <span className="fw-bold text-dark">${Number(currentPrice).toFixed(2)}</span>
                  </div>
                  <div className="col-6 col-md-3">
                    {!checkoutStep ? (
                      <div className="input-group input-group-sm" style={{ maxWidth: '120px' }}>
                        <button className="btn btn-outline-secondary" onClick={() => updateCartQuantity(item._id, -1)}>-</button>
                        <span className="form-control text-center bg-white">{item.quantity}</span>
                        <button className="btn btn-outline-secondary" onClick={() => updateCartQuantity(item._id, 1)}>+</button>
                      </div>
                    ) : (
                      <span className="text-muted fw-bold">Qty: {item.quantity}</span>
                    )}
                  </div>
                  <div className="col-6 col-md-2 text-end">
                    {!checkoutStep && (
                      <div className="d-flex flex-column gap-2">
                        <button className="btn btn-sm btn-outline-danger p-1" title="Remove" onClick={() => removeFromCart(item._id, item.name)}><i className="bi bi-trash"></i></button>
                        <button className="btn btn-sm btn-outline-secondary p-1" title="Wishlist" onClick={() => moveCartToWishlist(item)}><i className="bi bi-heart"></i></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {checkoutStep && (
            <div className="card border-0 shadow-sm p-4 mt-4 bg-white">
              <h5 className="fw-bold mb-3"><i className="bi bi-geo-alt-fill text-danger"></i> Delivery Target Address</h5>
              {activeAddress ? (
                <div>
                  <p className="fw-bold m-0">{activeAddress.name}</p>
                  <p className="text-muted small m-0">{activeAddress.street}, {activeAddress.city}, {activeAddress.zip}</p>
                  <p className="text-muted small m-0">Phone: {activeAddress.phone}</p>
                </div>
              ) : (
                <p className="text-danger small">No address selected! Go to profile to set one up.</p>
              )}
            </div>
          )}
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

            {!checkoutStep ? (
              <button className="btn btn-dark w-100 fw-bold py-2" onClick={() => setCheckoutStep(true)}>
                Proceed to Checkout
              </button>
            ) : (
              <div className="d-grid gap-2">
                <button className="btn btn-success w-100 fw-bold py-2" onClick={handleFinalOrder}>
                  Place Order (Successfully)
                </button>
                <button className="btn btn-link btn-sm text-muted text-decoration-none" onClick={() => setCheckoutStep(false)}>
                  Modify Cart Items
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;