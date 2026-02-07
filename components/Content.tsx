"use client";

import { ChangeEvent, useEffect, useState } from "react"
import WordPopup from "./WordPopup";

interface PopupData {
  word: string;
  category: string;
  audioUrl: string;
  translations: string[];
  x: number;
  y: number;
}

export default function ContentBody({ text }: { text: string }){
    const lineHeight = 10;
    const [fontSize, setFontSizeState] = useState<number>(18);
    const [popup, setPopup] = useState<PopupData | null>(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

    const textList = text.split(" ");

    // Carrega o tamanho da fonte do localStorage
    useEffect(() => {
        try {
            const savedFontSize = localStorage.getItem('fontSize');
            if (savedFontSize) {
                const size = parseInt(savedFontSize);
                if (size > 10 && size <= 30) {
                    setFontSizeState(size);
                }
            }
        } catch (error) {
            console.error('Erro ao carregar tamanho da fonte do localStorage:', error);
        }
    }, []);

    // Função auxiliar para atualizar fontSize e salvar no localStorage
    const setFontSize = (size: number) => {
        setFontSizeState(size);
        try {
            localStorage.setItem('fontSize', size.toString());
        } catch (error) {
            console.error('Erro ao salvar tamanho da fonte no localStorage:', error);
        }
    };

    // Carrega as vozes disponíveis
    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            const englishVoices = availableVoices.filter(voice => voice.lang.startsWith('en'));
            setVoices(englishVoices);
            
            const defaultVoice = 
                englishVoices.find(v => v.name === 'Google UK English Male') ||
                englishVoices.find(v => v.lang === 'en-GB') ||
                englishVoices.find(v => v.lang === 'en-US') || 
                englishVoices[0];
            setSelectedVoice(defaultVoice);
        };

        loadVoices();
        
        // Algumas vozes carregam assincronamente
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    const changeFontSize = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        const value = e.target.value;

        const valueNotText = value.replace(/\D/g, "");

        if(!valueNotText) return;

        const valueNumber = parseInt(valueNotText);

        if(valueNumber <= 10) return;
        if(valueNumber > 30) return;

        setFontSize(valueNumber);
    }

    const changeFontSizeValue = (value: number) => {
        if(value <= 10) return;
        if(value > 30) return;

        setFontSize(value);
    }

    const handleWordClick = async (e: React.MouseEvent<HTMLSpanElement>, word: string) => {
        const rect = e.currentTarget.getBoundingClientRect();

        const urlAudio = await handlePlayAudio(word);

        setPopup({
            word: word,
            category: "Verbo",
            audioUrl: urlAudio,
            translations: ["Exemplo 1", "Exemplo 2"],
            x: rect.left,
            y: rect.top,
        });
    };

    const handlePlayAudio = async (word: string) => {
        try {
            // Usa a Web Speech API nativa do navegador
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = 'en-US';
            utterance.rate = 0.8;
            utterance.pitch = 1.1;
            
            // Aplica a voz selecionada
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
            
            window.speechSynthesis.speak(utterance);
            
            return word;
        } catch (error) {
            console.error('Erro ao tocar o áudio:', error);
            return '';
        }
    };

    return <div>
        {/* Controles */}
        <div className="bg-gradient-to-r from-slate-50 to-gray-100 rounded-xl shadow-md p-4 mb-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Seletor de voz */}
                <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Voz do Narrador
                    </label>
                    <select
                        value={selectedVoice?.name || ''}
                        onChange={(e) => {
                            const voice = voices.find(v => v.name === e.target.value);
                            setSelectedVoice(voice || null);
                        }}
                        className="px-4 py-2.5 bg-white border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                        {voices.map((voice) => (
                            <option key={voice.name} value={voice.name}>
                                {voice.name} ({voice.lang})
                            </option>
                        ))}
                    </select>
                </div>
                
                {/* Controle de tamanho de fonte */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide text-center">
                        Tamanho da Fonte
                    </label>
                    <div className="flex gap-2 items-center bg-white rounded-lg p-1.5 shadow-sm border-2 border-gray-300">
                        <button 
                            onClick={() => changeFontSizeValue(fontSize-1)} 
                            className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-md cursor-pointer text-xl font-bold hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all shadow-md flex justify-center items-center"
                            aria-label="Diminuir fonte"
                        >
                            -
                        </button>
                        <div className="relative">
                            <input
                                type="string"
                                id="fontSize"
                                onChange={changeFontSize}
                                value={fontSize}
                                className="w-14 h-10 border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-md text-center text-lg font-bold text-gray-700 transition-all"
                            />
                        </div>
                        <button 
                            onClick={() => changeFontSizeValue(fontSize+1)} 
                            className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-md cursor-pointer text-xl font-bold hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all shadow-md flex justify-center items-center"
                            aria-label="Aumentar fonte"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
        </div>
        {/* Conteúdo */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-8 mb-6">
            {/* Área de leitura estilizada */}
            <div 
                className="text-gray-800 leading-relaxed max-w-4xl mx-auto"
                style={{
                    fontSize: `${fontSize}px`,
                    lineHeight: `${fontSize+lineHeight}px`,
                    textAlign: 'justify',
                    textJustify: 'inter-word'
                }}
            >
                {textList.map((element, index) => <>
                    <span 
                        key={index}
                        onClick={(e) => handleWordClick(e, element)}
                        className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded px-1 py-0.5 transition-all duration-200 inline-block hover:shadow-sm" 
                    >
                        {element}
                    </span>
                    {" "}
                </>)}
            </div>
        </div>

        <WordPopup 
            data={popup} 
            onClose={() => setPopup(null)}
            onPlayAudio={handlePlayAudio}
        />
    </div>
}