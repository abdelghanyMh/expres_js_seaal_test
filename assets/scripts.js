// public/scripts.js
function resetOccurrence(managerId) {
  fetch(`/admins/reset/${managerId}`, {
    method: 'PUT',
  })
    .then((response) => response.text())
    .then((message) => {
      // Display the response message as a  popout
      alert(message);
    })
    .catch((error) => {
      console.error('Error resetting occurrence:', error);
      // Handle error
      alert('An error occurred while resetting occurrence');
    });
}
