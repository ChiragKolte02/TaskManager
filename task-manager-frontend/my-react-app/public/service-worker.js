// /* eslint-disable no-restricted-globals */
// // eslint-disable-next-line no-restricted-globals
// self.addEventListener("push", function (event) {
//   let data = {
//     title: "🔔 Default Title",
//     body: "You have a new message.",
//   };

//   try {
//     data = event.data.json();
//   } catch (err) {
//     console.warn("Couldn't parse push event as JSON. Using fallback.");
//     data.body = event.data.text();
//   }

//   const options = {
//     body: data.body,
//     icon: "/icon.png", // Use a valid icon path
//     badge: "/badge.png", // Optional
//     // sound: "./alarm-clock-90867.mp3"
//   };



//   // event.waitUntil(
//   //   self.registration.showNotification(data.title, options)
//   // );

//   // event.waitUntil(
//   //   self.registration.showNotification(data.title, options).then(() => {
//   //     // After notification is shown, send message to all clients
//   //     return self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
//   //       for (const client of clients) {
//   //         client.postMessage("Notification has been sent from Service Worker" + data.title);
//   //       }
//   //     });
//   //   })
//   // );

  

//   event.waitUntil(
//     Promise.all([
//       self.registration.showNotification(data.title, options),
//       self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
//         for (const client of clients) {
//           client.postMessage("✅ Notification sent: " + data.title);
//         }
//       })
//     ])
//   );
// });




/* eslint-disable no-restricted-globals */

// Force activate new SW immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Push Notification Handler
self.addEventListener("push", function (event) {
  let data = {
    title: "🔔 Default Title",
    body: "You have a new message.",
  };

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (err) {
    console.warn("⚠️ Couldn't parse push event as JSON. Using fallback.");
    data.body = event.data.text();
  }

  const options = {
    body: data.body,
    icon: "/icon.png",      // Make sure this file exists in public/
    badge: "/badge.png",    // Optional badge icon
  };

  // Show notification and send message to client
  event.waitUntil(
    Promise.all([
      self.registration.showNotification(data.title, options),

      // Send message to all open windows/tabs
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
        for (const client of clients) {
          client.postMessage(`✅ Notification sent: ${data.body}`);
        }
      })
    ])
  );
});
