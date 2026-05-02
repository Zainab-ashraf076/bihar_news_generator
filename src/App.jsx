import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { formatDateDisplay, fetchArticle } from './utils/extractor';
import PDFTemplate from './components/PDFTemplate';
import { Link } from 'react-router-dom';

const PARTY_LOGOS = {
  'jan-suraaj': new URL('/logo.png', window.location.origin).href,
  'bjp': new URL('/bjp.jpeg', window.location.origin).href,
  'jdu': new URL('/jdu.jpeg', window.location.origin).href,
  'rjd': new URL('/rjd.jpeg', window.location.origin).href,
  'congress': new URL('/congress.jpeg', window.location.origin).href,
  'other': 'https://cdn-icons-png.flaticon.com/512/2991/2991279.png'
};

const SECTION_LOGOS = {
  'national': new URL('/national.jpeg', window.location.origin).href,
  'international': new URL('/international.jpeg', window.location.origin).href,
  'opinion': new URL('/opinion.jpeg', window.location.origin).href,
  'civic': new URL('/civic.jpeg', window.location.origin).href,
};

const TRENDING_TWEETS = [
  { id: 1, user: '@JanSuraajAbhiyan', text: 'Bihar is ready for a change! The Padyatra is reaching new heights. #BiharRising #JanSuraaj', time: '12m ago' },
  { id: 2, user: '@PrashantKishor', text: 'Education and employment are not just promises, they are rights. Let us build a new Bihar together. #NayaBihar', time: '45m ago' },
  { id: 3, user: '@BiharPolitics', text: 'Rumors of alliance shifts are intensifying as the elections approach. Who will hold the key? #Bihar2026', time: '1h ago' },
  { id: 4, user: '@KisanSamridhi', text: 'New subsidies for agricultural tech announced. A big win for Bihar farmers! 🚜 #Agriculture #FarmNews', time: '2h ago' },
  { id: 5, user: '@PatnaDaily', text: 'Traffic alerts for Gandhi Maidan tomorrow due to state-wide rally. Plan your commute accordingly. #PatnaTraffic', time: '3h ago' }
];

const SECTION_META = {
  headlines: { emoji: '🗞️', label: 'Top Headlines', accent: '#fbbf24', note: 'News of the Day section' },
  political: { emoji: '⚖️', label: 'Political Landscape', accent: '#fcd34d', note: 'Include party logos' },
  civic: { emoji: '🤝', label: 'Civic & Social', accent: '#fbbf24', note: 'Community & Social reform' },
  opinion: { emoji: '💡', label: 'Editorial & Opinion', accent: '#fcd34d', note: 'Voice of Bihar' },
  national: { emoji: '🇮🇳', label: 'National Desk', accent: '#fde68a', note: 'Indian news landscape' },
  international: { emoji: '🌍', label: 'International', accent: '#fbbf24', note: 'Global pulse & reports' },
};

