import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../Context/AppContext';

const OrderSummary = () => {
  const { cart, addresses, placeOrder } = useContext(AppContext);
  const navigate = useNavigate();

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddress?.id || null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => {
    const itemPrice = item.pricing || item.price || 0;
    return acc + itemPrice * item.quantity;
  }, 0);
  const shippingFee = 5.99;
  const grandTotal = totalPrice + shippingFee;

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      alert('Please select a delivery address first!');
      return;
    }

    placeOrder({
      itemsCount: totalItems,
      totalPaid: grandTotal,
      deliveredTo: selectedAddress.street
    });

    setOrderPlaced(true);
  };

  // ---------- SUCCESS STATE ----------
  if (orderPlaced) {
    return (
      <div className="container py-5">
        <div className="card border-0 shadow-sm p-5 text-center bg-white">
          <i className="bi bi-check-circle-fill text-success display-3 mb-3"></i>
          <h3 className="fw-bold mb-2">Order Placed Successfully!</h3>
          <p className="text-muted mb-4">
            Your order for {totalItems} item(s) totaling ${grandTotal.toFixed(2)} is on its way to{' '}
            {selectedAddress?.city}.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-warning fw-bold px-4" onClick={() => navigate('/products')}>
              Continue Shopping
            </button>
            <button className="btn btn-outline-dark fw-bold px-4" onClick={() => navigate('/profile')}>
              View Order History
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- EMPTY CART GUARD ----------
  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="card border-0 p-5 shadow-sm bg-white">
          <i className="bi bi-cart-x text-muted fs-1"></i>
          <h4 className="mt-3 fw-bold">Your cart is empty</h4>
          <p className="text-muted small">Add some books before heading to checkout.</p>
          <button className="btn btn-warning fw-bold mt-2" onClick={() => navigate('/products')}>
            Browse Books
          </button>
        </div>
      </div>
    );
  }

  // ---------- MAIN ORDER SUMMARY ----------
  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Order Summary</h2>

      <div className="row g-4">
        <div className="col-12 col-md-8">
          {/* Address Selection */}
          <div className="card border-0 shadow-sm p-4 mb-4 bg-white">
            <h5 className="fw-bold mb-3">
              <i className="bi bi-geo-alt-fill text-danger"></i> Select Delivery Address
            </h5>

            {addresses.length === 0 ? (
              <div className="text-center py-3">
                <p className="text-danger small mb-2">No saved addresses found.</p>
                <button className="btn btn-sm btn-dark fw-bold" onClick={() => navigate('/profile')}>
                  Add an Address
                </button>
              </div>
            ) : (
              addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-3 rounded border mb-2 d-flex align-items-start gap-3 ${
                    selectedAddressId === addr.id ? 'border-warning bg-light' : 'bg-white'
                  }`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedAddressId(addr.id)}
                >
                  <input
                    type="radio"
                    name="deliveryAddress"
                    className="form-check-input mt-1"
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                  />
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <h6 className="fw-bold m-0 small">{addr.name}</h6>
                      {addr.isDefault && (
                        <span className="badge bg-warning text-dark" style={{ fontSize: '0.6rem' }}>
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-muted small m-0">
                      {addr.street}, {addr.city}, {addr.zip}
                    </p>
                    <p className="text-muted small m-0">Phone: {addr.phone}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order Details / Item List */}
          <div className="card border-0 shadow-sm p-4 bg-white">
            <h5 className="fw-bold mb-3">
              <i className="bi bi-bag-check-fill text-dark"></i> Order Details
            </h5>
            {cart.map((item) => {
              const itemPrice = item.pricing || item.price || 0;
              return (
                <div className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom" key={item._id}>
                  <img
                    src={item.cover_image_url || item.cover_year_url}
                    style={{ maxHeight: '60px', maxWidth: '50px', objectFit: 'contain' }}
                    alt={item.name}
                  />
                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-0 small text-truncate">{item.name}</h6>
                    <span className="text-muted small">Qty: {item.quantity}</span>
                  </div>
                  <span className="fw-bold text-dark">
                    ${(itemPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Price Summary + Place Order */}
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm p-4 bg-white position-sticky" style={{ top: '20px' }}>
            <h5 className="fw-bold mb-4">Price Details</h5>
            <div className="d-flex justify-content-between mb-2 small text-muted">
              <span>Subtotal ({totalItems} items)</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3 small text-muted">
              <span>Shipping Fee</span>
              <span>${shippingFee.toFixed(2)}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-4 fw-bold fs-5 text-dark">
              <span>Total Bill</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>

            <button
              className="btn btn-success w-100 fw-bold py-2 mb-2"
              onClick={handlePlaceOrder}
              disabled={!selectedAddress}
            >
              Place Order
            </button>
            <button
              className="btn btn-link btn-sm text-muted text-decoration-none"
              onClick={() => navigate('/cart')}
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;