// Get form values
const firstName = document.getElementById('firstName').value.trim();
const lastName = document.getElementById('lastName').value.trim();
const email = document.getElementById('email').value.trim();
const role = document.getElementById('role').value;
const password = document.getElementById('password').value.trim();
const sex = document.getElementById('sex').value.trim();
const confirmPassword = document.getElementById('confirmPassword').value.trim(); // Added confirm password field
// local variables 

document.addEventListener('DOMContentLoaded', function () {
   
    // Navbar toggle functionality
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function () {
            console.log("Menu button clicked!"); // Debugging
            navMenu.classList.toggle("active");
        });
    } 
    
    // Form submit functionality
    const form = document.getElementById('signupForm');
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent default form submission

            console.log("Form submitted");  // Debugging line to check if form submission is triggered


            // Basic form validation
            if (!firstName || !lastName || !email || !role || !password || !confirmPassword) {
                alert('Please fill in all fields');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }

            // Password validation (minimum 8 characters)
            if (password.length < 8) {
                alert('Password must be at least 8 characters long');
                return;
            }

            // Confirm password validation
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            // Success message
            alert('Account created successfully!');
            form.reset(); // Clear form fields
        });
    }

    // Password visibility toggle functionality
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");
    const toggleConfirmPassword = document.getElementById("confirmPassword");

    if (togglePassword) {
        togglePassword.addEventListener("click", function () {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                confirmPasswordInput.type = "text"; // Also show confirm password
                this.classList.remove("fa-eye-slash");
                this.classList.add("fa-eye");
            } else {
                passwordInput.type = "password";
                confirmPasswordInput.type = "password"; // Hide confirm password again
                this.classList.remove("fa-eye");
                this.classList.add("fa-eye-slash");
            }
        });
    }

    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener("click", function () {
            if (confirmPasswordInput.type === "password") {
                confirmPasswordInput.type = "text";
                this.classList.replace("fa-eye-slash", "fa-eye");
            } else {
                confirmPasswordInput.type = "password";
                this.classList.replace("fa-eye", "fa-eye-slash");
            }
        });
    }

    // Add focus effects to inputs
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.style.borderColor = 'red';
            this.style.outline = 'none';
            this.style.boxShadow = '0 0 0 2px rgba(255, 0, 0, 0.2)';
        });

        input.addEventListener('blur', function () {
            this.style.borderColor = '#ddd';
            this.style.boxShadow = 'none';
        });
    });
});

// sending the data to the backend 

async function registerUser(e) {
    e.preventDefault(); // Prevent form from submitting normally

    // Create user data object
    const userData = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        role: role,
        password: password,
        sex: sex
    };

    try {
        // Send POST request to backend
        const response = await fetch("YOUR_BACKEND_API_URL_HERE", {  // nino 
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json(); // Parse JSON response

        if (response.ok) {
            console.log("User registered successfully!");
            alert("Sign-up successful!");
            window.location.href = "index.html"; // Redirect after success
        } else {
            console.error("Registration failed:", data.message);
            alert("Something went wrong: " + data.message);
        }
    } catch (error) {
        console.error("Error in sign-up:", error);
        alert("Something went wrong. Please try again!");
    }
}

// Attach event listener to button
document.getElementById("submit_btn").addEventListener("click", registerUser);

