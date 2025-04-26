/* eslint-disable no-restricted-globals */
// eslint-disable-next-line no-restricted-globals
self.addEventListener("push", function (event) {
  let data = {
    title: "🔔 Default Title",
    body: "You have a new message.",
  };

  try {
    data = event.data.json();
  } catch (err) {
    console.warn("Couldn't parse push event as JSON. Using fallback.");
    data.body = event.data.text();
  }

  const options = {
    body: data.body,
    icon: "/icon.png", // Use a valid icon path
    badge: "/badge.png", // Optional
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});