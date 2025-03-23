
// toggling the navbarr 

document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function () {
            navMenu.classList.toggle("active");
        });
    }
});


document.querySelectorAll("#nav-menu a").forEach(link => {
    link.addEventListener("click", function () {
        navMenu.classList.remove("active"); // Closes the menu after clicking
    });
});

// toggling the navbarr 


// the user data variables 

const firstName = document.getElementById('firstName').value.trim();
const lastName = document.getElementById('lastName').value.trim();
const email = document.getElementById('email').value.trim();
const role = document.getElementById('role').value;
const password = document.getElementById('password').value.trim();

// the form validation logic with adding the focus effect  
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('signupForm');

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent default form submission           

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

    // Add focus effects to inputs .
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
// the form validation logic with adding the focus effect  


// sending the new user data to the backend to store it on the data base ; 

async function Send_user_data(e) {

    e.preventDefault() ; 

    const user_data = {
        user_name : firstName,
        user_last_name :lastName,
        user_role: role,
        user_email :email,
        user_password:password,
    }

try{  

    const Response = await fetch("",{
        method:"POST",
        headers:{
            "content-Type" :"application/json"
        },
        body:JSON.stringify(user_data) 
    })
    const data = await Response.json() 

    if(Response.ok){
        alert("sign up succsuffuly !!") ; 
        window.location.href = "index.html" ; 
    }else{
        alert("somthing went wrong !!") ; 
    }
     
}catch(error){
    console.error("error in the sign up ")  ;
    alert("somthing went wrong !!!")  ;
}

}
let sign_up_btn =document.getElementById("sign_up_btn").addEventListener("click",Send_user_data) ;


// sending the new user data to the backend to store it on the data base ; 

