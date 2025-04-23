document.addEventListener("DOMContentLoaded", function () {
    const newPasswordInput = document.getElementById("new-password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const form = document.getElementById("change-form");
    const responseMessage = document.getElementById("responseMessage");

    // Create password strength indicator
    const strengthBar = document.createElement("div");
    strengthBar.style.height = "5px";
    strengthBar.style.width = "100%";
    strengthBar.style.background = "#ddd";
    strengthBar.style.marginTop = "5px";
    strengthBar.style.borderRadius = "5px";
    strengthBar.style.overflow = "hidden";
    newPasswordInput.parentNode.appendChild(strengthBar);

    const strengthIndicator = document.createElement("div");
    strengthIndicator.style.height = "100%";
    strengthIndicator.style.width = "0%";
    strengthIndicator.style.transition = "width 0.3s ease-in-out";
    strengthBar.appendChild(strengthIndicator);

    // Create error message container
    const errorMessage = document.createElement("p");
    errorMessage.style.fontSize = "12px";
    errorMessage.style.marginTop = "5px";
    errorMessage.style.color = "red";
    errorMessage.style.opacity = "0";
    errorMessage.style.transition = "opacity 0.3s ease-in-out";
    newPasswordInput.parentNode.appendChild(errorMessage);

    function checkPasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        return strength;
    }

    newPasswordInput.addEventListener("input", function () {
        const password = newPasswordInput.value;
        const strength = checkPasswordStrength(password);

        // Smooth gradient color transition
        const colors = ["#ff4d4d", "#ff884d", "#ffc107", "#99cc33", "#28a745"];
        strengthIndicator.style.width = (strength * 20) + "%";
        strengthIndicator.style.background = colors[strength - 1] || "#ddd";

        if (strength < 3) {
            errorMessage.textContent = "Weak password. Try adding numbers and symbols.";
            errorMessage.style.opacity = "1";
        } else {
            errorMessage.style.opacity = "0";
        }
    });

    confirmPasswordInput.addEventListener("input", function () {
        confirmPasswordInput.style.border = confirmPasswordInput.value === newPasswordInput.value 
            ? "2px solid green" 
            : "2px solid red";
    });

    form.addEventListener("submit", async function (e) {
        e.preventDefault(); // Prevent default form submission

        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        responseMessage.innerHTML = '';

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            responseMessage.innerHTML = '<p style="color: red;">Passwords do not match! Please try again.</p>';
            return;
        }

        // Ensure password meets length requirement
        if (newPassword.length < 8) {
            responseMessage.innerHTML = '<p style="color: red;">Password must be at least 8 characters long.</p>';
            return;
        }

        // Check password strength
        const strength = checkPasswordStrength(newPassword);
        if (strength < 3) {
            responseMessage.innerHTML = '<p style="color: red;">Password is too weak. Please use a stronger password.</p>';
            return;
        }

        // Extract the token from the URL
        let pathParts = window.location.pathname.split('/').filter(part => part); // Remove empty parts
        let token = pathParts[pathParts.length - 1]; // Take the last non-empty part
        console.log("Path parts:", pathParts); // Debug log
        console.log("Extracted token:", token); // Debug log

        if (!token || token.length < 32) { // Basic validation for token length
            console.error("Invalid token extracted from URL:", token);
            responseMessage.innerHTML = '<p style="color: red;">Invalid reset link. Please request a new password reset.</p>';
            return;
        }

        const passwordData = {
            password: newPassword,
            token: token
        };
        console.log("Request body:", JSON.stringify(passwordData)); // Debug log

        // Optionally, hardcode the token and password to match Postman (for testing)
        // const token = "<token-from-postman>";
        // const passwordData = {
        //     password: "NewPass123!",
        //     token: token
        // };
        // console.log("Using hardcoded request body:", JSON.stringify(passwordData));

        try {    
            const url = `http://127.0.0.1:8000/api/reset-password-confirm/${token}/`;
            console.log("Sending request to URL:", url); // Debug log

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(passwordData)
            });

            console.log("Response status:", response.status); // Debug log
            console.log("Response ok:", response.ok); // Debug log
            console.log("Response headers:", [...response.headers.entries()]); // Debug log

            // Log the raw response text before parsing as JSON
            const responseText = await response.text();
            console.log("Raw response text:", responseText); // Debug log

            // Try to parse the response as JSON
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (jsonError) {
                console.error("Failed to parse response as JSON:", jsonError);
                throw new Error("Server response is not valid JSON");
            }

            if (response.ok) {
                responseMessage.innerHTML = '<p style="color: green;">' + (data.message || 'Your password has been updated! Please log in.') + '</p>';
                setTimeout(() => {
                    window.location.href = '/api/login/view/';
                }, 2000);
            } else {
                responseMessage.innerHTML = `<p style="color: red;">Error: ${data.error || 'Failed to update password!'}</p>`;
            }
        } catch (error) {
            console.error("Error updating password:", error);
            responseMessage.innerHTML = '<p style="color: red;">An error occurred while updating the password. Please try again.</p>';
        }
    });
});