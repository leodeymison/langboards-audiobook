#!/usr/bin/env python3
import os
import json
import re
from pathlib import Path
from collections import Counter
import urllib.request
import urllib.error

def extract_words_from_files():
    """Extract all words from the 100 text files"""
    words = set()
    data_dir = Path("public/data")
    
    # Read all files from 1.txt to 100.txt
    for i in range(1, 101):
        file_path = data_dir / f"{i}.txt"
        if file_path.exists():
            with open(file_path, 'r', encoding='utf-8') as f:
                text = f.read().lower()
                # Extract words (alphanumeric sequences)
                file_words = re.findall(r'\b[a-z]+\b', text)
                words.update(file_words)
    
    return sorted(list(words))

def get_translation_and_meaning(word):
    """Get translation and meaning for a word using free-dict API or fallback"""
    try:
        # Try to get definition from Free Dictionary API
        url = f"https://api.dictionaryapi.dev/api/v2/entries/en/{word}"
        with urllib.request.urlopen(url, timeout=5) as response:
            data = json.loads(response.read().decode())
            if data and len(data) > 0:
                entry = data[0]
                # Extract meaning
                meaning = ""
                if "meanings" in entry and len(entry["meanings"]) > 0:
                    definitions = entry["meanings"][0].get("definitions", [])
                    if definitions:
                        meaning = definitions[0].get("definition", "")
                
                # Try to get translation (Portuguese)
                translation = word  # Fallback
                if "meanings" in entry:
                    for meaning_obj in entry["meanings"]:
                        if "synonyms" in meaning_obj and meaning_obj["synonyms"]:
                            # This is not ideal but we'll use synonyms as fallback
                            break
                
                return {
                    "translation": translation,
                    "meaning": meaning[:150] if meaning else ""
                }
    except Exception as e:
        pass
    
    return {
        "translation": word,
        "meaning": ""
    }

def main():
    print("Extracting words from 100 text files...")
    words = extract_words_from_files()
    print(f"Found {len(words)} unique words")
    
    # Load existing dictionary if it exists
    dict_path = Path("public/dictionary.json")
    if dict_path.exists():
        with open(dict_path, 'r', encoding='utf-8') as f:
            existing_dict = json.load(f)
    else:
        existing_dict = {}
    
    # Filter out common words that are already in dictionary
    common_words = {'the', 'a', 'and', 'to', 'of', 'in', 'is', 'that', 'it', 'for', 'on', 'with', 'as', 'was', 'at', 'be', 'this', 'but', 'his', 'by', 'from', 'not', 'have', 'had', 'has', 'or', 'an', 'they', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'can', 'just', 'who', 'will', 'than', 'its', 'over', 'such', 'into', 'him'}
    
    new_words = [w for w in words if w not in existing_dict and w not in common_words]
    
    print(f"New words to add: {len(new_words)}")
    
    # Try to get translations for new words (limited due to API rate limits)
    updated_dict = existing_dict.copy()
    
    for i, word in enumerate(new_words):
        if i % 10 == 0:
            print(f"Processing word {i+1}/{len(new_words)}: {word}")
        
        # For now, just add the word as is
        # You can manually add translations later or use a different approach
        if word not in updated_dict:
            updated_dict[word] = word  # Placeholder
    
    # Save updated dictionary
    with open(dict_path, 'w', encoding='utf-8') as f:
        json.dump(dict(sorted(updated_dict.items())), f, ensure_ascii=False, indent=2)
    
    print(f"Dictionary updated with {len(new_words)} new words")
    print(f"Total words in dictionary: {len(updated_dict)}")

if __name__ == "__main__":
    main()
