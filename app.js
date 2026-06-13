// MATCHES
const MATCHES = [
  { teams:"Qatar vs Switzerland",  group:"Group B", date:new Date("2026-06-13T12:00:00-07:00"), day:"13", month:"JUN", time:"12:00 PM" },
  { teams:"Austria vs Jordan",     group:"Group J", date:new Date("2026-06-16T21:00:00-07:00"), day:"16", month:"JUN", time:"9:00 PM"  },
  { teams:"Türkiye vs Paraguay",   group:"Group D", date:new Date("2026-06-19T21:00:00-07:00"), day:"19", month:"JUN", time:"9:00 PM"  },
  { teams:"Jordan vs Algeria",     group:"Group J", date:new Date("2026-06-22T20:00:00-07:00"), day:"22", month:"JUN", time:"8:00 PM"  },
  { teams:"Paraguay vs Australia", group:"Group D", date:new Date("2026-06-25T19:00:00-07:00"), day:"25", month:"JUN", time:"7:00 PM"  },
  { teams:"Round of 32 Knockout",  group:"Knockout Stage", date:new Date("2026-07-01T17:00:00-07:00"), day:"01", month:"JUL", time:"5:00 PM" }
];


// --- SECURITY HELPERS ---
function esc(s) {
  const d = document.createElement('div');
  d.textContent = String(s == null ? '' : s);
  return d.innerHTML;
}
function safeUrl(u) {
  try {
    const url = new URL(u, location.href);
    if (url.protocol === 'http:' || url.protocol === 'https:') return url.href;
  } catch(e) {}
  return '#';
}
const ALLOWED_TAG_CLASSES = new Set(['levis','breaking','transit','travel']);

function pad(n) { return String(n).padStart(2,'0'); }
function getCountdown(t) {
  const d = t - new Date();
  if (d <= 0) return null;
  return { days: Math.floor(d/86400000), hours: Math.floor((d%86400000)/3600000), mins: Math.floor((d%3600000)/60000), secs: Math.floor((d%60000)/1000) };
}
function getNextMatch() { return MATCHES.find(m => m.date > new Date()) || null; }

// CLOCK
function updateClock() {
  const pt = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
  document.getElementById('clock').textContent = pad(pt.getHours()) + ':' + pad(pt.getMinutes()) + ':' + pad(pt.getSeconds());
}
setInterval(updateClock, 1000); updateClock();

// HERO
function updateHero() {
  const next = getNextMatch();
  if (!next) {
    document.getElementById('heroLabel').textContent = 'Tournament complete';
    document.getElementById('heroTeams').textContent = 'Thanks for a great World Cup!';
    ['cd-days','cd-hours','cd-mins','cd-secs'].forEach(id => document.getElementById(id).textContent = '00');
    return;
  }
  const cd = getCountdown(next.date);
  document.getElementById('heroLabel').textContent = next.group + ' · Levi\'s Stadium, Santa Clara';
  document.getElementById('heroTeams').innerHTML = next.teams.replace(' vs ', ' <span class="vs-sep">vs</span> ');
  if (cd) {
    document.getElementById('cd-days').textContent  = cd.days;
    document.getElementById('cd-hours').textContent = pad(cd.hours);
    document.getElementById('cd-mins').textContent  = pad(cd.mins);
    document.getElementById('cd-secs').textContent  = pad(cd.secs);
  }
  document.getElementById('heroMeta').innerHTML =
    `<span>📅 ${next.date.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</span>
     <span>🕐 ${next.time} PT</span><span>📍 Santa Clara, CA</span>`;
}

