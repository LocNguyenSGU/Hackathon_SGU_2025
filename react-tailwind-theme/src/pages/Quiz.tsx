import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Brain,
  ChevronRight,
  ChevronLeft,
  Send,
  Sparkles,
  CheckCircle,
  Loader2
} from 'lucide-react'

interface Question {
  id: number
  question: string
  options: string[]
}

interface QuizData {
  layers: {
    [key: string]: Question[]
  }
}

interface Answer {
  question_id: number
  choice: string
}

export default function Quiz() {
  const navigate = useNavigate()
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPhase, setCurrentPhase] = useState(1)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [submitting, setSubmitting] = useState(false)
  const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1'

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${baseUrl}/quiz/questions`)
      const data = await response.json()
      setQuizData(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching questions:', error)
      setLoading(false)
    }
  }

  const handleAnswerSelect = (questionId: number, choice: string) => {
    setAnswers(prev => {
      const existingIndex = prev.findIndex(a => a.question_id === questionId)
      if (existingIndex >= 0) {
        const newAnswers = [...prev]
        newAnswers[existingIndex] = { question_id: questionId, choice }
        return newAnswers
      }
      return [...prev, { question_id: questionId, choice }]
    })
  }

  const getAnswer = (questionId: number) => {
    return answers.find(a => a.question_id === questionId)?.choice
  }

  const isPhaseComplete = (phase: number) => {
    if (!quizData) return false
    const phaseQuestions = quizData.layers[phase.toString()]
    return phaseQuestions.every(q => answers.some(a => a.question_id === q.id))
  }

  const handleNextPhase = () => {
    if (currentPhase < 3) {
      setCurrentPhase(currentPhase + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevPhase = () => {
    if (currentPhase > 1) {
      setCurrentPhase(currentPhase - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const response = await fetch(`${baseUrl}/quiz/result`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      })

      const result = await response.json()
      console.log(result)
      console.log(answers)

      localStorage.setItem('quizResult', JSON.stringify(result))
      navigate('/result')
    } catch (error) {
      console.error('Error submitting quiz:', error)
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mx-auto mb-3" />
          <p className="text-gray-600 text-sm">Đang tải câu hỏi...</p>
        </div>
      </div>
    )
  }

  if (!quizData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <div className="text-center">
          <p className="text-gray-600">Không thể tải câu hỏi. Vui lòng thử lại.</p>
        </div>
      </div>
    )
  }

  const currentQuestions = quizData.layers[currentPhase.toString()]
  const totalQuestions = Object.values(quizData.layers).flat().length
  const answeredCount = answers.length

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 pt-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-medium mb-3">
            <Brain className="w-4 h-4" />
            <span>Trắc nghiệm tâm lý du lịch</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Khám phá tính cách du lịch
          </h1>
          <p className="text-sm text-gray-600">
            Giai đoạn {currentPhase}/3 • {answeredCount}/{totalQuestions} câu hỏi
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex gap-1.5 mb-2">
            {[1, 2, 3].map(phase => {
              const phaseQuestions = quizData.layers[phase.toString()]
              const phaseAnswers = answers.filter(a =>
                phaseQuestions.some(q => q.id === a.question_id)
              ).length
              const phaseProgress = (phaseAnswers / phaseQuestions.length) * 100

              return (
                <div
                  key={phase}
                  className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${phase < currentPhase
                    ? 'bg-emerald-500'
                    : phase === currentPhase
                      ? 'bg-gray-200'
                      : 'bg-gray-200'
                    }`}
                >
                  {phase === currentPhase && (
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${phaseProgress}%` }}
                    />
                  )}
                  {phase < currentPhase && (
                    <div className="h-full bg-emerald-500 rounded-full w-full" />
                  )}
                </div>
              )
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Động lực</span>
            <span>Sở thích</span>
            <span>Phong cách</span>
          </div>
        </div>

        {/* Phase Title */}
        <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl p-4 mb-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {currentPhase === 1 && 'Giai đoạn 1: Động lực du lịch'}
                {currentPhase === 2 && 'Giai đoạn 2: Sở thích & Nhu cầu'}
                {currentPhase === 3 && 'Giai đoạn 3: Phong cách & Quyết định'}
              </h2>
              <p className="text-xs text-white/90">
                {currentQuestions.length} câu hỏi •
                {currentPhase === 1 && ' Khám phá động lực'}
                {currentPhase === 2 && ' Tìm hiểu sở thích'}
                {currentPhase === 3 && ' Xác định phong cách'}
              </p>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4 mb-6">
          {currentQuestions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">
                    {question.question}
                  </h3>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const choice = String.fromCharCode(65 + optionIndex)
                      const isSelected = getAnswer(question.id) === choice

                      return (
                        <button
                          key={optionIndex}
                          onClick={() => handleAnswerSelect(question.id, choice)}
                          className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${isSelected
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected
                                ? 'border-emerald-500 bg-emerald-500'
                                : 'border-gray-300'
                                }`}
                            >
                              {isSelected && (
                                <CheckCircle className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span className={`text-sm ${isSelected ? 'text-emerald-900 font-medium' : 'text-gray-700'}`}>
                              {option}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 justify-between items-center">
          <button
            onClick={handlePrevPhase}
            disabled={currentPhase === 1}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${currentPhase === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-gray-300 text-gray-700 hover:border-emerald-500'
              }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Quay lại
          </button>

          <div className="flex gap-3">
            {isPhaseComplete(currentPhase) && currentPhase < 3 && (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full transition-all hover:scale-105 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Nộp kết quả
                    </>
                )}
              </button>
            )}

            {currentPhase < 3 && (
              <button
                onClick={handleNextPhase}
                disabled={!isPhaseComplete(currentPhase)}
                className={`flex items-center gap-1.5 px-6 py-2 rounded-full text-sm font-semibold transition-all ${isPhaseComplete(currentPhase)
                  ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:scale-105'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
              >
                Khám phá sâu hơn
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {currentPhase === 3 && isPhaseComplete(3) && (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-1.5 px-6 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white text-sm font-semibold rounded-full hover:scale-105 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang phân tích...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Hoàn thành & Xem kết quả
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Help Text */}
        {!isPhaseComplete(currentPhase) && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              💡 Vui lòng trả lời tất cả câu hỏi để tiếp tục
            </p>
          </div>
        )}
      </div>
    </div>
  )
}