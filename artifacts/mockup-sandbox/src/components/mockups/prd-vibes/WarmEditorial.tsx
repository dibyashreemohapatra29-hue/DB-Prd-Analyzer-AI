export function WarmEditorial() {
  const palette = {
    pageBg: '#faf6ef',
    navBg: '#fffdf7',
    navBorder: '#e2d6c0',
    cardBg: '#fffdf7',
    cardBorder: '#e2d6c0',
    cardHeaderBg: '#faf6ef',
    accent: '#b07c2e',
    accentHover: '#8f6320',
    text: '#2a1c0e',
    textMid: '#6b4f2e',
    textLight: '#a8886a',
    inputBg: '#fdf9f2',
    inputBorder: '#d4c3a3',
    tagRed: { bg: '#fdf0e8', border: '#f0c4a0', text: '#8b3a0f' },
    tagAmber: { bg: '#fef8e6', border: '#e8d08a', text: '#7a5010' },
    tagBlue: { bg: '#edf4fe', border: '#b0ccee', text: '#1e4a7c' },
    badgeBg: '#f5edd8',
    badgeText: '#7a5010',
    badgeBorder: '#d4b878',
    pillGreen: { bg: '#edf7ee', text: '#2a6b30', border: '#a8d4aa' },
    barFill: '#b07c2e',
    confBg: '#faf6ef',
    topIssuesBorder: '#e8dcc8',
    summaryBorder: '#e2d6c0',
    subtitleColor: '#9a7550',
  };

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", background: palette.pageBg, minHeight: '100vh', color: palette.text }}>

      {/* NAV */}
      <nav style={{ background: palette.navBg, borderBottom: `1px solid ${palette.navBorder}`, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 58 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={palette.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.3px' }}>PRD Analyzer</span>
            <span style={{ fontSize: '0.6rem', fontFamily: 'system-ui, sans-serif', fontWeight: 600, color: palette.accent, background: palette.badgeBg, border: `1px solid ${palette.badgeBorder}`, borderRadius: 999, padding: '2px 8px', letterSpacing: '0.4px', textTransform: 'uppercase' }}>Beta</span>
          </div>
          <div style={{ display: 'flex', gap: 2, fontFamily: 'system-ui, sans-serif' }}>
            {['Analyzer', 'History', 'How it Works'].map((item, i) => (
              <button key={item} style={{ background: i === 0 ? palette.badgeBg : 'none', border: 'none', cursor: 'pointer', fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem', fontWeight: i === 0 ? 600 : 500, color: i === 0 ? palette.accent : palette.textMid, padding: '6px 14px', borderRadius: 8 }}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 56px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* INPUT CARD */}
        <div style={{ background: palette.cardBg, border: `1px solid ${palette.cardBorder}`, borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(90,55,10,0.07)' }}>
          <div style={{ background: palette.cardHeaderBg, borderBottom: `1px solid ${palette.cardBorder}`, padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '1rem' }}>📋</span>
            <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: palette.text, letterSpacing: '-0.2px' }}>Your Specification</span>
          </div>
          <div style={{ padding: '20px 22px' }}>
            <label style={{ display: 'block', fontFamily: 'system-ui, sans-serif', fontSize: '0.8125rem', fontWeight: 500, color: palette.textMid, marginBottom: 8 }}>
              Paste your PRD or feature specification
            </label>
            <textarea
              readOnly
              placeholder="e.g. Build a user authentication flow that supports email/password login, OAuth with Google, and 2FA. Users should be able to reset their password via email. The session should expire after 30 minutes of inactivity..."
              style={{ width: '100%', minHeight: 180, padding: '14px 16px', border: `1.5px solid ${palette.inputBorder}`, borderRadius: 7, fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem', color: palette.text, background: palette.inputBg, resize: 'vertical', lineHeight: 1.65, outline: 'none' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
              <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: palette.textLight }}>0 characters</span>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 22px', borderRadius: 7, fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', background: palette.accent, color: '#fffdf7', border: 'none', boxShadow: `0 2px 8px rgba(176,124,46,0.35)`, letterSpacing: '0.1px' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                Analyze PRD
              </button>
            </div>
          </div>
        </div>

        {/* SUMMARY CARD */}
        <div style={{ background: palette.cardBg, border: `1px solid ${palette.cardBorder}`, borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(90,55,10,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 22px', borderBottom: `1px solid ${palette.topIssuesBorder}`, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', fontWeight: 600, color: palette.textLight, textTransform: 'uppercase', letterSpacing: '0.5px', flexShrink: 0 }}>Confidence</span>
            <span style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-1.5px', color: palette.text, lineHeight: 1, minWidth: 68 }}>57%</span>
            <div style={{ flex: 1, minWidth: 120 }}>
              <div style={{ height: 7, background: '#ecdfc8', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: '57%', height: '100%', background: palette.accent, borderRadius: 999 }} />
              </div>
            </div>
            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: 999, background: '#fef8e6', color: '#7a5010', border: `1px solid #e8d08a` }}>Needs Improvement</span>
          </div>
          <div style={{ padding: '16px 22px 20px' }}>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: palette.textLight, marginBottom: 12 }}>Top Issues to Fix First</p>
            {[
              { type: 'ambiguity', text: 'Session timeout stated as "reasonable time" — no concrete duration defined' },
              { type: 'missing_logic', text: 'No specification for login failure handling or maximum retry attempts' },
              { type: 'undefined', text: 'Login notification channel and content are entirely absent from spec' },
            ].map((issue, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderBottom: i < 2 ? `1px solid ${palette.topIssuesBorder}` : 'none' }}>
                <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6875rem', fontWeight: 700, color: '#fff', background: palette.textLight, borderRadius: '50%', width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: issue.type === 'ambiguity' ? '#c0392b' : issue.type === 'missing_logic' ? palette.accent : '#4a7db5', flexShrink: 0, marginTop: 5 }} />
                <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8125rem', color: palette.textMid, lineHeight: 1.5 }}>{issue.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DETAILS CARD */}
        <div style={{ background: palette.cardBg, border: `1px solid ${palette.cardBorder}`, borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(90,55,10,0.07)' }}>
          <div style={{ display: 'flex', borderBottom: `1px solid ${palette.cardBorder}`, background: palette.cardHeaderBg }}>
            {[['Issues', 4], ['Edge Cases', null], ['Assumptions', null], ['Questions', 3]].map(([label, count], i) => (
              <button key={i as number} style={{ padding: '14px 20px', background: 'none', border: 'none', borderBottom: i === 0 ? `2px solid ${palette.accent}` : 'none', cursor: 'pointer', fontFamily: 'system-ui, sans-serif', fontSize: '0.8125rem', fontWeight: i === 0 ? 700 : 500, color: i === 0 ? palette.accent : palette.textMid, display: 'flex', alignItems: 'center', gap: 7 }}>
                {label}
                {count && <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '1px 7px', borderRadius: 999, background: i === 0 ? palette.badgeBg : '#f4f0e8', color: i === 0 ? palette.accent : palette.textLight, border: `1px solid ${i === 0 ? palette.badgeBorder : palette.inputBorder}` }}>{count}</span>}
              </button>
            ))}
          </div>
          <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { label: 'Ambiguity', dot: '#c0392b', tag: palette.tagRed, issues: ['Session timeout "reasonable time" — no concrete duration defined', 'Notification trigger conditions are ambiguous — on every login or only suspicious ones?'] },
              { label: 'Missing Logic', dot: palette.accent, tag: palette.tagAmber, issues: ['No specification for login failure handling or maximum retry attempts'] },
              { label: 'Undefined Inputs', dot: '#4a7db5', tag: palette.tagBlue, issues: ['Login notification channel and content are entirely absent'] },
            ].map((group) => (
              <div key={group.label}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', fontWeight: 700, color: palette.subtitleColor, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: group.dot }} />
                  {group.label}
                  <span style={{ color: palette.textLight }}>({group.issues.length})</span>
                </div>
                {group.issues.map((text, j) => (
                  <div key={j} style={{ background: group.tag.bg, border: `1px solid ${group.tag.border}`, borderRadius: 8, padding: '13px 15px', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7, gap: 8 }}>
                      <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6875rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: group.tag.bg, color: group.tag.text, border: `1px solid ${group.tag.border}` }}>{group.label}</span>
                      <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.6875rem', color: palette.textLight }}>Severity: {group.label === 'Missing Logic' ? 'High' : 'Medium'}</span>
                    </div>
                    <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8125rem', color: palette.textMid, lineHeight: 1.6 }}>{text}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
