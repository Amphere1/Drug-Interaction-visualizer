
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: 'What is DrugViz?',
    answer:
      'DrugViz is a web application designed to visualize interactions between different medications in an interactive format.',
  },
  {
    question: 'Where does the data come from?',
    answer:
      'The interaction data is sourced from trusted databases like OpenFDA and DrugBank.',
  },
  {
    question: 'Is this tool meant for medical professionals?',
    answer:
      'While it can assist professionals, DrugViz is designed to be user-friendly and informative for anyone interested in learning about drug interactions.',
  },
  {
    question: 'Is my data private?',
    answer:
      'Yes. We do not store or track any user-inputted drug data on our servers.',
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section className="bg-gray-50 py-20 px-6 md:px-16" id="faq">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-blue-800 mb-10">Frequently Asked Questions</h2>
        <div className="space-y-6 text-left">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl p-6 cursor-pointer border border-gray-200"
              onClick={() => toggleFAQ(index)}
            >
              <motion.h3
                className="text-lg font-semibold text-blue-700"
                whileHover={{ scale: 1.02 }}
              >
                {faq.question}
              </motion.h3>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.p
                    className="text-gray-700 mt-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;