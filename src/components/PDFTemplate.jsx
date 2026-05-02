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
const PAGE_HEIGHT_PX   = 1121;   // 296.8mm at 96dpi
const FOOTER_HEIGHT    = 50;
const PAGE_TOP_MASTHEAD = 40;
const PAGE_TOP_NORMAL   = 90;
const PAGE_BOTTOM_GAP   = 30;    // breathing room above footer
const PAGE_SIDE_PAD     = 45; // Reduced from 50 to prevent overflow

// Usable content height per page type
const USABLE_HEIGHT_P1   = PAGE_HEIGHT_PX - PAGE_TOP_MASTHEAD - FOOTER_HEIGHT - PAGE_BOTTOM_GAP;
const USABLE_HEIGHT_REST = PAGE_HEIGHT_PX - PAGE_TOP_NORMAL   - FOOTER_HEIGHT - PAGE_BOTTOM_GAP;

// Approximate heights of fixed UI elements (px)
const MASTHEAD_H              = 155;  // title + meta-bar + ribbon
const TOP_HEADLINES_H         = 250;  // section header + 3-col image grid
const POLITICAL_SECTION_HDG_H = 45;
const SECTION_HEADING_H       = 68;   // section icon + text + margin

// Text layout constants
const HEADLINE_LINE_H = 25.65;  // 19px * 1.35
const SUMMARY_LINE_H  = 17.6;   // 11px * 1.6
const CHARS_PER_LINE  = 88;     // approx chars per summary line at full width

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

  /* KEY: flex:1 + min-height:0 lets the content area shrink within fixed page.
     padding-bottom = footer(50) + gap(30) = 80px — content never hides under footer. */
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
  .news-card-h { font-family:'Playfair Display',serif; font-size:19px; font-weight:700; margin-bottom:6px; line-height:1.35; color:${INK}; word-break: break-word; }
  .news-card-p { font-size:11px; line-height:1.6; color:${SLATE}; word-break: break-word; }
  .read-more { font-family:'Outfit',sans-serif; font-size:9.5px; font-weight:800; color:${INK}; text-decoration:none; border-bottom:3px solid ${AMBER_400}; display:inline-block; margin-top:10px; text-transform:uppercase; }

  .cont-label { font-size:9px; color:${SLATE}; font-style:italic; margin-bottom:4px; }
  .cont-headline { font-size:13px; font-weight:700; font-family:'Playfair Display',serif; color:${INK}; margin-bottom:6px; line-height:1.35; word-break: break-word; }

  .tweet-sidebar { background:#fff; border:2px solid ${AMBER_300}; padding:15px; border-radius:10px; box-shadow:4px 4px 0px ${AMBER_200}; overflow:hidden; display: flex; flex-direction: column; width: 100%; max-height: 100%; }
  .sidebar-h { font-family:'Playfair Display',serif; font-size:16px; font-weight:900; border-bottom:3px solid ${AMBER_400}; padding-bottom:6px; margin-bottom:12px; text-transform:uppercase; text-align:center; }
  .t-card { margin-bottom:12px; border-bottom:1px dashed ${AMBER_200}; padding-bottom:10px; }
  .t-user { font-family:'Outfit',sans-serif; font-size:9px; font-weight:800; color:${AMBER_500}; display:block; }

  .mag-footer { position:absolute; bottom:0; left:0; width:100%; border-top:4px solid ${INK}; padding:12px ${PAGE_SIDE_PAD}px; background:${AMBER_400}; display:flex; align-items:center; justify-content:space-between; z-index:20; height:${FOOTER_HEIGHT}px; }
  .f-brand { font-family:'Playfair Display',serif; font-size:17px; font-weight:900; }
  .f-meta { font-family:'Outfit',sans-serif; font-size:10px; font-weight:800; text-transform:uppercase; }
  .f-pg { width:32px; height:32px; background:${INK}; color:${AMBER_400}; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:900; }
`;

// ─── Height estimators ────────────────────────────────────────────────────────

function estimateCardHeight(article, category, isContinuation = false) {
  const partyTagH = (category === 'political' && !isContinuation) ? 25 : 0;
  const logoH     = (category === 'political' && !isContinuation) ? 55 : 0;
  const headlineChars = (article.headline || '').length;
  const headlineLines = Math.ceil(headlineChars / 45);
  const headlineH = isContinuation
    ? Math.ceil(headlineChars / 55) * 18 + 10   // smaller continuation headline
    : headlineLines * HEADLINE_LINE_H;
  const summaryChars = (article.summary || '').length;
  const summaryLines = Math.ceil(summaryChars / CHARS_PER_LINE);
  const summaryH = summaryLines * SUMMARY_LINE_H;
  const readMoreH  = 30;
  const paddingV   = 30;

  const bodyH  = partyTagH + headlineH + summaryH + readMoreH;
  const innerH = Math.max(logoH, bodyH);
  return innerH + paddingV;
}

function estimateHeadlinesHeight(hNews) {
  if (hNews.length === 0) return 0;
  let maxH = 0;
  for (let a of hNews) {
    const chars = (a.headline || '').length + (a.summary || '').length;
    const textLines = Math.ceil(chars / 45);
    const textH = textLines * 18 + 50;
    const cardH = (a.image ? 150 : 0) + textH;
    if (cardH > maxH) maxH = cardH;
  }
  return maxH + 60;
}

// ─── Page slot allocator ──────────────────────────────────────────────────────
//
// A "slot" is one of:
//   { type: 'sectionHeading', sTitle }
//   { type: 'card', article, category }
//   { type: 'cardContinuation', article, category }  ← rest of a split card
//
// Returns: Array<{ slots: Slot[] }>

function allocatePages(flowItems, firstPageAvailableH) {
  const pages = [];

  // current page state
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
    if (a.isPageBreak) {
      addSlot({ type: 'pageBreak', id: a.id }, 40);
      commitPage();
      prevSTitle = null;
      continue;
    }

    // ── Section heading ─────────────────────────────────────────────
    if (a.sTitle !== prevSTitle && a.sTitle) {
      prevSTitle = a.sTitle;
      const hH = SECTION_HEADING_H;
      // Need heading + at least ~80px for one partial card below it
      if (remainH < hH + 80) {
        commitPage();
      }
      addSlot({ type: 'sectionHeading', sTitle: a.sTitle }, hH);
    }

    // ── Full card ───────────────────────────────────────────────────
    const fullH = estimateCardHeight(a, a.category, false);

    if (fullH <= remainH) {
      // Entire card fits
      addSlot({ type: 'card', article: a, category: a.category }, fullH);
      continue;
    }

    // ── Card needs splitting ────────────────────────────────────────
    const summary = a.summary || '';

    // Fixed overhead for first part (party tag + logo + headline + read-more + padding)
    const partyTagH  = a.category === 'political' ? 25 : 0;
    const logoH      = a.category === 'political' ? 55 : 0;
    const headlineH  = Math.ceil((a.headline || '').length / 45) * HEADLINE_LINE_H;
    const readMoreH  = 30;
    const paddingV   = 30;
    const fixedBodyH = partyTagH + headlineH + readMoreH;
    const fixedH     = Math.max(logoH, fixedBodyH) + paddingV;

    const summaryAvailH = remainH - fixedH;
    const linesAvail    = Math.floor(summaryAvailH / SUMMARY_LINE_H);
    const charsAvail    = linesAvail * CHARS_PER_LINE;

    if (linesAvail < 2 || charsAvail <= 0) {
      // Not enough room even for 2 summary lines — push whole card to next page
      commitPage();
      addSlot({ type: 'card', article: a, category: a.category }, Math.min(fullH, remainH));
      continue;
    }

    if (charsAvail >= summary.length) {
      // Summary fits but something else pushes total over — just push to next page
      commitPage();
      addSlot({ type: 'card', article: a, category: a.category }, fullH);
      continue;
    }

    // Find a clean word boundary to split at
    let splitAt = charsAvail;
    while (splitAt > 0 && summary[splitAt] !== ' ') splitAt--;
    if (splitAt === 0) splitAt = charsAvail; // fallback: hard split

    const part1Summary = summary.slice(0, splitAt).trimEnd() + '…';
    const part2Summary = '…' + summary.slice(splitAt).trimStart();

    // Part 1 on current page
    addSlot(
      { type: 'card', article: { ...a, summary: part1Summary }, category: a.category, isSplitStart: true },
      remainH  // fills remaining space on this page
    );

    commitPage();

    // Part 2 (continuation) on next page
    const contH = estimateCardHeight({ ...a, summary: part2Summary }, a.category, true);
    addSlot(
      { type: 'cardContinuation', article: { ...a, summary: part2Summary }, category: a.category },
      Math.min(contH, remainH)
    );
  }

  // Flush last page
  if (slots.length > 0) {
    pages.push({ slots });
  }

  return pages;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
const CanvasControl = ({ id, onMove, onAdjustY, onSetOffset, isTweet = false, xOffset = 0, yOffset = 0, onRemove, targetRef }) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const startMouse = React.useRef({ x: 0, y: 0 });
  const startOffset = React.useRef({ x: 0, y: 0 });

  const handleDragStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    startMouse.current = { x: e.clientX, y: e.clientY };
    startOffset.current = { x: xOffset || 0, y: yOffset || 0 };
    
    const onMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startMouse.current.x;
      const deltaY = moveEvent.clientY - startMouse.current.y;
      const newX = startOffset.current.x + deltaX;
      const newY = startOffset.current.y + deltaY;
      
      if (targetRef && targetRef.current) {
        targetRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
        targetRef.current.style.zIndex = '9999';
      }
    };

    const onMouseUp = (upEvent) => {
      const deltaX = upEvent.clientX - startMouse.current.x;
      const deltaY = upEvent.clientY - startMouse.current.y;
      
      setIsDragging(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      
      onSetOffset(id, startOffset.current.x + deltaX, startOffset.current.y + deltaY, isTweet);
      if (targetRef && targetRef.current) {
        targetRef.current.style.zIndex = '';
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className={`canvas-control ${isDragging ? 'dragging' : ''}`}>
      <div 
        className="control-btn drag-handle" 
        onMouseDown={handleDragStart}
        style={{ cursor: 'move', background: INK, color: AMBER_400, fontWeight: 'bold' }}
        title="Drag to move anywhere"
      >
        ✥
      </div>
      {onMove && <button className="control-btn" onClick={(e) => { e.stopPropagation(); onMove(id, 'up'); }} title="Move Up">↑</button>}
      {onMove && <button className="control-btn" onClick={(e) => { e.stopPropagation(); onMove(id, 'down'); }} title="Move Down">↓</button>}
      <div className="offset-control">
        <button className="offset-btn" onClick={(e) => { e.stopPropagation(); onAdjustY(id, -5, isTweet); }}>-</button>
        <span>{yOffset || 0}px</span>
        <button className="offset-btn" onClick={(e) => { e.stopPropagation(); onAdjustY(id, 5, isTweet); }}>+</button>
      </div>
      <button className="control-btn" onClick={(e) => { e.stopPropagation(); onRemove(id); }} title="Remove" style={{ color: '#ef4444' }}>×</button>
    </div>
  );
};

const SectionHeading = ({ sTitle, interactive, onAdjustY, onSetOffset, xOffset = 0, yOffset = 0 }) => {
  const logoMap = {
    'जंगल राज 2.O':    SECTION_LOGOS.civic,
    'विचार मंच':    SECTION_LOGOS.opinion,
    'देश की खबरें': SECTION_LOGOS.national,
    'विदेश दर्पण':  SECTION_LOGOS.international,
  };
  const logo = logoMap[sTitle];
  const headRef = React.useRef(null);
  return (
    <div 
      ref={headRef}
      className={`section-heading-wrapper ${interactive ? 'interactive-mode' : ''}`}
      style={{ 
        display:'flex', 
        alignItems:'center', 
        gap:'12px', 
        margin:'15px 0 8px',
        position: 'relative',
        transform: `translate(${xOffset}px, ${yOffset}px)`,
        marginBottom: `${yOffset < 0 ? 15 : (15 + yOffset)}px`
      }}
    >
      {interactive && (
        <CanvasControl 
          id={`heading-${sTitle}`} 
          onMove={() => {}} 
          onAdjustY={(id, amt) => onAdjustY(sTitle, amt, false, true)} 
          onSetOffset={(id, x, y) => onSetOffset(sTitle, x, y, false, true)} 
          xOffset={xOffset} 
          yOffset={yOffset} 
          onRemove={() => {}} 
          targetRef={headRef} 
        />
      )}
      {logo && <img src={logo} style={{ width:45, height:45, objectFit:'contain', flexShrink:0 }} crossOrigin="anonymous" alt="" />}
      <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'20px', whiteSpace:'nowrap' }}>{sTitle}</h2>
      <div style={{ flex:1, height:'1px', background:RULE }} />
    </div>
  );
};

const NewsCard = ({ article: a, category, isContinuation = false, interactive, onMove, onAdjustY, onSetOffset, onUpdateArticle, onRemove }) => {
  const cardRef = React.useRef(null);
  if (a.isCustomText) {
    return (
      <div ref={cardRef} className={`news-card-wrapper ${interactive ? 'interactive-mode' : ''}`} style={{ transform: `translate(${a.xOffset || 0}px, ${a.yOffset || 0}px)`, marginBottom: `${(a.yOffset || 0) < 0 ? 0 : (a.yOffset || 0)}px` }}>
        {interactive && <CanvasControl id={a.id} onMove={onMove} onAdjustY={onAdjustY} onSetOffset={onSetOffset} xOffset={a.xOffset} yOffset={a.yOffset} onRemove={onRemove} targetRef={cardRef} />}
        <div className="custom-text-box" style={{ padding: '10px', background: 'rgba(251, 191, 36, 0.1)', border: '1px dashed #fbbf24', borderRadius: '4px' }}>
          <div 
            className={`news-card-p ${interactive ? 'editable-text' : ''}`}
            style={{ fontSize: '12px', color: INK, minHeight: '20px' }}
            contentEditable={interactive}
            suppressContentEditableWarning={true}
            onBlur={(e) => onUpdateArticle(a.id, 'headline', e.target.innerText)}
          >
            {a.headline}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={cardRef} className={`news-card-wrapper ${interactive ? 'interactive-mode' : ''}`} style={{ transform: `translate(${a.xOffset || 0}px, ${a.yOffset || 0}px)`, marginBottom: `${(a.yOffset || 0) < 0 ? 0 : (a.yOffset || 0)}px` }}>
      {interactive && <CanvasControl id={a.id} onMove={onMove} onAdjustY={onAdjustY} onSetOffset={onSetOffset} xOffset={a.xOffset} yOffset={a.yOffset} onRemove={onRemove} targetRef={cardRef} />}
      <div className="news-card">
        <div style={{ display:'flex', gap:'15px', width:'100%' }}>
          {/* Show logo only on fresh cards, not continuations */}
          {category === 'political' && !isContinuation && (
            <img src={a.customLogo || PARTY_LOGOS[a.party]} className="news-card-logo" crossOrigin="anonymous" alt="" />
          )}
          <div className="news-card-body">
            {/* Party tag — fresh cards only */}
            {category === 'political' && a.party && !isContinuation && (
              <div className="party-tag">
                {PARTY_NAMES[a.party] || a.party}
              </div>
            )}
            {/* Continuation label */}
            {isContinuation && (
              <div className="cont-label">↳ {a.headline} (continued)</div>
            )}
            {/* Headline — fresh cards only */}
            {!isContinuation && (
              <div 
                className={`news-card-h ${interactive ? 'editable-text' : ''}`}
                contentEditable={interactive}
                suppressContentEditableWarning={true}
                onBlur={(e) => onUpdateArticle(a.id, 'headline', e.target.innerText)}
              >
                {a.headline}
              </div>
            )}
            <div 
              className={`news-card-p ${interactive ? 'editable-text' : ''}`}
              contentEditable={interactive}
              suppressContentEditableWarning={true}
              onBlur={(e) => onUpdateArticle(a.id, 'summary', e.target.innerText)}
            >
              {a.summary}
            </div>
            <a href={a.url} className="read-more">Read More →</a>
          </div>
        </div>
      </div>
    </div>
  );
};

const TweetCard = ({ t, interactive, onAdjustY, onSetOffset, onUpdateTweetField, onRemoveTweet }) => {
  const tweetRef = React.useRef(null);
  return (
    <div ref={tweetRef} className="tweet-wrapper" style={{ transform: `translate(${t.xOffset || 0}px, ${t.yOffset || 0}px)`, marginBottom: `${(t.yOffset || 0) < 0 ? 0 : (t.yOffset || 0)}px` }}>
      {interactive && (
         <div className="canvas-control" style={{ left: 'auto', right: '-10px', top: '0' }}>
            <div className="offset-control">
              <button className="offset-btn" onClick={(e) => { e.stopPropagation(); onAdjustY(t.id, -5, true); }}>-</button>
              <span>{t.yOffset || 0}px</span>
              <button className="offset-btn" onClick={(e) => { e.stopPropagation(); onAdjustY(t.id, 5, true); }}>+</button>
            </div>
            <button className="control-btn" onClick={(e) => { e.stopPropagation(); onRemoveTweet(t.id); }} title="Remove" style={{ color: '#ef4444' }}>×</button>
            <div 
              className="control-btn drag-handle" 
              onMouseDown={(e) => {
                e.preventDefault();
                const startX = e.clientX;
                const startY = e.clientY;
                const initialX = t.xOffset || 0;
                const initialY = t.yOffset || 0;
                
                const onMouseMove = (m) => {
                  const dx = m.clientX - startX;
                  const dy = m.clientY - startY;
                  if (tweetRef.current) {
                    tweetRef.current.style.transform = `translate(${initialX + dx}px, ${initialY + dy}px)`;
                  }
                };
                const onMouseUp = (m) => {
                  window.removeEventListener('mousemove', onMouseMove);
                  window.removeEventListener('mouseup', onMouseUp);
                  onSetOffset(t.id, initialX + (m.clientX - startX), initialY + (m.clientY - startY), true);
                };
                window.addEventListener('mousemove', onMouseMove);
                window.addEventListener('mouseup', onMouseUp);
              }}
              style={{ cursor: 'move', background: INK, color: AMBER_400 }}
            >✥</div>
         </div>
      )}
      <div className="t-card">
        {t.image && (
          <img src={t.image} style={{ width:'100%', height:60, objectFit:'cover', borderRadius:4, marginBottom:8 }} crossOrigin="anonymous" alt="" />
        )}
        <span 
          className={`t-user ${interactive ? 'editable-text' : ''}`}
          contentEditable={interactive}
          suppressContentEditableWarning={true}
          onBlur={(e) => onUpdateTweetField(t.id, 'user', e.target.innerText)}
        >
          {t.user}
        </span>
        <p 
          className={`t-text ${interactive ? 'editable-text' : ''}`}
          style={{ fontSize:'9px', fontStyle:'italic' }}
          contentEditable={interactive}
          suppressContentEditableWarning={true}
          onBlur={(e) => onUpdateTweetField(t.id, 'text', e.target.innerText)}
        >
          "{t.text}"
        </p>
      </div>
    </div>
  );
};

const TweetSidebar = ({ tweets, interactive, onAdjustY, onSetOffset, onUpdateTweetField, onRemoveTweet }) => (
  <div className={`tweet-sidebar ${interactive ? 'interactive-mode' : ''}`}>
    <div className="sidebar-h">Twitter Trendings</div>
    {tweets.map((t, i) => (
      <TweetCard 
        key={i} 
        t={t} 
        interactive={interactive} 
        onAdjustY={onAdjustY} 
        onSetOffset={onSetOffset} 
        onUpdateTweetField={onUpdateTweetField} 
        onRemoveTweet={onRemoveTweet} 
      />
    ))}
  </div>
);

const MasterPage = ({ children, pgNum, dateDisplay, showMasthead, interactive }) => (
  <div className={`mag-root${pgNum > 1 ? ' page-break' : ''} ${interactive ? 'interactive-page' : ''}`}>
    <div className="tri-tl-outer" /><div className="tri-tl-inner" />
    <div className="tri-br-outer" /><div className="tri-br-inner" />

    <div className="mag-page" style={{ paddingTop: showMasthead ? `${PAGE_TOP_MASTHEAD}px` : `${PAGE_TOP_NORMAL}px` }}>
      {showMasthead && (
        <>
          <div className="masthead-title">Bihar Media <span>Scan</span></div>
          <div className="meta-bar"><span className="meta-date">{dateDisplay}</span></div>
          <div className="ribbon-banner"><span className="ribbon-text">आज क्या कहता है बिहार?</span></div>
        </>
      )}
      {children}
    </div>

    <footer className="mag-footer">
      <div className="f-brand">Bihar Media Scan</div>
<div className="f-meta">
  Bihar's Leading Journal • {dateDisplay} • 
  <a 
    href="https://www.jansuraaj.org" 
    target="_blank" 
    rel="noopener noreferrer"
    style={{ color: INK, textDecoration: 'underline', marginLeft: '5px' }}
  >
    www.jansuraaj.org
  </a>
</div>   
   <div className="f-pg">{pgNum}</div>
    </footer>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

const PDFTemplate = forwardRef(({ 
  date, articles, tweets, interactive = false,
  onMoveArticle, onAdjustY, onSetOffset, onUpdateArticle, onRemoveArticle, onUpdateTweetField, onRemoveTweet,
  headingOffsets = {}
}, ref) => {
  const dateDisplay = formatDateDisplay(date);

  const hNews = articles.filter(a => a.category === 'headlines').slice(0, 3);
  const pNews = articles.filter(a => a.category === 'political');
  const cNews = articles.filter(a => a.category === 'civic');
  const oNews = articles.filter(a => a.category === 'opinion');
  const nNews = articles.filter(a => a.category === 'national');
  const iNews = articles.filter(a => a.category === 'international');

  // All items flow across pages
  const flowItems = [
    ...articles.filter(a => a.isCustomText).map(a => ({ ...a, sTitle: null, category: 'customText' })),
    ...pNews.map(a => ({ ...a, sTitle: 'सत्ता से जुड़ी खबरें', category: 'political' })),
    ...cNews.map(a  => ({ ...a, sTitle: 'जंगल राज 2.O',    category: 'civic'    })),
    ...oNews.map(a  => ({ ...a, sTitle: 'विचार मंच',    category: 'opinion'  })),
    ...nNews.map(a  => ({ ...a, sTitle: 'देश की खबरें', category: 'national' })),
    ...iNews.map(a  => ({ ...a, sTitle: 'विदेश दर्पण',  category: 'international' })),
  ];

  // Estimate how much of Page 1 is consumed by fixed content
  const headlinesH   = estimateHeadlinesHeight(hNews);
  const p1Fixed      = MASTHEAD_H + headlinesH;
  const p1Available  = USABLE_HEIGHT_P1 - p1Fixed;

  const useP1Overflow = p1Available > 350;
  const startH = useP1Overflow ? p1Available : USABLE_HEIGHT_REST;
  const allocatedPages = allocatePages(flowItems, startH);

  const p1ExtraSlots  = useP1Overflow ? (allocatedPages[0]?.slots || []) : [];
  const dynamicPages  = useP1Overflow ? allocatedPages.slice(1) : allocatedPages;

  const TWEETS_PER_PAGE = 6;
  let p1Tweets = [];
  let dynamicTweets = [];
  if (useP1Overflow) {
    p1Tweets = tweets.slice(0, TWEETS_PER_PAGE);
    dynamicTweets = tweets.slice(TWEETS_PER_PAGE);
  } else {
    dynamicTweets = tweets;
  }

  const tweetPagesNeeded = Math.ceil(dynamicTweets.length / TWEETS_PER_PAGE);
  while (dynamicPages.length < tweetPagesNeeded) {
    dynamicPages.push({ slots: [] });
  }

  const tweetsByPage = Array.from({ length: dynamicPages.length }, (_, i) =>
    dynamicTweets.slice(i * TWEETS_PER_PAGE, (i + 1) * TWEETS_PER_PAGE)
  );

  return (
    <div ref={ref} className="mag-wrapper">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ══════════════ PAGE 1 ══════════════ */}
      <MasterPage pgNum={1} dateDisplay={dateDisplay} showMasthead interactive={interactive}>

        {/* Top Headlines */}
        {hNews.length > 0 && (
          <section style={{ marginBottom: '20px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px', position: 'relative' }}>
              <span className="party-tag" style={{ background:INK, color:AMBER_400, marginBottom:0 }}>Latest Update</span>
              {(() => {
                const off = headingOffsets['Top Headlines'] || { x: 0, y: 0 };
                return (
                  <SectionHeading 
                    sTitle="Top Headlines" 
                    interactive={interactive} 
                    onAdjustY={onAdjustY} 
                    onSetOffset={onSetOffset} 
                    xOffset={off.x} 
                    yOffset={off.y} 
                  />
                );
              })()}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, minmax(0, 1fr))', gap:'12px' }}>
              {hNews.map((a, i) => (
                <div key={i} className={`headline-wrapper ${interactive ? 'interactive-mode' : ''}`}>
                  <div style={{ background:AMBER_100, border:`1px solid ${AMBER_200}`, borderTop:`4px solid ${AMBER_500}`, borderRadius:'6px', overflow:'hidden', display:'flex', flexDirection:'column', height: '100%' }}>
                    {a.image && <img src={a.image} style={{ width:'100%', aspectRatio:'16/9', objectFit:'cover' }} crossOrigin="anonymous" alt="" />}
                    <div style={{ padding:'10px', flex:1, display:'flex', flexDirection:'column', justifyContent:'space-between', paddingTop: a.image ? '10px' : '16px' }}>
                      <div>
                        <div 
                          className={`headline-text ${interactive ? 'editable-text' : ''}`}
                          style={{ fontSize:'12px', fontWeight:'bold', fontFamily:"'Playfair Display',serif", lineHeight:'1.35', marginBottom:'8px', wordBreak: 'break-word' }}
                          contentEditable={interactive}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => onUpdateArticle(a.id, 'headline', e.target.innerText)}
                        >
                          {a.headline}
                        </div>
                        {!a.image && a.summary && (
                          <div 
                            className={`summary-text ${interactive ? 'editable-text' : ''}`}
                            style={{ fontSize:'10px', color:SLATE, wordBreak: 'break-word' }}
                            contentEditable={interactive}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => onUpdateArticle(a.id, 'summary', e.target.innerText)}
                          >
                            {a.summary}
                          </div>
                        )}
                      </div>
                      <a href={a.url} style={{ fontSize:'8px', fontWeight:'bold', color:INK, textDecoration:'none', borderBottom:`2px solid ${AMBER_400}`, display:'inline-block' }}>READ MORE →</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Flow content + Tweet sidebar */}
        <div style={{ display:'grid', gridTemplateColumns: p1Tweets.length > 0 ? 'minmax(0, 2.1fr) minmax(0, 0.9fr)' : '1fr', gap:'24px', flex:1, minHeight: 0 }}>
          <div style={{ minWidth: 0 }}>
            {/* Flow content that fits in remaining P1 space */}
            {p1ExtraSlots.map((slot, i) => {
              if (slot.type === 'sectionHeading') {
                const off = headingOffsets[slot.sTitle] || { x: 0, y: 0 };
                return <SectionHeading key={i} sTitle={slot.sTitle} interactive={interactive} onAdjustY={onAdjustY} onSetOffset={onSetOffset} xOffset={off.x} yOffset={off.y} />;
              }
              return (
                <NewsCard
                  key={i}
                  article={slot.article}
                  category={slot.category}
                  isContinuation={slot.type === 'cardContinuation'}
                  interactive={interactive}
                  onMove={onMoveArticle}
                  onAdjustY={onAdjustY}
                  onUpdateArticle={onUpdateArticle}
                  onRemove={onRemoveArticle}
                />
              );
            })}
          </div>

          {p1Tweets.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <TweetSidebar tweets={p1Tweets} interactive={interactive} onAdjustY={onAdjustY} onUpdateTweetField={onUpdateTweetField} onRemoveTweet={onRemoveTweet} />
            </div>
          )}
        </div>

      </MasterPage>

      {/* ══════════════ DYNAMIC PAGES ══════════════ */}
      {dynamicPages.map((page, pIdx) => {
        const pgNum      = pIdx + 2;
        const pageTweets = tweetsByPage[pIdx] || [];

        return (
          <MasterPage key={pgNum} pgNum={pgNum} dateDisplay={dateDisplay} showMasthead={false}>
            <div style={{ display:'grid', gridTemplateColumns: pageTweets.length > 0 ? 'minmax(0, 2.1fr) minmax(0, 0.9fr)' : '1fr', gap:'24px', flex:1, minHeight: 0 }}>
              <div style={{ flex:1, minWidth:0 }}>
                {page.slots.map((slot, sIdx) => {
                  if (slot.type === 'sectionHeading') {
                    const off = headingOffsets[slot.sTitle] || { x: 0, y: 0 };
                    return <SectionHeading key={sIdx} sTitle={slot.sTitle} interactive={interactive} onAdjustY={onAdjustY} onSetOffset={onSetOffset} xOffset={off.x} yOffset={off.y} />;
                  }
                  if (slot.type === 'pageBreak') {
                    return (
                      <div key={sIdx} className="page-break-indicator" style={{ borderTop: '2px dashed #10b981', padding: '10px', textAlign: 'center', color: '#10b981', fontSize: '12px', position: 'relative' }}>
                        --- Page Break ---
                        {interactive && <button onClick={() => onRemoveArticle(slot.id)} style={{ position: 'absolute', right: 0, top: '-10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer' }}>×</button>}
                      </div>
                    );
                  }
                  return (
                    <NewsCard
                      key={sIdx}
                      article={slot.article}
                      category={slot.category}
                      isContinuation={slot.type === 'cardContinuation'}
                      interactive={interactive}
                      onMove={onMoveArticle}
                      onAdjustY={onAdjustY}
                      onSetOffset={onSetOffset}
                      onUpdateArticle={onUpdateArticle}
                      onRemove={onRemoveArticle}
                    />
                  );
                })}
              </div>

              {pageTweets.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  <TweetSidebar tweets={pageTweets} interactive={interactive} onAdjustY={onAdjustY} onSetOffset={onSetOffset} onUpdateTweetField={onUpdateTweetField} onRemoveTweet={onRemoveTweet} />
                </div>
              )}
            </div>
          </MasterPage>
        );
      })}

    </div>
  );
});

export default PDFTemplate;