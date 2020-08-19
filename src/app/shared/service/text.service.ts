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
    let keys;
    if (key == '' || words == 0) {
      return 0;
    }
    keys = (text.match(new RegExp(key, 'i')) || []).length;
    const countWord = this.countWord(key);
    return +((keys * countWord / (words / 100)).toFixed(2))
  }

  isLetter(char) {
    return RegExp(/^\p{L}/, 'u').test(char);
  }
}
