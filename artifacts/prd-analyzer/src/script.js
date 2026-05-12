const textarea       = document.getElementById('prd-input');
const analyzeBtn     = document.getElementById('analyze-btn');
const charCount      = document.getElementById('char-count');
const analysisBanner = document.getElementById('analysis-banner');
const bannerText     = document.getElementById('banner-text');

// ── Character counter ─────────────────────────────────────────────────────────
textarea.addEventListener('input', () => {
  const len = textarea.value.length;
  charCount.textContent = len === 1 ? '1 character' : `${len.toLocaleString()} characters`;
  clearInputError();
});

// ── Analyze button ────────────────────────────────────────────────────────────
analyzeBtn.addEventListener('click', () => {
  const text = textarea.value.trim();

  if (!text) {
    return showInputError('Please enter a PRD');
  }
  if (text.length < 20) {
    return showInputError('PRD too short — please provide more detail');
  }

  clearInputError();

  const preview = text.length > 140 ? text.slice(0, 140).trimEnd() + '...' : text;
  bannerText.textContent = preview;
  analysisBanner.classList.remove('hidden');
  analysisBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  setLoading(true);
  runAnalysis(text);
});

textarea.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') analyzeBtn.click();
});

document.querySelectorAll('.history-item').forEach((item) => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.history-item').forEach((el) => el.classList.remove('history-item-active'));
    item.classList.add('history-item-active');
  });
});

// ── Input validation helpers ──────────────────────────────────────────────────
function showInputError(msg) {
  textarea.classList.add('textarea-error');
  let err = document.getElementById('input-error');
  if (!err) {
    err = document.createElement('p');
    err.id = 'input-error';
    err.className = 'input-error-msg';
    textarea.parentNode.insertBefore(err, textarea.nextSibling);
  }
  err.textContent = msg;
  textarea.focus();
}

function clearInputError() {
  textarea.classList.remove('textarea-error');
  const err = document.getElementById('input-error');
  if (err) err.remove();
}

// ── Loading state ─────────────────────────────────────────────────────────────
function setLoading(on) {
  analyzeBtn.disabled = on;
  analyzeBtn.style.opacity = on ? '0.7' : '';
  analyzeBtn.style.cursor  = on ? 'not-allowed' : '';
  analyzeBtn.innerHTML = on
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Analyzing…`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> Analyze PRD`;
}

// ── API call ──────────────────────────────────────────────────────────────────
async function runAnalysis(text) {
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prd_text: text }),
    });

    if (res.status === 422) {
      const body = await res.json();
      const msg = typeof body.detail === 'string'
        ? body.detail
        : Array.isArray(body.detail)
          ? (body.detail[0]?.msg || 'Invalid input').replace('Value error, ', '')
          : 'Invalid input';
      showInputError(msg);
      return;
    }
    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const data = await res.json();
    renderResults(data);
    addHistoryEntry(text, data);
    loadDashboard();
  } catch (err) {
    showError(err.message || 'Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
}

// ── Render results ────────────────────────────────────────────────────────────
function renderResults(data) {
  const { issues = [], questions = [], confidence_score = 0.5, status = '' } = data;

  const ambiguity  = issues.filter(i => i.type === 'ambiguity');
  const missing    = issues.filter(i => i.type === 'missing_logic');
  const undefined_ = issues.filter(i => i.type === 'undefined_input');

  renderIssueSubsection('ambiguity-list', ambiguity,  'tag-red',   'Ambiguity',       'icv2-red');
  renderIssueSubsection('missing-list',   missing,    'tag-amber', 'Missing Logic',   'icv2-amber');
  renderIssueSubsection('undefined-list', undefined_, 'tag-blue',  'Undefined Input', 'icv2-blue');

  setGroupCount('count-ambiguity', ambiguity.length);
  setGroupCount('count-missing',   missing.length);
  setGroupCount('count-undefined', undefined_.length);

  const tabIssues = document.getElementById('tab-count-issues');
  if (tabIssues) tabIssues.textContent = issues.length;

  renderQuestions(questions);
  renderSummary(issues, confidence_score, status);

  const resultsArea = document.getElementById('results-area');
  if (resultsArea) {
    resultsArea.classList.remove('hidden');
    resultsArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  activateTab('issues');
}

function setGroupCount(id, count) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = count > 0 ? `(${count})` : '';
}

function renderIssueSubsection(containerId, issues, tagClass, label, colorClass) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (issues.length === 0) {
    container.innerHTML = `<div class="icv2-empty">✓ PRD looks ready — no ${label.toLowerCase()} issues found.</div>`;
    return;
  }
  const severity = tagClass === 'tag-amber' ? 'High' : 'Medium';
  container.innerHTML = issues.map(issue => `
    <div class="issue-card-v2 ${colorClass}">
      <div class="icv2-top">
        <span class="issue-tag ${tagClass}">${label}</span>
        <span class="icv2-severity">Severity: ${severity}</span>
      </div>
      <p class="icv2-text">${escHtml(issue.explanation)}</p>
      ${issue.text ? `<span class="icv2-snippet">${escHtml(issue.text)}</span>` : ''}
    </div>
  `).join('');
}

