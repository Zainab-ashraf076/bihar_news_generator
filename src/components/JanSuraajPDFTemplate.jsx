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
  'jan-suraaj': new URL('/js.png', window.location.origin).href,
  'bjp': new URL('/bjp.png', window.location.origin).href,
  'jdu': new URL('/JDU.png', window.location.origin).href,
  'rjd': new URL('/rjd.png', window.location.origin).href,
  'congress': new URL('/Congress.png', window.location.origin).href,
};

const SECTION_LOGOS = {
  'national': new URL('/National.png', window.location.origin).href,
  'international': new URL('/International.png', window.location.origin).href,
  'opinion': new URL('/Opinion.png', window.location.origin).href,
  'civic': new URL('/Civic.png', window.location.origin).href,
};

const PARTY_NAMES = {
  'jan-suraaj': 'Jan Suraaj',
  'bjp': 'Bhartiya Janta Party',
  'jdu': 'Janata Dal (United)',
  'rjd': 'Rashtriya Janata Dal',
  'congress': 'Indian National Congress',
  'other': 'Other Party',
};

// ─── Page dimension constants ─────────────────────────────────────────────────
const PAGE_HEIGHT_PX = 1121;   // 296.8mm at 96dpi
const FOOTER_HEIGHT = 50;
const PAGE_TOP_MASTHEAD = 40;
const PAGE_TOP_NORMAL = 90;
const PAGE_BOTTOM_GAP = 65;    // breathing room above footer
const PAGE_SIDE_PAD = 52;

// Usable content height per page type
const USABLE_HEIGHT_P1 = PAGE_HEIGHT_PX - PAGE_TOP_MASTHEAD - FOOTER_HEIGHT - PAGE_BOTTOM_GAP;
const USABLE_HEIGHT_REST = PAGE_HEIGHT_PX - PAGE_TOP_NORMAL - FOOTER_HEIGHT - PAGE_BOTTOM_GAP;

// Approximate heights of fixed UI elements (px)
const MASTHEAD_H = 155;  // title + meta-bar + ribbon
const TOP_HEADLINES_H = 420;  // section header + 1 full + 2 small cards layout
const POLITICAL_SECTION_HDG_H = 45;
const SECTION_HEADING_H = 68;   // section icon + text + margin

