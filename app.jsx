import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Star, Play, Clock, Trophy, Volume2, ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react';

// --- DATA & CONTENT ---
const LESSONS = [
  {
    id: 1,
    title: "שעות עגולות",
    explanation: [
      { text: "ברוכה הבאה! בואי נכיר את השעון. בשעון יש שני מחוגים חשובים.", h: 3, m: 0, highlight: 'none' },
      { text: "המחוג הקצר והעבה הוא מחוג השעות. הוא זז לאט ומראה לנו איזו שעה עכשיו.", h: 3, m: 0, highlight: 'hour' },
      { text: "המחוג הארוך הוא מחוג הדקות. הוא זז מהר יותר.", h: 3, m: 0, highlight: 'minute' },
      { text: "כשהמחוג הארוך מצביע בדיוק למעלה על המספר 12, זו שעה עגולה!", h: 4, m: 0, highlight: 'both' },
      { text: "למשל עכשיו, המחוג הקצר על 4 והארוך על 12. השעה היא בדיוק ארבע!", h: 4, m: 0, highlight: 'none' }
    ],
    exercises: [
      { question: "מה השעה בתמונה?", h: 2, m: 0, type: 'text', options: ["השעה שלוש", "השעה שתיים", "השעה חמש", "השעה אחת"], correct: 1 },
      { question: "איזה שעון מראה את השעה שמונה?", targetH: 8, targetM: 0, type: 'find_clock', options: [{h: 6, m:0}, {h: 8, m:0}, {h: 10, m:0}, {h: 12, m:0}], correct: 1 },
      { question: "מה השעה בתמונה?", h: 10, m: 0, type: 'text', options: ["עשר", "תשע", "אחת עשרה", "שתים עשרה"], correct: 0 }
    ]
  },
  {
    id: 2,
    title: "חצאי שעות (וחצי)",
    explanation: [
      { text: "כל הכבוד! עכשיו נלמד מה קורה כשהמחוג הארוך מטייל.", h: 2, m: 0, highlight: 'none' },
      { text: "כשהמחוג הארוך של הדקות עושה חצי סיבוב ומגיע למטה אל המספר 6...", h: 2, m: 30, highlight: 'minute' },
      { text: "אנחנו אומרים שעברה חצי שעה, או 'וחצי'!", h: 2, m: 30, highlight: 'none' },
      { text: "שימי לב שהמחוג הקצר של השעות נמצא בדיוק באמצע, בין 2 ל-3.", h: 2, m: 30, highlight: 'hour' },
      { text: "השעה עכשיו היא שתיים וחצי!", h: 2, m: 30, highlight: 'none' }
    ],
    exercises: [
      { question: "מה השעה בתמונה?", h: 4, m: 30, type: 'text', options: ["ארבע בדיוק", "חמש וחצי", "ארבע וחצי", "שלוש וחצי"], correct: 2 },
      { question: "איזה שעון מראה את השעה שבע וחצי?", targetH: 7, targetM: 30, type: 'find_clock', options: [{h: 7, m:0}, {h: 6, m:30}, {h: 8, m:30}, {h: 7, m:30}], correct: 3 },
      { question: "מה השעה בתמונה?", h: 9, m: 30, type: 'text', options: ["תשע וחצי", "עשר וחצי", "שמונה וחצי", "תשע בדיוק"], correct: 0 }
    ]
  },
  {
    id: 3,
    title: "רבע שעה (ורבע / רבע ל-)",
    explanation: [
      { text: "עד עכשיו למדנו על שעה שלמה וחצי שעה. עכשיו נלמד על רבע!", h: 4, m: 0, highlight: 'none' },
      { text: "כשהמחוג הארוך מצביע על המספר 3, עברה רבע שעה. אנחנו קוראים לזה 'ורבע'.", h: 4, m: 15, highlight: 'minute' },
      { text: "למשל עכשיו, השעה ארבע ורבע.", h: 4, m: 15, highlight: 'none' },
      { text: "וכשהמחוג הארוך מצביע על המספר 9, חסרה רק רבע שעה עד לשעה הבאה. קוראים לזה 'רבע ל-'.", h: 4, m: 45, highlight: 'minute' },
      { text: "עכשיו השעה רבע לחמש! שימי לב שהמחוג הקצר כמעט הגיע למספר 5.", h: 4, m: 45, highlight: 'none' }
    ],
    exercises: [
      { question: "מה השעה בתמונה?", h: 7, m: 15, type: 'text', options: ["שבע וחצי", "שמונה ורבע", "שבע ורבע", "שש ורבע"], correct: 2 },
      { question: "איזה שעון מראה את השעה עשר ורבע?", targetH: 10, targetM: 15, type: 'find_clock', options: [{h: 10, m:0}, {h: 10, m:30}, {h: 10, m:15}, {h: 9, m:15}], correct: 2 },
      { question: "מה השעה בתמונה?", h: 2, m: 45, type: 'text', options: ["רבע לשלוש", "שתיים ורבע", "רבע לשתים", "שלוש בדיוק"], correct: 0 }
    ]
  }
];

