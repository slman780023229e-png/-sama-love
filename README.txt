Sama Royal Sanctuary — النسخة الكاملة مع إشعارات FCM

الملفات:
- index.html
- firebase-messaging-sw.js
- functions/index.js
- functions/package.json

التركيب:
1. ارفع index.html و firebase-messaging-sw.js إلى جذر موقعك.
2. داخل مشروع Firebase أنشئ مجلد functions وضع داخله index.js و package.json.
3. ثبت Firebase CLI ثم نفذ داخل مجلد functions:
   npm install
4. من مجلد المشروع نفذ:
   firebase deploy --only functions
5. الموقع يجب أن يعمل عبر HTTPS.
6. افتح الدردشة واضغط:
   🔔 > 🌐 تفعيل المتصفح
   واسمح بالإشعارات.
7. بعد تسجيل الجهاز، عندما يرسل جهاز آخر رسالة، Cloud Function ترسل إشعار النظام حتى لو الموقع مغلق.

مهم:
- لا تضع Service Account داخل index.html.
- VAPID الموجود في index.html هو المفتاح الذي تم تزويدنا به.
- قواعد Realtime Database يجب أن تسمح بكتابة notificationTokens حتى يستطيع المتصفح تسجيل جهازه.
- إذا كان موقعك ليس مستضافا من جذر الدومين، يجب تعديل مسار Service Worker.
