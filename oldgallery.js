/* WC26 Hub — Match Day Gallery
   How it works: upload photos to the repo (same folder as index.html) named
   match1-a.jpg, match1-b.jpg ... match1-f.jpg   (Match 1: Jun 13)
   match2-a.jpg ... match2-f.jpg                 (Match 2: Jun 16)
   ... up to match6-f.jpg                        (Match 6: Jul 1)
   Up to 6 photos (letters a–f) per match. .jpg only, lowercase, no spaces.
   Photos appear automatically; missing ones stay hidden. No HTML editing needed. */
(function () {
  'use strict';

  var MATCH_LABELS = [
    'Jun 13 — Qatar vs Switzerland',
    'Jun 16 — Austria vs Jordan',
    'Jun 19 — Türkiye vs Paraguay',
    'Jun 22 — Jordan vs Algeria',
    'Jun 25 — Paraguay vs Australia',
    'Jul 1 — Round of 32'
  ];
  var LETTERS = ['a', 'b', 'c', 'd', 'e', 'f'];

  var host = document.getElementById('gallery');
  if (!host) return;

  /* Lightbox */
  var lb = document.createElement('div');
  lb.id = 'wcgal-lb';
  lb.innerHTML = '<img alt=""><div id="wcgal-lb-x">✕ tap to close</div>';
  lb.addEventListener('click', function () { lb.classList.remove('open'); });
  document.body.appendChild(lb);
  var lbImg = lb.querySelector('img');

  function openLightbox(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt;
    lb.classList.add('open');
  }

  MATCH_LABELS.forEach(function (label, mi) {
    var group = document.createElement('div');
    group.className = 'wcgal-group';
    group.style.display = 'none'; /* hidden until at least one photo loads */

    var h = document.createElement('div');
    h.className = 'wcgal-label';
    h.textContent = label;
    group.appendChild(h);

    var grid = document.createElement('div');
    grid.className = 'wcgal-grid';
    group.appendChild(grid);

    LETTERS.forEach(function (letter) {
      var src = 'match' + (mi + 1) + '-' + letter + '.jpg';
      var img = document.createElement('img');
      img.className = 'wcgal-img';
      img.loading = 'lazy';
      img.alt = label + ' — fan photo';
      img.src = src;
      img.addEventListener('load', function () {
        group.style.display = '';            /* photo exists: show the group */
      });
      img.addEventListener('error', function () {
        img.remove();                        /* photo not uploaded yet: hide slot */
      });
      img.addEventListener('click', function () { openLightbox(src, img.alt); });
      grid.appendChild(img);
    });

    host.appendChild(group);
  });
})();