// --- UTILS ---
const pcmToWav = (pcmData, sampleRate) => {
  const buffer = new ArrayBuffer(44 + pcmData.length * 2);
  const view = new DataView(buffer);
  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  writeString(0, 'RIFF');
  view.setUint32(4, 32 + pcmData.length * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, pcmData.length * 2, true);
  for (let i = 0; i < pcmData.length; i++) {
    view.setInt16(44 + i * 2, pcmData[i], true);
  }
  return new Blob([buffer], { type: 'audio/wav' });
};

// --- COMPONENTS ---

const AnalogClock = ({ hours, minutes, highlight = 'none', size = 150 }) => {
  const hourAngle = (hours % 12) * 30 + (minutes / 60) * 30;
  const minuteAngle = minutes * 6;
  
  const getOpacity = (type) => {
    if (highlight === 'none' || highlight === 'both') return 1;
    return highlight === type ? 1 : 0.2;
  };

  return (
    <div style={{ width: size, height: size }} className="relative bg-white rounded-full shadow-lg border-4 border-slate-700 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Numbers */}
        {[...Array(12)].map((_, i) => {
          const num = i + 1;
          const angle = (num * 30) - 90;
          const radius = 38;
          const x = 50 + radius * Math.cos(angle * Math.PI / 180);
          const y = 50 + radius * Math.sin(angle * Math.PI / 180);
          return (
            <text key={num} x={x} y={y} textAnchor="middle" dominantBaseline="central" className="text-[10px] font-bold fill-slate-800 pointer-events-none">
              {num}
            </text>
          );
        })}
        {/* Center point */}
        <circle cx="50" cy="50" r="3" fill="#334155" />
        {/* Hour hand */}
        <line 
          x1="50" y1="50" x2="50" y2="28" 
          stroke="#ef4444" strokeWidth="4" strokeLinecap="round" 
          transform={`rotate(${hourAngle}, 50, 50)`}
          style={{ opacity: getOpacity('hour'), transition: 'opacity 0.3s ease' }}
        />
        {/* Minute hand */}
        <line 
          x1="50" y1="50" x2="50" y2="15" 
          stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" 
          transform={`rotate(${minuteAngle}, 50, 50)`}
          style={{ opacity: getOpacity('minute'), transition: 'opacity 0.3s ease' }}
        />
      </svg>
    </div>
  );
};

