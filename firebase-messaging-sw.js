/* Sama Royal Sanctuary - Firebase Messaging Service Worker */
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCEXxF2WsyCa_ebK3PJ5yraCikCIkBgm8Q",
  authDomain: "slmane.firebaseapp.com",
  databaseURL: "https://slmane-default-rtdb.firebaseio.com",
  projectId: "slmane",
  storageBucket: "slmane.firebasestorage.app",
  messagingSenderId: "957015187792",
  appId: "1:957015187792:web:56ca1c0567d6228cba4c55",
  measurementId: "G-WF8MN20DLV"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const data = payload.data || {};
  const sender = data.sender || "مستخدم";
  const isVoice = data.isVoice === "true";
  const title = data.title || `💌 رسالة جديدة من ${sender}`;
  const body = data.body || (isVoice ? "🎙️ أرسل رسالة صوتية ملكية" : "لديك رسالة جديدة");
  const messageId = data.messageId || Date.now().toString();

  self.registration.showNotification(title, {
    body: body.slice(0, 180),
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: "sama-message-" + messageId,
    renotify: true,
    vibrate: [120, 60, 120],
    data: {
      url: "/?chat=1&message=" + encodeURIComponent(messageId),
      messageId
    }
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification?.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            return client.focus().then(() => {
              if ("navigate" in client) return client.navigate(url);
            });
          }
        }
        if (clients.openWindow) return clients.openWindow(url);
      })
  );
});
