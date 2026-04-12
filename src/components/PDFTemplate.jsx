import React, { forwardRef } from 'react';
import { formatDateDisplay } from '../utils/extractor';

// ── STRICT AMBER COLOR PALETTE ──
const AMBER_400 = '#fbbf24'; 
const AMBER_300 = '#fcd34d';
const AMBER_200 = '#fde68a';
const AMBER_100 = '#fef3c7';
const INK = '#1a1a1a';
const SLATE = '#545454';
const RULE = '#e5e5e5';
const AM = '#fffdf0'; // Paper white

const PARTY_LOGOS = {
  'jan-suraaj': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Jan_Suraaj_logo.png/1024px-Jan_Suraaj_logo.png',
  'bjp': 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/512px-Bharatiya_Janata_Party_logo.svg.png',
  'jdu': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Janata_Dal_%28United%29_Logo.png/512px-Janata_Dal_%28United%29_Logo.png',
  'rjd': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Rashtriya_Janata_Dal_logo.png/512px-Rashtriya_Janata_Dal_logo.png',
  'congress': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Indian_National_Congress_logo.svg/512px-Indian_National_Congress_logo.svg.png'
};

const PARTY_NAMES = {
  'jan-suraaj': 'Jan Suraaj',
  'bjp': 'Bharatiya Janata Party',
  'jdu': 'Janata Dal (United)',
  'rjd': 'Rashtriya Janata Dal',
  'congress': 'Indian National Congress'
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600;700;800&display=swap');

  * { box-sizing: border-box; }

  .mag-wrapper {
    width: 210mm;
    background: transparent;
    display: block;
  }

  .mag-root {
    width: 210mm;
    height: 297mm;
    background: ${AM};
    color: ${INK};
    font-family: 'Libre Baskerville', Georgia, serif;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    /* Removed page-break-after to prevent blank pages */
  }

  /* ─── CORNER TRIANGLES ─── */
  .tri-tl {
    position: absolute; top: 0; left: 0; width: 0; height: 0;
    border-style: solid;
    border-width: 90px 90px 0 0;
    border-color: ${AMBER_400} transparent transparent transparent;
    z-index: 10;
  }
  .tri-tl-inner {
    position: absolute; top: 0; left: 0; width: 0; height: 0;
    border-style: solid;
    border-width: 76px 76px 0 0;
    border-color: ${AMBER_300} transparent transparent transparent;
    z-index: 11;
  }
  .tri-br {
    position: absolute; bottom: 0; right: 0; width: 0; height: 0;
    border-style: solid;
    border-width: 0 0 90px 90px;
    border-color: transparent transparent ${AMBER_400} transparent;
    z-index: 10;
  }
  .tri-br-inner {
    position: absolute; bottom: 0; right: 0; width: 0; height: 0;
    border-style: solid;
    border-width: 0 0 76px 76px;
    border-color: transparent transparent ${AMBER_300} transparent;
    z-index: 11;
  }

  /* ─── PAGE PADDING ─── */
  .mag-page { 
    padding: 60px 64px 80px; /* Extra bottom padding to avoid footer overlap */
    position: relative; 
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  /* ─── MASTHEAD ─── */
  .masthead-tagline {
    text-align: center;
    font-family: 'Outfit', sans-serif;
    font-size: 8.5px;
    font-weight: 700;
    letter-spacing: 5px;
    color: ${SLATE};
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .masthead-title {
    text-align: center;
    font-family: 'Playfair Display', serif;
    font-size: 68px;
    font-weight: 900;
    line-height: 1;
    color: ${INK};
    letter-spacing: -1px;
  }
  .masthead-title span { color: ${AMBER_400}; font-style: italic; }
  .masthead-rule-top { height: 3px; background: ${INK}; margin: 10px 0 0; }
  .masthead-rule-thin { height: 1px; background: ${INK}; margin-top: 3px; }

  /* ─── META BAR ─── */
  .meta-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    border-bottom: 2px solid ${INK};
    font-family: 'Outfit', sans-serif;
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: ${SLATE};
    margin-bottom: 0;
  }
  .meta-date {
    background: ${AMBER_400};
    color: ${INK};
    font-weight: 900;
    padding: 2px 10px;
    border-radius: 3px;
    letter-spacing: 1px;
  }

  /* ─── RIBBON BANNER ─── */
  .ribbon-wrap {
    margin: 0 -64px;
    background: ${AMBER_400};
    padding: 8px 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    margin-bottom: 32px;
  }
  .ribbon-line { flex: 1; height: 1px; background: ${INK}; opacity: 0.15; }
  .ribbon-text {
    font-family: 'Playfair Display', serif;
    font-size: 14px;
    font-style: italic;
    font-weight: 900;
    color: ${INK};
    letter-spacing: 1.5px;
    white-space: nowrap;
    text-transform: uppercase;
  }

  /* ─── SECTION HEADING ─── */
  .sec-head { display: flex; align-items: center; gap: 12px; margin: 32px 0 20px; }
  .sec-head-line { flex: 1; height: 1px; background: ${RULE}; }
  .sec-head-label {
    font-family: 'Outfit', sans-serif;
    font-size: 8px;
    font-weight: 900;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: ${INK};
    background: ${AMBER_400};
    padding: 3px 12px;
    border-radius: 2px;
  }
  .sec-head h2 {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    font-weight: 900;
    color: ${INK};
    white-space: nowrap;
  }

  /* ─── VIRAL CARDS ─── */
  .viral-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 12px; }
  .viral-card {
    background: ${AMBER_100};
    border: 1px solid ${AMBER_200};
    border-top: 4px solid ${AMBER_400};
    border-radius: 4px;
    padding: 20px 16px 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 140px;
  }
  .viral-badge {
    font-family: 'Outfit', sans-serif;
    font-size: 7.5px;
    font-weight: 900;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: ${INK};
    border: 1px solid ${INK};
    padding: 2px 7px;
    border-radius: 2px;
    margin-bottom: 10px;
  }
  .viral-h {
    font-family: 'Playfair Display', serif;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.4;
    color: ${INK};
    flex: 1;
    margin-bottom: 12px;
  }
  .read-more {
    font-family: 'Outfit', sans-serif;
    font-size: 8.5px;
    font-weight: 900;
    color: ${INK};
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    display: inline-flex;
    align-items: center; gap: 4px;
    border-bottom: 1.5px solid ${AMBER_400};
    padding-bottom: 1px;
  }

  /* ─── POLITICAL NEWS ─── */
  .pol-list { display: flex; flex-direction: column; gap: 0; }
  .pol-card {
    display: flex; gap: 20px; align-items: flex-start;
    padding: 20px 0; border-bottom: 1px solid ${RULE};
  }
  .pol-card:last-child { border-bottom: none; }
  .pol-logo {
    width: 60px; height: 60px; object-fit: contain;
    background: #fff; border: 1px solid ${RULE}; border-radius: 6px; padding: 6px; flex-shrink: 0;
  }
  .pol-content { flex: 1; }
  .pol-party {
    font-family: 'Outfit', sans-serif; font-size: 8.5px; font-weight: 900; letter-spacing: 2.5px; color: ${SLATE}; text-transform: uppercase; margin-bottom: 6px;
  }
  .pol-h {
    font-family: 'Playfair Display', serif; font-size: 19px; font-weight: 700; line-height: 1.35; color: ${INK}; margin-bottom: 8px;
  }
  .pol-s { font-size: 11.5px; line-height: 1.7; color: ${SLATE}; margin-bottom: 12px; }

  /* ─── INDIAN / GLOBAL ─── */
  .ig-list { display: flex; flex-direction: column; gap: 0; }
  .ig-card {
    display: flex; gap: 16px; align-items: flex-start; padding: 16px 0; border-bottom: 1px solid ${RULE};
  }
  .ig-card:last-child { border-bottom: none; }
  .ig-num {
    font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 900; color: ${AMBER_300}; line-height: 1; min-width: 40px; margin-top: 4px;
  }
  .ig-body { flex: 1; }
  .ig-h {
    font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: ${INK}; margin-bottom: 6px; line-height: 1.35;
  }
  .ig-s { font-size: 11.5px; color: ${SLATE}; line-height: 1.65; margin-bottom: 10px; }

  /* ─── FOOTER ─── */
  .mag-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    border-top: 2px solid ${INK};
    padding: 20px 64px 22px;
    background: ${AMBER_400};
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 20;
  }
  .footer-brand {
    font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 900; color: ${INK}; letter-spacing: 0.5px;
  }
  .footer-center {
    font-family: 'Outfit', sans-serif; font-size: 8.5px; letter-spacing: 2px; text-transform: uppercase; color: ${INK}; opacity: 0.6;
  }
  .footer-right {
    font-family: 'Outfit', sans-serif; font-size: 8.5px; color: ${INK}; text-align: right; opacity: 0.8;
  }
  .footer-pg {
    width: 32px; height: 32px; background: ${INK}; color: ${AMBER_400}; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 900;
  }
