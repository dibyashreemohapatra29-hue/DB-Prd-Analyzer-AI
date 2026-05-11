const textarea       = document.getElementById('prd-input');
const analyzeBtn     = document.getElementById('analyze-btn');
const charCount      = document.getElementById('char-count');
const analysisBanner = document.getElementById('analysis-banner');
const bannerText     = document.getElementById('banner-text');

textarea.addEventListener('input', () => {
  const len = textarea.value.length;
  charCount.textContent = len === 1 ? '1 character' : `${len.toLocaleString()} characters`;
});

analyzeBtn.addEventListener('click', () => {
  const text = textarea.value.trim();
  if (!text) {
    textarea.focus();
    textarea.style.borderColor = '#ef4444';
    textarea.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.15)';
    setTimeout(() => { textarea.style.borderColor = ''; textarea.style.boxShadow = ''; }, 1800);
    return;
  }

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

function setLoading(on) {
  analyzeBtn.disabled = on;
  analyzeBtn.style.opacity = on ? '0.7' : '';
  analyzeBtn.style.cursor  = on ? 'not-allowed' : '';
  analyzeBtn.innerHTML = on
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Analyzing…`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> Analyze PRD`;
}

async function runAnalysis(text) {
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prd_text: text }),
    });
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();
    renderResults(data);
    addHistoryEntry(text, data);
  } catch (err) {
    showError(err.message || 'Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
}

function renderResults(data) {
  const { issues = [], questions = [], confidence_score = 0.5 } = data;

  const ambiguity  = issues.filter(i => i.type === 'ambiguity');
  const missing    = issues.filter(i => i.type === 'missing_logic');
  const undefined_ = issues.filter(i => i.type === 'undefined_input');

  renderIssueSubsection('ambiguity-list', ambiguity,  'tag-amber', 'Ambiguous');
  renderIssueSubsection('missing-list',   missing,    'tag-red',   'Missing Logic');
  renderIssueSubsection('undefined-list', undefined_, 'tag-blue',  'Undefined Input');

  const badge = document.getElementById('issues-badge');
  if (badge) badge.textContent = `${issues.length} found`;

  renderQuestions(questions);
  renderConfidence(confidence_score);

  document.getElementById('issues-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderIssueSubsection(containerId, issues, tagClass, label) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (issues.length === 0) {
    container.innerHTML = `<div class="issue-card issue-card-ok"><p class="issue-text">✓ No ${label.toLowerCase()} issues detected.</p></div>`;
    return;
  }
  container.innerHTML = issues.map(issue => `
    <div class="issue-card ${tagClass === 'tag-red' ? 'issue-card-red' : tagClass === 'tag-blue' ? 'issue-card-blue' : ''}">
      <div class="issue-header">
        <span class="issue-tag ${tagClass}">${label}</span>
        <span class="issue-loc">${escHtml(issue.text)}</span>
      </div>
      <p class="issue-text">${escHtml(issue.explanation)}</p>
    </div>
  `).join('');
}

function renderQuestions(questions) {
  const list  = document.getElementById('question-list');
  const badge = document.getElementById('questions-badge');
  if (!list) return;
  if (badge) badge.textContent = `${questions.length} question${questions.length !== 1 ? 's' : ''}`;
  if (questions.length === 0) {
    list.innerHTML = `<li class="question-item"><p>No additional clarifying questions — the PRD is sufficiently detailed.</p></li>`;
    return;
  }
  list.innerHTML = questions.map((q, i) => `
    <li class="question-item">
      <div class="question-meta">Question ${i + 1}</div>
      <p>${escHtml(q)}</p>
    </li>
  `).join('');
}

function renderConfidence(score) {
  const pct   = Math.round(score * 100);
  const numEl = document.getElementById('score-num');
  const ringEl= document.getElementById('score-ring');
  const barEls= document.querySelectorAll('.score-bar-fill[data-key]');

  if (numEl) numEl.textContent = `${pct}%`;

  if (ringEl) {
    const circumference = 2 * Math.PI * 50;
    const filled = (score * circumference).toFixed(1);
    const rest   = (circumference - filled).toFixed(1);
    ringEl.setAttribute('stroke-dasharray', `${filled} ${rest}`);
    ringEl.style.stroke = pct >= 70 ? '#22c55e' : pct >= 45 ? '#4f63e7' : '#ef4444';
  }

  barEls.forEach(bar => {
    bar.style.width = `${pct}%`;
    pct < 40 ? bar.classList.add('score-bar-low') : bar.classList.remove('score-bar-low');
  });

  const summary = document.getElementById('score-summary');
  if (summary) {
    const level = pct >= 70 ? 'high clarity' : pct >= 45 ? 'moderate clarity' : 'low clarity';
    const color = pct >= 70 ? '#16a34a'       : pct >= 45 ? '#1a1d23'         : '#dc2626';
    summary.innerHTML = `This specification has <strong style="color:${color}">${level}</strong> (${pct}%). ${
      pct >= 70
        ? 'Most requirements are clear and testable.'
        : pct >= 45
        ? 'Several sections lack concrete criteria or unaddressed edge cases.'
        : 'Significant gaps detected — resolve the issues above before handing to engineering.'
    }`;
  }
}

function addHistoryEntry(text, data) {
  const list = document.querySelector('.history-list');
  if (!list) return;

  const words = text.trim().split(/\s+/).slice(0, 5).join(' ');
  const title = words.length < text.trim().length ? words + '…' : words;

  const pct        = Math.round((data.confidence_score || 0.5) * 100);
  const scoreClass = pct >= 70 ? 'score-high' : pct >= 45 ? 'score-med' : 'score-low';
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

function showError(msg) {
  const banner = document.getElementById('error-banner');
  if (banner) {
    banner.textContent = `Error: ${msg}`;
    banner.classList.remove('hidden');
    setTimeout(() => banner.classList.add('hidden'), 6000);
  }
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

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
      const text  = entry.prd_text || '';
      const words = text.trim().split(/\s+/).slice(0, 5).join(' ');
      const title = words + (text.length > words.length ? '…' : '');
      const pct   = Math.round((entry.confidence_score || 0.5) * 100);
      const scoreClass = pct >= 70 ? 'score-high' : pct >= 45 ? 'score-med' : 'score-low';
      const issues = Array.isArray(entry.issues) ? entry.issues.length : 0;
      const snippet = text.length > 60 ? text.slice(0, 60).trimEnd() + '...' : text;
      const when = entry.created_at ? timeAgo(new Date(entry.created_at)) : '';

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
  if (diff < 60)   return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

loadHistory();
