import { subscribeToPush } from "./PushManager"; // Import the function

export async function askForNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      console.log('Permission not granted for notifications.');
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    const publicKey = "BDvso2i6ozteEOq89h5X6qlHFy2mJfG8MV_3TqTOLuhLhv9Wnnv4bqcXLOwFAGQiBKJTdFGCPj8yNSmlukQa-5g";
    const subscription = await subscribeToPush(registration, publicKey);

    //  ✅  ENCODE the p256dh and auth keys!
    const p256dh = subscription.getKey('p256dh') ? btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')))) : null;
    const auth = subscription.getKey('auth') ? btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')))) : null;

    const taskTitle = "Task Example"; // Add the task title from your logic
    const taskTimeDate = new Date().toISOString(); // Example task time

    await fetch('http://localhost:8000/api/save-subscription/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        keys: { p256dh, auth },
        task_title: taskTitle,
        task_time_date: taskTimeDate,
      }),
    });

    console.log('Push subscription sent to backend.');
  } catch (error) {
    console.error('askForNotificationPermission error:', error);
  }
}

export default askForNotificationPermission;
