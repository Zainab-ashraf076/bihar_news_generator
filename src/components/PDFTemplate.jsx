import React from 'react';
import { formatDateDisplay } from '../utils/extractor';

const AMBER_400 = '#fbbf24';

const PARTY_CONFIG = {
  'jan-suraaj': { color: AMBER_400, label: 'Jan Suraaj', icon: '🎒' },
  'bjp': { color: '#f59e0b', label: 'BJP', icon: '🦁' },
  'jdu': { color: '#60a5fa', label: 'JDU', icon: '🏠' },
  'rjd': { color: '#f87171', label: 'RJD', icon: '🔴' },
  'congress': { color: '#4ade80', label: 'Congress', icon: '🌿' },
  'development': { color: '#2dd4bf', label: 'Development', icon: '🚋' },
  'national': { color: '#c084fc', label: 'National', icon: '🌐' },
};

const PDFTemplate = ({ date, articles, ticker, stats, opinion, globalNews, containerRef }) => {
  const dateDisplay = formatDateDisplay(date);
  const top4 = articles.slice(0, 4);
  const remainingArticles = articles.slice(4);

  return (
    <div id="pdf-template-container" style={{ position: 'absolute', left: '-9999px', top: 0 }}>
      {/* Container is the source for the PDF */}
      <div 
        ref={containerRef} 
        style={{ 
          width: '210mm', 
          background: '#0a1128', 
          color: '#FFFBEB', 
          fontFamily: "'Outfit', 'Inter', sans-serif",
          minHeight: '297mm',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box'
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Outfit:wght@300;400;600;800&display=swap');
          
          /* Force global background for all pages */
          html, body { 
            background-color: #0a1128 !important; 
            margin: 0; padding: 0;
            -webkit-print-color-adjust: exact;
          }

          h1, h2, h3 { font-family: 'Playfair Display', serif; }

          /* Header */
          .p-mast { padding: 15mm 45px 20px; text-align: center; border-bottom: 2px solid ${AMBER_400}; }
          .p-mast h1 { font-size: 52px; font-weight: 900; color: ${AMBER_400}; line-height: 0.8; margin-bottom: 10px; }
          .p-mast .p-tagline { font-size: 10px; letter-spacing: 5px; color: #9CA3AF; }
          .p-mast .p-tagline span { color: ${AMBER_400}; font-weight: 700; }

          .p-meta { display: flex; justify-content: space-between; margin-top: 20px; font-size: 9px; color: #6B7280; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
          .p-date-pill { background: ${AMBER_400}; color: #000; padding: 3px 15px; border-radius: 4px; font-weight: 900; }

          /* Ticker */
          .p-ticker { background: #111; border-bottom: 1px solid rgba(251, 191, 36, 0.3); padding: 8px 50px; display: flex; align-items: center; gap: 20px; }
          .p-tick-label { background: ${AMBER_400}; color: #000; font-size: 8px; font-weight: 900; padding: 2px 10px; border-radius: 3px; }
          .p-tick-text { font-size: 9px; color: #FFF; font-weight: 500; font-style: italic; }

          .p-content { padding: 20px 50px 25mm; }

          /* Section Headers */
          .p-sec { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; margin-top: 10px; }
          .p-sec h2 { font-size: 20px; color: #FFF; font-weight: 700; margin: 0; }
          .p-sec-line { flex: 1; height: 1px; background: rgba(255, 255, 255, 0.1); }
          .p-sec-tag { font-size: 7px; background: ${AMBER_400}; color: #000; padding: 2px 8px; border-radius: 100px; font-weight: 900; text-transform: uppercase; }

          /* Top 4 Stories */
          .p-top4 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 30px; }
          .p-top4-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(251, 191, 36, 0.2); border-radius: 12px; padding: 15px; display: flex; gap: 12px; page-break-inside: avoid; }
          .p-top4-num { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 900; color: ${AMBER_400}; opacity: 0.3; line-height: 1; }
          .p-top4-txt { font-size: 11px; font-weight: 600; line-height: 1.5; }
          .p-top4-txt strong { color: ${AMBER_400}; }

          /* Stats */
          .p-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 35px; }
          .p-stat { background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), transparent); border: 1px solid rgba(251, 191, 36, 0.2); border-radius: 18px; padding: 22px; text-align: center; }
          .p-stat-v { font-family: 'Playfair Display', serif; font-size: 26px; color: ${AMBER_400}; font-weight: 900; }
          .p-stat-l { font-size: 8.5px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; margin-top: 5px; }

          /* Articles */
          .p-art { 
            background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); 
            border-radius: 20px; padding: 25px; margin-bottom: 20px; position: relative;
            page-break-inside: avoid;
          }
          .p-art-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
          .p-art-tag { font-size: 8px; font-weight: 800; text-transform: uppercase; padding: 3px 12px; border-radius: 100px; display: inline-flex; align-items: center; gap: 6px; }
          .p-art-h { font-size: 17px; font-weight: 700; color: #FFF; line-height: 1.35; margin-bottom: 10px; }
          .p-art-s { font-size: 11px; color: #D1D5DB; line-height: 1.7; }
          .p-art-src { font-size: 8px; color: #6B7280; margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 10px; }

          /* Opinion */
          .p-opinion { 
            background: linear-gradient(135deg, rgba(251, 191, 36, 0.08), transparent); 
            border: 1px solid rgba(251, 191, 36, 0.3); padding: 30px; border-radius: 22px;
            margin-bottom: 35px; margin-top: 15mm; position: relative; page-break-inside: avoid;
          }
          .p-opinion::before { content: '"'; position: absolute; top: -10px; left: 20px; font-family: 'Playfair Display', serif; font-size: 80px; color: ${AMBER_400}; opacity: 0.15; }
          .p-op-h { font-size: 18px; color: #FFF; margin-bottom: 12px; font-weight: 700; line-height: 1.4; }
          .p-op-t { font-size: 11.5px; color: #D1D5DB; line-height: 1.8; }
          .p-op-src { font-size: 9px; color: ${AMBER_400}; text-transform: uppercase; margin-top: 15px; font-weight: 700; }

          /* GlobalNews */
          .p-global-wrap { page-break-inside: avoid; margin-bottom: 35px; margin-top: 15mm; }
          .p-global { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .p-global-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 20px; }
          .p-gl-flag { font-size: 22px; margin-bottom: 10px; }
          .p-gl-h { font-size: 13px; color: #FFF; margin-bottom: 8px; font-weight: 700; }
          .p-gl-tag { font-size: 7px; color: ${AMBER_400}; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-bottom: 10px; display: block; }
          .p-gl-t { font-size: 10px; color: #9CA3AF; line-height: 1.6; }
        ` }} />

        {/* MASTHEAD */}
        <header className="p-mast">
          <h1 style={{ color: AMBER_400 }}>Bihar Media Scan</h1>
          <p className="p-tagline">YOUR DAILY <span>POLITICAL PULSE</span> OF BIHAR</p>
          <div className="p-meta">
            <span>Bihar Edition</span>
            <span className="p-date-pill">{dateDisplay}</span>
            <span>Digital Scan</span>
          </div>
        </header>

        {/* TICKER */}
        <div className="p-ticker">
          <span className="p-tick-label">Breaking</span>
          <div className="p-tick-text">{ticker[0]} • {ticker[1]}</div>
        </div>

        <div className="p-content">
          {/* TOP HEADLINES */}
          <div className="p-sec">
             <span className="p-sec-tag">Top Stories</span>
             <h2>News of the Day</h2>
             <div className="p-sec-line"></div>
          </div>
          <div className="p-top4">
            {top4.map((a, i) => (
              <div key={i} className="p-top4-card">
                <span className="p-top4-num">{(i+1).toString().padStart(2, '0')}</span>
                <div className="p-top4-txt">
                  <strong>{a.headline.split(':')[0]}:</strong> {a.headline.includes(':') ? a.headline.split(':').slice(1).join(':') : a.headline}
                </div>
              </div>
            ))}
          </div>

          {/* STATS */}
          <div className="p-stats">
            {stats.map((s, i) => (
              <div key={i} className="p-stat">
                <div className="p-stat-v">{s.val}</div>
                <div className="p-stat-l">{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* DETAILED DIGEST */}
          <div className="p-sec">
             <span className="p-sec-tag">Deep Dive</span>
             <h2>Detailed Coverage</h2>
             <div className="p-sec-line"></div>
          </div>
          <div className="p-news-list">
            {remainingArticles.map((art, idx) => {
              const conf = PARTY_CONFIG[art.party] || PARTY_CONFIG['jan-suraaj'];
              return (
                <div key={idx} className="p-art" style={{ borderLeft: `5px solid ${conf.color}` }}>
                  <div className="p-art-header">
                    <span className="p-art-tag" style={{ background: `${conf.color}20`, color: conf.color, border: `1px solid ${conf.color}40` }}>
                      {conf.icon} {conf.label}
                    </span>
                    <span style={{ fontSize: '8px', color: '#6B7280', fontWeight: '700' }}>{art.sentiment.toUpperCase()}</span>
                  </div>
                  <h3 className="p-art-h">{art.headline}</h3>
                  <p className="p-art-s">{art.summary}</p>
                  <div className="p-art-src">🔗 SOURCE: {art.url.replace(/^https?:\/\//, '').slice(0, 80)}...</div>
                </div>
              );
            })}
          </div>

          {/* OPINION */}
          <div className="p-sec">
             <span className="p-sec-tag">Opinion</span>
             <h2>Analysis & Perspective</h2>
             <div className="p-sec-line"></div>
          </div>
          <div className="p-opinion">
            <h3 className="p-op-h">{opinion.title}</h3>
            <p className="p-op-t">{opinion.text}</p>
            <div className="p-op-src">{opinion.source}</div>
          </div>

          {/* GLOBAL */}
          <div style={{ height: '10mm' }}></div> {/* Safe spacer for page breaks */}
          <div className="p-global-wrap">
            <div className="p-sec">
               <span className="p-sec-tag">World</span>
               <h2>Global Headlines</h2>
               <div className="p-sec-line"></div>
            </div>
            <div className="p-global">
              {globalNews.map((gn, i) => (
                <div key={i} className="p-global-card">
                  <div className="p-gl-flag">{gn.flag}</div>
                  <span className="p-gl-tag">{gn.tag}</span>
                  <h4 className="p-gl-h">{gn.title}</h4>
                  <p className="p-gl-t">{gn.text}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* FILLER to force background to end of page */}
          <div style={{ flex: '1 0 100mm', minHeight: '100mm' }}></div>
        </div>
      </div>
    </div>
  );
};

export default PDFTemplate;
