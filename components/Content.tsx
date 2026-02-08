"use client";

import { ChangeEvent, useEffect, useState } from "react"
import WordPopup from "./WordPopup";
import { MdLightMode, MdDarkMode } from 'react-icons/md';

interface PopupData {
  word: string;
  x: number;
  y: number;
}

export default function ContentBody({ text }: { text: string }){
    const lineHeight = 10;
    const [fontSize, setFontSizeState] = useState<number>(18);
    const [popup, setPopup] = useState<PopupData | null>(null);
    const [isDark, setIsDark] = useState<boolean>(false);
    const [isClient, setIsClient] = useState<boolean>(false);

    const textList = text.split(" ");

    // Carrega o tamanho da fonte e tema do localStorage
    useEffect(() => {
        setIsClient(true);
        try {
            const savedFontSize = localStorage.getItem('fontSize');
            if (savedFontSize) {
                const size = parseInt(savedFontSize);
                if (size > 10 && size <= 30) {
                    setFontSizeState(size);
                }
            }
            
            const savedTheme = localStorage.getItem('theme');
            const darkMode = savedTheme ? savedTheme === 'dark' : false;
            setIsDark(darkMode);
            applyTheme(darkMode);
        } catch (error) {
            console.error('Erro ao carregar preferências do localStorage:', error);
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

    const applyTheme = (dark: boolean) => {
        if (typeof window === 'undefined') return;
        const htmlElement = document.documentElement;
        if (dark) {
            htmlElement.classList.add('dark');
        } else {
            htmlElement.classList.remove('dark');
        }
    };

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        applyTheme(newTheme);
        try {
            localStorage.setItem('theme', newTheme ? 'dark' : 'light');
        } catch (error) {
            console.error('Erro ao salvar tema no localStorage:', error);
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

        // Remove pontuações do início e fim da palavra
        const cleanWord = word.replace(/^[.,!?;:"""''()[\]{}\-—]+|[.,!?;:"""''()[\]{}\-—]+$/g, '');

        setPopup({
            word: cleanWord,
            x: rect.left,
            y: rect.top,
        });
    };

    return <div>
        {/* Controles */}
        <div style={{
            background: isDark ? 'linear-gradient(to right, #1a1a1a, #2a2a2a)' : 'linear-gradient(to right, #f8f8f8, #f0f0f0)',
            borderColor: isDark ? '#333333' : '#e5e5e5'
        }} className="rounded-xl shadow-md p-4 mb-6 border">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                    <button
                        onClick={toggleTheme}
                        className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                            isDark 
                                ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900' 
                                : 'bg-slate-800 hover:bg-slate-900 text-white'
                        }`}
                        aria-label="Alternar tema"
                    >
                        {isDark ? (
                            <>
                                <MdLightMode size={20} />
                                <span>Claro</span>
                            </>
                        ) : (
                            <>
                                <MdDarkMode size={20} />
                                <span>Escuro</span>
                            </>
                        )}
                    </button>
                </div>
                
                {/* Controle de tamanho de fonte */}
                <div className="flex flex-col gap-1.5">
                    <label style={{
                        color: isDark ? '#fafafa' : '#171717'
                    }} className="text-xs font-semibold uppercase tracking-wide text-center">
                        Tamanho da Fonte
                    </label>
                    <div style={{
                        backgroundColor: isDark ? '#2a2a2a' : '#ffffff',
                        borderColor: isDark ? '#333333' : '#e5e5e5'
                    }} className="flex gap-2 items-center rounded-lg p-1.5 shadow-sm border-2">
                        <button 
                            onClick={() => changeFontSizeValue(fontSize-1)} 
                            className={`w-10 h-10 rounded-md cursor-pointer text-xl font-bold active:scale-95 transition-all shadow-md flex justify-center items-center ${
                                isDark 
                                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800' 
                                    : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                            }`}
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
                                style={{
                                    color: isDark ? '#fafafa' : '#171717',
                                    borderColor: isDark ? '#444444' : '#e5e5e5',
                                    backgroundColor: isDark ? '#1a1a1a' : '#ffffff'
                                }}
                                className="w-14 h-10 border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-md text-center text-lg font-bold transition-all"
                            />
                        </div>
                        <button 
                            onClick={() => changeFontSizeValue(fontSize+1)} 
                            className={`w-10 h-10 rounded-md cursor-pointer text-xl font-bold active:scale-95 transition-all shadow-md flex justify-center items-center ${
                                isDark 
                                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800' 
                                    : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                            }`}
                            aria-label="Aumentar fonte"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
        </div>
        {/* Conteúdo */}
        <div style={{
            backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
            borderColor: isDark ? '#333333' : '#e5e5e5'
        }} className="rounded-xl shadow-lg border p-4 sm:p-8 mb-6">
            {/* Área de leitura estilizada */}
            <div 
                className="leading-relaxed max-w-4xl mx-auto"
                style={{
                    fontSize: `${fontSize}px`,
                    lineHeight: `${fontSize+lineHeight}px`,
                    textAlign: 'justify',
                    textJustify: 'inter-word',
                    color: isDark ? '#fafafa' : '#171717'
                }}
            >
                {textList.map((element, index) =><span 
                        key={index}
                        onClick={(e) => handleWordClick(e, element)}
                        className={`cursor-pointer rounded px-1 py-0.5 transition-all duration-200 inline-block hover:shadow-sm ${
                            isDark ? 'hover:bg-blue-900 hover:text-blue-300' : 'hover:bg-blue-100 hover:text-blue-700'
                        }`}
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