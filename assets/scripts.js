// public/scripts.js
function resetOccurrence(managerId) {
  fetch(`/admins/reset/${managerId}`, {
    method: 'PUT',
  })
    .then((response) => response.text())
    .then((message) => {
      // Display the response message as a  popout
      alert(message);
      location.reload();
    })
    .catch((error) => {
      console.error('Error resetting occurrence:', error);
      // Handle error
      alert('An error occurred while resetting occurrence');
    });
}

function sendMessage(managerId) {
  fetch('/manager/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      managerId: managerId,
    }),
  })
    .then((response) => response.text())
    .then((message) => {
      // Display the response message as a  popout
      alert(message);
      location.reload();
    })
    .catch((error) => {
      console.error('Error sending message:', error);
      // Handle error
      alert('An error occurred while sending message');
    });
}
