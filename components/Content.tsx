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

export default function ContentBody({ text, audio }: { text: string, audio: React.ReactNode }){
    const lineHeight = 10;
    const [fontSize, setFontSize] = useState<number>(18);
    const [popup, setPopup] = useState<PopupData | null>(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

    const textList = text.split(" ");

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
        <div className="flex justify-between items-center mb-4">
            <div>{audio}</div>
            <div className="flex gap-3 items-center">
                {/* Seletor de Voz */}
                <select
                    value={selectedVoice?.name || ''}
                    onChange={(e) => {
                        const voice = voices.find(v => v.name === e.target.value);
                        setSelectedVoice(voice || null);
                    }}
                    className="px-3 py-1 border border-gray-600 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {voices.map((voice) => (
                        <option key={voice.name} value={voice.name}>
                            {voice.name} ({voice.lang})
                        </option>
                    ))}
                </select>
                
                {/* Controle de Tamanho */}
                <div className="flex gap-1">
                    <span onClick={() => changeFontSizeValue(fontSize-1)} className="px-1 bg-gray-50 rounded-sm cursor-pointer text-lg hover:bg-gray-200 min-w-10 flex justify-center items-center">-</span>
                    <input
                        type="string"
                        id="fontSize"
                        onChange={changeFontSize}
                        value={fontSize}
                        className="w-10 border border-gray-600 focus:outline-hidden rounded-sm text-center text-lg"
                    />
                    <span onClick={() => changeFontSizeValue(fontSize+1)} className="px-1 bg-gray-50 rounded-sm cursor-pointer text-lg hover:bg-gray-200 min-w-10 flex justify-center items-center">+</span>
                </div>
            </div>
        </div>
        <div
            style={{
                fontSize: `${fontSize}px`,
                lineHeight: `${fontSize+lineHeight}px`
            }}
        >
            {textList.map((element, index) => <>
                <span 
                    key={index}
                    onClick={(e) => handleWordClick(e, element)}
                    className="cursor-pointer hover:bg-gray-200 rounded-sm transition-colors duration-150" 
                    style={{ padding: "2px" }}
                >
                    {element}
                </span> {" "}
            </>)}
        </div>

        <WordPopup 
            data={popup} 
            onClose={() => setPopup(null)}
            onPlayAudio={handlePlayAudio}
        />
    </div>
}