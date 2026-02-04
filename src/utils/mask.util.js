export const maskSensitiveData = (obj) => {
    if (!obj || typeof obj !== "object") return obj;

    const masked = { ...obj };

    const rules = {
        partial: ["username", "email", "name", "nickname"],
        full: ["password", "token", "accesstoken", "refreshToken", "secret", "code"]
    };

    Object.keys(masked).forEach(key => {
        const value = masked[key];
        if (typeof value !== 'string') return;

        if (rules.full.includes(key)) {
            masked[key] = "*******";
        } 

        else if (rules.partial.includes(key)) {
            if (key === "email" && value.includes("@")) {
                const [id, domain] = value.split("@");
                masked[key] = id.length > 3 
                    ? id.substring(0, 3) + "*".repeat(id.length - 3) + "@" + domain
                    : id.substring(0, 1) + "**@" + domain;
            } else {
                masked[key] = value.length > 3 
                    ? value.substring(0, 3) + "*".repeat(value.length - 3)
                    : value.substring(0, 1) + "**";
            }
        }
    });

    return masked;
};