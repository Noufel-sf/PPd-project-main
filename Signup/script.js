document.addEventListener('DOMContentLoaded', function () {
    // Navbar toggle functionality
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function () {
            navMenu.classList.toggle("active");
        });
    }

    // Close the menu after clicking a link
    document.querySelectorAll("#nav-menu a").forEach(link => {
        link.addEventListener("click", function () {
            navMenu.classList.remove("active"); // Closes the menu after clicking
        });
    });

    // Form submit functionality
    const form = document.getElementById('signupForm');
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent default form submission

            console.log("Form submitted");  // Debugging line to check if form submission is triggered

            // Get form values
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('email').value.trim();
            const role = document.getElementById('role').value;
            const password = document.getElementById('password').value.trim();

            // Basic form validation
            if (!firstName || !lastName || !email || !role || !password) {
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

            // Success message
            alert('Account created successfully!');
            form.reset(); // Clear form fields
        });
    }

    // Password visibility toggle functionality
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");

    if (togglePassword) {
        togglePassword.addEventListener("click", function () {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                this.classList.remove("fa-eye-slash");
                this.classList.add("fa-eye");
            } else {
                passwordInput.type = "password";
                this.classList.remove("fa-eye");
                this.classList.add("fa-eye-slash");
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
