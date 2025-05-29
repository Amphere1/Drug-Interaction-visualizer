import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import drugsName from '../components/Assets/drugsNames.json';
import jsPDF from 'jspdf';

const DrugInfo = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const infoRef = useRef(null);

  React.useEffect(() => {
    if (query.length < 2) return setSuggestions([]);
    setSuggestions(
      drugsName.filter(name =>
        name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    );
  }, [query]);

  const fetchDrugInfo = async (name) => {
    setLoading(true);
    setError(null);
    setSelectedDrug(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://drug-interaction-visualizer-backend.onrender.com/api/drugs/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ drugName: name }),
      });
      if (!response.ok) throw new Error('Failed to fetch drug information.');
      const data = await response.json();
      setSelectedDrug(data);
    } catch (err) {
      setError('Unable to fetch drug information.');
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    const pdf = new jsPDF();
    let y = 10;
    pdf.setFontSize(18);
    pdf.text('Drug Information', 14, y);
    y += 10;
    pdf.setFontSize(12);

    fields.forEach(({ label, key }) => {
      const value = formatValue(selectedDrug[key]);
      const lines = pdf.splitTextToSize(`${label}: ${value}`, 180);
      pdf.text(lines, 14, y);
      y += lines.length * 7;
      if (y > 270) {
        pdf.addPage();
        y = 10;
      }
    });

    pdf.save(`${query || 'drug-info'}.pdf`);
  };

  const formatValue = (value) => Array.isArray(value) ? value.join(', ') : value || 'N/A';

  const fields = [
    { label: 'Generic Name', key: 'generic_name' },
    { label: 'Brand Name', key: 'brand_name' },
    { label: 'RXCUI', key: 'rxcui' },
    { label: 'Purpose', key: 'purpose' },
    { label: 'Dosage & Administration', key: 'dosage_and_administration' },
    { label: 'Indications & Usage', key: 'indications_and_usage' },
    { label: 'Active Ingredient', key: 'active_ingredient' },
    { label: 'Inactive Ingredient', key: 'inactive_ingredient' },
    { label: 'Storage & Handling', key: 'storage_and_handling' },
  ];

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-8 md:px-16 bg-gray-100">
      <motion.h1
        className="text-3xl md:text-5xl font-bold text-center text-purple-700 mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Drug Information
      </motion.h1>

      <div className="max-w-xl mx-auto relative">
        <form
          onSubmit={e => {
            e.preventDefault();
            if (query.trim()) {
              setSuggestions([]);
              fetchDrugInfo(query.trim());
            }
          }}
          autoComplete="off"
        >
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" />
              </svg>
            </span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search for a drug..."
              className="w-full pl-10 pr-14 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-500 hover:bg-purple-600 text-white rounded-full p-2 transition"
              aria-label="Search"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" />
              </svg>
            </button>
          </div>
          {suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border w-full shadow-md rounded-md mt-1 max-h-60 overflow-y-auto">
              {suggestions.map((item, idx) => (
                <li
                  key={idx}
                  className="px-4 py-2 hover:bg-purple-100 cursor-pointer"
                  onClick={() => {
                    setQuery(item);
                    setSuggestions([]);
                    fetchDrugInfo(item);
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </form>
      </div>

      {loading && <p className="text-center mt-6 text-purple-600">Loading...</p>}
      {error && <p className="text-center mt-6 text-red-500">{error}</p>}

      {selectedDrug && (
        <motion.div
          ref={infoRef}
          className="max-w-3xl mx-auto mt-10 bg-white rounded-xl shadow-md p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-purple-700">
              {selectedDrug.brand_name?.[0] || selectedDrug.generic_name?.[0] || "Drug Info"}
            </h2>
            <button
              onClick={exportPDF}
              className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Export PDF
            </button>
          </div>
          <div className="space-y-4">
            {fields.map(({ label, key }) => (
              <div key={key} className="bg-gray-50 p-4 rounded-lg border shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-1">{label}</h3>
                <p className="text-sm text-gray-700">{formatValue(selectedDrug[key])}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DrugInfo;
