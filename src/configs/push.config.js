import webpush from 'web-push';

export const configurePush = () => {
  webpush.setVapidDetails(
    'mailto:soksakletter@gmail.com',
    process.env.VAPID_PUBLIC,
    process.env.VAPID_PRIVATE
  );
};