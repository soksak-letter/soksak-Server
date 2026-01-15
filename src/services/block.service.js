import Filter from 'badwords-ko';
import leoProfanity from 'leo-profanity';

const koFilter = new Filter();
leoProfanity.loadDictionary('en');

/**
 * 텍스트 내에 비속어(한국어/영어)가 포함되어 있는지 확인합니다.
 * @param {string} text - 검사할 문자열
 * @returns {boolean} - 비속어가 존재하면 true, 없으면 false
 */
export const blockBadWordsInText = (text) => {
  if (!text || typeof text !== 'string') return false;

  const containsKoreanBadWord = koFilter.isProfane(text);
  const containsEnglishBadWord = leoProfanity.check(text);

  return containsKoreanBadWord || containsEnglishBadWord;
};