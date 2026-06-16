import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: '#08080F' }}>
      <div className="text-center px-6">
        <h1 className="mb-4 text-6xl font-playfair font-extrabold gold-gradient-text">404</h1>
        <p className="mb-6 text-lg text-white/50 font-inter">Oops! Page not found</p>
        <button onClick={() => navigate('/')} className="btn-gold-pill px-8 py-3 font-inter text-sm cursor-pointer">
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