// SCHEDULE
function renderSchedule() {
  const now = new Date(), next = getNextMatch();
  const grid = document.getElementById('scheduleGrid');
  grid.innerHTML = '';
  MATCHES.forEach((m, i) => {
    const isPast = m.date < now, isNext = next && m === next;
    const cd = getCountdown(m.date);
    const miniCd = (!isPast && cd) ? (cd.days > 0 ? `${cd.days}d ${pad(cd.hours)}h ${pad(cd.mins)}m` : `${pad(cd.hours)}h ${pad(cd.mins)}m ${pad(cd.secs)}s`) : '';
    const card = document.createElement('div');
    card.className = 'match-card' + (isPast ? ' completed' : '') + (isNext ? ' next-up' : '');
    card.innerHTML = `
      <div class="match-date"><div class="match-day">${m.day}</div><div class="match-month">${m.month}</div></div>
      <div>
        <div class="match-teams">${m.teams}</div>
        <div class="match-detail">${m.group} · Levi's Stadium</div>
        ${miniCd ? `<div class="mini-countdown" id="mini-${i}">⏱ ${miniCd}</div>` : ''}
      </div>
      <div class="match-time-col"><span class="match-time">${m.time}</span><span class="match-tz">PT</span></div>`;
    grid.appendChild(card);
  });
}

function updateMiniCountdowns() {
  MATCHES.forEach((m, i) => {
    const el = document.getElementById('mini-' + i);
    if (!el) return;
    const cd = getCountdown(m.date);
    if (!cd) return;
    el.textContent = cd.days > 0 ? `⏱ ${cd.days}d ${pad(cd.hours)}h ${pad(cd.mins)}m` : `⏱ ${pad(cd.hours)}h ${pad(cd.mins)}m ${pad(cd.secs)}s`;
  });
}

// NEWS FEED
// Uses rss2json.com — free, reliable, no API key needed for basic use
const RSS_FEEDS = [
  { url: 'https://feeds.bbci.co.uk/sport/football/rss.xml',                    source: 'BBC SPORT',    color: '#f0c040', tags: ['teams'] },
  { url: 'https://www.espn.com/espn/rss/soccer/news',                          source: 'ESPN FC',      color: '#00e676', tags: ['teams'] },
  { url: 'https://www.goal.com/feeds/en/news',                                 source: 'GOAL.COM',     color: '#4fc3f7', tags: ['teams'] },
  { url: 'https://www.mercurynews.com/feed/',                                   source: 'MERCURY NEWS', color: '#f0c040', tags: ['levis','travel'] },
  { url: 'https://www.sfgate.com/rss/feed/SFGate-Sports-273.php',              source: 'SFGATE',       color: '#ff3d57', tags: ['levis','travel'] },
  { url: 'https://theathletic.com/rss/news',                                   source: 'THE ATHLETIC', color: '#4fc3f7', tags: ['teams'] },
];

const RSS2JSON = 'https://api.rss2json.com/v1/api.json?rss_url=';

let allArticles = [];
let displayedCount = 0;
let currentFilter = 'all';
const PAGE_SIZE = 8;

function tagArticle(item, feedTags) {
  const text = (item.title + ' ' + (item.description||'')).toLowerCase();
  const tags = [...feedTags];
  if (text.includes('levis') || text.includes("levi's") || text.includes('santa clara') || text.includes('bay area') || text.includes('san francisco')) tags.push('levis');
  if (text.includes('transit') || text.includes('caltrain') || text.includes('parking') || text.includes('travel') || text.includes('hotel')) tags.push('travel');
  if (text.includes('world cup') || text.includes('fifa') || text.includes('2026')) tags.push('wc2026');
  return [...new Set(tags)];
}

function timeAgo(date) {
  const d = (new Date() - new Date(date)) / 1000;
  if (d < 3600)  return Math.floor(d/60) + 'm ago';
  if (d < 86400) return Math.floor(d/3600) + 'h ago';
  return Math.floor(d/86400) + 'd ago';
}

async function fetchFeed(feed) {
  try {
    const res = await fetch(RSS2JSON + encodeURIComponent(feed.url) + '&count=10', { signal: AbortSignal.timeout(8000) });
    const data = await res.json();
    if (data.status !== 'ok') return [];
    return (data.items || []).map(item => ({
      title:   item.title || '',
      link:    item.link  || '#',
      pubDate: item.pubDate || '',
      snippet: (item.description || '').replace(/<[^>]+>/g,'').substring(0,160),
      source:  feed.source,
      color:   feed.color,
      tags:    tagArticle(item, feed.tags)
    }));
  } catch(e) { return []; }
}

