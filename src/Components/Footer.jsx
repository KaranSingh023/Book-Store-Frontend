
const Footer = () => {
  return (
    <footer className="bg-dark text-light py-3 mt-auto">
      <div className="container text-center">
        <small>
          &copy; {new Date().getFullYear()} A to Z BookStore. All rights reserved.
        </small>
      </div>
    </footer>
  );
};
 
export default Footer;