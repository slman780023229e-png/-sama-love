importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey:"AIzaSyCEXxF2WsyCa_ebK3PJ5yraCikCIkBgm8Q",
  authDomain:"slmane.firebaseapp.com",
  databaseURL:"https://slmane-default-rtdb.firebaseio.com",
  projectId:"slmane",
  storageBucket:"slmane.firebasestorage.app",
  messagingSenderId:"957015187792",
  appId:"1:957015187792:web:56ca1c0567d6228cba4c55",
  measurementId:"G-WF8MN20DLV"
});

const messaging=firebase.messaging();

messaging.onBackgroundMessage(payload=>{
  const data=payload.data||{};
  const sender=data.sender||"مستخدم";
  const isVoice=data.isVoice==="true";
  const messageId=data.messageId||String(Date.now());
  const title=data.title||`💌 رسالة جديدة من ${sender}`;
  const body=data.body||(isVoice?"🎙️ أرسل رسالة صوتية ملكية":"لديك رسالة جديدة في مملكة سما");

  self.registration.showNotification(title,{
    body:String(body).slice(0,180),
    tag:"sama-message-"+messageId,
    renotify:true,
    vibrate:[120,60,120],
    data:{
      url:"/?chat=1&message="+encodeURIComponent(messageId),
      messageId
    }
  });
});

self.addEventListener("notificationclick",event=>{
  event.notification.close();
  const data=event.notification.data||{};
  const target=data.url||"/?chat=1";

  event.waitUntil(
    clients.matchAll({type:"window",includeUncontrolled:true}).then(list=>{
      for(const client of list){
        if("focus" in client){
          client.postMessage({type:"SAMA_OPEN_MESSAGE",messageId:data.messageId||""});
          return client.focus();
        }
      }
      if(clients.openWindow)return clients.openWindow(target);
    })
  );
});