async function loadNews(forceRefresh) {
  const btn = document.getElementById('refreshBtn');
  const bar = document.getElementById('loadingBar');
  const feed = document.getElementById('feedContent');

  btn.classList.add('spinning');
  btn.textContent = '↻';
  bar.style.display = 'block';
  displayedCount = 0;

  feed.innerHTML = Array(4).fill(0).map(() => `
    <div class="news-item">
      <div class="skeleton title"></div>
      <div class="skeleton snippet"></div>
      <div class="skeleton snippet2"></div>
      <div class="skeleton meta"></div>
    </div>`).join('');

  // Fetch all feeds in parallel
  const results = await Promise.all(RSS_FEEDS.map(fetchFeed));
  allArticles = results.flat()
    .filter(a => a.title.length > 10)
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  // Deduplicate by title similarity
  const seen = new Set();
  allArticles = allArticles.filter(a => {
    const key = a.title.toLowerCase().replace(/[^a-z0-9]/g,'').substring(0,40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (allArticles.length === 0) {
    feed.innerHTML = `<div class="error-msg">
      Live feed unavailable right now.<br>
      Try these directly: <a href="https://www.bbc.com/sport/football/world-cup" target="_blank">BBC Sport</a> ·
      <a href="https://www.espn.com/soccer/" target="_blank">ESPN FC</a> ·
      <a href="https://www.goal.com" target="_blank">Goal.com</a>
    </div>`;
    btn.classList.remove('spinning');
    btn.textContent = '↻';
    bar.style.display = 'none';
    return;
  }

  renderArticles();
  btn.classList.remove('spinning');
  btn.textContent = '↻';
  bar.style.display = 'none';
}

function getFilteredArticles() {
  if (currentFilter === 'all') return allArticles;
  return allArticles.filter(a => a.tags.includes(currentFilter));
}

function renderArticles() {
  const feed = document.getElementById('feedContent');
  const filtered = getFilteredArticles();
  const toShow = filtered.slice(0, displayedCount + PAGE_SIZE);
  displayedCount = toShow.length;

  feed.innerHTML = '';

  if (toShow.length === 0) {
    feed.innerHTML = `<div class="error-msg">No articles found for this filter. Try ALL.</div>`;
    document.getElementById('loadMoreBtn').style.display = 'none';
    return;
  }

  toShow.forEach(item => {
    const tagHTML = item.tags
      .filter(t => ALLOWED_TAG_CLASSES.has(t))
      .map(t => `<span class="news-tag ${t}">${t === 'levis' ? "LEVI'S" : esc(t.toUpperCase())}</span>`)
      .join('');

    const div = document.createElement('div');
    div.className = 'news-item';
    div.innerHTML = `
      <div class="news-top">
        <span class="news-source-tag" style="color:${esc(item.color)}">${esc(item.source)}</span>
        <span class="news-age">${esc(timeAgo(item.pubDate))}</span>
      </div>
      <div class="news-headline"><a href="${safeUrl(item.link)}" target="_blank" rel="noopener noreferrer">${esc(item.title)}</a></div>
      ${item.snippet ? `<div class="news-snippet">${esc(item.snippet)}...</div>` : ''}
      ${tagHTML ? `<div class="news-tags">${tagHTML}</div>` : ''}`;
    feed.appendChild(div);
  });

  const loadMoreBtn = document.getElementById('loadMoreBtn');
  loadMoreBtn.style.display = displayedCount < getFilteredArticles().length ? 'block' : 'none';
}

function loadMore() {
  renderArticles();
}

function setFilter(filter, btn) {
  currentFilter = filter;
  displayedCount = 0;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderArticles();
}

// INIT
renderSchedule();
updateHero();
// loadNews(); -- disabled for now
setInterval(() => { updateHero(); updateMiniCountdowns(); }, 1000);
