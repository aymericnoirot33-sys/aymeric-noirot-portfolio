(function () {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';

  function createSvgEl(tag, attrs) {
    var el = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs).forEach(function (key) {
      el.setAttribute(key, String(attrs[key]));
    });
    return el;
  }

  function formatCount(count) {
    if (count === 0) {
      return 'Aucune étape affichée';
    }
    if (count === 1) {
      return '1 étape affichée';
    }
    return count + ' étapes affichées';
  }

  function initParcoursTimeline() {
    var shell = document.getElementById('timeline-shell');
    var svg = document.getElementById('timeline-curve-svg');
    var list = document.getElementById('timeline-list');
    var countEl = document.getElementById('parcours-count');
    var filterButtons = Array.prototype.slice.call(
      document.querySelectorAll('.parcours-filter-bar .filter-btn[data-filter]')
    );

    if (!shell || !svg || !list) {
      return;
    }

    var items = Array.prototype.slice.call(list.querySelectorAll('.timeline-item'));
    var branchByItem = new Map();
    var rafId = null;

    function getVisibleItems() {
      return items.filter(function (item) {
        return !item.hidden;
      });
    }

    function drawTimelineCurve() {
      var visibleItems = getVisibleItems();
      var shellRect = shell.getBoundingClientRect();
      var width = Math.max(shell.scrollWidth, Math.round(shellRect.width));
      var height = Math.max(shell.scrollHeight, Math.round(shellRect.height));

      svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
      svg.setAttribute('width', String(width));
      svg.setAttribute('height', String(height));

      while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
      }
      branchByItem.clear();

      if (visibleItems.length === 0 || width <= 0 || height <= 0) {
        return;
      }

      var points = [];
      visibleItems.forEach(function (item) {
        var node = item.querySelector('.timeline-node');
        var card = item.querySelector('.timeline-card');
        if (!node || !card) {
          return;
        }
        var nodeRect = node.getBoundingClientRect();
        var cardRect = card.getBoundingClientRect();

        points.push({
          item: item,
          x: nodeRect.left + nodeRect.width / 2 - shellRect.left,
          y: nodeRect.top + nodeRect.height / 2 - shellRect.top,
          cardLeft: cardRect.left - shellRect.left,
          cardTop: cardRect.top - shellRect.top
        });
      });

      if (points.length === 0) {
        return;
      }

      var isCompact = window.innerWidth <= 860;

      // Liaison verticale calme et douce entre chaque jalon visible
      var first = points[0];
      var last = points[points.length - 1];
      var leadInY = Math.max(6, first.y - (isCompact ? 16 : 24));
      var leadInX = first.x + (isCompact ? 3 : 5);

      var mainPathParts = [
        'M ' + leadInX.toFixed(1) + ' ' + leadInY.toFixed(1),
        'C ' + leadInX.toFixed(1) + ' ' + (leadInY + (first.y - leadInY) * 0.55).toFixed(1) +
        ' ' + first.x.toFixed(1) + ' ' + (first.y - (first.y - leadInY) * 0.45).toFixed(1) +
        ' ' + first.x.toFixed(1) + ' ' + first.y.toFixed(1)
      ];

      for (var i = 0; i < points.length - 1; i++) {
        var p0 = points[i];
        var p1 = points[i + 1];
        var dy = p1.y - p0.y;
        var cp0Y = p0.y + dy * 0.5;
        var cp1Y = p1.y - dy * 0.5;

        mainPathParts.push(
          'C ' + p0.x.toFixed(1) + ' ' + cp0Y.toFixed(1) +
          ' ' + p1.x.toFixed(1) + ' ' + cp1Y.toFixed(1) +
          ' ' + p1.x.toFixed(1) + ' ' + p1.y.toFixed(1)
        );
      }

      // Fin de ligne discrète sous le dernier jalon
      var tailY = Math.min(height - 6, last.y + (isCompact ? 26 : 38));
      mainPathParts.push(
        'L ' + last.x.toFixed(1) + ' ' + tailY.toFixed(1)
      );

      svg.appendChild(
        createSvgEl('path', {
          d: mainPathParts.join(' '),
          class: 'timeline-curve-main'
        })
      );

      // Connecteurs discrets reliant chaque jalon au bord gauche de sa carte
      points.forEach(function (pt) {
        var targetX = pt.cardLeft - 1;
        if (targetX <= pt.x + 8) {
          return;
        }
        var startX = pt.x + 6.5;
        var branchD;

        if (isCompact) {
          var targetY = pt.cardTop + 18;
          var midX = startX + (targetX - startX) * 0.5;
          branchD =
            'M ' + startX.toFixed(1) + ' ' + pt.y.toFixed(1) +
            ' C ' + midX.toFixed(1) + ' ' + pt.y.toFixed(1) +
            ' ' + midX.toFixed(1) + ' ' + targetY.toFixed(1) +
            ' ' + targetX.toFixed(1) + ' ' + targetY.toFixed(1);
        } else {
          branchD =
            'M ' + startX.toFixed(1) + ' ' + pt.y.toFixed(1) +
            ' L ' + targetX.toFixed(1) + ' ' + pt.y.toFixed(1);
        }

        var branchPath = createSvgEl('path', {
          d: branchD,
          class: 'timeline-curve-branch'
        });
        svg.appendChild(branchPath);
        branchByItem.set(pt.item, branchPath);
      });

      shell.classList.add('has-svg-curve');
    }

    function scheduleRedraw() {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      rafId = window.requestAnimationFrame(function () {
        rafId = null;
        drawTimelineCurve();
      });
    }

    function applyFilter(filterKey) {
      var visibleIndex = 0;

      items.forEach(function (item) {
        var rawCategories = (item.getAttribute('data-categories') || '').trim();
        var categories = rawCategories ? rawCategories.split(/\s+/) : [];
        var matches = filterKey === 'all' || categories.indexOf(filterKey) !== -1;

        item.hidden = !matches;
        if (matches) {
          item.setAttribute('data-wave', visibleIndex % 2 === 0 ? 'left' : 'right');
          visibleIndex += 1;
        }
      });

      filterButtons.forEach(function (btn) {
        var isActive = btn.getAttribute('data-filter') === filterKey;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });

      if (countEl) {
        countEl.textContent = formatCount(visibleIndex);
      }

      scheduleRedraw();
    }

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filterKey = btn.getAttribute('data-filter') || 'all';
        applyFilter(filterKey);
      });
    });

    // Mise en évidence bleue du connecteur au survol / focus clavier
    items.forEach(function (item) {
      function setHighlighted(active) {
        var branch = branchByItem.get(item);
        if (branch) {
          branch.classList.toggle('is-highlighted', active);
        }
      }

      item.addEventListener('mouseenter', function () {
        setHighlighted(true);
      });
      item.addEventListener('mouseleave', function () {
        setHighlighted(false);
      });
      item.addEventListener('focusin', function () {
        setHighlighted(true);
      });
      item.addEventListener('focusout', function () {
        setHighlighted(false);
      });
    });

    // Redessin automatique au redimensionnement et chargement des polices
    window.addEventListener('resize', scheduleRedraw);

    if (typeof window.ResizeObserver === 'function') {
      var observer = new window.ResizeObserver(scheduleRedraw);
      observer.observe(shell);
    }

    if (document.fonts && document.fonts.ready && typeof document.fonts.ready.then === 'function') {
      document.fonts.ready.then(scheduleRedraw);
    }

    applyFilter('all');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParcoursTimeline);
  } else {
    initParcoursTimeline();
  }
})();
