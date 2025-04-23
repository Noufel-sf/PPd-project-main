// Wait for the DOM content to load
document.addEventListener("DOMContentLoaded", function () {
    // Get the form element
    const form = document.getElementById("completeprofile");

    // Get the input fields
    const contactInput = document.getElementById("nbr");
    const birthdayInput = document.getElementById("date");
    const addressInput = document.getElementById("address");

    // Error container to show error messages
    let errorContainer = document.getElementById("number_error");
    if (!errorContainer) {
        errorContainer = document.createElement("div");
        errorContainer.id = "number_error";
        contactInput.insertAdjacentElement("afterend", errorContainer);
    }

    // Define patterns
    const pattern1 = /^0\d{9}$/;         // e.g., 0794578843
    const pattern2 = /^\+213\d{9}$/;     // e.g., +213794578843

    // Handle form submission
    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent form submission for manual AJAX request

        const contactValue = contactInput.value.trim();
        const birthdayValue = birthdayInput.value.trim();
        const addressValue = addressInput.value.trim();
        
        // Clear previous error messages
        errorContainer.innerHTML = "";
        errorContainer.style.color = "red";

        // Validate inputs
        if (contactValue === "") {
            errorContainer.innerHTML = "<strong>Please enter your contact number.</strong>";
            return;
        } else if (!pattern1.test(contactValue) && !pattern2.test(contactValue)) {
            errorContainer.innerHTML = "<strong>Invalid number format!</strong><br>- Should start with <strong>0</strong> or <strong>+213</strong> followed by 9 digits";
            return;
        }

        // Prepare the data to be sent to the backend
        const formData = new FormData();
        formData.append("contact", contactValue);
        formData.append("birthday", birthdayValue);
        formData.append("address", addressValue);

        // Send the data to the backend using the Fetch API
        fetch('YOUR_BACKEND_URL_HERE', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())  // Parse the response as JSON
        .then(data => {
            if (data.success) {
                // Handle success (for example, redirect to the next page)
                window.location.href = "careerinfo.html"; // Redirect to the next page
            } else {
                // Handle error from backend (e.g., show a message)
                alert('There was an error submitting your information: ' + data.message);
            }
        })
        .catch(error => {
            // Handle any errors that occur during the fetch operation
            console.error("Error:", error);
            alert("There was an error submitting your information. Please try again.");
        });
    });

    // Handle input changes to hide the error message when a valid number is entered
    contactInput.addEventListener("input", function () {
        const value = contactInput.value.trim();
        if (pattern1.test(value) || pattern2.test(value)) {
            errorContainer.innerHTML = ""; // Hide the error message
        }
    });
});
