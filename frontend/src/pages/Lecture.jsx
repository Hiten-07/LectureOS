import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function Lecture() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('chat')
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([{
    role: 'ai',
    text: "Hi! I've processed your lecture. Ask me anything about it."
  }])
  const [chatLoading, setChatLoading] = useState(false)
  const [summary, setSummary] = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [flashcards, setFlashcards] = useState(null)
  const [flashcardsLoading, setFlashcardsLoading] = useState(false)
  const [flipped, setFlipped] = useState({})
  const [quiz, setQuiz] = useState(null)
  const [quizLoading, setQuizLoading] = useState(false)
  const [answers, setAnswers] = useState({})

  const askQuestion = async () => {
    if (!question.trim() || chatLoading) return
    const userMsg = question
    setMessages(m => [...m, { role: 'user', text: userMsg }])
    setQuestion('')
    setChatLoading(true)
    try {
      const res = await axios.post(`${API}/lecture/${id}/chat`, { question: userMsg })
      setMessages(m => [...m, { role: 'ai', text: res.data.answer }])
    } catch {
      setMessages(m => [...m, { role: 'ai', text: 'Something went wrong.' }])
    }
    setChatLoading(false)
  }

  const loadSummary = async () => {
    if (summary) return
    setSummaryLoading(true)
    try {
      const res = await axios.get(`${API}/lecture/${id}/summary`)
      setSummary(res.data)
    } catch {
      setSummary({ error: 'Failed to generate summary.' })
    }
    setSummaryLoading(false)
  }

  const loadFlashcards = async () => {
    if (flashcards) return
    setFlashcardsLoading(true)
    try {
      const res = await axios.get(`${API}/lecture/${id}/flashcards`)
      setFlashcards(res.data.flashcards || [])
    } catch {
      setFlashcards([])
    }
    setFlashcardsLoading(false)
  }

  const loadQuiz = async () => {
    if (quiz) return
    setQuizLoading(true)
    try {
      const res = await axios.get(`${API}/lecture/${id}/quiz`)
      setQuiz(res.data.questions || [])
    } catch {
      setQuiz([])
    }
    setQuizLoading(false)
  }

  const switchTab = (tab) => {
    setActiveTab(tab)
    if (tab === 'summary') loadSummary()
    if (tab === 'flashcards') loadFlashcards()
    if (tab === 'quiz') loadQuiz()
  }

  const tabs = [
    { id: 'chat', label: '💬 Chat' },
    { id: 'summary', label: '📋 Summary' },
    { id: 'flashcards', label: '🃏 Flashcards' },
    { id: 'quiz', label: '📝 Quiz' },
  ]

  const suggestions = [
    'Summarize the key points',
    'What are the main concepts?',
    'What should I remember for an exam?'
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column' }}>

      {/* Navbar */}
      <div style={{
        background: 'var(--bg)', borderBottom: '1px solid var(--border)',
        padding: '0 1.5rem', height: '52px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span>📚</span>
          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>LectureOS</span>
        </div>
        <button onClick={() => navigate('/')} style={{
          background: 'none', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: '0.3rem 0.75rem',
          fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer'
        }}>+ New lecture</button>
      </div>

      <div style={{ maxWidth: '720px', width: '100%', margin: '0 auto', padding: '1.5rem 1rem', flex: 1 }}>

        {/* Status badge */}
        <div style={{
          background: 'var(--bg)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: '0.6rem 1rem',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          marginBottom: '1rem'
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Lecture ready · <code style={{ fontSize: '0.75rem' }}>{id.slice(0, 8)}...</code>
          </span>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '0.25rem',
          background: 'var(--bg)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: '0.25rem',
          marginBottom: '1rem'
        }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => switchTab(tab.id)} style={{
              flex: 1, padding: '0.4rem 0.5rem',
              background: activeTab === tab.id ? 'var(--accent)' : 'transparent',
              color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
              border: 'none', borderRadius: '6px',
              fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
              transition: 'all 0.15s'
            }}>{tab.label}</button>
          ))}
        </div>

        {/* CHAT TAB */}
        {activeTab === 'chat' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '1.25rem',
              minHeight: '360px', maxHeight: '460px',
              overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem'
            }}>
              {messages.map((m, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                  gap: '0.5rem', alignItems: 'flex-start'
                }}>
                  {m.role === 'ai' && (
                    <div style={{
                      width: '26px', height: '26px', background: 'var(--accent)',
                      borderRadius: '6px', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '12px', flexShrink: 0, marginTop: '2px'
                    }}>📚</div>
                  )}
                  <div style={{
                    background: m.role === 'user' ? 'var(--accent)' : 'var(--bg-secondary)',
                    color: m.role === 'user' ? 'white' : 'var(--text-primary)',
                    padding: '0.6rem 0.9rem',
                    borderRadius: m.role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                    maxWidth: '80%', fontSize: '0.875rem', lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    border: m.role === 'ai' ? '1px solid var(--border)' : 'none'
                  }}>{m.text}</div>
                </div>
              ))}
              {chatLoading && (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <div style={{
                    width: '26px', height: '26px', background: 'var(--accent)',
                    borderRadius: '6px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '12px'
                  }}>📚</div>
                  <div style={{
                    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                    borderRadius: '10px 10px 10px 2px', padding: '0.6rem 0.9rem',
                    fontSize: '0.875rem', color: 'var(--text-muted)'
                  }}>Thinking...</div>
                </div>
              )}
            </div>

            {messages.length <= 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {suggestions.map(s => (
                  <button key={s} onClick={() => setQuestion(s)} style={{
                    background: 'var(--bg)', border: '1px solid var(--border)',
                    borderRadius: '20px', padding: '0.35rem 0.85rem',
                    fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer'
                  }}>{s}</button>
                ))}
              </div>
            )}

            <div style={{
              display: 'flex', gap: '0.5rem',
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: '10px', padding: '0.5rem'
            }}>
              <input
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && askQuestion()}
                placeholder="Ask anything about your lecture..."
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  fontSize: '0.875rem', background: 'transparent',
                  color: 'var(--text-primary)', padding: '0.25rem 0.5rem'
                }}
              />
              <button onClick={askQuestion} disabled={chatLoading || !question.trim()} style={{
                background: question.trim() && !chatLoading ? 'var(--accent)' : 'var(--border)',
                color: question.trim() && !chatLoading ? 'white' : 'var(--text-muted)',
                border: 'none', borderRadius: '7px', padding: '0.4rem 1rem',
                fontSize: '0.8rem', fontWeight: 500,
                cursor: question.trim() && !chatLoading ? 'pointer' : 'not-allowed'
              }}>Ask →</button>
            </div>
          </div>
        )}

        {/* SUMMARY TAB */}
        {activeTab === 'summary' && (
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
            {summaryLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                <p>Generating summary... this takes 20-30 seconds</p>
              </div>
            ) : summary?.error ? (
              <p style={{ color: 'red' }}>{summary.error}</p>
            ) : summary ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Main Topic</p>
                  <p style={{ fontSize: '1rem', fontWeight: 500 }}>{summary.main_topic}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Key Concepts</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {summary.key_concepts?.map((c, i) => (
                      <div key={i} style={{
                        display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                        background: 'var(--bg-secondary)', borderRadius: 'var(--radius)',
                        padding: '0.6rem 0.85rem'
                      }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.8rem', marginTop: '1px' }}>{i + 1}</span>
                        <span style={{ fontSize: '0.875rem' }}>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {summary.definitions && Object.keys(summary.definitions).length > 0 && (
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Definitions</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {Object.entries(summary.definitions).map(([term, def]) => (
                        <div key={term} style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', padding: '0.6rem 0.85rem' }}>
                          <span style={{ fontWeight: 500, color: 'var(--accent)', fontSize: '0.875rem' }}>{term}: </span>
                          <span style={{ fontSize: '0.875rem' }}>{def}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Key Takeaways</p>
                  {summary.takeaways?.map((t, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--success)', marginTop: '1px' }}>✓</span>
                      <span style={{ fontSize: '0.875rem' }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* FLASHCARDS TAB */}
        {activeTab === 'flashcards' && (
          <div>
            {flashcardsLoading ? (
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                <p>Generating flashcards... this takes 20-30 seconds</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {flashcards?.map((card, i) => (
                  <div
                    key={i}
                    onClick={() => setFlipped(f => ({ ...f, [i]: !f[i] }))}
                    style={{
                      background: flipped[i] ? 'var(--accent)' : 'var(--bg)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px', padding: '1.5rem',
                      cursor: 'pointer', minHeight: '140px',
                      display: 'flex', flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s', boxShadow: 'var(--shadow)'
                    }}
                  >
                    <p style={{
                      fontSize: '0.875rem', lineHeight: '1.5',
                      color: flipped[i] ? 'white' : 'var(--text-primary)',
                      fontWeight: flipped[i] ? 400 : 500
                    }}>
                      {flipped[i] ? card.back : card.front}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: flipped[i] ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)', marginTop: '1rem' }}>
                      {flipped[i] ? 'Click to see question' : 'Click to reveal answer'}
                    </p>
                  </div>
                ))}
                {(!flashcards || flashcards.length === 0) && (
                  <p style={{ color: 'var(--text-muted)' }}>No flashcards generated.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* QUIZ TAB */}
        {activeTab === 'quiz' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {quizLoading ? (
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                <p>Generating quiz... this takes 20-30 seconds</p>
              </div>
            ) : (
              <>
                {quiz?.map((q, i) => (
                  <div key={i} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem' }}>
                    <p style={{ fontWeight: 500, fontSize: '0.875rem', marginBottom: '1rem' }}>
                      <span style={{ color: 'var(--accent)', marginRight: '0.5rem' }}>Q{i + 1}.</span>
                      {q.question}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {q.options?.map((opt, j) => {
                        const letter = opt[0]
                        const isSelected = answers[i] === letter
                        const isCorrect = letter === q.correct
                        const showResult = answers[i] !== undefined
                        let bg = 'var(--bg-secondary)'
                        let border = 'var(--border)'
                        if (showResult && isSelected && isCorrect) { bg = '#f0fdf4'; border = 'var(--success)' }
                        else if (showResult && isSelected && !isCorrect) { bg = '#fef2f2'; border = '#fca5a5' }
                        else if (showResult && isCorrect) { bg = '#f0fdf4'; border = 'var(--success)' }
                        return (
                          <div
                            key={j}
                            onClick={() => !answers[i] && setAnswers(a => ({ ...a, [i]: letter }))}
                            style={{
                              padding: '0.6rem 0.85rem', borderRadius: 'var(--radius)',
                              border: `1px solid ${border}`, background: bg,
                              fontSize: '0.875rem', cursor: answers[i] ? 'default' : 'pointer',
                              transition: 'all 0.15s'
                            }}
                          >{opt}</div>
                        )
                      })}
                    </div>
                    {answers[i] && (
                      <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.85rem', background: 'var(--accent-light)', borderRadius: 'var(--radius)', fontSize: '0.8rem', color: 'var(--accent)' }}>
                        💡 {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
                {(!quiz || quiz.length === 0) && (
                  <p style={{ color: 'var(--text-muted)' }}>No quiz generated.</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
