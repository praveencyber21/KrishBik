document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('/login');

        if (response.ok) {
            const data = await response.json();
            console.log(data); // Log the received data from the server

            if (data.success) {
                window.location.href = '/user-home-page.html';
                const welcomeText = document.querySelector('.welcome-text h3');
                welcomeText.textContent = `Welcome, ${data.name}!`; // Update the text content
            } else {
                console.error('Login unsuccessful:', data.message); // Log error message if login fails
                window.location.href = '/index.html';
            }
        } else {
            console.error('Server error:', response.statusText); // Log server error
            window.location.href = '/index.html';
        }
    } catch (error) {
        console.error('Error during fetch:', error); // Log fetch error
        window.location.href = '/index.html';
    }
});
