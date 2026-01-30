import { deletePushSubscription, getPushSubscription } from "../repositories/user.repository.js"
import webpush from "web-push"

export const sendPushNotification = async (userId, title, body) => {
    const subscriptions = await getPushSubscription(userId);
    if(subscriptions.length === 0)  return;
    console.log(subscriptions);
    const payload = JSON.stringify({
        title,
        body,
        icon: "https://objectstorage.ap-seoul-1.oraclecloud.com/n/cn9mitxaov4i/b/soksak-Bucket/o/image%2Fpush%2Fbadge.png",
        badge: "https://objectstorage.ap-seoul-1.oraclecloud.com/n/cn9mitxaov4i/b/soksak-Bucket/o/image%2Fpush%2Flogo.png",
        data: { url: "http://localhost:3000" }
    })

    const results = await Promise.allSettled(
        subscriptions.map(sub => {
            const pushConfig = {
                endpoint: sub.endpoint,
                keys: {
                    p256dh: sub.p256dh,
                    auth: sub.auth
                }
            };

            return webpush.sendNotification(pushConfig, payload)
                .catch(async (err) => {
                    if (err.statusCode === 410 || err.statusCode === 404) {
                        await deletePushSubscription(sub.id);
                    }
                });
        })
    )
    console.log("=================전송 완료===================");

    console.log(results);
}