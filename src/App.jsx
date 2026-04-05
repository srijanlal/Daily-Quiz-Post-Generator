import { useMemo, useRef, useState } from 'react'
import { toPng } from 'html-to-image'

const sampleData = {
  title: '#KyaApkoPataHai ?',
  intro: 'Daily Banking Gyan',
  cta: 'साहेब बंदगी 🙏',
  questions: [
    { id: 'question-1', question: 'Which planet is known as the Red Planet?', answer: 'Mars' },
    { id: 'question-2', question: 'How many days are there in a leap year?', answer: '366' },
    { id: 'question-3', question: 'What is the capital of Japan?', answer: 'Tokyo' },
    { id: 'question-4', question: 'Which gas do plants absorb from the air?', answer: 'Carbon dioxide' },
    { id: 'question-5', question: 'Which ocean is the largest on Earth?', answer: 'Pacific Ocean' },
  ],
}

const defaultTheme = {
  pageBackground: 'linear-gradient(135deg, #0f172a, #6d28d9)',
  cardBackground: 'linear-gradient(145deg, rgba(30, 41, 59, 0.96), rgba(109, 40, 217, 0.78))',
  cardBorder: 'rgba(255, 255, 255, 0.12)',
  topbarText: '#ddd6fe',
  quizBackground: 'rgba(255, 255, 255, 0.1)',
  lockedBackground: 'linear-gradient(135deg, rgba(244, 114, 182, 0.32), rgba(251, 191, 36, 0.24))',
  badgeBackground: 'rgba(255, 255, 255, 0.14)',
  answerBackground: '#a7f3d0',
  answerText: '#052e16',
  hiddenBackground: 'rgba(15, 23, 42, 0.48)',
  hiddenText: '#fde68a',
  ctaBackground: 'rgba(15, 23, 42, 0.78)',
  text: '#ffffff',
  subtext: 'rgba(255, 255, 255, 0.9)',
}

const POST_WIDTH = 1080
const POST_HEIGHT = 1350
const PREVIEW_SCALE = 0.5