function renderQuestions(questions) {
  const list     = document.getElementById('question-list');
  const tabCount = document.getElementById('tab-count-questions');
  if (!list) return;
  if (tabCount) tabCount.textContent = questions.length;

  const shown = questions.slice(0, 3);
  if (shown.length === 0) {
    list.innerHTML = `<li class="question-item question-item-empty"><p>No clarification needed — the PRD is sufficiently detailed.</p></li>`;
    return;
  }
  list.innerHTML = shown.map((q, i) => `
    <li class="question-item">
      <p>${escHtml(q)}</p>
    </li>
  `).join('');
}

function renderSummary(issues, score, status) {
  const pct     = Math.round(score * 100);
  const isGreen = pct >= 70;
  const isAmber = pct >= 40 && pct < 70;
  const color   = isGreen ? '#22c55e' : isAmber ? '#f59e0b' : '#ef4444';

  const numEl = document.getElementById('sum-score-num');
  const barEl = document.getElementById('sum-score-bar');
  const stEl  = document.getElementById('sum-status');
  const topEl = document.getElementById('sum-top-issues');

  if (numEl) numEl.textContent = `${pct}%`;

  if (barEl) {
    barEl.style.width      = `${pct}%`;
    barEl.style.background = color;
  }

  const label   = status || (isGreen ? 'Ready for Engineering' : isAmber ? 'Needs Improvement' : 'Low Quality PRD');
  const pillCls = isGreen ? 'status-green' : isAmber ? 'status-yellow' : 'status-red';
  if (stEl) {
    stEl.textContent = label;
    stEl.className   = `summary-status-pill ${pillCls}`;
  }

  if (topEl) {
    const top3 = issues.slice(0, 3);
    if (top3.length === 0) {
      topEl.innerHTML = `<div class="top-issue-row top-issue-ok">✓ No issues detected — this PRD looks great!</div>`;
    } else {
      const bulletCls = (type) =>
        type === 'ambiguity'     ? 'tib-red'   :
        type === 'missing_logic' ? 'tib-amber' : 'tib-blue';
      topEl.innerHTML = top3.map((issue, i) => `
        <div class="top-issue-row">
          <span class="top-issue-num">${i + 1}</span>
          <span class="top-issue-bullet ${bulletCls(issue.type)}"></span>
          <span class="top-issue-text">${escHtml(issue.explanation)}</span>
        </div>
      `).join('');
    }
  }
}

// ── History panel ─────────────────────────────────────────────────────────────
function addHistoryEntry(text, data) {
  const list = document.querySelector('.history-list');
  if (!list) return;

  const words      = text.trim().split(/\s+/).slice(0, 5).join(' ');
  const title      = words + (text.trim().split(/\s+/).length > 5 ? '…' : '');
  const pct        = Math.round((data.confidence_score || 0.5) * 100);
  const scoreClass = pct >= 70 ? 'score-high' : pct >= 40 ? 'score-med' : 'score-low';
  const issueCount = (data.issues || []).length;
  const snippet    = text.length > 60 ? text.slice(0, 60).trimEnd() + '...' : text;

  document.querySelectorAll('.history-item').forEach(el => el.classList.remove('history-item-active'));

  const li = document.createElement('li');
  li.className = 'history-item history-item-active';
  li.innerHTML = `
    <div class="history-top">
      <span class="history-title">${escHtml(title)}</span>
      <span class="history-score ${scoreClass}">${pct}%</span>
    </div>
    <p class="history-snippet">${escHtml(snippet)}</p>
    <div class="history-meta">
      <span>${issueCount} issue${issueCount !== 1 ? 's' : ''}</span>
      <span>Just now</span>
    </div>
  `;
  li.addEventListener('click', () => {
    document.querySelectorAll('.history-item').forEach(el => el.classList.remove('history-item-active'));
    li.classList.add('history-item-active');
  });
  list.insertBefore(li, list.firstChild);
}

// ── Error banner ──────────────────────────────────────────────────────────────
function showError(msg) {
  const banner = document.getElementById('error-banner');
  if (banner) {
    banner.textContent = `Error: ${msg}`;
    banner.classList.remove('hidden');
    setTimeout(() => banner.classList.add('hidden'), 6000);
  }
}

