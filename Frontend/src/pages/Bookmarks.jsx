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

  return (
    <div className="max-w-3xl mx-auto pt-24">
      <h2 className="text-2xl font-bold mb-4">Your Bookmarks</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
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

          return (
            <li key={bm._id} className="mb-4 p-4 bg-white rounded shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="font-semibold text-blue-700">
                    Drugs: {uniqueDrugs.length > 0 ? uniqueDrugs.join(', ') : 'N/A'}
                    ....
                  </div>
                  <div className="flex gap-4 mt-2">
                    {['highRisk', 'moderateRisk', 'lowRisk'].map(risk => (
                      <span key={risk} className={`font-medium ${riskColors[risk]}`}>
                        {riskLabels[risk]}: {interactions[risk]?.length || 0}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 rounded bg-purple-500 text-white font-semibold hover:bg-purple-600 transition"
                    onClick={() => setExpanded(expanded === bm._id ? null : bm._id)}
                  >
                    {expanded === bm._id ? 'Hide Details' : 'View Details'}
                  </button>
                  <button
                    className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                    onClick={() => handleDelete(bm._id)}
                    disabled={deleting === bm._id}
                  >
                    {deleting === bm._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
              {expanded === bm._id && (
                <div className="mt-4 border-t pt-4">
                  {['highRisk', 'moderateRisk', 'lowRisk'].map(risk => (
                    <div key={risk} className="mb-4">
                      <h4 className={`font-bold ${riskColors[risk]} mb-2`}>
                        {riskLabels[risk]} Interactions
                      </h4>
                      {interactions[risk]?.length ? (
                        <ul className="list-disc ml-6 space-y-1">
                          {interactions[risk].map((item, i) => (
                            <li key={i}>
                              <strong>{item.drug1}</strong> + <strong>{item.drug2}</strong>: {item.reason}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400 text-sm">None</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Bookmarks;