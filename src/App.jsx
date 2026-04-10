import React, { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { fetchArticle, formatDateDisplay } from './utils/extractor';
import PDFTemplate from './components/PDFTemplate';

const DEFAULT_TICKER = [
  "Nitish Kumar hints at Bihar CM change — 'New hands will lead Bihar'",
  "Bhojpur-Buxar by-election May 12 — Jan Suraaj enters the fray!",
  "₹3,606 Cr · 117 km Bihta–Aurangabad railway with 13 new stations",
  "Sudha Kendras to open in 8,053 panchayats across Bihar"
];

const DEFAULT_STATS = [
  { val: '₹3,606 Cr', lbl: 'New Railway Project' },
  { val: 'May 12', lbl: 'Legislative Council Vote' },
  { val: '8,053', lbl: 'New Sudha Kendras' }
];

const DEFAULT_OPINION = {
  icon: '✍️',
  title: 'The World Trapped in the Arrogance of Three Nations',
  text: 'Vikesh Kumar Badola argues that global institutions from the UN to the World Bank remain deeply tied to American influence, creating a geopolitical landscape where few can challenge US economic policies.',
  source: 'Opinion · Vikesh Kumar Badola · 10 April 2026'
};

const DEFAULT_GLOBAL = [
  { flag: '🇺🇸', tag: 'USA · Politics', title: 'Melania Trump Denies Epstein Connection', text: 'Melania Trump has issued a categorical denial of any relationship with Jeffrey Epstein, calling allegations a defamation attempt.' },
  { flag: '🌐', tag: 'Global · Geopolitics', title: 'US Hegemony & the Debt Trap', text: 'Global institutions remain tied to American influence, leaving nations with little leverage to challenge policies.' }
];

function App() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [urls, setUrls] = useState(['']);
  const [articles, setArticles] = useState([]);
  const [ticker, setTicker] = useState(DEFAULT_TICKER);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [opinion, setOpinion] = useState(DEFAULT_OPINION);
  const [globalNews, setGlobalNews] = useState(DEFAULT_GLOBAL);
  
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionMsg, setExtractionMsg] = useState('');
  const [phase, setPhase] = useState('input');
  
  const pdfRef = useRef(null);

  const addUrlRow = () => setUrls([...urls, '']);
  const updateUrl = (idx, val) => {
    const newUrls = [...urls];
    newUrls[idx] = val;
    setUrls(newUrls);
  };
  const removeUrl = (idx) => setUrls(urls.filter((_, i) => i !== idx));

  const handleExtract = async () => {
    const validUrls = urls.map(u => u.trim()).filter(Boolean);
    if (!validUrls.length) return alert('Please enter at least one URL');

    setIsExtracting(true);
    const results = [];
    for (let i = 0; i < validUrls.length; i++) {
      setExtractionMsg(`Fetching article ${i + 1} of ${validUrls.length}…`);
      const art = await fetchArticle(validUrls[i]);
      results.push({ ...art, url: validUrls[i] });
    }
    setArticles(results);
    setIsExtracting(false);
    setPhase('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateArticle = (idx, camelKey, val) => {
    const newArticles = [...articles];
    newArticles[idx][camelKey] = val;
    setArticles(newArticles);
  };

  const handleGeneratePDF = async () => {
    setIsExtracting(true);
    setExtractionMsg('Generating Multi-page Magazine PDF…');
    await new Promise(r => setTimeout(r, 200));

    const element = pdfRef.current;
    const filename = `Jan_Suraaj_Magazine_${date}.pdf`;
    
    // 1. Measure content and force it to fill complete pages to prevent white gaps
    const originalMinHeight = element.style.minHeight;
    const heightPx = element.scrollHeight;
    const mmHeight = heightPx * 0.264583; // px to mm at 96dpi
    const pagesNeeded = Math.ceil(mmHeight / 297);
    element.style.minHeight = `${pagesNeeded * 297}mm`;

    const opt = {
      margin: 0, 
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 1.5, // Slightly lower scale for faster processing but better stability
        useCORS: true, 
        logging: false, 
        backgroundColor: '#0a1128'
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: 'css' }
    };

    try {
      const worker = html2pdf()
        .set(opt)
        .from(element)
        .toPdf()
        .get('pdf')
        .then((pdf) => {
          const totalPages = pdf.internal.getNumberOfPages();
          for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            
            // Re-enforce background layer for any browser-specific rendering gaps
            pdf.setFillColor(10, 17, 40); 
            pdf.rect(0, 277, 210, 20, 'F'); // Ensure footer strip is always blue

            pdf.setFontSize(8);
            pdf.setTextColor(251, 191, 36); // Amber-400
            pdf.text('JAN SURAAJ · Bihar Media Scan · ' + formatDateDisplay(date), 105, 290, { align: 'center' });
            pdf.text('PAGE ' + i + ' / ' + totalPages, 195, 290, { align: 'right' });
          }
        });
      await worker.save();
      // Restore original minHeight
      element.style.minHeight = originalMinHeight;
    } catch (err) {
      console.error('PDF Error:', err);
      alert('Error: ' + err.message);
    }
    setIsExtracting(false);
  };

  return (
    <>
      {isExtracting && (
        <div className="spinner-overlay">
          <div className="spinner-mag"></div>
          <p style={{marginTop:'1rem'}}>{extractionMsg}</p>
        </div>
      )}

      <div className="tricolor-bar"></div>
      <header className="masthead">
        <div className="masthead-inner">
          <div className="top-bar">
            <span>Bihar Edition</span>
            <span className="date-pill" style={{backgroundColor:'#fbbf24', color:'#000'}}>{formatDateDisplay(date)}</span>
            <span>Live Scan</span>
          </div>
          <h1 style={{color:'#fbbf24', '-webkit-text-fill-color': '#fbbf24'}}>Bihar Media Scan</h1>
          <div className="subtitle">Daily <span style={{color:'#fbbf24'}}>Political Pulse</span> of Bihar</div>
        </div>
      </header>

      {phase === 'review' && (
        <div className="ticker-strip" style={{borderColor:'#fbbf24'}}>
          <div className="ticker-label" style={{backgroundColor:'#fbbf24'}}>Breaking</div>
          <div className="marquee">
            {ticker.map((t, i) => <span key={i} style={{color:'#fff'}}>{t}</span>)}
            {ticker.map((t, i) => <span key={i + 'copy'} style={{color:'#fff'}}>{t}</span>)}
          </div>
        </div>
      )}

      <main className="container">
        {phase === 'input' ? (
          <div className="app-wrap">
            <div className="sec-head">
              <h2>Launch Console</h2>
              <span className="sec-badge" style={{background:'#fbbf24'}}>Setup</span>
              <div className="sec-line"></div>
            </div>

            <div className="glass-card">
              <div className="form-field">
                <label style={{color:'#fbbf24'}}>Publication Date</label>
                <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
              </div>

              <div className="form-field">
                <label style={{color:'#fbbf24'}}>Source URLs</label>
                {urls.map((url, idx) => (
                  <div key={idx} className="url-row">
                    <input 
                      type="url" 
                      placeholder="https://..." 
                      value={url} 
                      onChange={(e) => updateUrl(idx, e.target.value)} 
                    />
                    {urls.length > 1 && (
                      <button className="btn-remove" onClick={() => removeUrl(idx)}>&times;</button>
                    )}
                  </div>
                ))}
                <button className="btn btn-outline" style={{marginTop:'0.8rem', padding:'0.5rem 1rem', fontSize:'0.7rem', color:'#fbbf24', borderColor:'#fbbf24'}} onClick={addUrlRow}>+ Add URL</button>
              </div>

              <div style={{marginTop:'2rem', textAlign:'center'}}>
                <button className="btn btn-primary" style={{width:'100%', background:'#fbbf24'}} onClick={handleExtract}>
                  ⚡ Start Extraction
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="magazine-review">
            <div className="sec-head">
              <h2>Review Station</h2>
              <span className="sec-badge" style={{background:'#fbbf24'}}>Live Edit</span>
              <div className="sec-line"></div>
            </div>

            <div className="stats-grid">
              {stats.map((s, i) => (
                <div key={i} className="stat-box" style={{borderColor: 'rgba(251, 191, 36, 0.2)'}}>
                  <input className="stat-val" value={s.val} style={{color:'#fbbf24', background:'transparent', border:'none', textAlign:'center'}} onChange={(e) => {
                    const ns = [...stats]; ns[i].val = e.target.value; setStats(ns);
                  }} />
                  <input className="stat-lbl" value={s.lbl} style={{background:'transparent', border:'none', textAlign:'center'}} onChange={(e) => {
                    const ns = [...stats]; ns[i].lbl = e.target.value; setStats(ns);
                  }} />
                </div>
              ))}
            </div>

            <div className="magazine-grid">
              {articles.map((art, idx) => (
                <div key={idx} className="article-card" style={{borderColor: 'rgba(251, 191, 36, 0.1)'}}>
                  <span className="card-idx" style={{color:'#fbbf24', opacity:0.1}}>{(idx + 1).toString().padStart(2, '0')}</span>
                  <div className="card-body">
                    <select className="tag-select" style={{color:'#fbbf24', borderColor: '#fbbf24'}} value={art.party} onChange={(e) => updateArticle(idx, 'party', e.target.value)}>
                      <option value="jan-suraaj">Jan Suraaj</option>
                      <option value="bjp">BJP</option>
                      <option value="jdu">JDU</option>
                      <option value="rjd">RJD</option>
                      <option value="congress">Congress</option>
                      <option value="development">Development</option>
                    </select>

                    <div className="form-field">
                      <label style={{color:'#fbbf24'}}>Headline</label>
                      <input value={art.headline} onChange={(e) => updateArticle(idx, 'headline', e.target.value)} />
                    </div>
                    <div className="form-field">
                      <label style={{color:'#fbbf24'}}>Summary</label>
                      <textarea value={art.summary} onChange={(e) => updateArticle(idx, 'summary', e.target.value)} rows={3} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="proceed-strip" style={{marginTop:'3rem', borderColor: '#fbbf24'}}>
              <p>Reports are refined. Ready for <strong>Amber Edition</strong> Export?</p>
              <div style={{display:'flex', gap:'1rem'}}>
                <button className="btn btn-outline" style={{borderColor:'#fbbf24', color:'#fbbf24'}} onClick={() => setPhase('input')}>Reset</button>
                <button className="btn btn-primary" style={{background:'#fbbf24'}} onClick={handleGeneratePDF}>📦 Export Final Magazine</button>
              </div>
            </div>
          </div>
        )}
      </main>

      <PDFTemplate 
        date={date} 
        articles={articles} 
        ticker={ticker} 
        stats={stats} 
        opinion={opinion}
        globalNews={globalNews}
        containerRef={pdfRef} 
      />
    </>
  );
}

export default App;
