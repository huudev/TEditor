import { Injectable } from '@angular/core';

import { WORD_SEPARATOR, WORD_SEPARATOR_REG, SENTENCE_WORD_SEPARATOR, SENTENCE_WORD_SEPARATOR_REG } from '@shared/app.const';

@Injectable({
  providedIn: 'root'
})
export class TextService {
  wordSeparator = WORD_SEPARATOR;
  wordSeparatorReg = WORD_SEPARATOR_REG;
  sentenceSeparator = SENTENCE_WORD_SEPARATOR;
  sentenceSeparatorReg = SENTENCE_WORD_SEPARATOR_REG;
  constructor() { }

  normalizeString(str: string): string {
    return str.trim().normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase()
  }

  countWord(words: string): number {
    const wordArray = words.split(this.wordSeparatorReg);
    // console.log(wordArray);
    let sentencesLength = wordArray.length;
    wordArray.forEach(word => {
      word = word.trim();
      if (/^\W+/.test(word) || word.length == 0) {
        --sentencesLength
      }
    });
    return sentencesLength;
  }

  countSentence(text: string = ''): number {
    const sentenceArray = text.split(this.sentenceSeparatorReg);
    // console.log(sentenceArray);
    let sentencesLength = sentenceArray.length;
    sentenceArray.forEach(sentence => sentence.trim() == '' && --sentencesLength);
    return sentencesLength;
  }

  countKeyDensity(text: string = '', key: string = '', words: number) {
    key = key.trim();
    if (key == '' || words == 0) {
      return 0;
    }
    key = this.escapeRegExp(key);
    let numberKeyAppearInText = this.countNumberKeyAppearInText(text, key);
    const countWord = this.countWord(key);
    return +((numberKeyAppearInText * countWord / (words / 100)).toFixed(2))
  }

  isLetter(char) {
    return RegExp(/^\p{L}/, 'u').test(char);
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

  countNumberKeyAppearInText(text: string, key: string): number {
    text = text.normalize('NFKC');
    key = key.normalize('NFKC');
    // keys = (text.match(new RegExp('[\\b\\n]'+key+'([\\b!\.:\?!;])', 'ig')) || []).length;
    // const regMatch = text.match(new RegExp('[\\b\\n]'+key+'([\\b!\.:\?!;])', 'ig'));
    // const regMatch = text.split(new RegExp('\\b'+key, 'ig'))

    // const matchs = text.match(new RegExp('\\b' + key + '(\\b|[!\.:\?!;])', 'ig'));
    const reg =new RegExp('\\b' + key + '(!|:|\\?|\\s|,|;|\\.)', 'ig');
    console.log(reg);
    
    const matchs = text.match(reg);
    return (matchs || []).length;
  }
}
