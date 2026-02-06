"use client";

import { ChangeEvent, useState } from "react"
import WordPopup from "./WordPopup";

interface PopupData {
  word: string;
  category: string;
  translations: string[];
  x: number;
  y: number;
}

export default function ContentBody({ text, audio }: { text: string, audio: React.ReactNode }){
    const lineHeight = 10;
    const [fontSize, setFontSize] = useState<number>(18);
    const [popup, setPopup] = useState<PopupData | null>(null);

    const textList = text.split(" ");

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

    const handleWordClick = (e: React.MouseEvent<HTMLSpanElement>, word: string) => {
        const rect = e.currentTarget.getBoundingClientRect();
        
        // Aqui você pode integrar com dados reais da sua API/banco
        // Por enquanto, usando dados de exemplo
        setPopup({
            word: word,
            category: "Verbo", // Substitua com dados reais
            translations: ["Exemplo 1", "Exemplo 2"], // Substitua com dados reais
            x: rect.left,
            y: rect.top,
        });
    };

    const handlePlayAudio = (word: string) => {
        console.log("Reproduzindo áudio para:", word);
        // Implemente a lógica de reprodução de áudio aqui
    };

    return <div>
        <div className="flex justify-between items-center mb-4">
            <div>{audio}</div>
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