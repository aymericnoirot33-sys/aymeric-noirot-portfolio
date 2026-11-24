(function () {
  'use strict';

  var MODAL_ID = 'project-modal';
  var TOAST_ID = 'portfolio-toast';
  var FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  var state = {
    initialized: false,
    modalOverlay: null,
    modalPanel: null,
    lastFocusedElement: null,
    toastEl: null,
    toastTimer: null
  };

  function escapeHtml(value) {
    if (value === null || value === undefined) {
      return '';
    }
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalizeStatus(status, isPlaceholder) {
    if (!status) {
      return null;
    }
    if (typeof status === 'object') {
      var objLabel = status.label || status.text || '';
      if (!objLabel) {
        return null;
      }
      var rawTone = String(status.tone || status.type || status.variant || '').toLowerCase();
      var dotClass = isPlaceholder ? 'is-placeholder' : 'is-done';
      if (rawTone === 'placeholder' || rawTone === 'is-placeholder') {
        dotClass = 'is-placeholder';
      } else if (rawTone === 'wip' || rawTone === 'is-wip' || rawTone === 'progress') {
        dotClass = 'is-wip';
      } else if (rawTone === 'academic' || rawTone === 'is-academic' || rawTone === 'sae') {
        dotClass = 'is-academic';
      } else if (rawTone === 'done' || rawTone === 'is-done') {
        dotClass = 'is-done';
      }
      return { label: objLabel, dotClass: dotClass };
    }

    var label = String(status).trim();
    if (!label) {
      return null;
    }

    var lower = label.toLowerCase();
    var tone = isPlaceholder ? 'is-placeholder' : 'is-done';
    if (
      lower.indexOf('compléter') !== -1 ||
      lower.indexOf('completer') !== -1 ||
      lower.indexOf('emplacement') !== -1 ||
      lower.indexOf('réservé') !== -1 ||
      lower.indexOf('reserve') !== -1 ||
      lower.indexOf('préparation') !== -1 ||
      lower.indexOf('preparation') !== -1 ||
      lower.indexOf('placeholder') !== -1
    ) {
      tone = 'is-placeholder';
    } else if (
      lower.indexOf('en cours') !== -1 ||
      lower.indexOf('prototype') !== -1 ||
      lower.indexOf('wip') !== -1 ||
      lower.indexOf('évolution') !== -1
    ) {
      tone = 'is-wip';
    } else if (
      lower.indexOf('saé') !== -1 ||
      lower.indexOf('sae') !== -1 ||
      lower.indexOf('universit') !== -1 ||
      lower.indexOf('académ') !== -1 ||
      lower.indexOf('tutoré') !== -1 ||
      lower.indexOf('évalué') !== -1
    ) {
      tone = 'is-academic';
    }

    return { label: label, dotClass: tone };
  }

  function highlightActiveNav() {
    var currentPage = document.body ? document.body.dataset.page : '';
    if (!currentPage) {
      return;
    }

    var navLinks = document.querySelectorAll('[data-nav]');
    navLinks.forEach(function (link) {
      var isMatch = link.getAttribute('data-nav') === currentPage;
      link.classList.toggle('is-active', isMatch);
      if (isMatch) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function setupMobileNav() {
    var toggleBtn = document.querySelector('.nav-toggle');
    var mobileNav = document.getElementById('mobile-nav');
    if (!toggleBtn || !mobileNav) {
      return;
    }

    function setOpen(isOpen) {
      mobileNav.hidden = !isOpen;
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggleBtn.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
      toggleBtn.classList.toggle('is-open', isOpen);
    }

    toggleBtn.addEventListener('click', function () {
      var currentlyOpen = !mobileNav.hidden;
      setOpen(!currentlyOpen);
    });

    mobileNav.addEventListener('click', function (event) {
      var target = event.target.closest('a, button');
      if (target) {
        setOpen(false);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !mobileNav.hidden) {
        setOpen(false);
        toggleBtn.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && !mobileNav.hidden) {
        setOpen(false);
      }
    });
  }

  function copyTextFallback(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.left = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    var copied = false;
    try {
      copied = document.execCommand('copy');
    } catch (err) {
      copied = false;
    }
    document.body.removeChild(textarea);
    return copied;
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function' && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(
        function () {
          return true;
        },
        function () {
          return copyTextFallback(text);
        }
      );
    }
    return Promise.resolve(copyTextFallback(text));
  }

  function setupCopyEmailButtons() {
    document.addEventListener('click', function (event) {
      var trigger = event.target.closest('[data-copy-email]');
      if (!trigger) {
        return;
      }

      var email = trigger.getAttribute('data-copy-email');
      if (!email) {
        return;
      }

      event.preventDefault();
      copyToClipboard(email).then(function (ok) {
        if (ok) {
          showToast('Adresse e-mail copiée : ' + email);
        } else {
          showToast('Adresse e-mail : ' + email);
        }
      });
    });
  }

  function ensureToastElement() {
    if (state.toastEl && document.body.contains(state.toastEl)) {
      return state.toastEl;
    }

    var existing = document.getElementById(TOAST_ID);
    if (existing) {
      state.toastEl = existing;
      return existing;
    }

    var toast = document.createElement('div');
    toast.id = TOAST_ID;
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.setAttribute('aria-atomic', 'true');
    document.body.appendChild(toast);

    state.toastEl = toast;
    return toast;
  }

  function showToast(message) {
    if (!message) {
      return;
    }

    var toast = ensureToastElement();
    toast.innerHTML =
      '<svg class="toast-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
      '<path d="M3 8.5L6.2 11.7L13 4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>' +
      '<span>' + escapeHtml(message) + '</span>';

    if (state.toastTimer) {
      window.clearTimeout(state.toastTimer);
    }

    window.requestAnimationFrame(function () {
      toast.classList.add('is-visible');
    });

    state.toastTimer = window.setTimeout(function () {
      toast.classList.remove('is-visible');
      state.toastTimer = null;
    }, 3200);
  }

  function ensureModalElement() {
    if (state.modalOverlay && document.body.contains(state.modalOverlay)) {
      return state.modalOverlay;
    }

    var existing = document.getElementById(MODAL_ID);
    if (existing) {
      state.modalOverlay = existing;
      state.modalPanel = existing.querySelector('.modal-panel');
      return existing;
    }

    var overlay = document.createElement('div');
    overlay.id = MODAL_ID;
    overlay.className = 'modal-overlay';
    overlay.hidden = true;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'project-modal-title');

    overlay.innerHTML =
      '<div class="modal-panel" tabindex="-1">' +
      '  <div class="modal-header">' +
      '    <div class="modal-heading">' +
      '      <h2 id="project-modal-title" class="modal-title"></h2>' +
      '      <p id="project-modal-subtitle" class="modal-subtitle"></p>' +
      '    </div>' +
      '    <button type="button" class="modal-close" aria-label="Fermer la fenêtre">' +
      '      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">' +
      '        <path d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
      '      </svg>' +
      '    </button>' +
      '  </div>' +
      '  <div class="modal-body" id="project-modal-body"></div>' +
      '  <div class="modal-footer" id="project-modal-footer"></div>' +
      '</div>';

    document.body.appendChild(overlay);

    var closeBtn = overlay.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeProjectModal);
    }

    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) {
        closeProjectModal();
      }
    });

    document.addEventListener('keydown', handleModalKeydown);

    state.modalOverlay = overlay;
    state.modalPanel = overlay.querySelector('.modal-panel');
    return overlay;
  }

  function handleModalKeydown(event) {
    if (!state.modalOverlay || state.modalOverlay.hidden) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      closeProjectModal();
      return;
    }

    if (event.key === 'Tab' && state.modalPanel) {
      var focusables = Array.prototype.slice.call(
        state.modalPanel.querySelectorAll(FOCUSABLE_SELECTOR)
      ).filter(function (el) {
        return !el.hidden && el.offsetParent !== null;
      });

      if (focusables.length === 0) {
        event.preventDefault();
        state.modalPanel.focus();
        return;
      }

      var first = focusables[0];
      var last = focusables[focusables.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first || document.activeElement === state.modalPanel) {
          event.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  function renderModalLinks(links) {
    if (!Array.isArray(links) || links.length === 0) {
      return '';
    }

    return links
      .map(function (item) {
        if (!item || !item.label) {
          return '';
        }
        var href = item.href || item.url || '';
        var btnClass = item.primary ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm';

        if (!href || item.disabled) {
          return (
            '<span class="tag-mono" aria-disabled="true">' +
            escapeHtml(item.label) +
            '</span>'
          );
        }

        var isExternal =
          item.external === true ||
          /^https?:\/\//i.test(href);
        var attrs = isExternal
          ? ' target="_blank" rel="noopener noreferrer"'
          : '';
        var arrowSvg = isExternal
          ? '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M4.25 9.75L9.75 4.25M5.5 4.25H9.75V8.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
          : '';

        return (
          '<a class="' + btnClass + '" href="' + escapeHtml(href) + '"' + attrs + '>' +
          escapeHtml(item.label) +
          arrowSvg +
          '</a>'
        );
      })
      .join('');
  }

  function openProjectModal(project) {
    if (!project || typeof project !== 'object') {
      return;
    }

    var overlay = ensureModalElement();
    var titleEl = overlay.querySelector('#project-modal-title');
    var subtitleEl = overlay.querySelector('#project-modal-subtitle');
    var bodyEl = overlay.querySelector('#project-modal-body');
    var footerEl = overlay.querySelector('#project-modal-footer');

    state.lastFocusedElement =
      document.activeElement && typeof document.activeElement.focus === 'function'
        ? document.activeElement
        : null;

    if (titleEl) {
      titleEl.textContent = project.title || 'Détail du projet';
    }

    if (subtitleEl) {
      if (project.subtitle) {
        subtitleEl.textContent = project.subtitle;
        subtitleEl.hidden = false;
      } else {
        subtitleEl.textContent = '';
        subtitleEl.hidden = true;
      }
    }

    var parts = [];

    // 1. Metadata strip
    var metaItems = [];
    if (project.category) {
      metaItems.push('<span class="tag-mono">' + escapeHtml(project.category) + '</span>');
    }
    if (project.date) {
      metaItems.push('<span class="tag-mono">' + escapeHtml(project.date) + '</span>');
    }
    if (project.context) {
      metaItems.push('<span class="tag">' + escapeHtml(project.context) + '</span>');
    }
    if (project.team) {
      metaItems.push('<span class="tag">' + escapeHtml(project.team) + '</span>');
    }
    var normalizedStatus = normalizeStatus(project.status, project.isPlaceholder);
    if (normalizedStatus) {
      metaItems.push(
        '<span class="status-badge">' +
        '<span class="status-dot ' + normalizedStatus.dotClass + '" aria-hidden="true"></span>' +
        escapeHtml(normalizedStatus.label) +
        '</span>'
      );
    }

    if (metaItems.length > 0) {
      parts.push('<div class="modal-meta-row">' + metaItems.join('') + '</div>');
    }

    // 2. Project photo or flat SVG illustration
    var imagePath = typeof project.image === 'string' ? project.image.trim() : '';
    if (imagePath) {
      parts.push(
        '<div class="modal-visual">' +
        '<img src="' + escapeHtml(imagePath) + '" alt="' + escapeHtml(project.title || 'Aperçu du projet') + '" loading="lazy">' +
        '</div>'
      );
    } else if (project.svg) {
      parts.push('<div class="modal-visual" aria-hidden="true">' + project.svg + '</div>');
    }

    // 3. Summary
    if (project.summary) {
      parts.push('<p class="modal-summary">' + escapeHtml(project.summary) + '</p>');
    }

    // 4. Problem & Solution two-column grid
    if (project.problem || project.solution) {
      var gridCards = [];
      if (project.problem) {
        gridCards.push(
          '<section class="modal-section">' +
          '  <h3>Contexte &amp; objectifs</h3>' +
          '  <p>' + escapeHtml(project.problem) + '</p>' +
          '</section>'
        );
      }
      if (project.solution) {
        gridCards.push(
          '<section class="modal-section">' +
          '  <h3>Architecture &amp; solution</h3>' +
          '  <p>' + escapeHtml(project.solution) + '</p>' +
          '</section>'
        );
      }
      var gridClass = gridCards.length === 1 ? 'modal-grid modal-grid-single' : 'modal-grid';
      parts.push('<div class="' + gridClass + '">' + gridCards.join('') + '</div>');
    }

    // 5. Rich illustrated showcase sections
    if (Array.isArray(project.sections) && project.sections.length > 0) {
      var showcaseRows = project.sections
        .map(function (sec, idx) {
          if (!sec || typeof sec !== 'object') {
            return '';
          }
          var secImg = typeof sec.image === 'string' ? sec.image.trim() : '';
          var mediaBlock = '';
          if (secImg) {
            mediaBlock =
              '<div class="modal-showcase-media' + (sec.imageFit === 'contain' ? ' is-contain' : '') + '">' +
              '  <img src="' + escapeHtml(secImg) + '" alt="' + escapeHtml(sec.imageAlt || sec.title || '') + '" loading="lazy">' +
              '</div>';
          }

          var textParagraphs = '';
          if (Array.isArray(sec.paragraphs) && sec.paragraphs.length > 0) {
            textParagraphs = sec.paragraphs
              .map(function (p) {
                return '<p>' + escapeHtml(p) + '</p>';
              })
              .join('');
          } else if (sec.text) {
            textParagraphs = '<p>' + escapeHtml(sec.text) + '</p>';
          }

          return (
            '<article class="modal-showcase-row' + (idx % 2 === 1 ? ' is-reverse' : '') + '">' +
            mediaBlock +
            '<div class="modal-showcase-text">' +
            '  <h3>' + escapeHtml(sec.title || '') + '</h3>' +
            textParagraphs +
            '</div>' +
            '</article>'
          );
        })
        .join('');

      if (showcaseRows) {
        parts.push('<div class="modal-showcase">' + showcaseRows + '</div>');
      }
    }

    // 6. Key highlights list
    if (Array.isArray(project.highlights) && project.highlights.length > 0) {
      var highlightItems = project.highlights
        .map(function (item) {
          return '<li>' + escapeHtml(item) + '</li>';
        })
        .join('');
      parts.push(
        '<section class="modal-section">' +
        '  <h3>Points clés &amp; résultats</h3>' +
        '  <ul class="modal-list">' + highlightItems + '</ul>' +
        '</section>'
      );
    }

    // 7. GEII Competences & Technical stack
    var hasCompetences = Array.isArray(project.competences) && project.competences.length > 0;
    var hasStack = Array.isArray(project.stack) && project.stack.length > 0;

    if (hasCompetences || hasStack) {
      var bottomBlocks = [];
      if (hasCompetences) {
        var compTags = project.competences
          .map(function (comp) {
            return '<span class="tag">' + escapeHtml(comp) + '</span>';
          })
          .join('');
        bottomBlocks.push(
          '<section class="modal-section">' +
          '  <h3>Compétences BUT GEII</h3>' +
          '  <div class="modal-tags">' + compTags + '</div>' +
          '</section>'
        );
      }
      if (hasStack) {
        var stackTags = project.stack
          .map(function (tech) {
            return '<span class="tag-mono">' + escapeHtml(tech) + '</span>';
          })
          .join('');
        bottomBlocks.push(
          '<section class="modal-section">' +
          '  <h3>Technologies &amp; outils</h3>' +
          '  <div class="modal-tags">' + stackTags + '</div>' +
          '</section>'
        );
      }

      if (bottomBlocks.length === 2) {
        parts.push('<div class="modal-grid">' + bottomBlocks.join('') + '</div>');
      } else {
        parts.push(bottomBlocks.join(''));
      }
    }

    // 8. Credits / acknowledgments
    if (typeof project.credits === 'string' && project.credits.trim().length > 0) {
      parts.push('<p class="modal-credits">' + escapeHtml(project.credits.trim()) + '</p>');
    }

    if (bodyEl) {
      bodyEl.innerHTML = parts.join('');
      bodyEl.scrollTop = 0;
    }

    if (footerEl) {
      var linksHtml = renderModalLinks(project.links).trim();
      if (linksHtml) {
        footerEl.classList.remove('is-no-links');
        footerEl.innerHTML =
          '<div class="modal-footer-links">' + linksHtml + '</div>' +
          '<button type="button" class="btn btn-secondary btn-sm" data-modal-close>Fermer</button>';
      } else {
        footerEl.classList.add('is-no-links');
        footerEl.innerHTML =
          '<button type="button" class="btn btn-secondary btn-sm" data-modal-close>Fermer</button>';
      }

      var footerCloseBtn = footerEl.querySelector('[data-modal-close]');
      if (footerCloseBtn) {
        footerCloseBtn.addEventListener('click', closeProjectModal);
      }
    }

    overlay.hidden = false;
    document.body.classList.add('is-modal-open');

    window.requestAnimationFrame(function () {
      overlay.classList.add('is-open');
      var closeButton = overlay.querySelector('.modal-close');
      if (closeButton) {
        closeButton.focus();
      } else if (state.modalPanel) {
        state.modalPanel.focus();
      }
    });
  }

  function closeProjectModal() {
    if (!state.modalOverlay || state.modalOverlay.hidden) {
      return;
    }

    state.modalOverlay.classList.remove('is-open');
    state.modalOverlay.hidden = true;
    document.body.classList.remove('is-modal-open');

    if (state.lastFocusedElement && document.body.contains(state.lastFocusedElement)) {
      try {
        state.lastFocusedElement.focus();
      } catch (err) {
        // Ignore focus errors if element is no longer focusable
      }
    }
    state.lastFocusedElement = null;
  }

  function init() {
    if (state.initialized) {
      return;
    }
    state.initialized = true;

    highlightActiveNav();
    setupMobileNav();
    setupCopyEmailButtons();
    ensureModalElement();
  }

  window.PortfolioUI = {
    init: init,
    openProjectModal: openProjectModal,
    closeProjectModal: closeProjectModal,
    showToast: showToast
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
