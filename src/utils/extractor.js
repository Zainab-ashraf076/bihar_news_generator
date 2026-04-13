const PROXIES = [
  'https://api.allorigins.win/get?url=',
  'https://api.allorigins.win/raw?url=',
  'https://api.codetabs.com/v1/proxy?quest='
];

const PARTY_KEYWORDS = {
  'jan-suraaj': ['jan suraaj', 'जन सुराज', 'prashant kishor', 'pk'],
  'bjp': ['bjp', 'भाजपा', 'modi', 'yogi', 'nitish', 'nda', 'nda '],
  'jdu': ['jdu', 'janata dal', 'जदयू'],
  'rjd': ['rjd', 'rashtriya janata', 'lalu', 'tejashwi', 'राजद'],
  'congress': ['congress', 'कांग्रेस', 'inc ', 'rahul gandhi', 'sonia'],
  'development': ['road', 'highway', 'bridge', 'project', 'yojana', 'scheme', 'hospital', 'school'],
  'national': ['supreme court', 'parliament', 'rajya sabha', 'lok sabha', 'president', 'pm modi'],
};

export function detectParty(text) {
  const t = text.toLowerCase();
  for (const [tag, kws] of Object.entries(PARTY_KEYWORDS)) {
    if (kws.some(k => t.includes(k))) return tag;
  }
  return 'jan-suraaj';
}

export async function fetchArticle(url) {
  let html = '';
  let success = false;

  for (const proxy of PROXIES) {
    try {
      const res = await fetch(proxy + encodeURIComponent(url));
      if (!res.ok) continue;

      if (proxy.includes('allorigins.win/get')) {
        const data = await res.json();
        html = data.contents || '';
      } else {
        html = await res.text();
      }

      if (html.length > 200) {
        success = true;
        break;
      }
    } catch (e) {
      console.warn(`Proxy ${proxy} failed:`, e);
    }
  }

  if (!success) {
    return { 
      headline: 'Could not fetch — please edit', 
      summary: 'Extraction failed. Enter summary manually.', 
      party: 'jan-suraaj',
      sentiment: 'neutral'
    };
  }

  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');

    // Headline
    const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
    const twitterTitle = doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content');
    const docTitle = doc.querySelector('title')?.textContent?.trim();
    const headline = (ogTitle || twitterTitle || docTitle || 'Untitled Article').trim();

    // Summary
    const ogDesc = doc.querySelector('meta[property="og:description"]')?.getAttribute('content');
    const twDesc = doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content');
    const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content');
    let summary = (ogDesc || twDesc || metaDesc || '').trim();
    
    // Image
    const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
    const twImage = doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content');
    const image = (ogImage || twImage || '').trim();

    if (!summary) {
      const paras = [...doc.querySelectorAll('article p, .article-body p, .story-body p, p')]
        .map(p => p.textContent.trim())
        .filter(t => t.length > 60)
        .slice(0, 2);
      summary = paras.join(' ').slice(0, 380);
    }
    
    if (!summary) summary = 'Summary not available. Please edit this field.';

    const finalHeadline = headline.slice(0, 200);
    const finalSummary = summary.slice(0, 1200);

    return { 
      headline: finalHeadline, 
      summary: finalSummary, 
      image: image,
      party: detectParty(finalHeadline + ' ' + finalSummary),
      sentiment: 'neutral'
    };
  } catch (e) {
    return { 
      headline: 'Error parsing — please edit', 
      summary: 'Parsing failed. Enter summary manually.', 
      image: '',
      party: 'jan-suraaj',
      sentiment: 'neutral'
    };
  }
}

export function formatDateDisplay(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
}
