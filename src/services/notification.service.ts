const NOTIFICATION_API_URL = 'https://util.devi.tools/api/v1/notify';

export async function sendNotification() {
  try {
    const response = await fetch(NOTIFICATION_API_URL, {
      method: 'POST',
    });

    if (!response.ok) {
      console.error(
        `Error sending notification: ${response.status} - ${response.statusText}`
      );
    } else {
      console.log('Notification sent successfully');
    }
  } catch (err) {
    console.error(`Sending notification failed: ${err}`);
    throw new Error(`Sending notification failed: ${err}`);
  }
}
