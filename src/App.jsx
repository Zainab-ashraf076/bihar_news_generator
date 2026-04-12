import React, { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { formatDateDisplay } from './utils/extractor';
import PDFTemplate from './components/PDFTemplate';

const PARTY_LOGOS = {
  'jan-suraaj': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Jan_Suraaj_logo.png/1024px-Jan_Suraaj_logo.png',
  'bjp': 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/512px-Bharatiya_Janata_Party_logo.svg.png',
  'jdu': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Janata_Dal_%28United%29_Logo.png/512px-Janata_Dal_%28United%29_Logo.png',
  'rjd': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Rashtriya_Janata_Dal_logo.png/512px-Rashtriya_Janata_Dal_logo.png',
  'congress': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Indian_National_Congress_logo.svg/512px-Indian_National_Congress_logo.svg.png'
};

const DEFAULT_ARTICLES = [
  { id: 1, category: 'viral', headline: 'Bihar Rising: 117km New Railway Line Approved', summary: 'A massive ₹3,606 Cr project connecting Bihta to Aurangabad will feature 13 new stations, transforming the transit landscape of Bihar.', url: 'https://example.com/railway', party: '' },
  { id: 2, category: 'viral', headline: 'Sudha Kendras to Open in 8,053 Panchayats', summary: 'Boosting rural economy, the government announces the establishment of Sudha milk centers across every panchayat in the state.', url: 'https://example.com/sudha', party: '' },
  { id: 3, category: 'viral', headline: 'Bhojpur-Buxar Elections: The Game Changer', summary: 'Political experts eye Jan Suraaj as the strategic player in upcoming legislative council votes scheduled for May 12.', url: 'https://example.com/elections', party: '' },
  { id: 4, category: 'political', headline: 'Jan Suraaj Announces State-wide Padyatra Phase 2', summary: 'Prashant Kishor to lead the second phase of his transformative march, focusing on education and employment reform.', url: 'https://example.com/jan-suraaj', party: 'jan-suraaj' },
  { id: 5, category: 'political', headline: 'BJP Strengthens Booth-level Connectivity in Bihar', summary: 'The party launches a new initiative to reach every voter through its robust karyakarta network before the upcoming polls.', url: 'https://example.com/bjp', party: 'bjp' },
  { id: 6, category: 'indian', headline: 'India Overhauls Digital Infrastructure for Farmers', summary: 'New national portal aims to provide real-time market prices and weather updates to millions of farmers across India.', url: 'https://example.com/india-farmers', party: '' },
  { id: 7, category: 'global', headline: 'Global Energy Transition: New Accords Signed', summary: 'Major nations agree on a roadmap to accelerate green hydrogen adoption to combat climate change challenges.', url: 'https://example.com/global-energy', party: '' }
];

const SECTION_META = {
  viral:    { emoji: '🔥', label: 'Most Viral News',    accent: '#fbbf24', note: 'Top 3 shown in magazine' },
  political:{ emoji: '⚖️', label: 'Political Landscape', accent: '#fcd34d', note: 'Include party logos'    },
  indian:   { emoji: '🇮🇳', label: 'Indian Horizons',   accent: '#fde68a', note: 'National stories'       },
  global:   { emoji: '🌍', label: 'Global Pulse',        accent: '#fbbf24', note: 'World news'             },
};

function App() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [articles, setArticles] = useState(DEFAULT_ARTICLES);
  const [isGenerating, setIsGenerating] = useState(false);
  const pdfRef = useRef(null);

  const addArticle = (category) => {
    setArticles(prev => [...prev, {
      id: Date.now(),
      category,
      headline: '',
      summary: '',
      url: '',
      party: category === 'political' ? 'jan-suraaj' : ''
    }]);
  };

  const updateArticle = (id, key, val) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, [key]: val } : a));
  };

  const removeArticle = (id) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 800)); // More time for large images
    const element = pdfRef.current;
    
    const opt = {
      margin: 0,
      filename: `Bihar_News_Magazine_${date}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        letterRendering: true
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
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
      <div key={category} className="section-builder" style={{ animationDelay: `${Object.keys(SECTION_META).indexOf(category) * 80}ms` }}>
        <div className="builder-header">
          <div className="sec-accent-bar" style={{ background: accent }} />
          <h3>{emoji} {label}</h3>
          <span className="sec-count">{filtered.length} article{filtered.length !== 1 ? 's' : ''} · {note}</span>
          <button className="btn-add" onClick={() => addArticle(category)}>+ Add</button>
        </div>
        <div className="builder-grid">
          {filtered.length === 0 && (
            <div className="empty-state">No articles yet. Click "+ Add" to add a story.</div>
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
                        style={{ width: 42, height: 42, objectFit: 'contain', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 4 }}
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
                    <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                      <input 
                        type="text"
                        placeholder="Paste Logo URL..."
                        value={art.customLogo || ''}
                        onChange={(e) => updateArticle(art.id, 'customLogo', e.target.value)}
                        style={{ fontSize: '11px', height: '34px', flex: 1 }}
                      />
                      <label className="btn-add" style={{ padding: '0 12px', fontSize: '10px', height: '34px', display: 'flex', alignItems: 'center', margin: 0 }}>
                        Upload
                        <input 
                          type="file" 
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => updateArticle(art.id, 'customLogo', reader.result);
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                )}
                {category !== 'political' && <div />}
                <button className="btn-del" onClick={() => removeArticle(art.id)} title="Delete">×</button>
              </div>
              <div className="input-group">
                <label>Headline</label>
                <input
                  placeholder="Enter a catchy headline..."
                  value={art.headline}
                  onChange={(e) => updateArticle(art.id, 'headline', e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Summary</label>
                <textarea
                  placeholder="Write the news summary here..."
                  value={art.summary}
                  onChange={(e) => updateArticle(art.id, 'summary', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="input-group">
                <label>Source URL</label>
                <input
                  placeholder="https://..."
                  value={art.url}
                  onChange={(e) => updateArticle(art.id, 'url', e.target.value)}
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
          <p>Drafting Your Official Edition…</p>
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
          <button className="btn-primary" onClick={handleGeneratePDF}>
            ⚡ Publish PDF
          </button>
        </div>
      </header>

      <div className="hero-strip">
        <div className="hs-tag">Amber Edition</div>
        <div className="hs-line" />
        <span className="hs-text">
          ❝ Dedicated to Truth and Progress in Bihar ❞
        </span>
        <div className="hs-line" />
        <div className="hs-tag">Professional</div>
      </div>

      <main className="builder-main">
        {['viral', 'political', 'indian', 'global'].map(renderSection)}
      </main>

      <footer className="page-footer">
        <span>Bihar Media Scan</span>
        <strong>Official News Magazine Architect</strong>
        <span>© 2026 Jan Suraaj Media</span>
      </footer>

      <div style={{ visibility: 'hidden', position: 'absolute', top: '-9999px', left: 0 }}>
        <PDFTemplate date={date} articles={articles} ref={pdfRef} />
      </div>
    </div>
  );
}

export default App;
