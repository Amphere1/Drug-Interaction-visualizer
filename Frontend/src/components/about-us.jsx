
import { motion } from 'framer-motion';

const AboutUs = () => {
  return (
    <section className="bg-white py-20 px-6 md:px-16" id="about">
      <motion.div
        className="max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl font-bold text-blue-800 mb-6">About Us</h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          At DrugViz, our mission is to empower users with the tools to understand how medications interact with each other.
          Whether you're a healthcare provider, a pharmacist, or a curious patient, our platform helps you visualize drug interactions
          in a clear and accessible format. We aim to make pharmacological data easier to interpret and use responsibly.
        </p>
        <p className="text-gray-600 mt-4 text-base">
          Built with a focus on usability, transparency, and education, DrugViz is powered by trusted medical databases
          and intuitive design principles. Join us on our mission to make medical insights more interactive.
        </p>
      </motion.div>
    </section>
  );
};

export default AboutUs;
