const textarea = document.getElementById('prd-input');
const analyzeBtn = document.getElementById('analyze-btn');
const charCount = document.getElementById('char-count');
const analysisBanner = document.getElementById('analysis-banner');
const bannerText = document.getElementById('banner-text');

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
    setTimeout(() => {
      textarea.style.borderColor = '';
      textarea.style.boxShadow = '';
    }, 1800);
    return;
  }

  const preview = text.length > 140 ? text.slice(0, 140).trimEnd() + '...' : text;
  bannerText.textContent = preview;
  analysisBanner.classList.remove('hidden');

  analysisBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  analyzeBtn.disabled = true;
  analyzeBtn.textContent = 'Analyzing…';
  analyzeBtn.style.opacity = '0.7';
  analyzeBtn.style.cursor = 'not-allowed';

  setTimeout(() => {
    analyzeBtn.disabled = false;
    analyzeBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      Analyze PRD`;
    analyzeBtn.style.opacity = '';
    analyzeBtn.style.cursor = '';
  }, 1200);
});

textarea.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    analyzeBtn.click();
  }
});

document.querySelectorAll('.history-item').forEach((item) => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.history-item').forEach((el) => {
      el.classList.remove('history-item-active');
      el.style.borderLeft = '';
      el.style.paddingLeft = '';
    });
    item.classList.add('history-item-active');
  });
});
