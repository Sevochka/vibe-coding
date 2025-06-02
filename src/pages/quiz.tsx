import { useState } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';

const questions = [
  {
    question: "В каком году Валерий Карпин начал свою тренерскую карьеру?",
    options: ["2012", "2014", "2017", "2019"],
    correct: "2017"
  },
  {
    question: "Какой клуб был первым в тренерской карьере Карпина?",
    options: ["Спартак", "Ростов", "Краснодар", "Зенит"],
    correct: "Ростов"
  },
  {
    question: "В каком году Карпин возглавил сборную России?",
    options: ["2020", "2021", "2022", "2023"],
    correct: "2021"
  },
  {
    question: "Какой турнир Карпин выиграл с Ростовом?",
    options: ["Кубок России", "Суперкубок России", "Чемпионат России", "Ни один из перечисленных"],
    correct: "Ни один из перечисленных"
  }
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    if (answer === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowScore(true);
      }
    }, 1000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white">
      <Head>
        <title>Тест: Тренерская карьера Валерия Карпина</title>
      </Head>

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-center mb-8">Тест: Тренерская карьера Карпина</h1>

          {!showScore ? (
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h2 className="text-xl mb-4">
                Вопрос {currentQuestion + 1} из {questions.length}
              </h2>
              <p className="text-lg mb-6">{questions[currentQuestion].question}</p>
              
              <div className="space-y-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                    className={`w-full p-4 rounded-lg text-left transition-colors ${
                      selectedAnswer === option
                        ? option === questions[currentQuestion].correct
                          ? 'bg-green-500'
                          : 'bg-red-500'
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center bg-white/10 p-8 rounded-lg backdrop-blur-sm"
            >
              <h2 className="text-2xl mb-4">Тест завершен!</h2>
              <p className="text-xl mb-6">
                Ваш результат: {score} из {questions.length}
              </p>
              <div className="space-x-4">
                <button
                  onClick={resetQuiz}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
                >
                  Пройти тест снова
                </button>
                <Link
                  href="/"
                  className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
                >
                  На главную
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
} 