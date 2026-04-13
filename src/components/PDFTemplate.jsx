import React, { forwardRef } from 'react';
import { formatDateDisplay } from '../utils/extractor';

const AMBER_500 = '#f59e0b';
const AMBER_400 = '#fbbf24';
const AMBER_300 = '#fcd34d';
const AMBER_200 = '#fde68a';
const AMBER_100 = '#fef3c7';
const INK = '#0f172a';
const SLATE = '#475569';
const RULE = '#e2e8f0';
const AM = '#fffdf5';

const PARTY_LOGOS = {
  'jan-suraaj': new URL('/logo.png', window.location.origin).href,
  'jdu': new URL('/jdu.jpeg', window.location.origin).href,
  'rjd': new URL('/rjd.jpeg', window.location.origin).href,
  'congress': new URL('/congress.jpeg', window.location.origin).href,
};

const SECTION_LOGOS = {
  'national': new URL('/national.jpeg', window.location.origin).href,
  'international': new URL('/international.jpeg', window.location.origin).href,
  'opinion': new URL('/opinion.jpeg', window.location.origin).href,
  'civic': new URL('/civic.jpeg', window.location.origin).href,
};

const PARTY_NAMES = {
  'jan-suraaj': 'Jan Suraaj',
  'bjp': 'Bhartiya Janta Party',
  'jdu': 'Janata Dal (United)',
  'rjd': 'Rashtriya Janata Dal',
  'congress': 'Indian National Congress',
  'other': 'Other Party'
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Outfit:wght@300;400;600;700;800&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  .mag-wrapper { width: 210mm; background: #bbb; display: block; margin: 0; padding: 0; }
  .mag-root {
    width: 210mm; height: 296.8mm; background: ${AM}; color: ${INK};
    font-family: 'Libre Baskerville', serif; position: relative;
    display: flex; flex-direction: column; overflow: hidden;
  }
  .page-break { page-break-before: always; }

  .tri-tl-outer { position: absolute; top: 0; left: 0; border-top: 130px solid ${AMBER_500}; border-right: 130px solid transparent; z-index: 5; }
  .tri-tl-inner { position: absolute; top: 0; left: 0; border-top: 100px solid ${AMBER_300}; border-right: 100px solid transparent; z-index: 6; }
  .tri-br-outer { position: absolute; bottom: 0; right: 0; border-bottom: 130px solid ${AMBER_500}; border-left: 130px solid transparent; z-index: 5; }
  .tri-br-inner { position: absolute; bottom: 0; right: 0; border-bottom: 100px solid ${AMBER_400}; border-left: 100px solid transparent; z-index: 6; }

  .mag-page { padding: 40px 52px 130px; position: relative; flex: 1; display: flex; flex-direction: column; z-index: 10; overflow: hidden; }
  
  .masthead-title { text-align: center; font-family: 'Playfair Display', serif; font-size: 60px; font-weight: 900; line-height: 1; color: ${INK}; margin-top: 10px; }
  .masthead-title span { color: ${AMBER_400}; font-style: italic; }
  
  .meta-bar { display: flex; justify-content: center; padding: 6px 0; border-bottom: 4px solid ${INK}; font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 900; text-transform: uppercase; margin-bottom: 25px; }
  .meta-date { background: ${AMBER_300}; padding: 3px 20px; border-radius: 4px; border: 2.5px solid ${INK}; transform: translateY(14px); }

  .ribbon-banner { background: ${AMBER_400}; margin: 5px -52px 25px; padding: 12px 52px; text-align: center; border-top: 2px solid ${INK}; border-bottom: 2px solid ${INK}; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
  .ribbon-text { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: 6px; color: ${INK}; }

  .party-tag { display: inline-block; background: ${AMBER_400}; color: ${INK}; font-family: 'Outfit', sans-serif; font-size: 9.5px; font-weight: 900; padding: 2.5px 9px; border-radius: 4px; margin-bottom: 7px; text-transform: uppercase; }

  .news-card { display: flex; gap: 15px; padding: 15px 0; border-bottom: 1px solid ${RULE}; }
  .news-card-logo { width: 55px; height: 55px; object-fit: contain; }
  .news-card-body { flex: 1; }
  .news-card-h { font-family: 'Playfair Display', serif; font-size: 19px; font-weight: 700; margin-bottom: 6px; line-height: 1.35; color: ${INK}; }
  .news-card-p { font-size: 11px; line-height: 1.6; color: ${SLATE}; }
  .read-more { font-family: 'Outfit', sans-serif; font-size: 9.5px; font-weight: 800; color: ${INK}; text-decoration: none; border-bottom: 3px solid ${AMBER_400}; display: inline-block; margin-top: 10px; text-transform: uppercase; }

  .tweet-sidebar { background: #fff; border: 2px solid ${AMBER_300}; padding: 15px; border-radius: 10px; box-shadow: 4px 4px 0px ${AMBER_200}; }
  .sidebar-h { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 900; border-bottom: 3px solid ${AMBER_400}; padding-bottom: 6px; margin-bottom: 12px; text-transform: uppercase; text-align: center; }
  .t-card { margin-bottom: 12px; border-bottom: 1px dashed ${AMBER_200}; padding-bottom: 10px; }
  .t-user { font-family: 'Outfit', sans-serif; font-size: 9px; font-weight: 800; color: ${AMBER_500}; display: block; }

  .mag-footer { position: absolute; bottom: 0; left: 0; width: 100%; border-top: 4px solid ${INK}; padding: 12px 52px; background: ${AMBER_400}; display: flex; align-items: center; justify-content: space-between; z-index: 20; height: 50px; }
  .f-brand { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 900; }
  .f-meta { font-family: 'Outfit', sans-serif; font-size: 10px; font-weight: 800; text-transform: uppercase; }
  .f-pg { width: 32px; height: 32px; background: ${INK}; color: ${AMBER_400}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 900; }
`;

const PDFTemplate = forwardRef(({ date, articles, tweets }, ref) => {
  const dateDisplay = formatDateDisplay(date);

  const hNews = articles.filter(a => a.category === 'headlines').slice(0, 3);
  const pNews = articles.filter(a => a.category === 'political');
  const cNews = articles.filter(a => a.category === 'civic');
  const oNews = articles.filter(a => a.category === 'opinion');
  const nNews = articles.filter(a => a.category === 'national');
  const iNews = articles.filter(a => a.category === 'international');

  const pNewsP1 = pNews.slice(0, 2);
  const restOfNewsGroup = [
    ...pNews.slice(2),
    ...cNews.map(a => ({ ...a, sTitle: 'Civic & Social' })),
    ...oNews.map(a => ({ ...a, sTitle: 'Opinion & Editorial', type: 'op' })),
    ...nNews.map(a => ({ ...a, sTitle: 'National Pulse' })),
    ...iNews.map(a => ({ ...a, sTitle: 'International Desk' }))
  ];

  // BALANCED CHUNKING: Use 4 items per page for Page 2+ to ensure bottom whitespace
  const chunks = [];
  const itemsPerPage = 4;
  for (let i = 0; i < restOfNewsGroup.length; i += itemsPerPage) {
    chunks.push(restOfNewsGroup.slice(i, i + itemsPerPage));
  }

  const tweetsP1 = tweets.slice(0, 7);
  const restOfTweets = tweets.slice(7);
  const tweetChunks = [];
  const tweetsPerPage = 7;
  for (let i = 0; i < restOfTweets.length; i += tweetsPerPage) {
    tweetChunks.push(restOfTweets.slice(i, i + tweetsPerPage));
  }

  const renderCard = (a, i, category = 'political') => (
    <div key={i} className="news-card">
      <div style={{ display: 'flex', gap: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {category === 'political' && (
            <img src={a.customLogo || PARTY_LOGOS[a.party]} className="news-card-logo" crossOrigin="anonymous" />
          )}
        </div>
        <div className="news-card-body">
          {category === 'political' && a.party && (
            <div className="party-tag">{a.party === 'jan-suraaj' ? 'Jan Suraaj' : (PARTY_NAMES[a.party] || a.party)}</div>
          )}
          <div className="news-card-h">{a.headline}</div>
          <div className="news-card-p">{a.summary}</div>
          <a href={a.url} className="read-more">Read More →</a>
        </div>
      </div>
    </div>
  );

  const getSectionLogo = (sTitle) => {
    if (sTitle === 'Civic & Social') return SECTION_LOGOS.civic;
    if (sTitle === 'Opinion & Editorial') return SECTION_LOGOS.opinion;
    if (sTitle === 'National Pulse') return SECTION_LOGOS.national;
    if (sTitle === 'International Desk') return SECTION_LOGOS.international;
    return null;
  };

  const renderSectionHeading = (sTitle) => {
    const logo = getSectionLogo(sTitle);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '15px 0 8px' }}>
        {logo && <img src={logo} style={{ width: 45, height: 45, objectFit: 'contain' }} crossOrigin="anonymous" />}
        <h2 style={{ fontFamily: 'Playfair Display', fontSize: '20px' }}>{sTitle}</h2>
        <div style={{ flex: 1, height: '1px', background: RULE }} />
      </div>
    );
  };

  const MasterPage = ({ children, pgNum, showMasthead = false }) => (
    <div className={`mag-root ${pgNum > 1 ? 'page-break' : ''}`}>
      <div className="tri-tl-outer" /><div className="tri-tl-inner" />
      <div className="tri-br-outer" /><div className="tri-br-inner" />
      <div className="mag-page" style={{ paddingTop: showMasthead ? '40px' : '90px' }}>
        {showMasthead && (
          <>
            <div className="masthead-title">Bihar Media <span>Scan</span></div>
            <div className="meta-bar"><span className="meta-date">{dateDisplay}</span></div>
            <div className="ribbon-banner"><span className="ribbon-text">News of the Day</span></div>
          </>
        )}
        {children}
      </div>
      <footer className="mag-footer">
        <div className="f-brand">Bihar Media Scan</div>
        <div className="f-meta">Bihar's Leading Journal • {dateDisplay}</div>
        <div className="f-pg">{pgNum}</div>
      </footer>
    </div>
  );

  return (
    <div ref={ref} className="mag-wrapper">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* PAGE 1 */}
      <MasterPage pgNum={1} showMasthead={true}>
        {hNews.length > 0 && (
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span className="party-tag" style={{ background: INK, color: AMBER_400, marginBottom: 0 }}>Latest Update</span>
              <h2 style={{ fontFamily: 'Playfair Display', fontSize: '22px' }}>Top Headlines</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px' }}>
              {hNews.map((a, i) => (
                <div key={i} style={{ background: AMBER_100, border: '1px solid ' + AMBER_200, borderTop: '4px solid ' + AMBER_500, borderRadius: '6px', overflow: 'hidden' }}>
                  {a.image && <img src={a.image} style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover' }} crossOrigin="anonymous" />}
                  <div style={{ padding: '10px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', fontFamily: 'Playfair Display' }}>{a.headline}</div>
                    <a href={a.url} style={{ fontSize: '8px', fontWeight: 'bold', color: INK, marginTop: '8px', textDecoration: 'none', borderBottom: '2px solid ' + AMBER_400, display: 'inline-block' }}>READ MORE →</a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: tweetsP1.length > 0 ? '2.1fr 0.9fr' : '1fr', gap: '24px' }}>
          <div>
            {pNewsP1.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '15px 0 8px' }}>
                <h2 style={{ fontFamily: 'Playfair Display', fontSize: '20px' }}>Political Landscape</h2>
                <div style={{ flex: 1, height: '1px', background: RULE }} />
              </div>
            )}
            {pNewsP1.map((a, i) => renderCard(a, i, 'political'))}
          </div>
          {tweetsP1.length > 0 && (
            <div className="side-col">
              <div className="tweet-sidebar">
                <div className="sidebar-h">Twitter Trendings</div>
                {tweetsP1.map((t, idx) => (
                  <div key={idx} className="t-card">
                    {t.image && <img src={t.image} style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 4, marginBottom: 8 }} crossOrigin="anonymous" />}
                    <span className="t-user">{t.user}</span>
                    <p style={{ fontSize: '9px', fontStyle: 'italic' }}>"{ t.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </MasterPage>

      {/* DYNAMIC PAGES 2+ */}
      {chunks.map((chunk, cIdx) => (
        <MasterPage key={cIdx} pgNum={cIdx + 2}>
          <div style={{ display: 'grid', gridTemplateColumns: tweetChunks[cIdx]?.length > 0 ? '2.1fr 0.9fr' : '1fr', gap: '24px' }}>
            <div style={{ flex: 1 }}>
              {chunk.map((a, i) => (
                <div key={i}>
                  {(i === 0 || a.sTitle !== chunk[i - 1].sTitle) && renderSectionHeading(a.sTitle)}
                  {renderCard(a, i, a.category)}
                </div>
              ))}
            </div>
            {tweetChunks[cIdx]?.length > 0 && (
              <div className="tweet-sidebar">
                <div className="sidebar-h">Twitter Trendings</div>
                {tweetChunks[cIdx].map((t, idx) => (
                  <div key={idx} className="t-card">
                    {t.image && <img src={t.image} style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 4, marginBottom: 8 }} crossOrigin="anonymous" />}
                    <span className="t-user">{t.user}</span>
                    <p style={{ fontSize: '9px', fontStyle: 'italic' }}>"{ t.text}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </MasterPage>
      ))}
    </div>
  );
});

export default PDFTemplate;
