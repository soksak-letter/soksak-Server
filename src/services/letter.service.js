import { getLetterDetail } from "../repositories/letter.repository.js"

export const getLetter = async (id) => {
    const letter = await getLetterDetail(id);
    if(!letter) throw new Error("작성되지 않은 편지입니다.");
    
    return letter;
}