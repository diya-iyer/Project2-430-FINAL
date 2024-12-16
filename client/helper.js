const handleError = (message) => {
  const errorMessageElement = document.getElementById('errorMessage');
  const messageContainer = document.getElementById('domoMessage');

  if (errorMessageElement && messageContainer) {
    errorMessageElement.textContent = message;
    messageContainer.classList.remove('hidden');
  } else {
    console.error('Error elements are missing in the DOM.');
  }
};

const hideError = () => {
  const messageContainer = document.getElementById('domoMessage');
  if (messageContainer) {
    messageContainer.classList.add('hidden');
  }
};

// Generic function to send requests (supports POST, PUT, DELETE)
const sendRequest = async (url, method = 'POST', data = null, handler = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);

    // Check if the response failed
    if (!response.ok) {
      const errorText = await response.text();
      handleError(`Error ${response.status}: ${errorText}`);
      return;
    }

    // Parse JSON response safely
    let result = {};
    try {
      result = await response.json();
    } catch (err) {
      console.warn('Response is not valid JSON:', err);
    }

    hideError();

    // Redirect if necessary
    if (result.redirect) {
      window.location = result.redirect;
      return;
    }

    // Display errors if present in the result
    if (result.error) {
      handleError(result.error);
      return;
    }

    // Pass the result to a custom handler if provided
    if (handler) {
      handler(result);
    }
  } catch (err) {
    console.error('Network request failed:', err);
    handleError('Request failed. Please try again later.');
  }
};

// Helper methods for specific HTTP verbs
const sendPost = (url, data = null, handler = null) =>
  sendRequest(url, 'POST', data, handler);

const sendPut = (url, data = null, handler = null) =>
  sendRequest(url, 'PUT', data, handler);

const sendDelete = (url, handler = null) => sendRequest(url, 'DELETE', null, handler);

module.exports = {
  handleError,
  hideError,
  sendRequest,
  sendPost,
  sendPut,
  sendDelete,
};
