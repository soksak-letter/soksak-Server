import { sendReservedLetter } from "../../repositories/letter.repository.js";
import { getDayStartAndEnd } from "../../utils/date.util.js"

export const sendScheduledLetters = async () => {
    const today = new Date();
    const { startTime, endTime } = getDayStartAndEnd(today);

    const isUpdated = await sendReservedLetter({startTime, endTime});
    if(isUpdated != 0){
        console.log("편지가 발송되었습니다.");
    }
}