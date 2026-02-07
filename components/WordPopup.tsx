"use client";

import { useEffect, useRef } from "react";
import { useSpeech } from 'react-text-to-speech';

interface WordPopupData {
  word: string;
  category: string;
  audioUrl: string;
  translations: string[];
  x: number;
  y: number;
}

interface WordPopupProps {
  data: WordPopupData | null;
  onClose: () => void;
}

export default function WordPopup({ data, onClose }: WordPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  const {
    start,
    stop,
  } = useSpeech({
    text: data?.word || '',
    pitch: 1.0,
    rate: 1.0,
    volume: 1.0,
    lang: 'en-US',
    voiceURI: 'Google US English',
  });


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleScroll = () => {
      onClose();
    };

    if (data) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
      document.addEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
      document.removeEventListener("scroll", handleScroll);
    };
  }, [data, onClose]);

  if (!data) return null;

  // Calcula a posição inteligente
  let positionX = data.x;
  let positionY = data.y + 10;
  
  const popupWidth = 320; // Largura aproximada do popup
  const popupHeight = 300; // Altura aproximada do popup
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1024;
  const screenHeight = typeof window !== "undefined" ? window.innerHeight : 768;

  // Se o popup sairia da tela pela direita, move para a esquerda
  if (data.x + popupWidth > screenWidth - 16) {
    positionX = data.x - popupWidth - 16;
  }

  // Se ainda sair da tela pela esquerda, coloca no máximo que cabe
  if (positionX < 16) {
    positionX = 16;
  }

  // Se o popup sairia da tela por baixo, renderiza acima
  if (data.y + popupHeight > screenHeight - 16) {
    positionY = data.y - popupHeight - 10;
  }

  return (
    <div
      ref={popupRef}
      className="fixed z-50 mt-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-80 animate-fadeIn"
      style={{
        left: `${positionX}px`,
        top: `${positionY}px`,
      }}
    >
      {/* Palavra */}
      <div className="mb-3">
        <h3 className="text-xl font-bold text-gray-800 break-words">{data.word}</h3>
      </div>

      {/* Categoria */}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xs font-semibold text-white bg-blue-500 px-2 py-1 rounded-full">
          {data.category}
        </span>
      </div>

      {/* Traduções */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">Traduções:</p>
        <div className="flex flex-col gap-1">
          {data.translations.map((translation, index) => (
            <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              {translation}
            </div>
          ))}
        </div>
      </div>

      {/* Botão de Player */}
      <button
        onClick={() => {
          stop();
          setTimeout(() => {
            start();
          }, 100);
        }}
        className="cursor-pointer w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
            clipRule="evenodd"
          />
        </svg>
        Ouvir
      </button>
    </div>
  );
}
