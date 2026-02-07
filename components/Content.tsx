"use client";

import { ChangeEvent, useEffect, useState } from "react"
import WordPopup from "./WordPopup";

interface PopupData {
  word: string;
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

        setPopup({
            word: word,
            audioUrl: word,
            translations: ["Exemplo 1", "Exemplo 2"],
            x: rect.left,
            y: rect.top,
        });
    };

    return <div>
        {/* Controles */}
        <div className="bg-gradient-to-r from-slate-50 to-gray-100 rounded-xl shadow-md p-4 mb-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    
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
                {textList.map((element, index) =><span 
                        key={index}
                        onClick={(e) => handleWordClick(e, element)}
                        className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 rounded px-1 py-0.5 transition-all duration-200 inline-block hover:shadow-sm" 
                    >
                        {element}
                        {" "}
                    </span>
                )}
            </div>
        </div>

        <WordPopup 
            data={popup} 
            onClose={() => setPopup(null)}
        />
    </div>
}