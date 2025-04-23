document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('completeprofile');
    const skillsInput = document.getElementById('skills');
    const experienceInput = document.getElementById('experience');
    const errorMessage = document.getElementById('skills-error');
    const backBtn = document.getElementById('back-btn');

    // Handle "Back" button click
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = '/complete-profile/';
        });
    }

    // Navbar toggle functionality
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function () {
            console.log("Menu button clicked!");
            navMenu.classList.toggle("active");
        });
    }

    // Add event listener to validate skills input on form submission
    form.addEventListener('submit', function(event) {
        const skillsValue = skillsInput.value.trim();
        const experienceValue = experienceInput.value.trim();

        // Split the skills by commas and check each skill
        const skillsArray = skillsValue.split(',');

        // Check if any skill after the comma is only digits
        for (let skill of skillsArray) {
            const trimmedSkill = skill.trim();
            if (/^\d+$/.test(trimmedSkill)) {
                event.preventDefault(); // Prevent form submission
                errorMessage.textContent = "Skills cannot be only numbers after a comma.";
                errorMessage.style.display = 'block';
                return;
            }
        }

        errorMessage.style.display = 'none'; // Hide error message if valid
        // Let the form submit naturally
    });

    // Optionally, provide instant feedback as the user types
    skillsInput.addEventListener('input', function() {
        const skillsValue = skillsInput.value.trim();
        const skillsArray = skillsValue.split(',');

        // Check if any skill is only digits
        for (let skill of skillsArray) {
            const trimmedSkill = skill.trim();
            if (/^\d+$/.test(trimmedSkill)) {
                errorMessage.textContent = "Skill cannot be only numbers";
                errorMessage.style.display = 'block';
                return;
            }
        }

        errorMessage.style.display = 'none';
    });
});