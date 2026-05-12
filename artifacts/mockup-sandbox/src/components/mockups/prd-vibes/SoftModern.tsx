export function SoftModern() {
  const p = {
    bg: '#f5f4ff',
    navBg: '#ffffff',
    navBorder: '#ede9fe',
    cardBg: '#ffffff',
    cardBorder: '#ede9fe',
    cardHeaderBg: '#faf9ff',
    accent: '#7c3aed',
    accentLight: '#ede9fe',
    accentMid: '#a78bfa',
    text: '#0f172a',
    textMid: '#475569',
    textLight: '#94a3b8',
    inputBg: '#faf9ff',
    inputBorder: '#ddd6fe',
    tagRed: { bg: '#fff1f2', border: '#fecdd3', text: '#be123c' },
    tagAmber: { bg: '#fffbeb', border: '#fde68a', text: '#92400e' },
    tagBlue: { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
    pillAmber: { bg: '#fffbeb', border: '#fde68a', text: '#92400e' },
    topBorder: '#f1f0fe',
    badgeBg: '#ede9fe',
    badgeText: '#6d28d9',
    badgeBorder: '#c4b5fd',
  };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", background: p.bg, minHeight: '100vh', color: p.text }}>

      {/* NAV */}
      <nav style={{ background: p.navBg, borderBottom: `1px solid ${p.navBorder}`, position: 'sticky', top: 0, zIndex: 100, boxShadow: 'none' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 58 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.9375rem', letterSpacing: '-0.4px' }}>PRD Analyzer</span>
            <span style={{ fontSize: '0.6rem', fontWeight: 600, color: p.badgeText, background: p.badgeBg, border: `1px solid ${p.badgeBorder}`, borderRadius: 999, padding: '2px 8px', letterSpacing: '0.4px', textTransform: 'uppercase' }}>Beta</span>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {['Analyzer', 'History', 'How it Works'].map((item, i) => (
              <button key={item} style={{ background: i === 0 ? p.accentLight : 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: i === 0 ? 600 : 500, color: i === 0 ? p.accent : p.textMid, padding: '7px 16px', borderRadius: 999 }}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '36px 24px 56px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* INPUT CARD */}
        <div style={{ background: p.cardBg, border: `1px solid ${p.cardBorder}`, borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 16px rgba(124,58,237,0.06)' }}>
          <div style={{ background: p.cardHeaderBg, borderBottom: `1px solid ${p.cardBorder}`, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '1.1rem' }}>📋</span>
            <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: p.text, letterSpacing: '-0.3px' }}>Your Specification</span>
          </div>
          <div style={{ padding: '22px 24px' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: p.textMid, marginBottom: 10 }}>
              Paste your PRD or feature specification
            </label>
            <textarea
              readOnly
              placeholder="e.g. Build a user authentication flow that supports email/password login, OAuth with Google, and 2FA. Users should be able to reset their password via email. The session should expire after 30 minutes of inactivity..."
              style={{ width: '100%', minHeight: 180, padding: '14px 16px', border: `2px solid ${p.inputBorder}`, borderRadius: 12, fontFamily: 'inherit', fontSize: '0.875rem', color: p.text, background: p.inputBg, resize: 'vertical', lineHeight: 1.65, outline: 'none' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
              <span style={{ fontSize: '0.75rem', color: p.textLight }}>0 characters</span>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 22px', borderRadius: 999, fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: '#ffffff', border: 'none', boxShadow: '0 4px 14px rgba(124,58,237,0.35)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                Analyze PRD
              </button>
            </div>
          </div>
        </div>

        {/* SUMMARY CARD */}
        <div style={{ background: p.cardBg, border: `1px solid ${p.cardBorder}`, borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 16px rgba(124,58,237,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 24px', borderBottom: `1px solid ${p.topBorder}`, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: p.textLight, textTransform: 'uppercase', letterSpacing: '0.5px', flexShrink: 0 }}>Confidence</span>
            <span style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-2px', color: p.text, lineHeight: 1, minWidth: 68 }}>57%</span>
            <div style={{ flex: 1, minWidth: 120 }}>
              <div style={{ height: 8, background: '#f1f0fe', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: '57%', height: '100%', background: 'linear-gradient(90deg, #f59e0b, #d97706)', borderRadius: 999 }} />
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '5px 14px', borderRadius: 999, background: p.pillAmber.bg, color: p.pillAmber.text, border: `1px solid ${p.pillAmber.border}` }}>Needs Improvement</span>
          </div>
          <div style={{ padding: '18px 24px 22px' }}>
            <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: p.textLight, marginBottom: 14 }}>Top Issues to Fix First</p>
            {[
              { type: 'ambiguity', text: 'Session timeout stated as "reasonable time" — no concrete duration defined' },
              { type: 'missing', text: 'No specification for login failure handling or maximum retry attempts' },
              { type: 'undefined', text: 'Login notification channel and content are entirely absent from spec' },
            ].map((issue, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: i < 2 ? `1px solid ${p.topBorder}` : 'none' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#fff', background: p.accentMid, borderRadius: '50%', width: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: issue.type === 'ambiguity' ? '#ef4444' : issue.type === 'missing' ? '#f59e0b' : '#3b82f6', flexShrink: 0, marginTop: 5 }} />
                <span style={{ fontSize: '0.8125rem', color: p.textMid, lineHeight: 1.55 }}>{issue.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DETAILS CARD */}
        <div style={{ background: p.cardBg, border: `1px solid ${p.cardBorder}`, borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 16px rgba(124,58,237,0.06)' }}>
          <div style={{ display: 'flex', borderBottom: `1px solid ${p.cardBorder}`, background: p.cardHeaderBg, padding: '0 8px' }}>
            {[['Issues', 4], ['Edge Cases', null], ['Assumptions', null], ['Questions', 3]].map(([label, count], i) => (
              <button key={i as number} style={{ padding: '14px 16px', background: 'none', border: 'none', borderBottom: i === 0 ? `2px solid ${p.accent}` : 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: i === 0 ? 600 : 500, color: i === 0 ? p.accent : p.textMid, display: 'flex', alignItems: 'center', gap: 7 }}>
                {label}
                {count && <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: i === 0 ? p.accentLight : '#f8f7ff', color: i === 0 ? p.accent : p.textLight, border: `1px solid ${i === 0 ? p.badgeBorder : p.cardBorder}` }}>{count}</span>}
              </button>
            ))}
          </div>
          <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 22 }}>
            {[
              { label: 'Ambiguity', dot: '#ef4444', tag: p.tagRed, issues: ['Session timeout "reasonable time" — no concrete duration defined', 'Notification trigger conditions are ambiguous'] },
              { label: 'Missing Logic', dot: '#f59e0b', tag: p.tagAmber, issues: ['No specification for login failure handling'] },
              { label: 'Undefined Inputs', dot: '#3b82f6', tag: p.tagBlue, issues: ['Login notification channel and content are entirely absent'] },
            ].map((group) => (
              <div key={group.label}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8125rem', fontWeight: 600, color: p.textMid, marginBottom: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: group.dot }} />
                  {group.label}
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '1px 8px', borderRadius: 999, background: '#f8f7ff', color: p.textLight, border: `1px solid ${p.cardBorder}` }}>{group.issues.length}</span>
                </div>
                {group.issues.map((text, j) => (
                  <div key={j} style={{ background: group.tag.bg, border: `1.5px solid ${group.tag.border}`, borderRadius: 12, padding: '14px 16px', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, gap: 8 }}>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: group.tag.bg, color: group.tag.text, border: `1px solid ${group.tag.border}` }}>{group.label}</span>
                      <span style={{ fontSize: '0.6875rem', color: p.textLight }}>Severity: {group.label === 'Missing Logic' ? 'High' : 'Medium'}</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: p.textMid, lineHeight: 1.6 }}>{text}</p>
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
