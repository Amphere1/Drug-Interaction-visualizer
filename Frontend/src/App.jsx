import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import FAQ from "./components/faq";
import Footer from "./components/footer";
import HeroSection from "./components/hero-page";
import Navbar from "./components/navbar";
import Login from './pages/login';
import SignUp from "./pages/sign-up";
import ContactUs from "./components/contact-us";
import AboutUs from "./components/about-us";
import Visualizer from "./pages/drug";
import DrugInfo from './pages/info';
import Bookmarks from './pages/Bookmarks';

function App() {
  return (
    <Router>
    <div className="app">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }} 
      />
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <AboutUs/>
              <FAQ />
              <ContactUs />
            </>
            }
        />
        <Route path="/hero" element={<HeroSection />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />        <Route path="/visualizer" element={
          <ProtectedRoute>
            <Visualizer />
          </ProtectedRoute>
        } />
        <Route path="/drugs" element={
          <ProtectedRoute>
            <DrugInfo />
          </ProtectedRoute>
        } />
        <Route path="/bookmark" element={
          <ProtectedRoute>
            <Bookmarks />
          </ProtectedRoute>
        } />
      </Routes>
      <Footer />
    </div>
    </Router>
  );
}

export default App;