// Text layout constants
const HEADLINE_LINE_H = 25.65;  // 19px * 1.35
const SUMMARY_LINE_H = 17.6;   // 11px * 1.6
const CHARS_PER_LINE = 88;     // approx chars per summary line at full width

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Outfit:wght@300;400;600;700;800&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Noto+Sans+Devanagari:wght@400;700;900&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  .mag-wrapper { width: 210mm; background: #bbb; display: block; margin: 0; padding: 0; }

  .mag-root {
    width: 210mm; height: 296.8mm;
    background: ${AM}; color: ${INK};
    font-family: 'Libre Baskerville', serif;
    position: relative; display: flex; flex-direction: column;
    overflow: hidden;
  }
  .page-break { page-break-before: always; break-before: page; }

  .tri-tl-outer { position:absolute; top:0; left:0; border-top:130px solid ${AMBER_500}; border-right:130px solid transparent; z-index:5; pointer-events:none; }
  .tri-tl-inner { position:absolute; top:0; left:0; border-top:100px solid ${AMBER_300}; border-right:100px solid transparent; z-index:6; pointer-events:none; }
  .tri-br-outer { position:absolute; bottom:0; right:0; border-bottom:130px solid ${AMBER_500}; border-left:130px solid transparent; z-index:5; pointer-events:none; }
  .tri-br-inner { position:absolute; bottom:0; right:0; border-bottom:100px solid ${AMBER_400}; border-left:100px solid transparent; z-index:6; pointer-events:none; }

  .mag-page {
    padding: 40px ${PAGE_SIDE_PAD}px ${FOOTER_HEIGHT + PAGE_BOTTOM_GAP}px;
    position: relative; flex: 1; min-height: 0;
    display: flex; flex-direction: column;
    z-index: 10; overflow: hidden;
  }

  .masthead-title { text-align:center; font-family:'Playfair Display',serif; font-size:60px; font-weight:900; line-height:1; color:${INK}; margin-top:10px; }
  .masthead-title span { color:${AMBER_400}; font-style:italic; }

  .meta-bar { display:flex; justify-content:center; padding:6px 0; border-bottom:4px solid ${INK}; font-family:'Outfit',sans-serif; font-size:11px; font-weight:900; text-transform:uppercase; margin-bottom:25px; }
  .meta-date { background:${AMBER_300}; padding:3px 20px; border-radius:4px; border:2.5px solid ${INK}; transform:translateY(14px); }

  .ribbon-banner { background:${AMBER_400}; margin:5px -${PAGE_SIDE_PAD}px 25px; padding:12px ${PAGE_SIDE_PAD}px; text-align:center; border-top:2px solid ${INK}; border-bottom:2px solid ${INK}; box-shadow:0 4px 8px rgba(0,0,0,0.1); }
  .ribbon-text { font-family:'Noto Sans Devanagari','Playfair Display',serif; font-size:20px; font-weight:900; letter-spacing:1px; color:${INK}; }

  .party-tag { display:inline-block; background:${AMBER_400}; color:${INK}; font-family:'Outfit',sans-serif; font-size:9.5px; font-weight:900; padding:2.5px 9px; border-radius:4px; margin-bottom:7px; text-transform:uppercase; }

  .news-card { display:flex; gap:15px; padding:15px 0; border-bottom:1px solid ${RULE}; }
  .news-card-logo { width:55px; height:55px; object-fit:contain; flex-shrink:0; }
  .news-card-body { flex:1; min-width:0; }
  .news-card-h { font-family:'Playfair Display',serif; font-size:16px; font-weight:700; margin-bottom:6px; line-height:1.35; color:${INK}; }
  .news-card-p { font-size:11px; line-height:1.6; color:${SLATE}; }
  .read-more { font-family:'Outfit',sans-serif; font-size:9.5px; font-weight:800; color:${INK}; text-decoration:none; border-bottom:3px solid ${AMBER_400}; display:inline-block; margin-top:10px; text-transform:uppercase; }

  .cont-label { font-size:9px; color:${SLATE}; font-style:italic; margin-bottom:4px; }
  .cont-headline { font-size:13px; font-weight:700; font-family:'Playfair Display',serif; color:${INK}; margin-bottom:6px; line-height:1.35; }

  .tweet-sidebar { background:#fff; border:4px solid ${AMBER_400}; padding:15px; border-radius:10px; box-shadow:4px 4px 0px ${AMBER_200}; overflow:hidden; display: flex; flex-direction: column; width: 100%; max-width: 100%; margin-bottom: 20px; }
  .sidebar-h { font-family:'Playfair Display',serif; font-size:16px; font-weight:900; border-bottom:3px solid ${AMBER_400}; padding-bottom:6px; margin-bottom:12px; text-transform:uppercase; text-align:center; }
  .t-card { margin-bottom:12px; border-bottom:1px dashed ${AMBER_200}; padding-bottom:10px; width: 100%; }
  .t-user { font-family:'Outfit',sans-serif; font-size:9px; font-weight:800; color:${AMBER_500}; display:block; }
  .t-text { fontSize:9px; fontStyle:italic; word-break: break-all; width: 100%; }

  .mag-footer { position:absolute; bottom:0; left:0; width:100%; border-top:4px solid ${INK}; padding:12px ${PAGE_SIDE_PAD}px; background:${AMBER_400}; display:flex; align-items:center; justify-content:space-between; z-index:20; height:${FOOTER_HEIGHT}px; }
  .f-brand { font-family:'Playfair Display',serif; font-size:17px; font-weight:900; }
  .f-meta { font-family:'Outfit',sans-serif; font-size:10px; font-weight:800; text-transform:uppercase; }
  .f-pg { width:32px; height:32px; background:${INK}; color:${AMBER_400}; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:900; }
`;

// ─── Height estimators ────────────────────────────────────────────────────────

function estimateCardHeight(article, category, isContinuation = false) {
  const partyTagH = (category === 'political' && !isContinuation) ? 25 : 0;
  const logoH = (category === 'political' && !isContinuation) ? 55 : 0;
  const headlineChars = (article.headline || '').length;
  const headlineLines = Math.ceil(headlineChars / 45);
  const headlineH = isContinuation
    ? Math.ceil(headlineChars / 55) * 18 + 10   // smaller continuation headline
    : headlineLines * HEADLINE_LINE_H;
  const summaryChars = (article.summary || '').length;
  const summaryLines = Math.ceil(summaryChars / CHARS_PER_LINE);
  const summaryH = summaryLines * SUMMARY_LINE_H;
  const readMoreH = 35;
  const paddingV = 45;

  const bodyH = partyTagH + headlineH + summaryH + readMoreH;
  const innerH = Math.max(logoH, bodyH);
  return innerH + paddingV;
}

// ─── Page slot allocator ──────────────────────────────────────────────────────
function allocatePages(flowItems, firstPageAvailableH) {
  const pages = [];
  let slots = [];
  let remainH = firstPageAvailableH;

  function commitPage() {
    pages.push({ slots });
    slots = [];
    remainH = USABLE_HEIGHT_REST;
  }

  function addSlot(slot, h) {
    slots.push(slot);
    remainH -= h;
  }

  let prevSTitle = null;

  for (let i = 0; i < flowItems.length; i++) {
    const a = flowItems[i];
    if (a.sTitle !== prevSTitle) {
      prevSTitle = a.sTitle;
      const hH = SECTION_HEADING_H;
      if (remainH < hH + 80) { commitPage(); }
      addSlot({ type: 'sectionHeading', sTitle: a.sTitle }, hH);
    }
    const fullH = estimateCardHeight(a, a.category, false);
    if (fullH <= remainH) {
      addSlot({ type: 'card', article: a, category: a.category }, fullH);
      continue;
    }
    const summary = a.summary || '';
    const partyTagH = a.category === 'political' ? 25 : 0;
    const logoH = a.category === 'political' ? 55 : 0;
    const headlineH = Math.ceil((a.headline || '').length / 45) * HEADLINE_LINE_H;
    const readMoreH = 30;
    const paddingV = 30;
    const fixedBodyH = partyTagH + headlineH + readMoreH;
    const fixedH = Math.max(logoH, fixedBodyH) + paddingV;

    const summaryAvailH = remainH - fixedH;
    const linesAvail = Math.floor(summaryAvailH / SUMMARY_LINE_H);
    const charsAvail = linesAvail * CHARS_PER_LINE;

    if (linesAvail < 2 || charsAvail <= 0) {
      commitPage();
      addSlot({ type: 'card', article: a, category: a.category }, Math.min(fullH, remainH));
      continue;
    }
    if (charsAvail >= summary.length) {
      commitPage();
      addSlot({ type: 'card', article: a, category: a.category }, fullH);
      continue;
    }
    let splitAt = charsAvail;
    while (splitAt > 0 && summary[splitAt] !== ' ') splitAt--;
    if (splitAt === 0) splitAt = charsAvail;
    const part1Summary = summary.slice(0, splitAt).trimEnd() + '…';
    const part2Summary = '…' + summary.slice(splitAt).trimStart();
    addSlot({ type: 'card', article: { ...a, summary: part1Summary }, category: a.category, isSplitStart: true }, remainH);
    commitPage();
    const contH = estimateCardHeight({ ...a, summary: part2Summary }, a.category, true);
    addSlot({ type: 'cardContinuation', article: { ...a, summary: part2Summary }, category: a.category }, Math.min(contH, remainH));
  }
  if (slots.length > 0) { pages.push({ slots }); }
  return pages;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
const SectionHeading = ({ sTitle }) => {
  if (!sTitle) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '15px 0 8px' }}>
      <h2 style={{ fontFamily: "'Noto Sans Devanagari','Playfair Display',serif", fontSize: '20px', fontWeight: 700, whiteSpace: 'nowrap' }}>
        {sTitle}
      </h2>
      <div style={{ flex: 1, height: '1px', background: RULE }} />
    </div>
  );
};

const NewsCard = ({ article: a, category, isContinuation = false }) => (
  <div className="news-card">
    <div style={{ display: 'flex', gap: '15px', width: '100%' }}>
      {category === 'political' && !isContinuation && (
        <img src={a.customLogo || PARTY_LOGOS[a.party]} className="news-card-logo" crossOrigin="anonymous" alt="" />
      )}
      <div className="news-card-body">
        {category === 'political' && a.party && !isContinuation && (
          <div className="party-tag">{PARTY_NAMES[a.party] || a.party}</div>
        )}
        {isContinuation && <div className="cont-label">↳ {a.headline} (continued)</div>}
        {!isContinuation && <div className="news-card-h">{a.headline}</div>}
        <div className="news-card-p">{a.summary}</div>
        <a href={a.url} className="read-more">Read More →</a>
      </div>
    </div>
  </div>
);

const TweetSidebar = ({ tweets, showTitle = true, isFirst = true, isLast = true }) => (
  <div className="tweet-sidebar" style={{
    borderTop: isFirst ? `4px solid ${AMBER_400}` : 'none',
    borderBottom: isLast ? `12px solid ${AMBER_500}` : `4px solid ${AMBER_400}`,
    borderTopLeftRadius: isFirst ? '10px' : '0',
    borderTopRightRadius: isFirst ? '10px' : '0',
    borderBottomLeftRadius: isLast ? '10px' : '0',
    borderBottomRightRadius: isLast ? '10px' : '0',
  }}>
    {showTitle && <div className="sidebar-h">JS Tweets</div>}
    {tweets.map((t, i) => (
      <div key={i} className="t-card">
        {t.image && <img src={t.image} style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 4, marginBottom: 8 }} crossOrigin="anonymous" alt="" />}
        <span className="t-user">{t.user}</span>
        <p className="t-text">"{t.text}"</p>
      </div>
    ))}
  </div>
);

const MasterPage = ({ children, pgNum, dateDisplay, showMasthead }) => (
  <div className={`mag-root${pgNum > 1 ? ' page-break' : ''}`}>
    <div className="tri-tl-outer" /><div className="tri-tl-inner" />
    <div className="tri-br-outer" /><div className="tri-br-inner" />

    <div className="mag-page" style={{ paddingTop: showMasthead ? `${PAGE_TOP_MASTHEAD}px` : `${PAGE_TOP_NORMAL}px` }}>
      {showMasthead && (
        <>
          <div className="masthead-title">Jan Suraaj <span>News</span></div>
          <div className="meta-bar"><span className="meta-date">{dateDisplay}</span></div>
          <div className="ribbon-banner"><span className="ribbon-text">जन सुराज समाचार</span></div>
        </>
      )}
      {children}
    </div>

    <footer className="mag-footer">
      <div className="f-brand">Jan Suraaj News</div>
      <div className="f-meta">
        Bihar's Leading Journal • {dateDisplay} •
        <a href="https://www.jansuraaj.org" target="_blank" rel="noopener noreferrer" style={{ color: INK, textDecoration: 'underline', marginLeft: '5px' }}>www.jansuraaj.org</a>
      </div>
      <div className="f-pg">{pgNum}</div>
    </footer>
  </div>
);

const JanSuraajPDFTemplate = forwardRef(({ date, articles, tweets }, ref) => {
  const dateDisplay = formatDateDisplay(date);

  const hNews = articles.filter(a => a.category === 'headlines').slice(0, 3);
  const pNews = articles.filter(a => a.category === 'political');

  const flowItems = [
    ...pNews.map(a => ({ ...a, sTitle: '  जन सुराज से जुड़ी खबरें', category: 'political' })),
  ];

  const headlinesH = hNews.length > 0 ? TOP_HEADLINES_H : 0;
  const p1Fixed = MASTHEAD_H + headlinesH;
  const p1Available = USABLE_HEIGHT_P1 - p1Fixed;

  const useP1Overflow = p1Available > 150;
  const startH = useP1Overflow ? p1Available : USABLE_HEIGHT_REST;
  const allocatedPages = allocatePages(flowItems, startH);

  const p1ExtraSlots = useP1Overflow ? (allocatedPages[0]?.slots || []) : [];
  const dynamicPages = useP1Overflow ? allocatedPages.slice(1) : allocatedPages;

  const totalPages = 1 + dynamicPages.length;
  const tweetsPerPage = Math.ceil(tweets.length / totalPages);

  const tweetsByPage = Array.from({ length: totalPages }, (_, i) =>
    tweets.slice(i * tweetsPerPage, (i + 1) * tweetsPerPage)
  );

  const p1Tweets = tweetsByPage[0] || [];

  return (
    <div ref={ref} className="mag-wrapper">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <MasterPage pgNum={1} dateDisplay={dateDisplay} showMasthead>
        {/* Top Jan Suraaj News - 1 Full + 2 Half layout */}
        {hNews.length > 0 && (
          <section style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span className="party-tag" style={{ background: INK, color: AMBER_400, marginBottom: 0 }}>Jan Suraaj</span>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '22px' }}>Top Headlines</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {/* Big Featured Card (Full Width) */}
              {hNews[0] && (
                <div style={{ background: AMBER_100, border: `1px solid ${AMBER_200}`, borderTop: `4px solid ${AMBER_500}`, borderRadius: '6px', overflow: 'hidden', display: 'flex', minHeight: '200px' }}>
                  {hNews[0].image && <img src={hNews[0].image} style={{ width: '40%', objectFit: 'cover' }} crossOrigin="anonymous" alt="" />}
                  <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: "'Playfair Display',serif", lineHeight: '1.3', marginBottom: '10px' }}>{hNews[0].headline}</div>
                    <div style={{ fontSize: '11px', color: SLATE, lineHeight: '1.5', marginBottom: '12px' }}>{hNews[0].summary}</div>
                    <a href={hNews[0].url} style={{ fontSize: '10px', fontWeight: 'bold', color: INK, textDecoration: 'none', borderBottom: `2px solid ${AMBER_400}`, alignSelf: 'flex-start' }}>READ MORE →</a>
                  </div>
                </div>
              )}

              {/* Two Smaller Cards Below */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                {hNews.slice(1, 3).map((a, i) => (
                  <div key={i} style={{ background: AMBER_100, border: `1px solid ${AMBER_200}`, borderTop: `4px solid ${AMBER_500}`, borderRadius: '6px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    {a.image && <img src={a.image} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} crossOrigin="anonymous" alt="" />}
                    <div style={{ padding: '10px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', fontFamily: "'Playfair Display',serif", lineHeight: '1.35', marginBottom: '8px' }}>{a.headline}</div>
                      <a href={a.url} style={{ fontSize: '8px', fontWeight: 'bold', color: INK, textDecoration: 'none', borderBottom: `2px solid ${AMBER_400}`, display: 'inline-block' }}>READ MORE →</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: p1Tweets.length > 0 ? 'minmax(0, 2.1fr) minmax(0, 0.9fr)' : '1fr', gap: '24px', flex: 1 }}>
          <div style={{ minWidth: 0 }}>
            {p1ExtraSlots.map((slot, i) => {
              if (slot.type === 'sectionHeading') return <SectionHeading key={i} sTitle={slot.sTitle} />;
              return <NewsCard key={i} article={slot.article} category={slot.category} isContinuation={slot.type === 'cardContinuation'} />;
            })}
          </div>
          {p1Tweets.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <TweetSidebar
                tweets={p1Tweets}
                showTitle={true}
                isFirst={true}
                isLast={tweetsByPage.length <= 1 || tweetsByPage.slice(1).every(p => p.length === 0)}
              />
            </div>
          )}
        </div>
      </MasterPage>

      {dynamicPages.map((page, pIdx) => {
        const pgNum = pIdx + 2;
        const pageTweets = tweetsByPage[pgNum - 1] || [];
        return (
          <MasterPage key={pgNum} pgNum={pgNum} dateDisplay={dateDisplay} showMasthead={false}>
            <div style={{ display: 'grid', gridTemplateColumns: pageTweets.length > 0 ? 'minmax(0, 2.1fr) minmax(0, 0.9fr)' : '1fr', gap: '24px', flex: 1 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {page.slots.map((slot, sIdx) => {
                  if (slot.type === 'sectionHeading') return <SectionHeading key={sIdx} sTitle={slot.sTitle} />;
                  return <NewsCard key={sIdx} article={slot.article} category={slot.category} isContinuation={slot.type === 'cardContinuation'} />;
                })}
              </div>
              {pageTweets.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <TweetSidebar
                    tweets={pageTweets}
                    showTitle={false}
                    isFirst={false}
                    isLast={pIdx === dynamicPages.length - 1 || (tweetsByPage[pgNum]?.length === 0)}
                  />
                </div>
              )}
            </div>
          </MasterPage>
        );
      })}
    </div>
  );
});

export default JanSuraajPDFTemplate;