const colorThemes = [
  { name: 'Midnight Violet', ...defaultTheme },
  {
    name: 'Ocean Breeze',
    ...defaultTheme,
    pageBackground: 'linear-gradient(135deg, #083344, #0891b2)',
    cardBackground: 'linear-gradient(145deg, #0f766e, #164e63)',
    cardBorder: 'rgba(103, 232, 249, 0.24)',
    topbarText: '#a5f3fc',
    quizBackground: 'rgba(6, 182, 212, 0.16)',
    lockedBackground: 'linear-gradient(135deg, rgba(34, 211, 238, 0.32), rgba(14, 116, 144, 0.38))',
    badgeBackground: 'rgba(165, 243, 252, 0.18)',
    answerBackground: '#ccfbf1',
    answerText: '#164e63',
    hiddenBackground: 'rgba(8, 47, 73, 0.54)',
    hiddenText: '#cffafe',
    ctaBackground: 'rgba(8, 47, 73, 0.72)',
    text: '#ecfeff',
    subtext: 'rgba(236, 254, 255, 0.88)',
  },
  {
    name: 'Sunset Pop',
    ...defaultTheme,
    pageBackground: 'linear-gradient(135deg, #431407, #ea580c)',
    cardBackground: 'linear-gradient(145deg, #7c2d12, #db2777)',
    cardBorder: 'rgba(253, 186, 116, 0.24)',
    topbarText: '#fdba74',
    quizBackground: 'rgba(255, 237, 213, 0.12)',
    lockedBackground: 'linear-gradient(135deg, rgba(251, 191, 36, 0.34), rgba(244, 63, 94, 0.3))',
    badgeBackground: 'rgba(255, 237, 213, 0.18)',
    answerBackground: '#fde68a',
    answerText: '#78350f',
    hiddenBackground: 'rgba(88, 28, 135, 0.42)',
    hiddenText: '#fff7ed',
    ctaBackground: 'rgba(127, 29, 29, 0.48)',
    text: '#fff7ed',
    subtext: 'rgba(255, 247, 237, 0.9)',
  },
  {
    name: 'Emerald Glow',
    ...defaultTheme,
    pageBackground: 'linear-gradient(135deg, #022c22, #059669)',
    cardBackground: 'linear-gradient(145deg, #14532d, #047857)',
    cardBorder: 'rgba(110, 231, 183, 0.24)',
    topbarText: '#bbf7d0',
    quizBackground: 'rgba(16, 185, 129, 0.16)',
    lockedBackground: 'linear-gradient(135deg, rgba(74, 222, 128, 0.28), rgba(34, 197, 94, 0.32))',
    badgeBackground: 'rgba(187, 247, 208, 0.16)',
    answerBackground: '#d9f99d',
    answerText: '#365314',
    hiddenBackground: 'rgba(6, 78, 59, 0.48)',
    hiddenText: '#ecfccb',
    ctaBackground: 'rgba(6, 78, 59, 0.72)',
    text: '#f0fdf4',
    subtext: 'rgba(240, 253, 244, 0.9)',
  },
  {
    name: 'Rose Gold',
    ...defaultTheme,
    pageBackground: 'linear-gradient(135deg, #4c0519, #be185d)',
    cardBackground: 'linear-gradient(145deg, #9d174d, #be123c)',
    cardBorder: 'rgba(253, 164, 175, 0.24)',
    topbarText: '#fecdd3',
    quizBackground: 'rgba(255, 228, 230, 0.12)',
    lockedBackground: 'linear-gradient(135deg, rgba(253, 164, 175, 0.28), rgba(251, 191, 36, 0.24))',
    badgeBackground: 'rgba(255, 228, 230, 0.18)',
    answerBackground: '#ffe4e6',
    answerText: '#881337',
    hiddenBackground: 'rgba(80, 7, 36, 0.5)',
    hiddenText: '#fff1f2',
    ctaBackground: 'rgba(136, 19, 55, 0.48)',
    text: '#fff1f2',
    subtext: 'rgba(255, 241, 242, 0.9)',
  },
  {
    name: 'Mango Splash',
    ...defaultTheme,
    pageBackground: 'linear-gradient(135deg, #78350f, #f59e0b)',
    cardBackground: 'linear-gradient(145deg, #b45309, #f97316)',
    cardBorder: 'rgba(253, 224, 71, 0.24)',
    topbarText: '#fde68a',
    quizBackground: 'rgba(255, 251, 235, 0.14)',
    lockedBackground: 'linear-gradient(135deg, rgba(255, 237, 213, 0.26), rgba(253, 186, 116, 0.32))',
    badgeBackground: 'rgba(255, 251, 235, 0.2)',
    answerBackground: '#fef3c7',
    answerText: '#78350f',
    hiddenBackground: 'rgba(120, 53, 15, 0.54)',
    hiddenText: '#fffbeb',
    ctaBackground: 'rgba(146, 64, 14, 0.56)',
    text: '#fffbeb',
    subtext: 'rgba(255, 251, 235, 0.92)',
  },
  {
    name: 'Lavender Dream',
    ...defaultTheme,
    pageBackground: 'linear-gradient(135deg, #312e81, #a78bfa)',
    cardBackground: 'linear-gradient(145deg, #4338ca, #7c3aed)',
    cardBorder: 'rgba(196, 181, 253, 0.24)',
    topbarText: '#ddd6fe',
    quizBackground: 'rgba(221, 214, 254, 0.12)',
    lockedBackground: 'linear-gradient(135deg, rgba(233, 213, 255, 0.28), rgba(244, 114, 182, 0.24))',
    badgeBackground: 'rgba(233, 213, 255, 0.16)',
    answerBackground: '#ede9fe',
    answerText: '#4c1d95',
    hiddenBackground: 'rgba(49, 46, 129, 0.52)',
    hiddenText: '#f5f3ff',
    ctaBackground: 'rgba(67, 56, 202, 0.48)',
    text: '#f5f3ff',
    subtext: 'rgba(245, 243, 255, 0.9)',
  },
  {
    name: 'Ruby Night',
    ...defaultTheme,
    pageBackground: 'linear-gradient(135deg, #1f2937, #991b1b)',
    cardBackground: 'linear-gradient(145deg, #450a0a, #b91c1c)',
    cardBorder: 'rgba(252, 165, 165, 0.24)',
    topbarText: '#fecaca',
    quizBackground: 'rgba(254, 226, 226, 0.12)',
    lockedBackground: 'linear-gradient(135deg, rgba(252, 165, 165, 0.28), rgba(251, 191, 36, 0.22))',
    badgeBackground: 'rgba(254, 226, 226, 0.16)',
    answerBackground: '#fee2e2',
    answerText: '#7f1d1d',
    hiddenBackground: 'rgba(69, 10, 10, 0.54)',
    hiddenText: '#fef2f2',
    ctaBackground: 'rgba(127, 29, 29, 0.56)',
    text: '#fef2f2',
    subtext: 'rgba(254, 242, 242, 0.9)',
  },
  {
    name: 'Forest Mint',
    ...defaultTheme,
    pageBackground: 'linear-gradient(135deg, #052e16, #16a34a)',
    cardBackground: 'linear-gradient(145deg, #14532d, #15803d)',
    cardBorder: 'rgba(134, 239, 172, 0.24)',
    topbarText: '#bbf7d0',
    quizBackground: 'rgba(220, 252, 231, 0.12)',
    lockedBackground: 'linear-gradient(135deg, rgba(110, 231, 183, 0.28), rgba(163, 230, 53, 0.22))',
    badgeBackground: 'rgba(220, 252, 231, 0.16)',
    answerBackground: '#dcfce7',
    answerText: '#14532d',
    hiddenBackground: 'rgba(5, 46, 22, 0.54)',
    hiddenText: '#f0fdf4',
    ctaBackground: 'rgba(6, 95, 70, 0.5)',
    text: '#f0fdf4',
    subtext: 'rgba(240, 253, 244, 0.9)',
  },
  {
    name: 'Neon Pop',
    ...defaultTheme,
    pageBackground: 'linear-gradient(135deg, #172554, #db2777)',
    cardBackground: 'linear-gradient(145deg, #1d4ed8, #c026d3)',
    cardBorder: 'rgba(191, 219, 254, 0.24)',
    topbarText: '#bfdbfe',
    quizBackground: 'rgba(219, 234, 254, 0.12)',
    lockedBackground: 'linear-gradient(135deg, rgba(192, 132, 252, 0.28), rgba(96, 165, 250, 0.28))',
    badgeBackground: 'rgba(219, 234, 254, 0.18)',
    answerBackground: '#dbeafe',
    answerText: '#1e3a8a',
    hiddenBackground: 'rgba(49, 46, 129, 0.54)',
    hiddenText: '#fdf4ff',
    ctaBackground: 'rgba(91, 33, 182, 0.5)',
    text: '#eff6ff',
    subtext: 'rgba(239, 246, 255, 0.9)',
  },
]