`;

const PDFTemplate = forwardRef(({ date, articles }, ref) => {
  const dateDisplay = formatDateDisplay(date);

  const viralNews = articles.filter(a => a.category === 'viral').slice(0, 3);
  const politicalNews = articles.filter(a => a.category === 'political');
  const indianNews = articles.filter(a => a.category === 'indian');
  const globalNews = articles.filter(a => a.category === 'global');

  const Page = ({ children, pgNum, showMasthead = false }) => (
    <div className="mag-root">
      <div className="tri-tl" />
      <div className="tri-tl-inner" />
      <div className="tri-br" />
      <div className="tri-br-inner" />

      <div className="mag-page" style={{ paddingTop: !showMasthead ? '90px' : '60px' }}>
        {showMasthead && (
          <>
            <div className="masthead-tagline">Bihar's Most Trusted Political Journal • Est. 2024</div>
            <div className="masthead-title">Bihar Media <span>Scan</span></div>
            <div className="masthead-rule-top" />
            <div className="masthead-rule-thin" />

            <div className="meta-bar">
              <span>Vol. IV • Issue No. 42</span>
              <span className="meta-date">{dateDisplay}</span>
              <span>Digital Edition • ₹0</span>
            </div>

            <div className="ribbon-wrap">
              <div className="ribbon-line" />
              <span className="ribbon-text">
                ❝ Satyam Shivam Sundaram — Truth, Goodness & Beauty in Every Story ❞
              </span>
              <div className="ribbon-line" />
            </div>
          </>
        )}
        {children}
      </div>

      <footer className="mag-footer">
        <div className="footer-brand">Bihar Media Scan</div>
        <div className="footer-center">
          Jan Suraaj Media Division • Bihar Political Scan • {dateDisplay}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="footer-right">Proprietary<br />Digital Edition</div>
          <div className="footer-pg">{pgNum}</div>
        </div>
      </footer>
    </div>
  );

  return (
    <div ref={ref} className="mag-wrapper">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* PAGE 1: Masthead + Viral + Political */}
      <Page pgNum={1} showMasthead={true}>
        {viralNews.length > 0 && (
          <section>
            <div className="sec-head">
              <div className="thick-rule" style={{ margin: 0, width: 30, background: AMBER_400, height: 3 }} />
              <span className="sec-head-label">🔥 Most Viral</span>
              <h2>Breaking Stories</h2>
              <div className="sec-head-line" />
            </div>
            <div className="viral-grid">
              {viralNews.map((a, i) => (
                <div key={a.id || i} className="viral-card">
                  <div>
                    <span className="viral-badge">Viral News</span>
                    <div className="viral-h">{a.headline}</div>
                  </div>
                  <a href={a.url} className="read-more">Read Full Story →</a>
                </div>
              ))}
            </div>
          </section>
        )}

        {politicalNews.length > 0 && (
          <section>
            <div className="sec-head">
              <div style={{ width: 30, height: 3, background: AMBER_400, flexShrink: 0 }} />
              <span className="sec-head-label">⚖️ Power Play</span>
              <h2>Political Landscape</h2>
              <div className="sec-head-line" />
            </div>
            <div className="pol-list">
              {politicalNews.map((a, i) => (
                <div key={a.id || i} className="pol-card">
                  {(a.customLogo || PARTY_LOGOS[a.party]) && (
                    <img 
                      src={a.customLogo || PARTY_LOGOS[a.party]} 
                      alt={a.party} 
                      className="pol-logo" 
                      crossOrigin="anonymous"
                    />
                  )}
                  <div className="pol-content">
                    <div className="pol-party">{a.party === 'other' ? 'Other Party' : (PARTY_NAMES[a.party] || a.party)}</div>
                    <div className="pol-h">{a.headline}</div>
                    <p className="pol-s">{a.summary}</p>
                    <a href={a.url} className="read-more pol-read">Read More →</a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </Page>

      {/* PAGE 2: Indian Horizon + Global Pulse */}
      {(indianNews.length > 0 || globalNews.length > 0) && (
        <Page pgNum={2} showMasthead={false}>
          {/* INDIAN NEWS */}
          {indianNews.length > 0 && (
            <section>
              <div className="sec-head">
                <div style={{ width: 30, height: 3, background: AMBER_400, flexShrink: 0 }} />
                <span className="sec-head-label">🇮🇳 National</span>
                <h2>Indian Horizons</h2>
                <div className="sec-head-line" />
              </div>
              <div className="ig-list">
                {indianNews.map((a, i) => (
                  <div key={a.id || i} className="ig-card">
                    <div className="ig-num">0{i + 1}</div>
                    <div className="ig-body">
                      <div className="ig-h">{a.headline}</div>
                      <p className="ig-s">{a.summary}</p>
                      <a href={a.url} className="read-more pol-read">Read More →</a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* GLOBAL NEWS */}
          {globalNews.length > 0 && (
            <section style={{ marginTop: '20px' }}>
              <div className="sec-head">
                <div style={{ width: 30, height: 3, background: AMBER_400, flexShrink: 0 }} />
                <span className="sec-head-label">🌍 World Desk</span>
                <h2>Global Pulse</h2>
                <div className="sec-head-line" />
              </div>
              <div className="ig-list">
                {globalNews.map((a, i) => (
                  <div key={a.id || i} className="ig-card">
                    <div className="ig-num">0{i + 1}</div>
                    <div className="ig-body">
                      <div className="ig-h">{a.headline}</div>
                      <p className="ig-s">{a.summary}</p>
                      <a href={a.url} className="read-more pol-read">Global Report →</a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </Page>
      )}
    </div>
  );
});

export default PDFTemplate;
