const PROXIES = [
  'https://api.allorigins.win/get?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest=',
  'https://thingproxy.freeboard.io/fetch/',
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

  // Try with different proxies
  for (const proxy of PROXIES) {
    try {
      let proxyUrl = '';
      
      if (proxy.includes('allorigins.win/get')) {
        proxyUrl = proxy + encodeURIComponent(url);
        const res = await fetch(proxyUrl, { mode: 'cors' });
        if (res.ok) {
          const data = await res.json();
          html = data.contents || '';
        }
      } else if (proxy.includes('corsproxy.io')) {
        proxyUrl = proxy + encodeURIComponent(url);
        const res = await fetch(proxyUrl, { mode: 'cors' });
        if (res.ok) {
          html = await res.text();
        }
      } else if (proxy.includes('thingproxy')) {
        proxyUrl = proxy + url;
        const res = await fetch(proxyUrl, { mode: 'cors' });
        if (res.ok) {
          html = await res.text();
        }
      } else {
        proxyUrl = proxy + encodeURIComponent(url);
        const res = await fetch(proxyUrl, { mode: 'cors' });
        if (res.ok) {
          html = await res.text();
        }
      }

      if (html && html.length > 200) {
        success = true;
        break;
      }
    } catch (e) {
      console.warn(`Proxy ${proxy} failed:`, e.message);
    }
  }

  // Fallback: Try direct fetch with user-agent header
  if (!success) {
    try {
      const res = await fetch(url, {
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      if (res.ok) {
        html = await res.text();
        success = html && html.length > 200;
      }
    } catch (e) {
      console.warn('Direct fetch failed:', e.message);
    }
  }

  if (!success) {
    return { 
      headline: 'Could not fetch — please edit manually', 
      summary: 'Link extraction failed. Try another source or enter details manually.', 
      image: '',
      party: 'jan-suraaj',
      sentiment: 'neutral'
    };
  }

  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');

    // Headline - Multiple fallback strategies
    const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
    const twitterTitle = doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content');
    const h1 = doc.querySelector('h1')?.textContent?.trim();
    const h2 = doc.querySelector('h2')?.textContent?.trim();
    const docTitle = doc.querySelector('title')?.textContent?.trim();
    const headline = (ogTitle || twitterTitle || h1 || h2 || docTitle || 'Untitled Article').trim();

    // Summary - Better extraction
    const ogDesc = doc.querySelector('meta[property="og:description"]')?.getAttribute('content');
    const twDesc = doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content');
    const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content');
    let summary = (ogDesc || twDesc || metaDesc || '').trim();
    
    // Image - Multiple fallback strategies
    const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
    const twImage = doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content');
    const firstImg = doc.querySelector('img')?.getAttribute('src');
    const image = (ogImage || twImage || firstImg || '').trim();

    // If no summary, extract from paragraphs
    if (!summary) {
      const paras = [...doc.querySelectorAll('article p, .article-body p, .story-body p, .content p, main p, p')]
        .map(p => p.textContent.trim())
        .filter(t => t.length > 60)
        .slice(0, 3);
      summary = paras.join(' ').slice(0, 380);
    }
    
    if (!summary) summary = 'Summary not available. Please edit this field.';

    const finalHeadline = headline.slice(0, 200);
    const finalSummary = summary.slice(0, 1200);

    return { 
      headline: finalHeadline || 'Untitled', 
      summary: finalSummary || 'No summary available', 
      image: image || '',
      party: detectParty(finalHeadline + ' ' + finalSummary),
      sentiment: 'neutral'
    };
  } catch (e) {
    console.error('Parse error:', e);
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
