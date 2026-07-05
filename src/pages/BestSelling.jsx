import { useEffect, useState } from 'react';
import Header from "../Components/Header";
import Footer from "../Components/Footer"

function BestSelling() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBestselling = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:3000/books/bestselling');

        if (!response.ok) {
          throw new Error(`Something went wrong: ${response.status}`);
        }

        const data = await response.json();
        setBooks(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBestselling();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading bestselling books...</p>;
  if (error) return <p className="text-center text-danger mt-5">Error: {error}</p>;
  if (books.length === 0) return <p className="text-center mt-5">No bestselling books found.</p>;

  return (
    <>
    <Header/>
      <main>
        <section className="my-4 mx-5">
          <h2 className="fw-bold mb-4">Bestselling Books</h2>
          {/* 1. Changed row-cols-md-3 to row-cols-auto and added justify-content-center */}
          <div className="row row-cols-auto g-4 justify-content-start mx-5">
            {books.map((book) => (
              <div className="col" key={book._id}>
                {/* 2. Added a max-width to the card so it matches standard book cover dimensions */}
                <div className="card h-100" style={{ overflow: 'hidden', width: '220px' }}>
                  <img
                    src={book.cover_image_url}
                    className="card-img-top"
                    alt={book.name}
                    /* 3. Changed height to auto so it keeps the true book aspect ratio */
                    style={{ height: 'auto', width: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/220x300?text=No+Cover';
                    }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fs-6 text-truncate" title={book.name}>{book.name}</h5>
                    <p className="card-text small text-muted text-truncate" title={book.author}>{book.author}</p>
                    <p className="card-text mb-2">
                      <span className="badge bg-secondary">{book.type}</span>
                    </p>
                    <p className="card-text small mb-2">⭐ {book.rating} &nbsp; ❤️ {book.likes.toLocaleString()}</p>
                    <p className="card-text fw-bold mb-3">${book.pricing}</p>
                    <button className="btn btn-primary btn-sm mt-auto">
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer/>
    </>
  );
}

export default BestSelling;