import { InternalServerError } from "../errors/base.error.js";

export const enqueueJob = async (queue, jobName, data, customOptions = {}) => {
    const defaultOptions = {
        attempts: 5,
        backoff: {
            type: 'fixed',
            delay: 1000 * 30    // 30초
        },
        removeOnComplete: true,
        removeOnFail: false,
    }

    const finalOptions = { ...defaultOptions, ...customOptions };

    try {
        const job = await queue.add(jobName, data, finalOptions);
        return job;
    } catch (error) {
        throw InternalServerError("INTERNAL_SERVER_ERROR", "작업 추가중 에러가 발생했습니다");
    }
}