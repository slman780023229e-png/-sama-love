Sama Royal Sanctuary — FCM Ready

FILES
1) index.html
   Replace your current HTML with this file.
2) firebase-messaging-sw.js
   Put this file in the ROOT of the same HTTPS domain as index.html.
3) functions/index.js
   Put this inside your Firebase Functions project.
4) functions/package.json
   Install dependencies and deploy the function.

IMPORTANT
- FCM Web requires HTTPS.
- The VAPID public key is already included.
- The Firebase Web config is already included.
- Never put a Firebase Service Account private key inside index.html or the service worker.
- The Cloud Function uses Firebase Admin credentials supplied by Firebase during deployment.

DEPLOY
From the Firebase project directory:
  npm install -g firebase-tools
  firebase login
  firebase init functions
Choose the existing project "slmane", JavaScript/ESM if prompted.
Replace functions/index.js and functions/package.json with the supplied files.
Then:
  cd functions
  npm install
  cd ..
  firebase deploy --only functions

SERVICE WORKER
Upload:
  firebase-messaging-sw.js
to the public/root directory where index.html is hosted.

HTTPS
The page must be served over HTTPS for web push/service workers.

NOTIFICATION SETUP
Open the chat, press 🔔, then "تفعيل الإشعارات".
Allow browser notifications.

VOICE NOTE
The original project stores URL.createObjectURL() for voice messages. That URL is local to the sender's browser and is NOT globally playable by other devices. Text notifications work globally. To make voice messages globally playable, add Firebase Storage upload in a separate step.
