'use client';

import { useState } from 'react';
import { FaPlay, FaPause, FaRedo } from 'react-icons/fa';
import { useSpeech } from 'react-text-to-speech';

interface AudioPlayerProps {
  text: string;
}

export default function AudioPlayer({ text }: AudioPlayerProps) {
  const [speed, setSpeed] = useState(0.5);
  const [selectedVoiceName, setSelectedVoiceName] = useState('Google UK English Male');

  const {
    Text,
    speechStatus,
    start,
    pause,
    stop,
  } = useSpeech({
    text,
    pitch: 1.0,
    rate: speed,
    volume: 1.0,
    lang: 'en-US',
    voiceURI: selectedVoiceName,
  });

  const isPlaying = speechStatus === 'started';
  const isPaused = speechStatus === 'paused';

  const handlePlay = () => {
    start();
  };

  const handlePause = () => {
    pause();
  };

  const handleRestart = () => {
    stop();
    setTimeout(() => {
      start();
    }, 100);
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVoiceName(e.target.value);
    if (isPlaying || isPaused) {
      stop();
      setTimeout(() => {
        start();
      }, 100);
    }
  };

  // Lista de vozes comuns em inglês
  const commonEnglishVoices = [
    'Google UK English Male',
    'Google UK English Female',
    'Google US English',
    'Microsoft David - English (United States)',
    'Microsoft Zira - English (United States)',
    'Microsoft Mark - English (United States)',
    'Alex',
    'Samantha',
    'Karen',
  ];

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 mb-6">
      <div className="flex flex-col gap-4">
        {/* Título */}
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold">Reprodutor de Áudio</h2>
          <p className="text-sm opacity-90">Ouça o texto completo</p>
        </div>

        {/* Controles de configuração */}
        <div className="grid grid-cols-1 gap-4">
          {/* Seletor de voz */}
          <div className="flex flex-col gap-2">
            <label className="text-white text-sm font-medium">Selecione a voz:</label>
            <select
              value={selectedVoiceName}
              onChange={handleVoiceChange}
              className="px-3 py-2 rounded-lg bg-white/20 text-white border border-white/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              {commonEnglishVoices.map((voiceName) => (
                <option key={voiceName} value={voiceName} className="text-gray-900">
                  {voiceName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Controles */}
        <div className="flex justify-center items-center gap-4">
          {/* Botão Play/Pause */}
          {!isPlaying && !isPaused ? (
            <button
              onClick={handlePlay}
              className="bg-white text-blue-600 hover:bg-blue-50 p-4 rounded-full shadow-lg transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!text}
              title="Reproduzir"
            >
              <FaPlay size={24} />
            </button>
          ) : (
            <button
              onClick={isPlaying ? handlePause : handlePlay}
              className="bg-white text-blue-600 hover:bg-blue-50 p-4 rounded-full shadow-lg transition-all transform hover:scale-110"
              title={isPlaying ? "Pausar" : "Continuar"}
            >
              {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
            </button>
          )}

          {/* Botão Recomeçar */}
          <button
            onClick={handleRestart}
            className="bg-white text-purple-600 hover:bg-purple-50 p-4 rounded-full shadow-lg transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!text}
            title="Recomeçar"
          >
            <FaRedo size={20} />
          </button>

          {/* Velocidade */}
            <div className="flex items-center gap-3">
                <select
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="px-2 py-1 rounded-lg bg-white/20 text-white text-sm border border-white/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                    <option value="0.5" className="text-gray-900">0.5x</option>
                    <option value="0.75" className="text-gray-900">0.75x</option>
                    <option value="1.0" className="text-gray-900">1.0x</option>
                    <option value="1.25" className="text-gray-900">1.25x</option>
                    <option value="1.5" className="text-gray-900">1.5x</option>
                </select>
            </div>
        </div>

        {/* Indicador de status */}
        <div className="text-center text-white text-sm">
          {isPlaying && <span className="animate-pulse">▶ Reproduzindo...</span>}
          {isPaused && <span>⏸ Pausado</span>}
          {!isPlaying && !isPaused && <span className="opacity-70">Pronto para reproduzir</span>}
        </div>
      </div>
    </div>
  );
}
