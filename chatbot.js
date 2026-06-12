/* WC26 Hub — Match Day Helper (no-API FAQ bot)
   Install: add  <script src="chatbot.js" defer></script>  before </body> on any page.
   All answers live in the KB below. Edit freely; no keys, no servers, no cost. */
(function () {
  'use strict';

  /* ---------- KNOWLEDGE BASE ---------- */
  var KB = [
    { k: ['bart', 'milpitas', 'east bay', 'oakland', 'sfo', 'berkeley'],
      a: "From BART: ride any train toward Berryessa, get off at Milpitas Station, cross the pedestrian bridge to the VTA Orange Line, and ride to Lick Mill Station. Going home, follow the Gate F signs to VTA. BART and VTA run matched 20-minute frequencies. Full routes on the Getting In page." },
    { k: ['caltrain', 'peninsula', 'mountain view', 'palo alto', 'san francisco train', 'sf train'],
      a: "From Caltrain: ride south to Mountain View Station, then transfer to the VTA Orange Line for the ~30-minute light rail leg to the stadium. Going home, follow the Gate A signs for the Caltrain connection. A combined Caltrain + VTA day pass is roughly $15–20 round trip." },
    { k: ['vta', 'light rail', 'san jose', 'sunnyvale', 'campbell', 'great america station'],
      a: "VTA Orange and Green lines both stop at Great America / Levi's Stadium Station, 0.2 miles from the gates — about a 3-minute walk. Fare is $2.50 each way. Easiest way in by far." },
    { k: ['ace', 'stockton', 'tracy', 'livermore', 'pleasanton', 'fremont', 'tri-valley', 'central valley'],
      a: "ACE runs direct match-day service from Stockton, Lathrop/Manteca, Tracy, Vasco, Livermore, Pleasanton and Fremont, connecting to VTA for the final leg. Check the ACE match-day schedule before you travel." },
    { k: ['drive', 'driving', 'car', 'freeway', '101', '880', 'traffic'],
      a: "Driving: I-880, US-101, CA-87 and I-680 all reach the stadium, with Tasman Drive providing direct access. Lots open 3 hours before kickoff. Reserve parking in advance through the official FIFA parking page and expect heavy traffic both directions. Transit is faster on match days." },
    { k: ['park', 'parking', 'lot', 'reserve'],
      a: "Parking is available on match day but advance reservation through the official FIFA World Cup 2026 parking page is strongly encouraged. One pass per match ticket. Some off-stadium lots are a 15–20 minute walk. Accessible parking needs a pre-paid pass plus a DMV disability plate or placard at entry." },
    { k: ['rideshare', 'uber', 'lyft', 'pickup', 'pick up', 'drop off', 'dropoff', 'waymo', 'taxi'],
      a: "Rideshare pickup starts one hour after kickoff. Exiting Gates A, E or F: go to Rideshare North, Red Lot 7. Exiting Gates B or C: go to Rideshare South on Freedom Circle. Autonomous vehicles like Waymo are not allowed in the rideshare lots." },
    { k: ['gate', 'entry', 'entrance', 'which gate', 'enter'],
      a: "Your designated entry gate is printed on your ticket — check it before you leave. All gates are accessible. Arrive at least 90 minutes before kickoff; lines peak 60–75 minutes out. Exit planning: Gate F for VTA/BART, Gate A for Caltrain, B/C for Rideshare South." },
    { k: ['bag', 'backpack', 'purse', 'clutch', 'bring', 'allowed', 'prohibited', 'water bottle', 'umbrella'],
      a: "Bag policy: one clear bag (12\"x6\"x12\" max) or small clutch (4.5\"x6.5\"). Allowed: sealed water bottle up to 1 liter, sunscreen, medication in original packaging. Not allowed: backpacks, cans, glass, selfie sticks, large umbrellas, laser pointers, noisemakers, outside food." },
    { k: ['schedule', 'matches', 'fixtures', 'when', 'what games', 'kickoff', 'next match'],
      a: "Six matches at Levi's Stadium: Jun 13 Qatar vs Switzerland (12:00 PM), Jun 16 Austria vs Jordan (9:00 PM), Jun 19 Türkiye vs Paraguay, Jun 22 Jordan vs Algeria (8:00 PM), Jun 25 Paraguay vs Australia (7:00 PM), and a Round of 32 knockout Jul 1 (5:00 PM). All times Pacific. Countdown on the home page." },
    { k: ['ticket', 'tickets', 'buy', 'qr', 'phone', 'wifi', 'wi-fi', 'signal'],
      a: "Download your ticket before arriving and screenshot it as backup — concourse tunnels are signal dead zones and stadium Wi-Fi gets crushed near kickoff. Tickets are sold only through FIFA's official channels at fifa.com/tickets; avoid resellers." },
    { k: ['weather', 'hot', 'cold', 'sun', 'rain', 'temperature', 'wear'],
      a: "Noon kickoffs: open bowl, full Silicon Valley sun — sunscreen, hat, water; the west-side upper deck is fully exposed. Evening kickoffs start warm, then the marine layer drops it to around 55°F by halftime, so bring a layer." },
    { k: ['food', 'eat', 'drink', 'beer', 'concession', 'restaurant'],
      a: "Stadium food runs $18–25 per item and lines peak at halftime — buy before kickoff or wait until the 30-minute mark. The fan zone near Great America Station has cheaper options if you arrive early." },
    { k: ['accessible', 'accessibility', 'wheelchair', 'disability', 'elevator', 'ada', 'mobility'],
      a: "All gates are accessible. Accessible pickup and drop-off is on Patrick Henry Drive. Elevators are in the NE, NW, SE, SW, E and W sections. Guests with mobility needs using rideshare should use Rideshare North for a shuttle to Stadium Plaza. Accessible seating/parking: +1 415 464 9377 ext. 4. Wheelchair assistance: +1 408 579 4610." },
    { k: ['fan zone', 'watch party', 'no ticket', 'without ticket'],
      a: "No ticket? Fan zones and watch parties are planned across the Bay Area, many reachable by BART and VTA. Check the official FIFA Bay Area site (sfbayareafwc26.com) for locations by match day." },
    { k: ['late', 'night', 'last train', 'after match', 'get home', 'midnight'],
      a: "Getting home late: BART runs special after-midnight service for 8 and 9 PM kickoffs. The last all-station train leaves Milpitas at 11:53 PM; the last train to Berryessa is 1:47 AM. Follow Gate F signs to VTA for the timed BART transfer." },
    { k: ['hi', 'hello', 'hey', 'help', 'what can you'],
      a: "Hi! I'm the match-day helper. Ask me about getting to Levi's Stadium (BART, Caltrain, VTA, ACE, driving), gates, the bag policy, rideshare pickup, accessibility, weather, food, or the match schedule." }
  ];

  var FALLBACK = "I don't have that one. Try asking about transit (BART, Caltrain, VTA), gates, bags, parking, rideshare, accessibility, or the schedule — or see the Getting In page for the full guide.";

  var QUICK = ['How do I get there by BART?', 'What bags are allowed?', 'Where is rideshare pickup?', 'Match schedule'];

  /* ---------- MATCHING ---------- */
  function answer(q) {
    q = (' ' + String(q).toLowerCase() + ' ');
    var best = null, bestScore = 0;
    for (var i = 0; i < KB.length; i++) {
      var score = 0;
      for (var j = 0; j < KB[i].k.length; j++) {
        if (q.indexOf(KB[i].k[j]) !== -1) score += KB[i].k[j].length;
      }
      if (score > bestScore) { bestScore = score; best = KB[i]; }
    }
    return best ? best.a : FALLBACK;
  }

  /* ---------- STYLES ---------- */
  var css = [
    '#wcbot-btn{position:fixed;right:18px;bottom:18px;z-index:9999;width:56px;height:56px;border-radius:50%;border:1px solid #c9a84c;background:#0d0d12;color:#f0c040;font-size:24px;cursor:pointer;box-shadow:0 4px 18px rgba(0,0,0,.5);transition:transform .15s}',
    '#wcbot-btn:hover{transform:scale(1.08)}',
    '#wcbot{position:fixed;right:18px;bottom:84px;z-index:9999;width:min(340px,calc(100vw - 36px));max-height:70vh;display:none;flex-direction:column;background:#0d0d12;border:1px solid #1c1c2a;border-top:3px solid #f0c040;border-radius:8px;overflow:hidden;font-family:"IBM Plex Sans",system-ui,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.6)}',
    '#wcbot.open{display:flex}',
    '#wcbot-head{padding:10px 14px;background:#12121a;border-bottom:1px solid #1c1c2a;color:#f0c040;font-weight:700;font-size:13px;letter-spacing:1px;display:flex;justify-content:space-between;align-items:center}',
    '#wcbot-close{background:none;border:none;color:#5a5a7a;font-size:16px;cursor:pointer}',
    '#wcbot-log{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;min-height:160px}',
    '.wcbot-msg{max-width:85%;padding:8px 11px;border-radius:8px;font-size:13px;line-height:1.5;white-space:pre-wrap}',
    '.wcbot-bot{background:#12121a;border:1px solid #1c1c2a;color:#ddddf0;align-self:flex-start}',
    '.wcbot-user{background:rgba(240,192,64,.12);border:1px solid rgba(240,192,64,.35);color:#f0c040;align-self:flex-end}',
    '#wcbot-quick{display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 8px}',
    '.wcbot-chip{background:none;border:1px solid #1c1c2a;color:#5a5a7a;font-size:11px;padding:4px 9px;border-radius:12px;cursor:pointer}',
    '.wcbot-chip:hover{border-color:#f0c040;color:#f0c040}',
    '#wcbot-form{display:flex;border-top:1px solid #1c1c2a}',
    '#wcbot-in{flex:1;background:#060608;border:none;color:#ddddf0;padding:11px 12px;font-size:13px;outline:none}',
    '#wcbot-send{background:#12121a;border:none;border-left:1px solid #1c1c2a;color:#f0c040;padding:0 16px;cursor:pointer;font-size:15px}'
  ].join('');
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- UI ---------- */
  var btn = document.createElement('button');
  btn.id = 'wcbot-btn'; btn.type = 'button';
  btn.setAttribute('aria-label', 'Open match day helper');
  btn.textContent = '⚽';

  var panel = document.createElement('div');
  panel.id = 'wcbot';
  panel.innerHTML =
    '<div id="wcbot-head"><span>MATCH DAY HELPER</span><button id="wcbot-close" type="button" aria-label="Close">✕</button></div>' +
    '<div id="wcbot-log" aria-live="polite"></div>' +
    '<div id="wcbot-quick"></div>' +
    '<form id="wcbot-form"><input id="wcbot-in" type="text" maxlength="200" placeholder="Ask about transit, gates, bags…" autocomplete="off"><button id="wcbot-send" type="submit" aria-label="Send">➤</button></form>';

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  var log = panel.querySelector('#wcbot-log');
  var input = panel.querySelector('#wcbot-in');
  var quick = panel.querySelector('#wcbot-quick');

  function addMsg(text, who) {
    var m = document.createElement('div');
    m.className = 'wcbot-msg wcbot-' + who;
    m.textContent = text; /* textContent = no HTML injection, ever */
    log.appendChild(m);
    log.scrollTop = log.scrollHeight;
  }

  QUICK.forEach(function (q) {
    var c = document.createElement('button');
    c.className = 'wcbot-chip'; c.type = 'button'; c.textContent = q;
    c.addEventListener('click', function () { ask(q); });
    quick.appendChild(c);
  });

  function ask(q) {
    q = q.trim(); if (!q) return;
    addMsg(q, 'user');
    setTimeout(function () { addMsg(answer(q), 'bot'); }, 250);
    input.value = '';
  }

  btn.addEventListener('click', function () {
    panel.classList.toggle('open');
    if (panel.classList.contains('open') && !log.children.length) {
      addMsg("Hi! Ask me anything about match day at Levi's Stadium — transit, gates, bags, rideshare, accessibility, schedule.", 'bot');
      input.focus();
    }
  });
  panel.querySelector('#wcbot-close').addEventListener('click', function () { panel.classList.remove('open'); });
  panel.querySelector('#wcbot-form').addEventListener('submit', function (e) { e.preventDefault(); ask(input.value); });
})();
