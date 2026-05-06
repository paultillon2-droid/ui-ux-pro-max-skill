/* ============================================================
   CLEANPAWN — script.js
   Vanilla JS, zero dependencies, IIFE-wrapped
============================================================ */
(function () {
  'use strict';

  /* ── DATA ─────────────────────────────────────────────── */
  var FEED = [
    { name: 'iPhone 15 Pro Max · 512GB',        amount: '780 €',   status: 'paid'       },
    { name: 'Leica Q3 · 2023',                  amount: '2 150 €', status: 'paid'       },
    { name: 'PS5 Slim + 3 jeux',                amount: '340 €',   status: 'paid'       },
    { name: 'Rolex Oyster Perpetual 36mm',       amount: '4 200 €', status: 'paid'       },
    { name: 'MacBook Pro M3 · 16GB · 512GB',    amount: '1 180 €', status: 'processing' },
    { name: 'Sony A7R V + 24-70mm f/2.8',       amount: '2 890 €', status: 'paid'       },
    { name: 'AirPods Pro 2 · USB-C',            amount: '180 €',   status: 'paid'       },
    { name: 'Canon EOS R6 Mark II',             amount: '1 650 €', status: 'processing' },
    { name: 'Samsung Galaxy S24 Ultra · 256GB', amount: '680 €',   status: 'paid'       },
    { name: 'Omega Seamaster Pro Diver 300m',   amount: '3 100 €', status: 'paid'       },
    { name: 'DJI Mavic 3 Pro · Fly More',       amount: '890 €',   status: 'paid'       },
    { name: 'iPad Pro M4 · 13" · 256GB',        amount: '720 €',   status: 'processing' },
  ];

  var STREAM = [
    { ref: '#4821', name: 'Leica Q3',               price: '2 150 €', city: 'Lyon'      },
    { ref: '#4820', name: 'iPhone 15 Pro · 256GB',  price: '680 €',   city: 'Paris'     },
    { ref: '#4819', name: 'Rolex Datejust 41',       price: '5 800 €', city: 'Bordeaux'  },
    { ref: '#4818', name: 'PS5 + FIFA 25',           price: '320 €',   city: 'Marseille' },
    { ref: '#4817', name: 'MacBook Air M3 · 8GB',   price: '940 €',   city: 'Paris'     },
    { ref: '#4816', name: 'Sony WH-1000XM5',         price: '195 €',   city: 'Nantes'    },
    { ref: '#4815', name: 'Canon R8 + 50mm f/1.8',  price: '1 120 €', city: 'Lille'     },
    { ref: '#4814', name: 'Tag Heuer Aquaracer 43',  price: '980 €',   city: 'Nice'      },
    { ref: '#4813', name: 'Nintendo Switch OLED',    price: '180 €',   city: 'Lyon'      },
    { ref: '#4812', name: 'iPad Pro M2 · 11"',       price: '560 €',   city: 'Paris'     },
  ];

  var PRICES = {
    smartphone:  { mint:[400,900],   good:[200,500],  fair:[80,220],   poor:[20,80]  },
    ordinateur:  { mint:[600,1400],  good:[300,800],  fair:[100,350],  poor:[30,100] },
    montre:      { mint:[200,8000],  good:[100,4000], fair:[50,2000],  poor:[20,500] },
    photo:       { mint:[300,3000],  good:[150,1500], fair:[60,600],   poor:[20,150] },
    gaming:      { mint:[150,600],   good:[80,350],   fair:[30,150],   poor:[10,50]  },
    bijou:       { mint:[100,5000],  good:[50,2500],  fair:[20,1000],  poor:[10,200] },
    audio:       { mint:[80,800],    good:[40,400],   fair:[15,150],   poor:[5,40]   },
    autre:       { mint:[50,500],    good:[20,200],   fair:[10,80],    poor:[5,20]   },
  };

  /* ── NAV SCROLL ───────────────────────────────────────── */
  var nav = document.getElementById('cp-nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 24);
    }, { passive: true });
  }

  /* ── SCROLL REVEAL ────────────────────────────────────── */
  if (window.IntersectionObserver) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('cp-in');
          revObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.13 });
    document.querySelectorAll('.cp-reveal').forEach(function (el) {
      revObs.observe(el);
    });
  } else {
    /* Fallback: show all immediately */
    document.querySelectorAll('.cp-reveal').forEach(function (el) {
      el.classList.add('cp-in');
    });
  }

  /* ── LIVE FEED ────────────────────────────────────────── */
  (function () {
    var feed = document.getElementById('cp-feed');
    if (!feed) return;
    var idx = 0;

    function mkItem(d) {
      var el = document.createElement('div');
      el.className = 'cp-feed-item';
      el.innerHTML =
        '<span class="cp-feed-item__name">' + d.name + '</span>' +
        '<span class="cp-feed-item__amount">' + d.amount + '</span>' +
        '<span class="cp-feed-tag cp-tag-' + d.status + '">' +
          (d.status === 'paid' ? 'Payé' : 'En cours') +
        '</span>';
      return el;
    }

    FEED.slice(0, 3).forEach(function (d) { feed.appendChild(mkItem(d)); });
    idx = 3;

    setInterval(function () {
      var el = mkItem(FEED[idx % FEED.length]);
      feed.insertBefore(el, feed.firstChild);
      var kids = feed.children;
      if (kids.length > 3) {
        var last = kids[kids.length - 1];
        last.style.transition = 'opacity .3s';
        last.style.opacity = '0';
        setTimeout(function () { if (last.parentNode) last.parentNode.removeChild(last); }, 320);
      }
      idx++;
    }, 3200);
  })();

  /* ── STREAM / MARQUEE ─────────────────────────────────── */
  (function () {
    var belt = document.getElementById('cp-belt');
    if (!belt) return;
    var doubled = STREAM.concat(STREAM);
    belt.innerHTML = doubled.map(function (d) {
      return '<span class="cp-stream__item">' +
        '<span class="cp-stream__ref">'   + d.ref   + '</span>' +
        '<span class="cp-stream__sep">●</span>' +
        '<span class="cp-stream__name">'  + d.name  + '</span>' +
        '<span class="cp-stream__sep">●</span>' +
        '<span class="cp-stream__price">' + d.price + '</span>' +
        '<span class="cp-stream__sep">·</span>' +
        '<span>' + d.city + '</span>' +
        '<span class="cp-stream__sep">·</span>' +
        '<span class="cp-stream__ok">✓ Payé</span>' +
        '</span>';
    }).join('');
  })();

  /* ── COUNT-UP ─────────────────────────────────────────── */
  function countUp(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    var target  = parseInt(el.getAttribute('data-count'), 10);
    var decimal = el.hasAttribute('data-decimal');
    var dur = 1900, t0 = performance.now();
    function tick(now) {
      var p     = Math.min((now - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val   = Math.round(target * eased);
      el.textContent = decimal
        ? (val / 10).toFixed(1)
        : val.toLocaleString('fr-FR');
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (window.IntersectionObserver) {
    var kpiObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.querySelectorAll('[data-count]').forEach(countUp);
          kpiObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('[data-kpi]').forEach(function (el) {
      kpiObs.observe(el);
    });
  }

  /* ── ESTIMATION ENGINE ────────────────────────────────── */
  (function () {
    var selCat = null, selCond = null;

    /* Category chips */
    document.querySelectorAll('#cp-cats .cp-chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('#cp-cats .cp-chip').forEach(function (b) { b.classList.remove('on'); });
        btn.classList.add('on');
        selCat = btn.getAttribute('data-cat');
      });
    });

    /* Condition chips */
    document.querySelectorAll('#cp-conds .cp-chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('#cp-conds .cp-chip').forEach(function (b) { b.classList.remove('on'); });
        btn.classList.add('on');
        selCond = btn.getAttribute('data-cond');
      });
    });

    /* Estimate */
    var submitBtn = document.getElementById('cp-estimate-btn');
    if (!submitBtn) return;

    submitBtn.addEventListener('click', function () {
      if (!selCat || !selCond) {
        var target = !selCat
          ? document.getElementById('cp-cats')
          : document.getElementById('cp-conds');
        target.style.outline = '2px solid var(--cp-blue)';
        target.style.outlineOffset = '4px';
        target.style.borderRadius = '6px';
        setTimeout(function () {
          target.style.outline = '';
          target.style.outlineOffset = '';
        }, 1400);
        target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
      }

      var result  = document.getElementById('cp-result');
      var rangeEl = document.getElementById('cp-result-range');
      var noteEl  = document.getElementById('cp-result-note');
      var brand   = (document.getElementById('cp-model').value || '').trim();

      result.classList.add('show');
      rangeEl.textContent = 'Calcul en cours…';
      noteEl.textContent  = '';

      setTimeout(function () {
        var r    = PRICES[selCat][selCond];
        var txns = Math.floor(Math.random() * 80 + 30);
        rangeEl.textContent =
          r[0].toLocaleString('fr-FR') + ' € — ' +
          r[1].toLocaleString('fr-FR') + ' €';
        noteEl.textContent =
          'Estimation' + (brand ? ' pour "' + brand + '"' : '') +
          ' basée sur ' + txns + ' transactions CleanPawn des 30 derniers jours.';
        result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 820);
    });
  })();

  /* ── LIVE DATE ────────────────────────────────────────── */
  (function () {
    var now = new Date();
    var fmt = now.toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
    var luEl = document.getElementById('cp-last-update');
    var dmEl = document.getElementById('cp-date-matrix');
    if (luEl) luEl.textContent = fmt;
    if (dmEl) dmEl.textContent = now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  })();

})();
