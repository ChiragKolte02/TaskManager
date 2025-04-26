export async function subscribeToPush(registration, publicKey) {
  const existingSubscription = await registration.pushManager.getSubscription();

  if (existingSubscription) {
    console.log("Existing subscription found, unsubscribing...");
    await existingSubscription.unsubscribe();
  }

  const convertedKey = urlBase64ToUint8Array(publicKey); // Make sure this is used

  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedKey,  // ✅ THIS is where the key goes
  });
}

export function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}