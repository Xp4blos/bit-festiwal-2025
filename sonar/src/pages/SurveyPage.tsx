import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  type: 'single' | 'multiple' | 'scale' | 'text';
  options?: string[];
}

const questions: Question[] = [
  {
    id: 1,
    question: 'Jakie typy wydarzeń Cię interesują?',
    type: 'multiple',
    options: [
      '🧠 Edukacja i rozwój',
      '🏋️‍♂️ Sport i aktywność fizyczna',
      '🍎 Zdrowie i lifestyle',
      '🎭 Kultura i rozrywka',
      '🤝 Społeczność i networking',
      '💼 Kariera i biznes',
      '📱 Technologie i innowacje'
    ]
  },
  {
    id: 2,
    question: 'Którą kategorię uważasz za najciekawszą?',
    type: 'single',
    options: [
      '🧠 Edukacja i rozwój',
      '🏋️‍♂️ Sport i aktywność fizyczna',
      '🍎 Zdrowie i lifestyle',
      '🎭 Kultura i rozrywka',
      '🤝 Społeczność i networking',
      '💼 Kariera i biznes',
      '📱 Technologie i innowacje'
    ]
  },
  {
    id: 3,
    question: 'Czy preferujesz wydarzenia stacjonarne czy online?',
    type: 'single',
    options: ['Stacjonarne', 'Online', 'Hybrydowe']
  },
  {
    id: 4,
    question: 'Jak często brałbyś udział w takim wydarzeniu?',
    type: 'single',
    options: ['Raz w tygodniu', 'Raz w miesiącu', 'Kilka razy w roku', 'Sporadycznie']
  }
];

export default function SurveyPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    if (currentQuestion.type === 'multiple') {
      const current = (answers[currentQuestion.id] as string[]) || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      setAnswers({ ...answers, [currentQuestion.id]: updated });
    } else {
      setAnswers({ ...answers, [currentQuestion.id]: value });
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Serializacja odpowiedzi do stringa
    const serializedAnswers = Object.entries(answers).map(([questionId, answer]) => {
      const question = questions.find(q => q.id === parseInt(questionId));
      if (!question) return '';
      
      if (Array.isArray(answer)) {
        return `${question.question}: ${answer.join(', ')}`;
      }
      return `${question.question}: ${answer}`;
    }).join(' | ');

    console.log('Survey answers:', answers);
    console.log('Serialized answers string:', serializedAnswers);
    
    localStorage.setItem('surveyCompleted', 'true');
    localStorage.setItem('userPreferences', JSON.stringify(answers));
    localStorage.setItem('userPreferencesString', serializedAnswers);
    navigate('/dashboard');
  };

  const isAnswered = () => {
    const answer = answers[currentQuestion.id];
    if (currentQuestion.type === 'multiple') {
      return Array.isArray(answer) && answer.length > 0;
    }
    return !!answer;
  };

  const isSelected = (option: string) => {
    const answer = answers[currentQuestion.id];
    if (currentQuestion.type === 'multiple') {
      return Array.isArray(answer) && answer.includes(option);
    }
    return answer === option;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl my-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Pytanie {currentStep + 1} z {questions.length}
            </span>
            <span className="text-sm font-medium text-indigo-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className={`w-full px-6 py-4 rounded-xl border-2 transition-all text-left flex items-center justify-between ${
                  isSelected(option)
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
                }`}
              >
                <span className="font-medium">{option}</span>
                {isSelected(option) && (
                  <Check className="text-indigo-600" size={20} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <ChevronLeft size={20} />
            Wstecz
          </button>

          <button
            onClick={handleNext}
            disabled={!isAnswered()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg"
          >
            {currentStep === questions.length - 1 ? 'Zakończ' : 'Dalej'}
            {currentStep === questions.length - 1 ? (
              <Check size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
