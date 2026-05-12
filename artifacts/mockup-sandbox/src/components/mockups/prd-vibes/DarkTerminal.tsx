export function DarkTerminal() {
  const p = {
    bg: '#0d1117',
    navBg: '#161b22',
    navBorder: '#21262d',
    cardBg: '#161b22',
    cardBorder: '#30363d',
    cardHeaderBg: '#1c2128',
    green: '#3fb950',
    blue: '#58a6ff',
    cyan: '#39d353',
    accent: '#58a6ff',
    text: '#e6edf3',
    textMid: '#8b949e',
    textDim: '#484f58',
    inputBg: '#0d1117',
    inputBorder: '#30363d',
    badgeBg: '#1a3a1a',
    badgeText: '#3fb950',
    badgeBorder: '#2a5a2a',
    tagRed: { bg: '#2d1a1a', border: '#5c2020', text: '#ff7b72' },
    tagAmber: { bg: '#2d260a', border: '#5c4a10', text: '#e3b341' },
    tagBlue: { bg: '#0a1929', border: '#1a3a5c', text: '#58a6ff' },
    pillAmber: { bg: '#2d260a', border: '#5c4a10', text: '#e3b341' },
    topBorder: '#21262d',
  };

  return (
    <div style={{ fontFamily: "'Menlo', 'Consolas', 'SF Mono', monospace", background: p.bg, minHeight: '100vh', color: p.text }}>

      {/* NAV */}
      <nav style={{ background: p.navBg, borderBottom: `1px solid ${p.navBorder}`, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={p.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            <span style={{ fontWeight: 700, fontSize: '0.9375rem', letterSpacing: '-0.3px', color: p.text }}>prd-analyzer</span>
            <span style={{ fontSize: '0.6rem', fontWeight: 600, color: p.green, background: p.badgeBg, border: `1px solid ${p.badgeBorder}`, borderRadius: 4, padding: '2px 8px', letterSpacing: '0.4px', textTransform: 'uppercase' }}>v0.1-beta</span>
          </div>
          <div style={{ display: 'flex', gap: 2 }}>
            {['analyzer', 'history', 'how-it-works'].map((item, i) => (
              <button key={item} style={{ background: i === 0 ? 'rgba(88,166,255,0.1)' : 'none', border: i === 0 ? `1px solid rgba(88,166,255,0.3)` : '1px solid transparent', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8125rem', fontWeight: i === 0 ? 600 : 400, color: i === 0 ? p.blue : p.textMid, padding: '5px 12px', borderRadius: 6 }}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 56px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* INPUT CARD */}
        <div style={{ background: p.cardBg, border: `1px solid ${p.cardBorder}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ background: p.cardHeaderBg, borderBottom: `1px solid ${p.cardBorder}`, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: p.green, fontSize: '0.8125rem' }}>$</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: p.text }}>input.prd</span>
            <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: p.textDim }}>/* paste spec */</span>
          </div>
          <div style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: '0.75rem', color: p.textMid, marginBottom: 8 }}>
              <span style={{ color: p.textDim }}>// </span>
              <span>paste your PRD or feature specification below</span>
            </div>
            <textarea
              readOnly
              placeholder="e.g. Build a user authentication flow that supports email/password login, OAuth with Google, and 2FA. Users should be able to reset their password via email..."
              style={{ width: '100%', minHeight: 180, padding: '12px 14px', border: `1px solid ${p.inputBorder}`, borderRadius: 6, fontFamily: 'inherit', fontSize: '0.8125rem', color: p.text, background: p.inputBg, resize: 'vertical', lineHeight: 1.7, outline: 'none' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
              <span style={{ fontSize: '0.75rem', color: p.textDim, fontFamily: 'inherit' }}>// 0 chars</span>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 18px', borderRadius: 6, fontFamily: 'inherit', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', background: '#238636', color: '#ffffff', border: `1px solid #2ea043`, boxShadow: '0 0 10px rgba(63,185,80,0.2)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                ./analyze
              </button>
            </div>
          </div>
        </div>

        {/* SUMMARY CARD */}
        <div style={{ background: p.cardBg, border: `1px solid ${p.cardBorder}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ background: p.cardHeaderBg, borderBottom: `1px solid ${p.cardBorder}`, padding: '10px 18px', fontSize: '0.75rem', color: p.textDim, display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ color: p.green }}>●</span>
            <span style={{ color: p.textMid }}>analysis.json</span>
            <span style={{ marginLeft: 'auto', color: p.textDim }}>exit_code: 0</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: `1px solid ${p.cardBorder}`, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: p.textDim, textTransform: 'uppercase', letterSpacing: '0.5px', flexShrink: 0 }}>confidence</span>
            <span style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-1.5px', color: p.text, lineHeight: 1, minWidth: 68, fontFamily: 'inherit' }}>57%</span>
            <div style={{ flex: 1, minWidth: 120 }}>
              <div style={{ height: 6, background: '#21262d', borderRadius: 999, overflow: 'hidden', border: `1px solid ${p.cardBorder}` }}>
                <div style={{ width: '57%', height: '100%', background: `linear-gradient(90deg, #238636, #3fb950)`, borderRadius: 999 }} />
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: 4, background: p.pillAmber.bg, color: p.pillAmber.text, border: `1px solid ${p.pillAmber.border}`, fontFamily: 'inherit' }}>NEEDS_IMPROVEMENT</span>
          </div>
          <div style={{ padding: '14px 20px 18px' }}>
            <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: p.textDim, marginBottom: 12 }}>
              <span style={{ color: p.green }}>#</span> top_issues[]
            </p>
            {[
              { type: 'ambiguity', text: 'session_timeout: value="reasonable" — no concrete duration' },
              { type: 'missing', text: 'login_failure: no retry limit or lockout policy specified' },
              { type: 'undefined', text: 'notify_on_login: channel and content undefined' },
            ].map((issue, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '7px 0', borderBottom: i < 2 ? `1px solid ${p.topBorder}` : 'none' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff', background: p.textDim, borderRadius: '50%', width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: issue.type === 'ambiguity' ? '#ff7b72' : issue.type === 'missing' ? '#e3b341' : p.blue, flexShrink: 0, marginTop: 5 }} />
                <span style={{ fontSize: '0.8125rem', color: p.textMid, lineHeight: 1.55, fontFamily: 'inherit' }}>{issue.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DETAILS CARD */}
        <div style={{ background: p.cardBg, border: `1px solid ${p.cardBorder}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: `1px solid ${p.cardBorder}`, background: p.cardHeaderBg }}>
            {[['issues', 4], ['edge_cases', null], ['assumptions', null], ['questions', 3]].map(([label, count], i) => (
              <button key={i} style={{ padding: '12px 18px', background: 'none', border: 'none', borderBottom: i === 0 ? `2px solid ${p.blue}` : 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8125rem', fontWeight: i === 0 ? 600 : 400, color: i === 0 ? p.blue : p.textMid, display: 'flex', alignItems: 'center', gap: 7 }}>
                {label}
                {count && <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: i === 0 ? 'rgba(88,166,255,0.1)' : p.cardHeaderBg, color: i === 0 ? p.blue : p.textDim, border: `1px solid ${i === 0 ? 'rgba(88,166,255,0.3)' : p.cardBorder}` }}>{count}</span>}
              </button>
            ))}
          </div>
          <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[
              { label: 'AMBIGUITY', dot: '#ff7b72', tag: p.tagRed, issues: ['session_timeout is "reasonable time" — no integer defined', 'notify_on_login: trigger conditions underspecified'] },
              { label: 'MISSING_LOGIC', dot: '#e3b341', tag: p.tagAmber, issues: ['login_failure: retry limit and lockout absent'] },
              { label: 'UNDEFINED_INPUT', dot: p.blue, tag: p.tagBlue, issues: ['notify_on_login: channel (email|sms|push) not declared'] },
            ].map((group) => (
              <div key={group.label}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.7rem', fontWeight: 700, color: p.textDim, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: group.dot }} />
                  <span style={{ color: group.dot }}>{group.label}</span>
                  <span style={{ color: p.textDim }}>({group.issues.length})</span>
                </div>
                {group.issues.map((text, j) => (
                  <div key={j} style={{ background: group.tag.bg, border: `1px solid ${group.tag.border}`, borderRadius: 6, padding: '12px 14px', marginBottom: 7 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7, gap: 8 }}>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: group.tag.bg, color: group.tag.text, border: `1px solid ${group.tag.border}`, fontFamily: 'inherit' }}>{group.label}</span>
                      <span style={{ fontSize: '0.6875rem', color: p.textDim }}>severity: {group.label === 'MISSING_LOGIC' ? 'high' : 'medium'}</span>
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: p.textMid, lineHeight: 1.6, fontFamily: 'inherit' }}>{text}</p>
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
