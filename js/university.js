/**
 * Logique interactive de la page Projets universitaires (BUT GEII).
 * Gère le filtrage par année académique et par compétence BUT GEII,
 * le rendu dynamique des cartes (photo ou SVG) dans #university-projects-grid
 * et l'ouverture de la modale partagée window.PortfolioUI.openProjectModal.
 */
(function () {
  'use strict';

  var state = {
    year: 'all',
    competence: null
  };

  var projects = Array.isArray(window.UNIVERSITY_PROJECTS) ? window.UNIVERSITY_PROJECTS : [];
  var competences = Array.isArray(window.UNIVERSITY_COMPETENCES) ? window.UNIVERSITY_COMPETENCES : [];

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

  function normalizeYearGroup(value) {
    if (!value) {
      return '';
    }
    var raw = String(value).toLowerCase().trim();
    if (raw === 's1-s2') {
      return 'y1';
    }
    if (raw === 's3-s4') {
      return 'y2';
    }
    if (raw === 's5-s6') {
      return 'y3';
    }
    return raw;
  }

  function isPlaceholderProject(project) {
    if (!project) {
      return false;
    }
    if (project.isPlaceholder === true) {
      return true;
    }
    var statusText = String(project.status || '').toLowerCase();
    return statusText.indexOf('compléter') !== -1 || statusText.indexOf('réservé') !== -1;
  }

  function findCompetenceMeta(compId) {
    for (var i = 0; i < competences.length; i += 1) {
      if (competences[i].id === compId) {
        return competences[i];
      }
    }
    return null;
  }

  function projectMatchesCompetence(project, compId) {
    if (!compId) {
      return true;
    }
    var meta = findCompetenceMeta(compId);
    if (!meta || !Array.isArray(project.competences)) {
      return false;
    }
    for (var i = 0; i < project.competences.length; i += 1) {
      if (meta.matches.indexOf(project.competences[i]) !== -1) {
        return true;
      }
    }
    return false;
  }

  function getFilteredProjects() {
    return projects.filter(function (project) {
      var yearMatch = state.year === 'all' || normalizeYearGroup(project.yearGroup) === state.year;
      var compMatch = projectMatchesCompetence(project, state.competence);
      return yearMatch && compMatch;
    });
  }

  function findProjectById(id) {
    for (var i = 0; i < projects.length; i += 1) {
      if (projects[i].id === id) {
        return projects[i];
      }
    }
    return null;
  }

  function renderCardVisual(project) {
    var imgPath = typeof project.image === 'string' ? project.image.trim() : '';
    if (imgPath) {
      return (
        '  <div class="project-card-visual">' +
        '<img src="' + escapeHtml(imgPath) + '" alt="' + escapeHtml(project.title || 'Visuel du projet') + '" loading="lazy">' +
        '</div>'
      );
    }
    return (
      '  <div class="project-card-visual" aria-hidden="true">\n' +
      (project.svg || '') +
      '\n  </div>'
    );
  }

  function renderProjectCard(project) {
    var isPlaceholder = isPlaceholderProject(project);
    var cardClass = isPlaceholder ? 'project-card uni-card is-placeholder' : 'project-card uni-card';
    var dotClass = isPlaceholder ? 'status-dot is-placeholder' : 'status-dot is-academic';
    var badgeCode = project.saeCode || project.code || 'SAÉ';
    var ctaLabel = isPlaceholder ? 'Aperçu du modèle' : 'Voir les détails';

    var compTags = Array.isArray(project.competences)
      ? project.competences
          .map(function (comp) {
            return '<span class="tag uni-comp-tag">' + escapeHtml(comp) + '</span>';
          })
          .join('')
      : '';

    return [
      '<article class="' + cardClass + '" role="button" tabindex="0" data-project-id="' + escapeHtml(project.id) + '" aria-label="Voir les détails de ' + escapeHtml(project.title) + '">',
      renderCardVisual(project),
      '  <div class="project-card-body">',
      '    <div class="project-card-meta">',
      '      <span class="tag-accent uni-sae-badge">' + escapeHtml(badgeCode) + '</span>',
      '      <span class="uni-card-meta-right">' + escapeHtml(project.semester) + ' · ' + escapeHtml(project.team) + '</span>',
      '    </div>',
      '    <h3 class="project-card-title">' + escapeHtml(project.title) + '</h3>',
      '    <p class="project-card-desc">' + escapeHtml(project.summary) + '</p>',
      '    <div class="project-card-tags" aria-label="Domaine et compétences BUT GEII">',
      '      <span class="tag-mono">' + escapeHtml(project.category) + '</span>',
      compTags,
      '    </div>',
      '    <div class="project-card-footer">',
      '      <span class="status-badge">',
      '        <span class="' + dotClass + '" aria-hidden="true"></span>',
      '        ' + escapeHtml(project.status || 'SAÉ évaluée'),
      '      </span>',
      '      <span class="project-card-cta">' + ctaLabel + ' <span class="cta-arrow" aria-hidden="true">→</span></span>',
      '    </div>',
      '  </div>',
      '</article>'
    ].join('\n');
  }

  function renderEmptyState() {
    return [
      '<div class="uni-empty-state" role="status">',
      '  <span class="uni-empty-bar" aria-hidden="true"></span>',
      '  <p class="uni-empty-title">Aucun projet dans ce filtre pour le moment.</p>',
      '  <p class="uni-empty-desc">Actuellement en 1re année de BUT GEII à l’IUT de Bordeaux — les SAÉ de 2e et 3e année viendront enrichir cette galerie au fil des prochains semestres.</p>',
      '  <button type="button" class="btn btn-secondary btn-sm" data-reset-filters>Afficher toutes les réalisations</button>',
      '</div>'
    ].join('\n');
  }

  function updateTotalCount() {
    var totalEl = document.getElementById('uni-total-count');
    if (totalEl) {
      totalEl.textContent = String(projects.length);
    }
  }

  function updatePillarStates() {
    var allPlaceholders = projects.length > 0 && projects.every(isPlaceholderProject);
    var pillarButtons = document.querySelectorAll('[data-competence-filter]');
    pillarButtons.forEach(function (btn) {
      var compId = btn.getAttribute('data-competence-filter');
      var isActive = state.competence === compId;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');

      var countEl = btn.querySelector('[data-competence-count]');
      if (countEl) {
        var count = projects.filter(function (project) {
          var yearMatch = state.year === 'all' || normalizeYearGroup(project.yearGroup) === state.year;
          return yearMatch && projectMatchesCompetence(project, compId);
        }).length;
        var unit = allPlaceholders
          ? (count > 1 ? ' emplacements' : ' emplacement')
          : (count > 1 ? ' projets' : ' projet');
        countEl.textContent = count + unit;
      }
    });
  }

  function updateYearFilterButtons() {
    var yearButtons = document.querySelectorAll('[data-year-filter]');
    yearButtons.forEach(function (btn) {
      var value = btn.getAttribute('data-year-filter');
      var isActive = state.year === value;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function updateResultsMeta(filtered) {
    var metaEl = document.getElementById('university-results-meta');
    if (!metaEl) {
      return;
    }

    var count = filtered.length;
    var onlyPlaceholders = count > 0 && filtered.every(isPlaceholderProject);
    var label = onlyPlaceholders
      ? count + (count > 1 ? ' emplacements affichés' : ' emplacement affiché')
      : count + (count > 1 ? ' réalisations affichées' : ' réalisation affichée');

    if (state.competence) {
      var compMeta = findCompetenceMeta(state.competence);
      if (compMeta) {
        metaEl.innerHTML =
          '<span>' + escapeHtml(label) + '</span>' +
          '<button type="button" class="uni-active-chip" data-clear-competence aria-label="Retirer le filtre ' + escapeHtml(compMeta.label) + '">' +
          escapeHtml(compMeta.label) +
          ' <span aria-hidden="true">×</span></button>';
        return;
      }
    }

    metaEl.textContent = label;
  }

  function render() {
    var grid = document.getElementById('university-projects-grid');
    if (!grid) {
      return;
    }

    var filtered = getFilteredProjects();
    if (filtered.length === 0) {
      grid.innerHTML = renderEmptyState();
    } else {
      grid.innerHTML = filtered.map(renderProjectCard).join('\n');
    }

    updateTotalCount();
    updateYearFilterButtons();
    updatePillarStates();
    updateResultsMeta(filtered);
  }

  function openProjectById(projectId) {
    var project = findProjectById(projectId);
    if (!project) {
      return;
    }
    if (window.PortfolioUI && typeof window.PortfolioUI.openProjectModal === 'function') {
      window.PortfolioUI.openProjectModal(project);
    }
  }

  function bindEvents() {
    var yearGroup = document.getElementById('university-year-filters');
    if (yearGroup) {
      yearGroup.addEventListener('click', function (event) {
        var btn = event.target.closest('[data-year-filter]');
        if (!btn) {
          return;
        }
        var nextYear = btn.getAttribute('data-year-filter') || 'all';
        if (state.year === nextYear) {
          return;
        }
        state.year = nextYear;
        render();
      });
    }

    var pillarsContainer = document.getElementById('geii-pillars');
    if (pillarsContainer) {
      pillarsContainer.addEventListener('click', function (event) {
        var btn = event.target.closest('[data-competence-filter]');
        if (!btn) {
          return;
        }
        var compId = btn.getAttribute('data-competence-filter');
        state.competence = state.competence === compId ? null : compId;
        render();
      });
    }

    var metaEl = document.getElementById('university-results-meta');
    if (metaEl) {
      metaEl.addEventListener('click', function (event) {
        var clearBtn = event.target.closest('[data-clear-competence]');
        if (!clearBtn) {
          return;
        }
        state.competence = null;
        render();
      });
    }

    var grid = document.getElementById('university-projects-grid');
    if (grid) {
      grid.addEventListener('click', function (event) {
        var resetBtn = event.target.closest('[data-reset-filters]');
        if (resetBtn) {
          state.year = 'all';
          state.competence = null;
          render();
          return;
        }

        var card = event.target.closest('.project-card[data-project-id]');
        if (!card) {
          return;
        }
        openProjectById(card.getAttribute('data-project-id'));
      });

      grid.addEventListener('keydown', function (event) {
        if (event.key !== 'Enter' && event.key !== ' ') {
          return;
        }
        var card = event.target.closest('.project-card[data-project-id]');
        if (!card) {
          return;
        }
        event.preventDefault();
        openProjectById(card.getAttribute('data-project-id'));
      });
    }

    window.addEventListener('hashchange', checkHashDeepLink);
  }

  function checkHashDeepLink() {
    var rawHash = window.location.hash ? window.location.hash.slice(1).trim() : '';
    if (!rawHash) {
      return;
    }
    try {
      rawHash = decodeURIComponent(rawHash);
    } catch (err) {
      // Keep rawHash unchanged if URI decoding fails
    }
    if (findProjectById(rawHash)) {
      openProjectById(rawHash);
    }
  }

  function init() {
    bindEvents();
    render();
    checkHashDeepLink();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
