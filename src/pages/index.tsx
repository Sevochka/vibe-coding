import React from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white">
      <Head>
        <title>Валерий Карпин - Новый главный тренер ФК Динамо</title>
        <meta name="description" content="Официальная страница о назначении Валерия Карпина главным тренером ФК Динамо" />
      </Head>

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">Валерий Карпин</h1>
          <h2 className="text-3xl text-blue-400">Новый главный тренер ФК Динамо</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[400px] rounded-lg overflow-hidden"
          >
            <Image
              src="/karpin.jpg"
              alt="Валерий Карпин"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-semibold text-blue-400">О тренере</h3>
            <p className="text-lg">
              Валерий Георгиевич Карпин - легендарный российский футболист и успешный тренер. 
              В качестве игрока он выступал за такие клубы как "Спартак" (Москва), "Реал Сосьедад" 
              и сборную России.
            </p>
            <p className="text-lg">
              В тренерской карьере Карпин уже успел проявить себя в "Ростове" и сборной России, 
              а теперь возглавил московское "Динамо".
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <Link href="/quiz" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300">
            Пройти тест о тренерской карьере Карпина
          </Link>
        </motion.div>
      </main>

      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">
          Добро пожаловать в мир футбола!
        </h1>
        
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-lg p-8 shadow-xl">
          <h2 className="text-2xl font-semibold mb-6 text-center text-blue-400">
            Игры и развлечения
          </h2>
          
          <div className="space-y-4">
            <Link href="/hangman" className="block">
              <div className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg transition-colors duration-300">
                <h3 className="text-xl font-bold mb-2">Виселица: Угадай команду РПЛ</h3>
                <p className="text-blue-100">
                  Проверь свои знания команд Российской Премьер-Лиги в увлекательной игре!
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 