

const Footer = () => {
  return (
    <footer className="bg-blue-800 text-white py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="text-center md:text-left">
          <h4 className="text-lg font-semibold">DrugViz</h4>
          <p className="text-sm text-gray-200">Empowering safe medication use through visualization.</p>
        </div>

        <div className="flex space-x-6">
          <a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Use</a>
          <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
        </div>

        <div className="text-sm text-gray-300 text-center md:text-right">
          © {new Date().getFullYear()} DrugViz. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
