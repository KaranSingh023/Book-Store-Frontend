import { useContext, useState } from 'react';
import { AppContext } from "../Context/AppContext";

const UserProfile = () => {
  const { addresses, addAddress, deleteAddress, updateAddress, selectDefaultAddress, orders } = useContext(AppContext);

  // Local Controlled Modal State for New/Edit Address Form entries
  const [form, setForm] = useState({ name: '', street: '', city: '', zip: '', phone: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = "Add" mode, otherwise "Edit" mode

  const handleSubmitAddress = (e) => {
    e.preventDefault();
    if (!form.name || !form.street || !form.city || !form.zip || !form.phone) return;

    if (editingId) {
      updateAddress(editingId, form);
    } else {
      addAddress(form);
    }

    setForm({ name: '', street: '', city: '', zip: '', phone: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEditClick = (addr) => {
    setForm({
      name: addr.name,
      street: addr.street,
      city: addr.city,
      zip: addr.zip,
      phone: addr.phone
    });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const handleToggleForm = () => {
    if (showForm) {
      // Closing the form (whether it was Add or Edit) resets everything
      setShowForm(false);
      setEditingId(null);
      setForm({ name: '', street: '', city: '', zip: '', phone: '' });
    } else {
      setShowForm(true);
    }
  };

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* STATIC ACCREDITED USER INFO CARD */}
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm p-4 text-center bg-white">
            <div className="bg-warning text-dark d-inline-flex align-items-center justify-content-center rounded-circle fs-2 mx-auto mb-3" style={{ width: '70px', height: '70px' }}>
              JD
            </div>
            <h4 className="fw-bold mb-1">John Doe</h4>
            <p className="text-muted small mb-3">johndoe@example.com</p>
            <hr />
            <div className="text-start small text-muted">
              <p className="mb-1"><strong>Phone:</strong> +1 (555) 019-2834</p>
              <p className="mb-0"><strong>Status:</strong> Premium Member Account</p>
            </div>
          </div>
        </div>

        {/* ADDRESS MANAGEMENT PANEL */}
        <div className="col-12 col-md-8">
          <div className="card border-0 shadow-sm p-4 bg-white mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold m-0"><i className="bi bi-map"></i> Saved Delivery Addresses</h5>
              <button className="btn btn-sm btn-dark fw-bold" onClick={handleToggleForm}>
                {showForm ? "Cancel" : "+ Add New Address"}
              </button>
            </div>

            {/* Managed Form Segment - shared by both Add and Edit modes */}
            {showForm && (
              <form onSubmit={handleSubmitAddress} className="row g-2 bg-light p-3 rounded mb-3 border">
                <div className="col-12 mb-1">
                  <span className="badge bg-warning text-dark fw-bold">
                    {editingId ? "Editing Address" : "New Address"}
                  </span>
                </div>
                <div className="col-md-6"><input type="text" placeholder="Full Name" className="form-control form-control-sm" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                <div className="col-md-6"><input type="text" placeholder="Phone Number" className="form-control form-control-sm" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required /></div>
                <div className="col-12"><input type="text" placeholder="Street Location Address" className="form-control form-control-sm" value={form.street} onChange={e => setForm({...form, street: e.target.value})} required /></div>
                <div className="col-md-8"><input type="text" placeholder="City" className="form-control form-control-sm" value={form.city} onChange={e => setForm({...form, city: e.target.value})} required /></div>
                <div className="col-md-4"><input type="text" placeholder="ZIP Code" className="form-control form-control-sm" value={form.zip} onChange={e => setForm({...form, zip: e.target.value})} required /></div>
                <div className="col-12">
                  <button type="submit" className="btn btn-warning btn-sm fw-bold w-100">
                    {editingId ? "Update Address" : "Save Address Profile"}
                  </button>
                </div>
              </form>
            )}

            {/* Address Cards List layout */}
            {addresses.map(addr => (
              <div className={`p-3 rounded border mb-2 d-flex justify-content-between align-items-start ${addr.isDefault ? 'border-warning bg-light' : 'bg-white'}`} key={addr.id}>
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <h6 className="fw-bold m-0 small">{addr.name}</h6>
                    {addr.isDefault && <span className="badge bg-warning text-dark" style={{ fontSize: '0.6rem' }}>Primary</span>}
                  </div>
                  <p className="text-muted small m-0">{addr.street}, {addr.city}, {addr.zip}</p>
                </div>
                <div className="d-flex gap-2">
                  {!addr.isDefault && (
                    <button className="btn btn-sm btn-outline-secondary py-0 px-2" style={{ fontSize: '0.75rem' }} onClick={() => selectDefaultAddress(addr.id)}>Set Primary</button>
                  )}
                  <button className="btn btn-sm btn-outline-primary py-0 px-2" style={{ fontSize: '0.75rem' }} onClick={() => handleEditClick(addr)}>
                    <i className="bi bi-pencil-square"></i> Update
                  </button>
                  <button className="btn btn-sm btn-outline-danger border-0 py-0 px-1" onClick={() => deleteAddress(addr.id)}><i className="bi bi-x-circle"></i></button>
                </div>
              </div>
            ))}
          </div>

          {/* HISTORICAL LOGGED ORDERS VIEW */}
          <div className="card border-0 shadow-sm p-4 bg-white">
            <h5 className="fw-bold mb-3"><i className="bi bi-clock-history"></i> Order History Log</h5>
            {orders.length === 0 ? (
              <p className="text-muted small m-0 py-2">No historical order configurations loaded on this profile record yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm table-hover align-middle small m-0">
                  <thead className="table-light">
                    <tr><th>ID</th><th>Date</th><th>Delivery Street</th><th>Total Paid</th></tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td className="fw-bold text-secondary">{order.id}</td>
                        <td>{order.date}</td>
                        <td className="text-truncate" style={{ maxWidth: '150px' }}>{order.deliveredTo}</td>
                        <td className="fw-bold text-success">${order.totalPaid.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;