export default function App() {
  const [gameState, setGameState] = useState('welcome');
  const [currentLesson, setCurrentLesson] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const activeLesson = useMemo(() => LESSONS[currentLesson], [currentLesson]);

  const speakText = useCallback(async (text) => {
    if (!text) return;
    setIsSpeaking(true);
    const apiKey = "";
    try {
      const payload = {
        contents: [{ parts: [{ text: `Say in a warm and encouraging voice for a child in Hebrew: ${text}` }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } }
        },
        model: "gemini-2.5-flash-preview-tts"
      };

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("TTS failed");
      const result = await response.json();
      
      // Fixed syntax error here
      const part = result.candidates?.?.content?.parts?.;
      const audioData = part?.inlineData?.data;

      if (audioData) {
        const binaryString = atob(audioData);
        const pcmData = new Int16Array(binaryString.length / 2);
        for (let i = 0; i < pcmData.length; i++) {
          pcmData[i] = binaryString.charCodeAt(i * 2) | (binaryString.charCodeAt(i * 2 + 1) << 8);
        }
        const wavBlob = pcmToWav(pcmData, 24000);
        const audio = new Audio(URL.createObjectURL(wavBlob));
        audio.onended = () => setIsSpeaking(false);
        audio.play();
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error("TTS Error:", error);
      setIsSpeaking(false);
    }
  }, []);

  useEffect(() => {
    if (gameState === 'lesson') {
      speakText(activeLesson.explanation[currentStep].text);
    } else if (gameState === 'quiz') {
      speakText(activeLesson.exercises[currentQuestion].question);
    }
  }, [gameState, currentLesson, currentStep, currentQuestion, speakText, activeLesson]);

  const nextStep = () => {
    if (currentStep < activeLesson.explanation.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setGameState('quiz');
      setCurrentQuestion(0);
      setSelectedIdx(null);
    }
  };

  const handleAnswer = (idx, correctIdx) => {
    setSelectedIdx(idx);
    if (idx === correctIdx) {
      setFeedback('correct');
      speakText("נכון מאוד! כל הכבוד");
      setTimeout(() => {
        setFeedback(null);
        setSelectedIdx(null);
        if (currentQuestion < activeLesson.exercises.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          if (currentLesson < LESSONS.length - 1) {
            setCurrentLesson(currentLesson + 1);
            setCurrentStep(0);
            setGameState('lesson');
          } else {
            setGameState('end');
          }
        }
      }, 1500);
    } else {
      setFeedback('wrong');
      speakText("אופס, נסי שוב");
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b p-4 flex justify-between items-center px-8 shadow-sm relative z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setGameState('welcome')}>
          <div className="bg-blue-600 p-2 rounded-lg">
            <Clock className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-xl hidden sm:block text-slate-800">עולם השעון</span>
        </div>

        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full transition-all border border-slate-200"
          >
            <span className="font-medium text-slate-700">{activeLesson.title}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          {isMenuOpen && (
            <div className="absolute left-0 mt-2 w-56 bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden">
              {LESSONS.map((l, i) => (
                <button
                  key={l.id}
                  onClick={() => {
                    setCurrentLesson(i);
                    setCurrentStep(0);
                    setGameState('lesson');
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-right px-4 py-3 text-sm flex items-center gap-3 ${currentLesson === i ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-600'}`}
                >
                  <span className="opacity-50">{i + 1}.</span>
                  {l.title}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-1">
          {LESSONS.map((_, i) => (
            <Star key={i} className={`w-5 h-5 ${i <= currentLesson ? 'text-yellow-400 fill-current' : 'text-slate-200'}`} />
          ))}
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 flex flex-col items-center">
        {gameState === 'welcome' && (
          <div className="text-center py-20 space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="relative">
              <Clock className="w-32 h-32 text-blue-600 mx-auto" />
              <Star className="absolute top-0 right-1/4 text-yellow-400 fill-current animate-bounce" />
            </div>
            <h1 className="text-5xl font-extrabold text-blue-800">בואי נלמד שעון!</h1>
            <p className="text-xl text-slate-600 max-w-md">הצטרפי אלינו למסע מרתק שבו נלמד להבין בדיוק מה השעה.</p>
            <button 
              onClick={() => { setGameState('lesson'); setCurrentLesson(0); setCurrentStep(0); }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-2xl font-bold py-4 px-12 rounded-full shadow-lg transform transition active:scale-95 flex items-center gap-3 mx-auto"
            >
              <Play className="fill-current" /> בואי נתחיל!
            </button>
          </div>
        )}

        {gameState === 'lesson' && (
          <div className="w-full space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 flex flex-col items-center text-center space-y-8">
              <AnalogClock 
                hours={activeLesson.explanation[currentStep].h} 
                minutes={activeLesson.explanation[currentStep].m} 
                highlight={activeLesson.explanation[currentStep].highlight} 
                size={220} 
              />
              <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-100 flex items-start gap-4">
                <div className={`p-2 rounded-full bg-white shadow-sm shrink-0 ${isSpeaking ? 'ring-2 ring-blue-500' : ''}`}>
                  <Volume2 className={`w-6 h-6 ${isSpeaking ? 'text-blue-500' : 'text-slate-400'}`} />
                </div>
                <p className="text-2xl font-medium text-slate-700 leading-relaxed text-right">
                  {activeLesson.explanation[currentStep].text}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center px-4">
              <button 
                onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
                disabled={currentStep === 0}
                className="text-slate-500 font-bold px-6 py-2 disabled:opacity-0 flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4" /> חזור
              </button>
              <button 
                onClick={nextStep}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-full shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                הבא <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {gameState === 'quiz' && (
          <div className="w-full space-y-8 animate-in slide-in-from-bottom-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 flex flex-col items-center">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-center text-slate-800">
                {activeLesson.exercises[currentQuestion].question}
                <Volume2 className={`w-6 h-6 ${isSpeaking ? 'text-blue-500' : 'text-slate-300'}`} />
              </h2>
              
              {activeLesson.exercises[currentQuestion].type !== 'find_clock' && (
                <div className="mb-10">
                  <AnalogClock hours={activeLesson.exercises[currentQuestion].h} minutes={activeLesson.exercises[currentQuestion].m} size={180} />
                </div>
              )}

              <div className={`grid gap-4 w-full ${activeLesson.exercises[currentQuestion].type === 'find_clock' ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'}`}>
                {activeLesson.exercises[currentQuestion].options.map((opt, idx) => {
                  const isCorrect = idx === activeLesson.exercises[currentQuestion].correct;
                  const isSelected = idx === selectedIdx;
                  let colorClass = "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700";
                  
                  if (feedback === 'correct' && isCorrect) colorClass = "bg-green-100 border-green-500 text-green-800 scale-105 shadow-md";
                  if (feedback === 'wrong' && isSelected) colorClass = "bg-red-100 border-red-500 text-red-800 animate-shake";

                  return (
                    <button
                      key={idx}
                      disabled={feedback !== null}
                      onClick={() => handleAnswer(idx, activeLesson.exercises[currentQuestion].correct)}
                      className={`p-6 border-2 rounded-2xl transition-all duration-200 flex items-center justify-center min-h-[100px] ${colorClass}`}
                    >
                      {activeLesson.exercises[currentQuestion].type === 'find_clock' ? (
                        <AnalogClock hours={opt.h} minutes={opt.m} size={80} />
                      ) : (
                        <span className="text-xl font-bold">{opt}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {gameState === 'end' && (
          <div className="text-center py-20 space-y-8 animate-in zoom-in">
            <Trophy className="w-32 h-32 text-yellow-500 mx-auto drop-shadow-lg" />
            <h1 className="text-5xl font-bold text-slate-800">אלופה אמיתית!</h1>
            <p className="text-xl text-slate-600">סיימת את כל השיעורים ויודעת לקרוא שעון מצוין.</p>
            <button 
              onClick={() => setGameState('welcome')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-full font-bold shadow-lg transition-transform hover:scale-105"
            >
              לשחק שוב
            </button>
          </div>
        )}
      </main>

      {isMenuOpen && <div className="fixed inset-0 bg-black/5 z-40" onClick={() => setIsMenuOpen(false)} />}
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
}