function formatQuickText(questions) {
  return questions
    .map((item, index) => `${index + 1}. ${item.question} | ${item.answer}`)
    .join('\n')
}

function parseQuickText(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 5)

  return Array.from({ length: 5 }, (_, index) => {
    const rawLine = lines[index] ?? ''
    const cleaned = rawLine.replace(/^\s*\d+[.)-]?\s*/, '')
    const [question = '', answer = ''] = cleaned.split('|')

    return {
      id: `question-${index + 1}`,
      question: question.trim(),
      answer: answer.trim(),
    }
  })
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function getContentScale(data) {
  const totalLength = [
    data.title,
    data.intro,
    data.cta,
    ...data.questions.flatMap((item) => [item.question, item.answer]),
  ]
    .filter(Boolean)
    .join(' ')
    .length

  if (totalLength > 900) return 0.7
  if (totalLength > 700) return 0.78
  if (totalLength > 520) return 0.86
  if (totalLength > 380) return 0.93
  return 1
}

function buildHtmlSnippet(data, theme) {
  const contentScale = getContentScale(data)
  const questionCards = data.questions
    .map((item, index) => {
      const answerMarkup =
        index === 4
          ? '<div class="answer hidden">🔒 Hidden answer — comment below</div>'
          : `<div class="answer">✅ ${escapeHtml(item.answer || 'Answer')}</div>`

      return `
        <div class="quiz-item ${index === 4 ? 'locked' : ''}">
          <div class="badge">Q${index + 1}</div>
          <h3>${escapeHtml(item.question || `Question ${index + 1}`)}</h3>
          ${answerMarkup}
        </div>
      `
    })
    .join('')

  return `<!doctype html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(data.title)}</title>
  <style>
    :root { --content-scale: ${contentScale}; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      width: ${POST_WIDTH}px;
      min-height: ${POST_HEIGHT}px;
      font-family: Arial, sans-serif;
      background: ${theme.pageBackground};
      color: ${theme.text};
    }
    .post-card {
      position: relative;
      width: ${POST_WIDTH}px;
      min-height: ${POST_HEIGHT}px;
      padding: calc(38px * var(--content-scale));
      background: ${theme.cardBackground};
      border: 1px solid ${theme.cardBorder};
      box-shadow: 0 20px 50px rgba(15, 23, 42, 0.35);
      display: flex;
      flex-direction: column;
      gap: calc(10px * var(--content-scale));
      overflow: hidden;
    }
    .post-card::before,
    .post-card::after {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 0;
      pointer-events: none;
    }
    .post-card::before {
      content: '';
      top: calc(82px * var(--content-scale));
      left: calc(-90px * var(--content-scale));
      width: calc(320px * var(--content-scale));
      height: calc(120px * var(--content-scale));
      border-radius: 999px;
      background: linear-gradient(135deg, rgba(56, 189, 248, 0.22), rgba(168, 85, 247, 0.08));
      transform: rotate(-14deg);
      filter: blur(2px);
    }
    .post-card::after {
      content: '';
      right: calc(-88px * var(--content-scale));
      bottom: calc(86px * var(--content-scale));
      width: calc(290px * var(--content-scale));
      height: calc(110px * var(--content-scale));
      border-radius: 999px;
      background: linear-gradient(135deg, rgba(251, 191, 36, 0.18), rgba(244, 114, 182, 0.1));
      transform: rotate(18deg);
      filter: blur(2px);
    }
    .topbar,
    .title-card,
    .brand-block,
    .grid,
    .footer {
      position: relative;
      z-index: 1;
    }
    .topbar,
    .pill {
      display: none;
    }
    .title-card {
      margin: 0 auto;
      max-width: 88%;
      padding: calc(14px * var(--content-scale)) calc(24px * var(--content-scale));
      border-radius: calc(20px * var(--content-scale));
      background: rgba(15, 23, 42, 0.28);
      border: 1px solid rgba(255, 255, 255, 0.16);
      box-shadow: 0 14px 30px rgba(15, 23, 42, 0.18);
      text-align: center;
    }
    h1 {
      margin: 0;
      font-size: calc(50px * var(--content-scale));
      line-height: 1.06;
      color: ${theme.text};
      text-align: center;
      text-wrap: balance;
      text-shadow: 0 10px 24px rgba(15, 23, 42, 0.28);
    }
    .brand-block {
      margin: 0 auto;
      max-width: 88%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: calc(4px * var(--content-scale));
      text-align: center;
    }
    .brand-name {
      font-size: calc(32px * var(--content-scale));
      font-weight: 900;
      color: ${theme.text};
      letter-spacing: 0.01em;
    }
    .brand-subtitle {
      margin: 0;
      color: ${theme.subtext};
      line-height: 1.45;
      font-size: calc(19px * var(--content-scale));
      text-align: center;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: calc(9px * var(--content-scale));
      align-content: start;
      margin-top: calc(10px * var(--content-scale));
      flex: 1;
    }
    .quiz-item {
      position: relative;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.05)),
        ${theme.quizBackground};
      border: 1px solid rgba(255, 255, 255, 0.16);
      box-shadow: 0 18px 38px rgba(15, 23, 42, 0.2);
      border-radius: calc(22px * var(--content-scale));
      padding: calc(18px * var(--content-scale)) calc(18px * var(--content-scale)) calc(14px * var(--content-scale)) calc(60px * var(--content-scale));
      min-height: auto;
      display: flex;
      flex-direction: column;
      gap: calc(6px * var(--content-scale));
      backdrop-filter: blur(10px);
    }
    .quiz-item:last-child {
      width: 100%;
      max-width: 100%;
      justify-self: stretch;
      min-height: auto;
    }
    .quiz-item.locked {
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03)),
        ${theme.lockedBackground};
    }
    .badge {
      position: absolute;
      top: calc(16px * var(--content-scale));
      left: calc(16px * var(--content-scale));
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: calc(34px * var(--content-scale));
      height: calc(34px * var(--content-scale));
      border-radius: 999px;
      background: linear-gradient(135deg, #fcd34d, #f59e0b);
      color: #1f2937;
      font-size: calc(16px * var(--content-scale));
      font-weight: 900;
      box-shadow: 0 8px 18px rgba(15, 23, 42, 0.16);
    }
    .quiz-item h3 {
      margin: 0;
      font-size: calc(21px * var(--content-scale));
      line-height: 1.25;
      font-weight: 700;
      color: ${theme.text};
      letter-spacing: -0.01em;
    }
    .answer {
      margin-top: 0;
      padding: calc(8px * var(--content-scale)) calc(12px * var(--content-scale));
      border-radius: calc(14px * var(--content-scale));
      background: ${theme.answerBackground};
      color: ${theme.answerText};
      font-weight: 700;
      font-size: calc(17px * var(--content-scale));
      line-height: 1.3;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 10px 20px rgba(15, 23, 42, 0.12);
    }
    .answer.hidden {
      background: ${theme.hiddenBackground};
      color: ${theme.hiddenText};
    }
    .footer {
      margin-top: calc(8px * var(--content-scale));
      padding: calc(12px * var(--content-scale)) calc(14px * var(--content-scale));
      border-radius: calc(16px * var(--content-scale));
      background: ${theme.ctaBackground};
      color: ${theme.text};
      font-weight: 700;
      font-size: calc(19px * var(--content-scale));
      line-height: 1.4;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: calc(6px * var(--content-scale));
      text-align: center;
    }
    .footer-copy {
      display: block;
    }
    .follow-line {
      margin-top: 0;
      text-align: center;
      color: ${theme.subtext};
      font-size: calc(15px * var(--content-scale));
      font-weight: 600;
      line-height: 1.3;
      opacity: 0.95;
    }
  </style>
</head>
<body>
  <section class="post-card">
    <div class="backdrop-orb one">🔥</div>
    <div class="backdrop-orb two">✨</div>
    <div class="topbar" aria-hidden="true"></div>
    <div class="title-card">
      <h1>${escapeHtml(data.title)}</h1>
    </div>
    <div class="brand-block">
      <strong class="brand-name">Gyan Vichar</strong>
      <p class="brand-subtitle">${escapeHtml(data.intro)}</p>
    </div>
    <div class="grid">${questionCards}</div>
    <div class="footer">
      <div class="footer-copy">${escapeHtml(data.cta)}</div>
      <div class="follow-line">Follow our page @GyanVichar for such knowledge</div>
    </div>
  </section>
</body>
</html>`
}

