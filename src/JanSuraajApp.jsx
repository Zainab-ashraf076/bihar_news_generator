import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { formatDateDisplay, fetchArticle } from './utils/extractor';
import JanSuraajPDFTemplate from './components/JanSuraajPDFTemplate';


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
  'jungleraaj': new URL('/civic.jpeg', window.location.origin).href, 
};

const TRENDING_TWEETS = [
];

const SECTION_META = {
  headlines: { emoji: '🗞️', label: 'Top Headlines', accent: '#f59e0b', note: 'Top 2 cards' },
  political: { emoji: '⚖️', label: 'Jan Suraaj Highlights', accent: '#fbbf24', note: 'Political updates' },
  jungleraaj: { emoji: '🚨', label: 'Jungle Raj 2.0', accent: '#ef4444', note: 'Critical news' },
};

function JanSuraajApp() {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Persistence logic
  const [articles, setArticles] = useState(() => {
    const saved = localStorage.getItem('js-scan-articles');
    return saved ? JSON.parse(saved) : [];
  });
  const [tweets, setTweets] = useState(() => {
    const saved = localStorage.getItem('js-scan-tweets');
    return saved ? JSON.parse(saved) : TRENDING_TWEETS;
  });
  const [headingOffsets, setHeadingOffsets] = useState(() => {
    const saved = localStorage.getItem('js-scan-heading-offsets');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('js-scan-articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('js-scan-tweets', JSON.stringify(tweets));
  }, [tweets]);

  useEffect(() => {
    localStorage.setItem('js-scan-heading-offsets', JSON.stringify(headingOffsets));
  }, [headingOffsets]);

  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear all Jan Suraaj data?')) {
      setArticles([]);
      setTweets(TRENDING_TWEETS);
      setHeadingOffsets({});
      localStorage.removeItem('js-scan-articles');
      localStorage.removeItem('js-scan-tweets');
      localStorage.removeItem('js-scan-heading-offsets');
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

      // Find neighboring article in the same category
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
      // Force Jan Suraaj party for this specific generator
      setArticles(prev => prev.map(a => a.id === id ? { ...a, ...data, party: 'jan-suraaj' } : a));
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

    const opt = {
      margin: 0,
      filename: `Jan_Suraaj_News_${date}.pdf`,
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
            <div className="empty-state">No stories in this section.</div>
          )}
          {filtered.map(art => (
            <div key={art.id} className="edit-card">
              <div className="card-top">
                {category === 'political' && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.8rem', width: '100%' }}>
                    <img
                      src={art.customLogo || PARTY_LOGOS[art.party]}
                      alt={art.party}
                      crossOrigin="anonymous"
                      style={{ width: 55, height: 55, objectFit: 'contain' }}
                    />
                    <div style={{ fontWeight: '800', fontSize: '14px', color: '#f59e0b' }}>Jan Suraaj </div>
                  </div>
                )}
                 {category === 'jungleraaj' && (
                   <img src={SECTION_LOGOS[category]} alt={category} crossOrigin="anonymous" style={{ width: 70, height: 70, objectFit: 'contain' }} />
                 )}
                <button className="btn-del" onClick={() => removeArticle(art.id)}>×</button>
              </div>

              <div className="input-with-action">
                <input
                  placeholder="Paste link..."
                  value={art.url}
                  onChange={(e) => updateArticle(art.id, 'url', e.target.value)}
                />
                <button
                  className={`btn-scan ${fetchingIds.includes(art.id) ? 'scanning' : ''}`}
                  onClick={() => handleFetchLink(art.id, art.url)}
                  disabled={!art.url || fetchingIds.includes(art.id)}
                >
                  {fetchingIds.includes(art.id) ? '⌛' : '🔍'}
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
                {art.image && <div className="img-preview" style={{ backgroundImage: `url(${art.image})` }} />}
              </div>

              <div className="input-group">
                <label>Headline</label>
                <input
                  placeholder="Enter headline..."
                  value={art.headline}
                  onChange={(e) => updateArticle(art.id, 'headline', e.target.value)}
                  style={{ fontWeight: 'bold' }}
                />
              </div>
              <div className="input-group">
                <label>Summary Content</label>
                <textarea
                  placeholder="Summarize the core story..."
                  value={art.summary}
                  onChange={(e) => updateArticle(art.id, 'summary', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="app-container js-theme">
      {isGenerating && (
        <div className="loader">
          <div className="loader-box" />
          <p>Drafting Jan Suraaj Edition…</p>
        </div>
      )}

      <header className="app-header">
        <div className="brand">
          <span className="edition" style={{ background: '#f59e0b', color: '#000' }}>Jan Suraaj Edition</span>
          <h1>Jan Suraaj <span>News</span></h1>
        </div>
        <div className="header-actions">
          <div className="date-input">
            <label>Edition Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <button className="btn-secondary" onClick={clearAll} style={{ marginRight: '10px', background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
            🗑️ Clear All
          </button>
          <button className="btn-secondary" onClick={() => navigate('/')} style={{ marginRight: '10px', background: '#334155', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
            ← Main Scan
          </button>
          <button className="btn-secondary" onClick={() => setShowPreview(true)} style={{ marginRight: '10px', background: '#fbbf24', color: '#1c1917', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            👁️ Live Preview
          </button>
          <button className="btn-primary" onClick={handleGeneratePDF} style={{ background: '#f59e0b' }}>
            ⚡ Publish PDF
          </button>
        </div>
      </header>

      {showPreview && (
        <div className="preview-overlay">
          <div className="preview-modal">
            <header className="preview-header">
              <h2>Interactive Layout Preview</h2>
              <div className="preview-actions">
                <button className="btn-add" onClick={() => addArticle('customText')} style={{ border: '1px solid #fbbf24', color: '#fbbf24' }}>+ Add Simple Text</button>
                <button className="btn-add" onClick={() => setArticles(prev => [...prev, { id: Date.now(), isPageBreak: true, category: 'political' }])} style={{ border: '1px solid #10b981', color: '#10b981' }}>+ Add New Page</button>
                <button className="btn-secondary" onClick={() => setShowPreview(false)} style={{ background: '#475569', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Close</button>
                <button className="btn-primary" onClick={() => { handleGeneratePDF(); setShowPreview(false); }}>Download PDF</button>
              </div>
            </header>
            <div className="preview-body">
              <div className="preview-instructions">
                <p>💡 <strong>Canvas Mode:</strong> Use the arrows to reorder stories or adjust vertical spacing (Up/Down) for each item.</p>
              </div>
              <div className="template-container">
                {/* This is the interactive version of the template */}
                <div className="interactive-template">
                  <JanSuraajPDFTemplate
                    date={date}
                    articles={articles}
                    tweets={tweets}
                    interactive={true}
                    onMoveArticle={moveArticle}
                    onAdjustY={adjustYOffset}
                    onSetOffset={setOffset}
                    onUpdateTweetField={updateTweetField}
                    onRemoveTweet={removeTweet}
                    onAddTweet={addTweet}
                    onUpdateArticle={updateArticle}
                    onRemoveArticle={removeArticle}
                    headingOffsets={headingOffsets}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="app-main-layout">
        <main className="builder-main">
          {['headlines', 'political', 'jungleraaj'].map(renderSection)}
        </main>

        <aside className="trending-sidebar">
          <div className="sidebar-header">
            <div className="trending-dot" style={{ background: '#f59e0b' }} />
            <h4>JS Tweets Trend</h4>
            <button
              className="btn-add"
              onClick={addTweet}
            >
              + Add JS Tweet
            </button>
          </div>
          <div className="tweets-list">
            {tweets.map(tweet => (
              <div key={tweet.id} className="tweet-card-editor" style={{ background: '#111', border: '1px solid #f59e0b33', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <input
                    value={tweet.user}
                    onChange={(e) => updateTweetField(tweet.id, 'user', e.target.value)}
                    style={{ color: '#f59e0b', background: 'transparent', border: 'none', fontSize: '12px', fontWeight: 'bold', flex: 1 }}
                  />
                  <button onClick={() => removeTweet(tweet.id)} className="btn-del-small">×</button>
                </div>
                <textarea
                  value={tweet.text}
                  onChange={(e) => updateTweetField(tweet.id, 'text', e.target.value)}
                  style={{ background: '#000', color: '#fff', fontSize: '11px', minHeight: '50px' }}
                  placeholder="Tweet content..."
                />
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <label className="file-upload-label" style={{ padding: '4px 8px', fontSize: '10px' }}>
                    + Image
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
                  {tweet.image && (
                    <div style={{
                      width: '40px',
                      height: '40px',
                      backgroundImage: `url(${tweet.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: '4px',
                      border: '1px solid #f59e0b'
                    }} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div style={{ visibility: 'hidden', position: 'absolute', top: '-9999px', left: 0 }}>
        <JanSuraajPDFTemplate date={date} articles={articles} tweets={tweets} ref={pdfRef} headingOffsets={headingOffsets} />
      </div>
    </div>
  );
}

export default JanSuraajApp;