function App() {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Persistence logic
  const [articles, setArticles] = useState(() => {
    const saved = localStorage.getItem('bihar-scan-articles');
    return saved ? JSON.parse(saved) : [];
  });
  const [tweets, setTweets] = useState(() => {
    const saved = localStorage.getItem('bihar-scan-tweets');
    return saved ? JSON.parse(saved) : TRENDING_TWEETS;
  });
  const [headingOffsets, setHeadingOffsets] = useState(() => {
    const saved = localStorage.getItem('bihar-scan-heading-offsets');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('bihar-scan-articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('bihar-scan-tweets', JSON.stringify(tweets));
  }, [tweets]);

  useEffect(() => {
    localStorage.setItem('bihar-scan-heading-offsets', JSON.stringify(headingOffsets));
  }, [headingOffsets]);

  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear all data?')) {
      setArticles([]);
      setTweets(TRENDING_TWEETS);
      setHeadingOffsets({});
      localStorage.removeItem('bihar-scan-articles');
      localStorage.removeItem('bihar-scan-tweets');
      localStorage.removeItem('bihar-scan-heading-offsets');
    }
  };
  const [isGenerating, setIsGenerating] = useState(false);
  const [fetchingIds, setFetchingIds] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const pdfRef = useRef(null);

  const addArticle = (category) => {
    setArticles(prev => [...prev, {
      id: Date.now(),
      category: category || 'headlines',
      headline: category === 'customText' ? 'Edit this text' : '',
      summary: '',
      url: '',
      image: '',
      party: category === 'political' ? 'jan-suraaj' : '',
      xOffset: 0,
      yOffset: 0,
      isCustomText: category === 'customText'
    }]);
  };

  const updateArticle = (id, key, val) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, [key]: val } : a));
  };

  const moveArticle = (id, direction) => {
    setArticles(prev => {
      const idx = prev.findIndex(a => a.id === id);
      if (idx === -1) return prev;
      const newArticles = [...prev];
      const category = newArticles[idx].category;
      
      let swapIdx = -1;
      if (direction === 'up') {
        for (let i = idx - 1; i >= 0; i--) {
          if (newArticles[i].category === category) {
            swapIdx = i;
            break;
          }
        }
      } else {
        for (let i = idx + 1; i < newArticles.length; i++) {
          if (newArticles[i].category === category) {
            swapIdx = i;
            break;
          }
        }
      }

      if (swapIdx !== -1) {
        [newArticles[idx], newArticles[swapIdx]] = [newArticles[swapIdx], newArticles[idx]];
      }
      return newArticles;
    });
  };

  const setOffset = (id, x, y, isTweet = false, isHeading = false) => {
    if (isHeading) {
      setHeadingOffsets(prev => ({ ...prev, [id]: { x, y } }));
    } else if (isTweet) {
      setTweets(prev => prev.map(t => t.id === id ? { ...t, xOffset: x, yOffset: y } : t));
    } else {
      setArticles(prev => prev.map(a => a.id === id ? { ...a, xOffset: x, yOffset: y } : a));
    }
  };

  const adjustYOffset = (id, amount, isTweet = false, isHeading = false) => {
    if (isHeading) {
      setHeadingOffsets(prev => {
        const cur = prev[id] || { x: 0, y: 0 };
        return { ...prev, [id]: { ...cur, y: cur.y + amount } };
      });
    } else if (isTweet) {
      setTweets(prev => prev.map(t => t.id === id ? { ...t, yOffset: (t.yOffset || 0) + amount } : t));
    } else {
      setArticles(prev => prev.map(a => a.id === id ? { ...a, yOffset: (a.yOffset || 0) + amount } : a));
    }
  };

  const removeArticle = (id) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  const handleFetchLink = async (id, url) => {
    if (!url) return;
    setFetchingIds(prev => [...prev, id]);
    try {
      const data = await fetchArticle(url);
      setArticles(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
    } catch (err) {
      console.error('Fetch Error:', err);
    }
    setFetchingIds(prev => prev.filter(fid => fid !== id));
  };

  const updateTweetField = (id, key, val) => {
    setTweets(prev => prev.map(t => t.id === id ? { ...t, [key]: val } : t));
  };

  const addTweet = () => {
    setTweets(prev => [...prev, { id: Date.now(), user: '@UserHandle', text: '', time: 'Now', xOffset: 0, yOffset: 0 }]);
  };

  const removeTweet = (id) => {
    setTweets(prev => prev.filter(t => t.id !== id));
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 1000));

    const element = pdfRef.current;
    const filename = `Bihar_Media_Scan_${date}.pdf`;

    const opt = {
      margin: 0,
      filename: filename,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF Error:', err);
      alert('Error generating PDF.');
    }
    setIsGenerating(false);
  };

  const renderSection = (category) => {
    const { emoji, label, accent, note } = SECTION_META[category];
    const filtered = articles.filter(a => a.category === category);
    return (
      <div key={category} className="section-builder">
        <div className="builder-header">
          <div className="sec-accent-bar" style={{ background: accent }} />
          <h3>{emoji} {label}</h3>
          <span className="sec-count">{filtered.length} article{filtered.length !== 1 ? 's' : ''} · {note}</span>
          <button className="btn-add" onClick={() => addArticle(category)}>+ Add Story</button>
        </div>
        <div className="builder-grid">
          {filtered.length === 0 && (
            <div className="empty-state">No stories in this section. Click "+ Add Story" to create a new one.</div>
          )}
          {filtered.map(art => (
            <div key={art.id} className="edit-card">
              <div className="card-top">
                {category === 'political' && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.8rem', width: '100%' }}>
                    <div style={{ position: 'relative' }}>
                      <img
                        src={art.customLogo || PARTY_LOGOS[art.party]}
                        alt={art.party}
                        crossOrigin="anonymous"
                        style={{ width: 55, height: 55, objectFit: 'contain' }}
                      />
                    </div>
                    <select
                      value={art.party}
                      onChange={(e) => updateArticle(art.id, 'party', e.target.value)}
                      className="party-select"
                      style={{ flex: 1, minWidth: '120px' }}
                    >
                      <option value="jan-suraaj">Jan Suraaj</option>
                      <option value="bjp">BJP</option>
                      <option value="jdu">JDU</option>
                      <option value="rjd">RJD</option>
                      <option value="congress">Congress</option>
                      <option value="other">Other Party</option>
                    </select>
                  </div>
                )}
                {['civic', 'national', 'international', 'opinion'].includes(category) && (
                  <div>
                    <img
                      src={SECTION_LOGOS[category]}
                      alt={category}
                      crossOrigin="anonymous"
                      style={{ width: 70, height: 70, objectFit: 'contain' }}
                    />
                  </div>
                )}
                {!['political', 'civic', 'national', 'international', 'opinion'].includes(category) && <div />}
                <button className="btn-del" onClick={() => removeArticle(art.id)} title="Delete">×</button>
              </div>

              <div className="input-with-action">
                <div className="input-group" style={{ flex: 1 }}>
                  <label>Scan Source (URL)</label>
                  <input
                    placeholder="Paste link..." congressjdu
                    value={art.url}
                    onChange={(e) => updateArticle(art.id, 'url', e.target.value)}
                  />
                </div>
                <button
                  className={`btn-scan ${fetchingIds.includes(art.id) ? 'scanning' : ''}`}
                  onClick={() => handleFetchLink(art.id, art.url)}
                  disabled={!art.url || fetchingIds.includes(art.id)}
                >
                  {fetchingIds.includes(art.id) ? '⌛ Working...' : '🔍 Scan'}
                </button>
              </div>

              <div className="image-preview-group">
                <div className="input-group" style={{ flex: 1 }}>
                  <label>Featured Image</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      placeholder="https://..."
                      value={art.image || ''}
                      onChange={(e) => updateArticle(art.id, 'image', e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <label className="file-upload-label">
                      📁
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              updateArticle(art.id, 'image', evt.target?.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
                {art.image && (
                  <div className="img-preview" style={{ backgroundImage: `url(${art.image})` }} />
                )}
              </div>

              <div className="input-group">
                <label>Headline</label>
                <input
                  placeholder="Enter headline..."
                  value={art.headline}
                  onChange={(e) => updateArticle(art.id, 'headline', e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Summary Content</label>
                <textarea
                  placeholder="Summarize the core story..."
                  value={art.summary}
                  onChange={(e) => updateArticle(art.id, 'summary', e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      {isGenerating && (
        <div className="loader">
          <div className="loader-box" />
          <p>Drafting Edition…</p>
        </div>
      )}

      <header className="app-header">
        <div className="brand">
          <span className="edition">Bihar Edition · Professional Scan</span>
          <h1>Bihar Media <span>Scan</span></h1>
        </div>
        <div className="header-actions">
          <div className="date-input">
            <label>Edition Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <button className="btn-secondary" onClick={clearAll} style={{ marginRight: '10px', background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
            🗑️ Clear All
          </button>
          <button className="btn-secondary" onClick={() => navigate('/js')} style={{ marginRight: '10px', background: '#fbbf24', color: '#1c1917', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Jan Suraaj Edition →
          </button>
          <button className="btn-secondary" onClick={() => setShowPreview(true)} style={{ marginRight: '10px', background: '#334155', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
            👁️ Live Preview
          </button>
          <button className="btn-primary" onClick={handleGeneratePDF}>
            ⚡ Publish PDF
          </button>
        </div>
      </header>

      {showPreview && (
        <div className="preview-overlay">
          <div className="preview-modal">
            <header className="preview-header">
              <h2>Media Scan Interactive Preview</h2>
              <div className="preview-actions">
                <button className="btn-add" onClick={() => addArticle('customText')} style={{ border: '1px solid #fbbf24', color: '#fbbf24' }}>+ Add Simple Text</button>
                <button className="btn-add" onClick={() => setArticles(prev => [...prev, { id: Date.now(), isPageBreak: true, category: 'political' }])} style={{ border: '1px solid #10b981', color: '#10b981' }}>+ Add New Page</button>
                <button className="btn-secondary" onClick={() => setShowPreview(false)} style={{ background: '#475569', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Close</button>
                <button className="btn-primary" onClick={() => { handleGeneratePDF(); setShowPreview(false); }}>Download PDF</button>
              </div>
            </header>
            <div className="preview-body">
              <div className="preview-instructions">
                <p>💡 <strong>Canvas Mode:</strong> Reorder news items using arrows or fine-tune vertical spacing with +/- controls.</p>
              </div>
              <div className="template-container">
                 <div className="interactive-template">
                    <PDFTemplate 
                      date={date} 
                      articles={articles} 
                      tweets={tweets} 
                      interactive={true}
                      onMoveArticle={moveArticle}
                      onAdjustY={adjustYOffset}
                      onSetOffset={setOffset}
                      onUpdateArticle={updateArticle}
                      onRemoveArticle={removeArticle}
                      onUpdateTweetField={updateTweetField}
                      onRemoveTweet={removeTweet}
                      headingOffsets={headingOffsets}
                    />
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="hero-strip">
        <div className="hs-tag">Amber Edition</div>
        <div className="hs-line" />
        <span className="hs-text">Dedicated to Truth and Progress in Bihar</span>
        <div className="hs-line" />
        <div className="hs-tag">Professional</div>
      </div>

      <div className="app-main-layout">
        <main className="builder-main">
          {['headlines', 'political', 'civic', 'opinion', 'national', 'international'].map(renderSection)}
        </main>

        <aside className="trending-sidebar">
          <div className="sidebar-header">
            <div className="trending-dot" />
            <h4>Trends Manager</h4>
            <button className="btn-add" onClick={addTweet}>+ Add Trend</button>
          </div>
          <div className="tweets-list">
            {tweets.map(tweet => (
              <div key={tweet.id} className="tweet-card-editor" style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '12px', marginBottom: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>Handle</label>
                    <input
                      value={tweet.user}
                      onChange={(e) => updateTweetField(tweet.id, 'user', e.target.value)}
                      style={{ background: '#1e293b', border: '1px solid #334155', color: '#fbbf24', fontSize: '11px', fontWeight: '800', width: '100%', padding: '6px 8px', borderRadius: '6px', outline: 'none' }}
                    />
                  </div>
                  <button onClick={() => removeTweet(tweet.id)} style={{ alignSelf: 'flex-end', background: '#450a0a', border: '1px solid #991b1b', color: '#f87171', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                </div>
                <div>
                  <label style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>Trend Content</label>
                  <textarea
                    value={tweet.text}
                    onChange={(e) => updateTweetField(tweet.id, 'text', e.target.value)}
                    style={{ background: '#020617', border: '1px solid #334155', color: '#f8fafc', fontSize: '12px', width: '100%', borderRadius: '6px', padding: '10px', minHeight: '60px', outline: 'none', lineHeight: '1.4' }}
                    placeholder="Enter trend details here..."
                  />
                </div>
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <label className="file-upload-label" style={{ padding: '6px 12px', fontSize: '11px', flex: 1 }}>
                      + Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              updateTweetField(tweet.id, 'image', evt.target?.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  {tweet.image && <div style={{ marginTop: '8px', width: '100%', height: 60, backgroundImage: `url(${tweet.image})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '6px', border: '1px solid #334155' }} />}
                </div>
              </div>
            ))}
          </div>
          <div className="sidebar-footer">
            <span>Bihar Media Tech Engine 2.0</span>
          </div>
        </aside>
      </div>

      <footer className="page-footer">
        <span>© 2026 Jan Suraaj Media Division</span>
      </footer>

      <div style={{ visibility: 'hidden', position: 'absolute', top: '-9999px', left: 0 }}>
        <PDFTemplate date={date} articles={articles} tweets={tweets} ref={pdfRef} headingOffsets={headingOffsets} />
      </div>
    </div>
  );
}

export default App;
