importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyCHt_LSHDvShUljbhtZHL68ev-mbfHkMZ0",
    authDomain: "kd-vakondcsapda.firebaseapp.com",
    projectId: "kd-vakondcsapda",
    storageBucket: "kd-vakondcsapda.appspot.com",
    messagingSenderId: "653734981004",
    appId: "1:653734981004:web:201e0263981522f77a7aa9"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    console.log('Received background message ', payload);
  
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
    };
  
    self.registration.showNotification(notificationTitle,
      notificationOptions);
});