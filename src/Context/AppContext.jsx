import { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('az_bookstore_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Failed to parse cart from localStorage:', error);
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem('az_bookstore_wishlist');
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) {
      console.error('Failed to parse wishlist from localStorage:', error);
      return [];
    }
  });

  const [addresses, setAddresses] = useState(() => {
    try {
      const savedAddresses = localStorage.getItem('az_bookstore_addresses');
      return savedAddresses
        ? JSON.parse(savedAddresses)
        : [
            {
              id: 1,
              name: 'Default User',
              street: '123 Main Street',
              city: 'Ludhiana',
              zip: '141001',
              phone: '9876543210',
              isDefault: true
            }
          ];
    } catch (error) {
      console.error('Failed to parse addresses from localStorage:', error);
      return [];
    }
  });

  // Restored: order history state (was missing, caused UserProfile to crash)
  const [orders, setOrders] = useState(() => {
    try {
      const savedOrders = localStorage.getItem('az_bookstore_orders');
      return savedOrders ? JSON.parse(savedOrders) : [];
    } catch (error) {
      console.error('Failed to parse orders from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('az_bookstore_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('az_bookstore_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('az_bookstore_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('az_bookstore_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    const fetchCatalogBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://book-backend-ochre.vercel.app/books');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setBooks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load catalog data:', error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogBooks();
  }, []);

  const addToCart = (book) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item._id === book._id);

      if (existingIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity += 1;
        return updatedCart;
      }

      return [...prevCart, { ...book, quantity: 1 }];
    });
  };

  const removeFromCart = (bookId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== bookId));
  };

  const updateCartQuantity = (bookId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item._id === bookId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const addToWishlist = (book) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.some((item) => item._id === book._id)) {
        return prevWishlist;
      }
      return [...prevWishlist, book];
    });
  };

  const removeFromWishlist = (bookId) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => item._id !== bookId)
    );
  };

  const moveCartToWishlist = (book) => {
    addToWishlist(book);
    removeFromCart(book._id);
  };

  // Restored: reverse direction, used by Wishlist.jsx's "Move to Cart" button
  const moveWishlistToCart = (book) => {
    addToCart(book);
    removeFromWishlist(book._id);
  };

  // Restored: address CRUD helpers used by UserProfile.jsx
  const addAddress = (addr) => {
    setAddresses((prev) => [
      ...prev,
      { ...addr, id: Date.now(), isDefault: prev.length === 0 }
    ]);
  };

  const deleteAddress = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  // New: update an existing address in place, keeping its id and isDefault status
  const updateAddress = (id, updatedFields) => {
    setAddresses((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updatedFields } : a))
    );
  };

  const selectDefaultAddress = (id) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const placeOrder = (orderDetails) => {
    // Restored: actually push the order into history instead of only alerting
    setOrders((prev) => [
      {
        ...orderDetails,
        id: `ORD-${Date.now()}`,
        date: new Date().toLocaleDateString()
      },
      ...prev
    ]);
    setCart([]);
  };

  return (
    <AppContext.Provider
      value={{
        books,
        loading,
        searchQuery,
        setSearchQuery,
        cart,
        wishlist,
        addresses,
        setAddresses,
        addAddress,
        deleteAddress,
        updateAddress,
        selectDefaultAddress,
        orders,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        addToWishlist,
        removeFromWishlist,
        moveCartToWishlist,
        moveWishlistToCart,
        placeOrder
      }}
    >
      {children}
    </AppContext.Provider>
  );
};