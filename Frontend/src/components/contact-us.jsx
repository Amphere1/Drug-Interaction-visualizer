
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', form);
    alert('Thank you for your message!');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <section className="bg-white py-20 px-6 md:px-16" id="contact">
      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl font-bold text-blue-800 mb-6 text-center">Contact Us</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              name="message"
              rows="4"
              value={form.message}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <motion.button
            type="submit"
            className="bg-blue-700 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-800 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Submit
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
};

export default ContactUs;
