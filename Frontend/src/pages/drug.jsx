// Visualizer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';
import jsPDF from 'jspdf';
import drugsName from '../components/Assets/drugsNames.json';

const COLORS = ['#ef4444', '#facc15', '#22c55e'];

const Visualizer = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('bar');
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [bookmarkError, setBookmarkError] = useState('');
  const [bookmarkSuccess, setBookmarkSuccess] = useState(false);

  const inputRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const lastPart = query.split(',').pop().trim();
    if (!lastPart) {
      setSuggestions([]);
      return;
    }
    setSuggestions(
      drugsName.filter(name =>
        name.toLowerCase().includes(lastPart.toLowerCase())
      ).slice(0, 8)
    );
  }, [query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const drugName = query.split(',').map(d => d.trim()).filter(Boolean);
      const response = await fetch('https://drug-interaction-visualizer-backend.onrender.com/api/drugs/interaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ drugName })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'Something went wrong');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (name) => {
    const parts = query.split(',');
    parts[parts.length - 1] = name;
    setQuery(parts.join(', '));
    setSuggestions([]);
    inputRef.current.focus();
  };

  const handleExport = () => {
    if (!chartRef.current) return;
    htmlToImage.toPng(chartRef.current).then(dataUrl => {
      download(dataUrl, 'drug-interaction-chart.png');
    }).catch(err => {
      console.error('Export failed:', err);
    });
  };

  const handleExportPDF = () => {
    if (!chartRef.current) return;
    htmlToImage.toPng(chartRef.current).then(dataUrl => {
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('drug-interaction-chart.pdf');
    });
  };

  const getChartData = () => {
    if (!result?.interactions) return [];
    return [
      { name: 'High Risk', count: result.interactions.highRisk?.length || 0, fill: '#ef4444' },
      { name: 'Moderate Risk', count: result.interactions.moderateRisk?.length || 0, fill: '#facc15' },
      { name: 'Low Risk', count: result.interactions.lowRisk?.length || 0, fill: '#22c55e' }
    ];
  };

  const renderChart = () => {
    const data = getChartData();
    if (chartType === 'pie') {
      return (
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    }
  };

  const handleBookmark = async () => {
    setBookmarkLoading(true);
    setBookmarkError('');
    setBookmarkSuccess(false);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://drug-interaction-visualizer-backend.onrender.com/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ interactions: result.interactions }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'Failed to save bookmark');
      setBookmarkSuccess(true);
    } catch (err) {
      setBookmarkError(err.message);
    } finally {
      setBookmarkLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full pt-24 px-4 sm:px-8 bg-blue-50 flex flex-col items-center">
      <motion.h1
        className="text-3xl md:text-5xl font-bold text-center text-blue-700 mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Drug Interaction Visualizer
      </motion.h1>

      <div className="flex-1 w-full flex flex-col items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl bg-white border border-blue-200 px-4 py-6 rounded-2xl shadow-lg flex flex-col items-center"
          autoComplete="off"
        >
          <div className="relative w-full">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full px-5 py-4 border border-blue-300 rounded-full bg-blue-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-lg shadow transition"
              placeholder="Search for a drug..."
              autoFocus
            />
            {suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 mt-2 bg-white border border-blue-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                {suggestions.map((name) => (
                  <li
                    key={name}
                    className="px-5 py-3 cursor-pointer hover:bg-blue-100 transition"
                    onClick={() => handleSuggestionClick(name)}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !query}
            className="mt-6 px-8 py-4 rounded-full bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      <div className="max-w-3xl mx-auto w-full mt-10">
        {error && (
          <div className="mb-6 text-red-600 text-center">
            Error: {error}
          </div>
        )}

        {result && result.interactions && (
          <motion.div
            className="bg-white rounded-xl shadow-md p-6 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-blue-700 mb-6">Interaction Details</h2>

            <div className="w-full h-72 mb-6" ref={chartRef}>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <button
                    className={`px-4 py-1 text-sm rounded-full mr-2 ${chartType === 'bar' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setChartType('bar')}
                  >
                    Bar
                  </button>
                  <button
                    className={`px-4 py-1 text-sm rounded-full ${chartType === 'pie' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setChartType('pie')}
                  >
                    Pie
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-4 py-1 text-sm rounded bg-green-600 text-white hover:bg-green-700"
                    onClick={handleExport}
                  >
                    Export PNG
                  </button>
                  <button
                    className="px-4 py-1 text-sm rounded bg-purple-600 text-white hover:bg-purple-700"
                    onClick={handleExportPDF}
                  >
                    Export PDF
                  </button>
                </div>
              </div>
              {renderChart()}
            </div>

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-blue-700">
                Interaction Summary
              </h3>
              <button
                onClick={handleBookmark}
                className={`px-4 py-2 text-sm rounded-full transition-all flex items-center gap-2 ${
                  bookmarkLoading
                    ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                    : bookmarkSuccess
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                disabled={bookmarkLoading}
              >
                {bookmarkLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M14.243 4.757a9 9 0 10-12.486 12.486A7.963 7.963 0 012 12a9.001 9.001 0 0114.243-7.243l1.414-1.414z"
                    />
                  </svg>
                ) : bookmarkSuccess ? (
                  <svg
                    className="h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : null}
                {bookmarkSuccess
                  ? 'Bookmarked!'
                  : 'Bookmark This Interaction'}
              </button>
            </div>            <div className="space-y-6 mt-6">
              {['highRisk', 'moderateRisk', 'lowRisk'].map((risk) => (
                result.interactions[risk]?.length > 0 && (
                  <div key={risk} className={`w-full rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl ${
                    risk === 'highRisk' ? 'bg-red-50 border border-red-200' :
                    risk === 'moderateRisk' ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-green-50 border border-green-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`inline-block w-3 h-3 rounded-full ${
                        risk === 'highRisk' ? 'bg-red-600' :
                        risk === 'moderateRisk' ? 'bg-yellow-400' :
                        'bg-green-500'
                      }`} />
                      <h3 className={`text-lg font-bold ${
                        risk === 'highRisk' ? 'text-red-600' :
                        risk === 'moderateRisk' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {risk.replace('Risk', ' Risk')} Interactions
                      </h3>
                    </div>
                    <div className={`space-y-3 ${
                      risk === 'highRisk' ? 'text-red-700' :
                      risk === 'moderateRisk' ? 'text-yellow-700' :
                      'text-green-700'
                    }`}>
                      {result.interactions[risk].map((item, idx) => (
                        <div key={idx} className="p-3 bg-white rounded-lg shadow-sm">
                          <div className="font-semibold mb-1">
                            {item.drug1} + {item.drug2}
                          </div>
                          <div className="text-sm opacity-90">
                            {item.reason}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Visualizer;
