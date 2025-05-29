import heroImage from './Assets/hero-image.avif';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MoleculeViewer from './MoleculeViewer';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section
      className="min-h-screen flex flex-col md:flex-row items-stretch bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden w-full relative"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* MoleculeViewer as background for entire hero section (z-10) */}
      <div className="absolute inset-0 w-full h-full z-10">
        <MoleculeViewer />
      </div>

      {/* Optional: Overlay for readability (z-0, pointer-events-none) */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/80 via-white/30 to-transparent pointer-events-none z-0" />

      {/* Left: Text Content (z-20) */}
      <div className="relative z-20 md:w-1/2 flex flex-col items-center justify-center px-8 py-20 space-y-8">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold text-blue-800 drop-shadow-lg text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Drug Interaction Visualizer
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-blue-700 font-medium max-w-fit justify-center text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Explore the effects and connections between medications in an intuitive and interactive way.
        </motion.p>        <motion.button
          onClick={() => {
            const token = localStorage.getItem('token');
            if (!token) {
              navigate('/login');
            } else {
              navigate('/visualizer');
            }
          }}
          className="mt-4 w-fit bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all text-lg"
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.97 }}
        >
          Get Started
        </motion.button>
      </div>

      {/* Right: Empty for layout only */}
      <div className="relative z-20 w-full md:w-1/2 min-h-[350px] flex items-center justify-center">
        {/* Optional: Overlay for right side */}
        <div className="absolute inset-0 bg-gradient-to-l from-blue-100/80 via-white/10 to-transparent md:rounded-l-[4rem] pointer-events-none" />
      </div>
    </section>
  );
};

export default HeroSection;
