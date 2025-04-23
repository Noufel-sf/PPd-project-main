document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('reset-form');
    const emailInput = document.getElementById('email');
    const responseMessage = document.createElement('div');
    responseMessage.id = 'responseMessage';
    form.appendChild(responseMessage);

    const emailCheck = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const email = emailInput.value.trim();
        responseMessage.innerHTML = '';

        if (!email) {
            responseMessage.innerHTML = '<p style="color: red;">Please enter your email address.</p>';
            return;
        } else if (!email.match(emailCheck)) {
            responseMessage.innerHTML = '<p style="color: red;">Please enter a valid email address.</p>';
            return;
        }

        try {
            const response = await fetch('/api/reset-password-request/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                responseMessage.innerHTML = '<p style="color: green;">' + (data.message || 'Password reset email sent successfully!') + '</p>';
                emailInput.value = '';
                setTimeout(() => {
                    window.location.href = '/api/login/view/';
                }, 2000);
            } else {
                responseMessage.innerHTML = `<p style="color: red;">Error: ${data.error || 'Something went wrong'}</p>`;
            }
        } catch (error) {
            console.error('An error occurred:', error);
            responseMessage.innerHTML = '<p style="color: red;">An error occurred while sending the request. Please try again.</p>';
        }
    });
});