// ── HTML escape ───────────────────────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Load history from Supabase ────────────────────────────────────────────────
async function loadHistory() {
  try {
    const res = await fetch('/api/analyses');
    if (!res.ok) return;
    const { analyses } = await res.json();
    if (!analyses || analyses.length === 0) return;

    const list = document.querySelector('.history-list');
    if (!list) return;

    list.innerHTML = '';
    analyses.forEach((entry, idx) => {
      const text       = entry.prd_text || '';
      const words      = text.trim().split(/\s+/).slice(0, 5).join(' ');
      const title      = words + (text.trim().split(/\s+/).length > 5 ? '…' : '');
      const pct        = Math.round((entry.confidence_score || 0.5) * 100);
      const scoreClass = pct >= 70 ? 'score-high' : pct >= 40 ? 'score-med' : 'score-low';
      const issues     = Array.isArray(entry.issues) ? entry.issues.length : 0;
      const snippet    = text.length > 60 ? text.slice(0, 60).trimEnd() + '...' : text;
      const when       = entry.created_at ? timeAgo(new Date(entry.created_at)) : '';

      const li = document.createElement('li');
      li.className = 'history-item' + (idx === 0 ? ' history-item-active' : '');
      li.innerHTML = `
        <div class="history-top">
          <span class="history-title">${escHtml(title)}</span>
          <span class="history-score ${scoreClass}">${pct}%</span>
        </div>
        <p class="history-snippet">${escHtml(snippet)}</p>
        <div class="history-meta">
          <span>${issues} issue${issues !== 1 ? 's' : ''}</span>
          <span>${when}</span>
        </div>
      `;
      li.addEventListener('click', () => {
        document.querySelectorAll('.history-item').forEach(el => el.classList.remove('history-item-active'));
        li.classList.add('history-item-active');
      });
      list.appendChild(li);
    });
  } catch (_) {}
}

function timeAgo(date) {
  const diff = Math.floor((Date.now() - date) / 1000);
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

initNav();
initTabs();
loadDashboard();

// ── Page navigation ───────────────────────────────────────────────────────────
function initNav() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => showPage(link.dataset.page));
  });
}

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === name);
  });
  const target = document.getElementById(`page-${name}`);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ── Tab switching ─────────────────────────────────────────────────────────────
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => activateTab(btn.dataset.tab));
  });
}

function activateTab(name) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === name);
  });
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === `tab-${name}`);
  });
}

// ── Admin Dashboard ───────────────────────────────────────────────────────────
async function loadDashboard() {
  const grid  = document.getElementById('dashboard-grid');
  const badge = document.getElementById('dashboard-badge');
  if (!grid) return;

  try {
    const res = await fetch('/api/history');
    if (!res.ok) throw new Error('Failed to load');
    const entries = await res.json();

    if (badge) badge.textContent = `${entries.length} stored`;

    if (!entries.length) {
      grid.innerHTML = `<div class="dash-empty">No analyses stored yet. Run your first PRD analysis above.</div>`;
      return;
    }

    grid.innerHTML = entries.map((entry, idx) => buildDashCard(entry, idx)).join('');

    grid.querySelectorAll('.dash-card').forEach(card => {
      card.addEventListener('click', () => {
        const wasExpanded = card.classList.contains('expanded');
        grid.querySelectorAll('.dash-card').forEach(c => c.classList.remove('expanded'));
        if (!wasExpanded) card.classList.add('expanded');
      });
    });

  } catch (err) {
    if (badge) badge.textContent = 'Unavailable';
    grid.innerHTML = `<div class="dash-empty">Could not load history — Supabase may not be configured yet.</div>`;
  }
}

function buildDashCard(entry, idx) {
  const pct        = Math.round((entry.confidence_score || 0.5) * 100);
  const issues     = Array.isArray(entry.issues) ? entry.issues : [];
  const issueCount = issues.length;
  const preview    = (entry.prd_text || '').slice(0, 100).trimEnd() + (entry.prd_text?.length > 100 ? '…' : '');
  const when       = entry.created_at ? timeAgo(new Date(entry.created_at)) : '—';

  const statusLabel = issueCount > 4 ? 'Low Quality PRD' : issueCount >= 2 ? 'Needs Improvement' : 'Ready for Engineering';
  const statusCls   = issueCount > 4 ? 'status-red'      : issueCount >= 2 ? 'status-yellow'     : 'status-green';
  const scoreCls    = pct >= 70 ? 'score-high' : pct >= 40 ? 'score-med' : 'score-low';

  const issueRows = issues.slice(0, 3).map(issue => `
    <div class="dash-detail-issue">
      <strong>${escHtml(issue.text || '')}</strong> — ${escHtml(issue.explanation || '')}
    </div>
  `).join('');

  const noIssues = issues.length === 0
    ? `<div class="dash-detail-issue">✓ No issues detected</div>`
    : '';

  return `
    <div class="dash-card" data-idx="${idx}">
      <div class="dash-card-top">
        <p class="dash-card-preview">${escHtml(preview)}</p>
        <span class="dash-card-score history-score ${scoreCls}">${pct}%</span>
      </div>
      <div class="dash-card-meta">
        <span class="dash-card-status prd-status-label ${statusCls}">${statusLabel}</span>
        <span class="dash-card-issues">${issueCount} issue${issueCount !== 1 ? 's' : ''}</span>
        <span class="dash-card-time">${when}</span>
      </div>
      <div class="dash-detail">
        <div class="dash-detail-prd">${escHtml(entry.prd_text || '')}</div>
        <div class="dash-detail-issues">
          ${issueRows || noIssues}
          ${issues.length > 3 ? `<div class="dash-detail-issue" style="color:#9ca3af">+${issues.length - 3} more issue${issues.length - 3 !== 1 ? 's' : ''}…</div>` : ''}
        </div>
      </div>
    </div>
  `;
}
