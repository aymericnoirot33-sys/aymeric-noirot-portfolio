/**
 * Logique interactive de la page « Projets personnels »
 * ------------------------------------------------------------
 * - Rendu dynamique des cartes depuis window.PERSONAL_PROJECTS
 * - Support des visuels image (`project.image`) ou SVG (`project.svg`)
 * - Filtrage par catégorie avec compteur en direct
 * - Accessibilité clavier complète (Enter / Espace -> modale partagée)
 * - Ouverture directe optionnelle via ancre d'URL (#id-du-projet)
 */
(function () {
  'use strict';

  var CATEGORIES = [
    'Tous',
    'Embarqué & IoT',
    'Électronique & PCB',
    'Robotique',
    'Logiciel & Outils'
  ];

  var activeCategory = 'Tous';

  function getProjects() {
    if (Array.isArray(window.PERSONAL_PROJECTS)) {
      return window.PERSONAL_PROJECTS;
    }
    return [];
  }

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

  function getStatusDotClass(status, isPlaceholder) {
    var text = String(status || '').toLowerCase();
    if (
      isPlaceholder ||
      text.indexOf('compléter') !== -1 ||
      text.indexOf('completer') !== -1 ||
      text.indexOf('emplacement') !== -1 ||
      text.indexOf('à venir') !== -1 ||
      text.indexOf('placeholder') !== -1
    ) {
      return 'is-placeholder';
    }
    if (
      text.indexOf('en cours') !== -1 ||
      text.indexOf('prototype') !== -1 ||
      text.indexOf('wip') !== -1
    ) {
      return 'is-wip';
    }
    return 'is-done';
  }

  function matchesCategory(project, category) {
    if (category === 'Tous') {
      return true;
    }
    if (Array.isArray(project.filterCategories)) {
      if (project.filterCategories.indexOf(category) !== -1) {
        return true;
      }
    }
    return project.category === category;
  }

  function getFilteredProjects(category) {
    return getProjects().filter(function (project) {
      return matchesCategory(project, category);
    });
  }

  function buildVisualMarkup(project, safeTitle) {
    var imagePath =
      typeof project.image === 'string' ? project.image.trim() : '';
    if (imagePath) {
      return (
        '  <div class="project-card-visual">' +
        '    <img src="' + escapeHtml(imagePath) + '" alt="' + safeTitle + '" loading="lazy">' +
        '  </div>'
      );
    }
    return (
      '  <div class="project-card-visual" aria-hidden="true">' +
      (project.svg || '') +
      '  </div>'
    );
  }

  function buildCardMarkup(project) {
    var isPlaceholder = Boolean(project.isPlaceholder);
    var statusDotClass = getStatusDotClass(project.status, isPlaceholder);
    var stackList = Array.isArray(project.stack) ? project.stack : [];
    var visibleStack = stackList.slice(0, 4);
    var extraStackCount = Math.max(0, stackList.length - visibleStack.length);

    var tagsHtml = visibleStack
      .map(function (tech) {
        return '<span class="tag-mono">' + escapeHtml(tech) + '</span>';
      })
      .join('');

    if (extraStackCount > 0) {
      tagsHtml +=
        '<span class="tag-mono personal-tag-more">+' +
        extraStackCount +
        '</span>';
    }

    var safeTitle = escapeHtml(project.title);
    var safeCategory = escapeHtml(project.category);
    var safeDate = escapeHtml(project.date || '');
    var safeStatus = escapeHtml(project.status || (isPlaceholder ? 'À compléter' : 'Terminé'));
    var safeSummary = escapeHtml(project.summary || '');
    var safeId = escapeHtml(project.id || '');
    var cardClasses = 'project-card personal-card-enter' + (isPlaceholder ? ' is-placeholder' : '');
    var ctaLabel = isPlaceholder ? 'Voir l’emplacement' : 'Voir les détails';

    return (
      '<article class="' + cardClasses + '"' +
      ' role="button"' +
      ' tabindex="0"' +
      ' data-project-id="' + safeId + '"' +
      ' aria-label="Ouvrir la fiche détaillée : ' + safeTitle + '">' +
      buildVisualMarkup(project, safeTitle) +
      '  <div class="project-card-body">' +
      '    <div class="project-card-meta">' +
      '      <div class="personal-card-meta-left">' +
      '        <span class="tag-mono">' + safeCategory + '</span>' +
      (safeDate ? '<span class="personal-card-date">' + safeDate + '</span>' : '') +
      '      </div>' +
      '      <span class="status-badge">' +
      '        <span class="status-dot ' + statusDotClass + '" aria-hidden="true"></span>' +
      safeStatus +
      '      </span>' +
      '    </div>' +
      '    <h3 class="project-card-title">' + safeTitle + '</h3>' +
      '    <p class="project-card-desc">' + safeSummary + '</p>' +
      '    <div class="project-card-tags">' + tagsHtml + '</div>' +
      '    <div class="project-card-footer">' +
      '      <span class="personal-card-team">' + escapeHtml(project.team || 'Projet personnel') + '</span>' +
      '      <span class="project-card-cta">' +
      ctaLabel +
      '        <svg class="personal-cta-arrow" width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
      '          <path d="M3.5 8H12.5M9.2 4.7L12.5 8L9.2 11.3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '        </svg>' +
      '      </span>' +
      '    </div>' +
      '  </div>' +
      '</article>'
    );
  }

  function updateCounter(count, category) {
    var counterEl = document.getElementById('personal-results-count');
    if (!counterEl) {
      return;
    }

    var label;
    if (count === 0) {
      label = 'Aucun projet affiché';
    } else if (count === 1) {
      label = '1 projet affiché';
    } else {
      label = count + ' projets affichés';
    }

    if (category !== 'Tous') {
      counterEl.textContent = label + ' · ' + category;
    } else {
      counterEl.textContent = label;
    }
  }

  function updateHeroTotal(projects) {
    var total = projects.length;
    var documentedCount = projects.filter(function (item) {
      return !item.isPlaceholder;
    }).length;
    var displayCount = documentedCount > 0 && documentedCount < total ? total : (documentedCount || total);
    var formatted = displayCount < 10 ? '0' + displayCount : String(displayCount);
    var totalEl = document.getElementById('personal-total-count');
    if (totalEl) {
      totalEl.textContent = formatted;
    }

    var labelEl = document.getElementById('personal-total-label');
    if (labelEl) {
      if (documentedCount === 0) {
        labelEl.textContent = total === 1 ? 'Emplacement prêt' : 'Emplacements prêts';
      } else if (documentedCount < total) {
        labelEl.textContent = 'Projet & prototypes';
      } else {
        labelEl.textContent = total === 1 ? 'Projet documenté' : 'Projets documentés';
      }
    }
  }

  function updateFilterButtons(selectedCategory) {
    var buttons = document.querySelectorAll('#personal-filters .filter-btn');
    buttons.forEach(function (button) {
      var cat = button.getAttribute('data-category');
      var isActive = cat === selectedCategory;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function openProjectById(projectId) {
    var projects = getProjects();
    var found = null;
    for (var i = 0; i < projects.length; i += 1) {
      if (projects[i].id === projectId) {
        found = projects[i];
        break;
      }
    }
    if (!found) {
      return;
    }

    if (window.PortfolioUI && typeof window.PortfolioUI.openProjectModal === 'function') {
      window.PortfolioUI.openProjectModal(found);
    }
  }

  function renderProjects(category) {
    var gridEl = document.getElementById('personal-projects-grid');
    if (!gridEl) {
      return;
    }

    var filtered = getFilteredProjects(category);
    updateCounter(filtered.length, category);

    if (filtered.length === 0) {
      gridEl.innerHTML =
        '<div class="personal-empty-state">' +
        '  <p class="personal-empty-title">Aucun projet dans cette catégorie pour le moment.</p>' +
        '  <p class="personal-empty-desc">Affichez l’ensemble des emplacements ou ajoutez un projet dans js/data-personal.js.</p>' +
        '  <button type="button" class="btn btn-secondary btn-sm" data-reset-filter>Afficher tous les projets</button>' +
        '</div>';

      var resetBtn = gridEl.querySelector('[data-reset-filter]');
      if (resetBtn) {
        resetBtn.addEventListener('click', function () {
          setCategory('Tous');
        });
      }
      return;
    }

    gridEl.innerHTML = filtered.map(buildCardMarkup).join('');
  }

  function setCategory(category) {
    if (CATEGORIES.indexOf(category) === -1) {
      category = 'Tous';
    }
    activeCategory = category;
    updateFilterButtons(activeCategory);
    renderProjects(activeCategory);
  }

  function setupFilterEvents() {
    var filterContainer = document.getElementById('personal-filters');
    if (!filterContainer) {
      return;
    }

    filterContainer.addEventListener('click', function (event) {
      var btn = event.target.closest('.filter-btn[data-category]');
      if (!btn) {
        return;
      }
      var nextCategory = btn.getAttribute('data-category');
      if (nextCategory && nextCategory !== activeCategory) {
        setCategory(nextCategory);
      }
    });
  }

  function setupCardEvents() {
    var gridEl = document.getElementById('personal-projects-grid');
    if (!gridEl) {
      return;
    }

    gridEl.addEventListener('click', function (event) {
      var card = event.target.closest('.project-card[data-project-id]');
      if (!card) {
        return;
      }
      var id = card.getAttribute('data-project-id');
      if (id) {
        openProjectById(id);
      }
    });

    gridEl.addEventListener('keydown', function (event) {
      var isActivateKey =
        event.key === 'Enter' ||
        event.key === ' ' ||
        event.key === 'Spacebar';
      if (!isActivateKey) {
        return;
      }

      var card = event.target.closest('.project-card[data-project-id]');
      if (!card) {
        return;
      }

      event.preventDefault();
      var id = card.getAttribute('data-project-id');
      if (id) {
        openProjectById(id);
      }
    });
  }

  function checkHashDeepLink() {
    var rawHash = window.location.hash ? window.location.hash.replace(/^#/, '') : '';
    if (!rawHash) {
      return;
    }
    var projects = getProjects();
    for (var i = 0; i < projects.length; i += 1) {
      if (projects[i].id === rawHash) {
        openProjectById(rawHash);
        break;
      }
    }
  }

  function initPersonalPage() {
    var projects = getProjects();
    updateHeroTotal(projects);
    setupFilterEvents();
    setupCardEvents();
    setCategory('Tous');
    checkHashDeepLink();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPersonalPage);
  } else {
    initPersonalPage();
  }
})();
