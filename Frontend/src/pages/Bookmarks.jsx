import React, { useEffect, useState } from 'react';

const riskColors = {
  highRisk: 'text-red-600',
  moderateRisk: 'text-yellow-600',
  lowRisk: 'text-green-600',
};

const riskLabels = {
  highRisk: 'High Risk',
  moderateRisk: 'Moderate Risk',
  lowRisk: 'Low Risk',
};

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://drug-interaction-visualizer-backend.onrender.com/api/bookmarks', {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || data.error || 'Failed to fetch bookmarks');
        setBookmarks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bookmark?')) return;
    setDeleting(id);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://drug-interaction-visualizer-backend.onrender.com/api/bookmarks/${id}`,
        {
          method: 'DELETE',
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'Failed to delete bookmark');
      setBookmarks((prev) => prev.filter((bm) => bm._id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(null);
    }
  };

  return (    <div className="max-w-3xl mx-auto pt-24 px-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Your Bookmarks</h2>
      {loading && <p className="text-center text-blue-600">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && bookmarks.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg mb-2">No bookmarks found</div>
          <p className="text-gray-400">Your saved drug interactions will appear here</p>
        </div>
      )}
      <ul>
        {bookmarks.map((bm, idx) => {
          const interactions = bm.interactions || {};
          // Collect all drug1 and drug2 from all risks
          const allDrugs = ['highRisk']
            .flatMap(risk =>
              (interactions[risk] || []).flatMap(item => [item.drug1, item.drug2])
            )
            .filter(Boolean);
          const uniqueDrugs = [...new Set(allDrugs)];

          return (            <li key={bm._id} className="mb-6">
              <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-block w-2 h-2 rounded-full bg-blue-600"></span>
                        <h3 className="text-lg font-semibold text-blue-700">
                          Saved Interaction Analysis
                        </h3>
                      </div>
                      <div className="text-gray-700 font-medium">
                        Drugs: {uniqueDrugs.length > 0 ? uniqueDrugs.join(', ') : 'N/A'}
                      </div>
                      <div className="flex flex-wrap gap-3 mt-3">
                        {['highRisk', 'moderateRisk', 'lowRisk'].map(risk => (
                          <span 
                            key={risk} 
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              risk === 'highRisk' ? 'bg-red-100 text-red-700' :
                              risk === 'moderateRisk' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}
                          >
                            {riskLabels[risk]}: {interactions[risk]?.length || 0}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                        onClick={() => setExpanded(expanded === bm._id ? null : bm._id)}
                      >
                        {expanded === bm._id ? (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                            Hide Details
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                            View Details
                          </>
                        )}
                      </button>
                      <button
                        className="px-4 py-2 rounded-lg text-red-600 font-medium hover:bg-red-50 border border-red-200 transition-colors duration-200 flex items-center gap-2"
                        onClick={() => handleDelete(bm._id)}
                        disabled={deleting === bm._id}
                      >
                        {deleting === bm._id ? (
                          <>
                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                {expanded === bm._id && (
                  <div className="border-t border-blue-100">
                    {['highRisk', 'moderateRisk', 'lowRisk'].map(risk => (
                      interactions[risk]?.length > 0 && (
                        <div key={risk} className={`p-6 ${
                          risk === 'highRisk' ? 'bg-red-50' :
                          risk === 'moderateRisk' ? 'bg-yellow-50' :
                          'bg-green-50'
                        }`}>
                          <div className="flex items-center gap-2 mb-4">
                            <span className={`inline-block w-2 h-2 rounded-full ${
                              risk === 'highRisk' ? 'bg-red-600' :
                              risk === 'moderateRisk' ? 'bg-yellow-600' :
                              'bg-green-600'
                            }`}></span>
                            <h4 className={`font-semibold ${riskColors[risk]}`}>
                              {riskLabels[risk]} Interactions
                            </h4>
                          </div>
                          <div className="space-y-3">
                            {interactions[risk].map((item, i) => (
                              <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="font-medium mb-2">
                                  {item.drug1} + {item.drug2}
                                </div>
                                <div className="text-gray-600 text-sm">
                                  {item.reason}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Bookmarks;