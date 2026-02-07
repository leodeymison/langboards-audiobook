#!/usr/bin/env python3
import os
import json
import re
from pathlib import Path
import urllib.request
import urllib.error
import time

def get_word_definition_and_translation(word):
    """Get definition and translation for a word"""
    try:
        # Try to get definition from Free Dictionary API
        url = f"https://api.dictionaryapi.dev/api/v2/entries/en/{word}"
        with urllib.request.urlopen(url, timeout=5) as response:
            data = json.loads(response.read().decode())
            if data and len(data) > 0:
                entry = data[0]
                meaning = ""
                
                # Extract meaning
                if "meanings" in entry and len(entry["meanings"]) > 0:
                    definitions = entry["meanings"][0].get("definitions", [])
                    if definitions:
                        meaning = definitions[0].get("definition", "")[:200]
                
                # Get translation via MyMemory
                translation = get_translation_mymemory(word)
                
                return {
                    "translation": translation,
                    "meaning": meaning
                }
    except Exception as e:
        pass
    
    # Fallback: try to get translation only
    translation = get_translation_mymemory(word)
    return {
        "translation": translation,
        "meaning": ""
    }

def get_translation_mymemory(word):
    """Get Portuguese translation using MyMemory API"""
    try:
        url = f"https://api.mymemory.translated.net/get?q={word}&langpair=en|pt-BR"
        with urllib.request.urlopen(url, timeout=5) as response:
            data = json.loads(response.read().decode())
            if data.get("responseStatus") == 200:
                translated = data.get("responseData", {}).get("translatedText", word)
                if translated.lower() != word.lower():
                    return translated
    except Exception as e:
        pass
    
    return word

def main():
    dict_path = Path("public/dictionary.json")
    
    # Load existing dictionary
    with open(dict_path, 'r', encoding='utf-8') as f:
        dictionary = json.load(f)
    
    # Words that need translation (those currently set to themselves)
    words_to_translate = [w for w in dictionary.keys() if dictionary[w] == w and w not in ['is', 'be', 'was', 'has', 'have', 'are', 'am']]
    
    print(f"Found {len(words_to_translate)} words to translate...")
    
    # Create new dictionary with translations and meanings
    enhanced_dict = {}
    
    for i, word in enumerate(words_to_translate):
        if i % 50 == 0 and i > 0:
            print(f"Processed {i}/{len(words_to_translate)} words...")
            time.sleep(1)  # Rate limiting
        
        # For simple words, try to get translation and meaning
        info = get_word_definition_and_translation(word)
        enhanced_dict[word] = info
    
    # Merge with existing translations
    final_dict = {}
    for word in dictionary.keys():
        if word in enhanced_dict:
            final_dict[word] = enhanced_dict[word]
        elif isinstance(dictionary[word], dict):
            final_dict[word] = dictionary[word]
        else:
            # Old format (simple string), convert to new format
            final_dict[word] = {
                "translation": dictionary[word],
                "meaning": ""
            }
    
    # Save updated dictionary
    with open(dict_path, 'w', encoding='utf-8') as f:
        json.dump(final_dict, f, ensure_ascii=False, indent=2)
    
    print(f"Dictionary updated with translations and meanings!")
    print(f"Total words: {len(final_dict)}")

if __name__ == "__main__":
    main()