export default function App() {
  const [form, setForm] = useState(sampleData)
  const [quickText, setQuickText] = useState(formatQuickText(sampleData.questions))
  const [message, setMessage] = useState('')
  const [themeIndex, setThemeIndex] = useState(0)
  const previewRef = useRef(null)
  const activeTheme = colorThemes[themeIndex]
  const contentScale = getContentScale(form)
  const previewStyle = {
    '--preview-bg': activeTheme.cardBackground,
    '--preview-border': activeTheme.cardBorder,
    '--topbar-text': activeTheme.topbarText,
    '--preview-text': activeTheme.text,
    '--preview-subtext': activeTheme.subtext,
    '--quiz-bg': activeTheme.quizBackground,
    '--locked-bg': activeTheme.lockedBackground,
    '--badge-bg': activeTheme.badgeBackground,
    '--answer-bg': activeTheme.answerBackground,
    '--answer-text': activeTheme.answerText,
    '--hidden-bg': activeTheme.hiddenBackground,
    '--hidden-text': activeTheme.hiddenText,
    '--cta-bg': activeTheme.ctaBackground,
    '--content-scale': contentScale,
    width: `${POST_WIDTH * PREVIEW_SCALE}px`,
    minWidth: `${POST_WIDTH * PREVIEW_SCALE}px`,
    height: `${POST_HEIGHT * PREVIEW_SCALE}px`,
  }

  const captionText = useMemo(() => {
    const items = form.questions
      .map((item, index) => {
        const fallbackQuestion = item.question || `Question ${index + 1}`
        if (index === 4) {
          return `${index + 1}. ${fallbackQuestion}\n❓ Hidden answer — comment below!`
        }

        return `${index + 1}. ${fallbackQuestion}\n✅ ${item.answer || 'Answer here'}`
      })
      .join('\n\n')

    return `${form.title}\nGyan Vichar\n${form.intro}\n\n${items}\n\n${form.cta}`
  }, [form])

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function updateQuestion(index, key, value) {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }))
  }

  function loadSample() {
    setForm(sampleData)
    setQuickText(formatQuickText(sampleData.questions))
    setMessage('Sample loaded.')
  }

  function applyQuickText() {
    setForm((current) => ({
      ...current,
      questions: parseQuickText(quickText),
    }))
    setMessage('Questions updated from text.')
  }

  async function copyCaption() {
    try {
      await navigator.clipboard.writeText(captionText)
      setMessage('Caption copied to clipboard.')
    } catch {
      setMessage('Clipboard copy failed. Please copy manually.')
    }
  }

  async function copyHtml() {
    try {
      await navigator.clipboard.writeText(buildHtmlSnippet(form, activeTheme))
      setMessage(`HTML card copied with the ${activeTheme.name} theme.`)
    } catch {
      setMessage('Clipboard copy failed. Please copy manually.')
    }
  }

  function changeTheme() {
    const nextIndex = (themeIndex + 1) % colorThemes.length
    setThemeIndex(nextIndex)
    setMessage(`Theme changed to ${colorThemes[nextIndex].name}.`)
  }

  async function downloadPng() {
    if (!previewRef.current) {
      setMessage('Preview is not ready yet.')
      return
    }

    try {
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#0f172a',
      })
      const link = document.createElement('a')
      const safeTitle = (form.title || 'quiz-post')
        .toLowerCase()
        .replaceAll(/[^a-z0-9]+/g, '-')
        .replaceAll(/^-|-$/g, '')

      link.download = `${safeTitle || 'quiz-post'}-${POST_WIDTH}x${POST_HEIGHT}.png`
      link.href = dataUrl
      link.click()
      setMessage(`PNG downloaded at ${POST_WIDTH} × ${POST_HEIGHT}.`)
    } catch {
      setMessage('PNG download failed. Please try again.')
    }
  }

  return (
    <div className="app-shell">
      <section className="editor-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Creator tool</p>
            <h1>Daily quiz post generator</h1>
          </div>
          <button className="ghost-button" onClick={loadSample}>
            Load sample
          </button>
        </div>

        <div className="input-group">
          <label htmlFor="title">Post title</label>
          <input
            id="title"
            value={form.title}
            onChange={(event) => updateField('title', event.target.value)}
            placeholder="Enter your post title"
          />
        </div>

        <div className="input-group">
          <label htmlFor="intro">Subtitle</label>
          <textarea
            id="intro"
            rows="3"
            value={form.intro}
            onChange={(event) => updateField('intro', event.target.value)}
            placeholder="Daily Banking Gyan"
          />
        </div>

        <div className="input-group">
          <label htmlFor="quickText">Paste 5 lines as: Question | Answer</label>
          <textarea
            id="quickText"
            rows="8"
            value={quickText}
            onChange={(event) => setQuickText(event.target.value)}
            placeholder="1. Your question | Answer"
          />
          <button className="primary-button" onClick={applyQuickText}>
            Apply text to post
          </button>
        </div>

        <div className="question-list">
          {form.questions.map((item, index) => (
            <div className="question-editor" key={item.id}>
              <div className="question-label-row">
                <span>Question {index + 1}</span>
                {index === 4 && <strong>Answer stays hidden</strong>}
              </div>
              <input
                value={item.question}
                onChange={(event) => updateQuestion(index, 'question', event.target.value)}
                placeholder={`Type question ${index + 1}`}
              />
              <input
                value={item.answer}
                onChange={(event) => updateQuestion(index, 'answer', event.target.value)}
                placeholder={`Type answer ${index + 1}`}
              />
            </div>
          ))}
        </div>

        <div className="input-group">
          <label htmlFor="cta">Call to action</label>
          <input
            id="cta"
            value={form.cta}
            onChange={(event) => updateField('cta', event.target.value)}
            placeholder="Ask users to comment"
          />
        </div>

        <div className="theme-toolbar">
          <div className="theme-copy">
            <span>Current theme</span>
            <strong>{activeTheme.name}</strong>
          </div>
          <button className="secondary-button" onClick={changeTheme}>
            Change color theme
          </button>
        </div>

        <div className="action-row">
          <button className="primary-button" onClick={downloadPng}>
            Download PNG
          </button>
          <button className="secondary-button" onClick={copyCaption}>
            Copy caption text
          </button>
          <button className="secondary-button" onClick={copyHtml}>
            Copy HTML card
          </button>
        </div>

        {message && <p className="status-message">{message}</p>}
      </section>

      <section className="preview-panel">
        <div className="preview-stage">
          <div className="preview-card" ref={previewRef} style={previewStyle}>
            <div className="preview-topbar" aria-hidden="true" />

            <div className="title-card">
              <h2>{form.title}</h2>
            </div>
            <div className="preview-intro">
              <strong>Gyan Vichar</strong>
              <span>{form.intro}</span>
            </div>

            <div className="preview-grid">
              {form.questions.map((item, index) => (
                <article
                  key={item.id}
                  className={`quiz-card ${index === 4 ? 'hidden-card' : ''}`}
                >
                  <span className="quiz-badge">Q{index + 1}</span>
                  <h3>{item.question || `Question ${index + 1}`}</h3>
                  {index === 4 ? (
                    <div className="answer-box hidden-answer">🔒 Hidden answer — comment below</div>
                  ) : (
                    <div className="answer-box">✅ {item.answer || 'Answer here'}</div>
                  )}
                </article>
              ))}
            </div>

            <div className="comment-cta">
              <span className="footer-copy">{form.cta}</span>
              <div className="follow-line">Follow our page @GyanVichar for such knowledge</div>
            </div>
          </div>
        </div>

        <div className="caption-preview">
          <h3>Caption preview</h3>
          <pre>{captionText}</pre>
        </div>
      </section>
    </div>
  )
}
