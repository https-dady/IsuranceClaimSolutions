import { useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/layout/ScrollToTop";

function AppContent() {
  const location = useLocation();

  // Check if current page is an admin page
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />

      {/* Normal Website Navbar */}
      {!isAdminPage && <Navbar />}

      {/* Page Routes */}
      <main className="flex-1">
      
        <AppRoutes />
      </main>

      {/* Normal Website Footer */}
      {!isAdminPage && <Footer />}
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;