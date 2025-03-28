// the form validation logic  ;


let email = document.getElementById("email") ; 
let password = document.getElementById("password") ;

let email_error = document.getElementById("email_error") ;  
let password_error  = document.getElementById("password_error") ; 


let form  = document.getElementById("form") ;
var email_check = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

form.addEventListener("submit" , (e)=>{

    if(email.value == ''){
        e.preventDefault() ;
        email_error.innerHTML = "you must fill your Email" ; 
    }else if(!email.value.match(email_check)){
           e.preventDefault();
           email_error.innerHTML = "Valid Email is required";
    }else{
        email.innerhtml  = ' ' ; 
    }


    if(password.value.length <=5 ){
        e.preventDefault() ; 
        password_error.innerHTML = "password cannot be less then 5 characters" ;
    }else if(password.value.length >20 ){
        e.preventDefault() ; 
        password_error.innerHTML = "password cannote be more then 20 characters" ;
    }
 }
) ;

    // Add focus effects to inputs
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.style.borderColor = 'red';
            this.style.outline = 'none';
            this.style.boxShadow = '0 0 0 2px #4155E8';
        });

        input.addEventListener('blur', function () {
            this.style.borderColor = '#ddd';
            this.style.boxShadow = 'none';
        });
    });



// sending the actual user data to the backend via api post request


// async function login_user_data(e){
//     e.preventDefault() ;

//     let email = document.getElementById("email").value ; 
//     let password = document.getElementById("password").value ; 

//     let userdata = {
//         email: email ,
//         password:password ,
//     }
//     try{    

//         const response = await fetch("",{
//             method:"POST",
//             headers:{
//                 "Content-Type" :"application/json "
//             },
//             body:JSON.stringify(userdata)
//     }) ; 

//     const data = await response.json() ;

//     if(response.ok){
//         console.log("the user log in !!!");
//         alert("the login succsseful !!!") ;        
    
//         window.location.href = "index.html" ; 
//     }else{
//         console.log("the login failed ", data.message);
//         email_error.innerHTML = "invalid email or passord !" ; 
//     } 


//     }catch (error){
//         alert("Somthing went wrong .Please try again !")  ; 

//     }

// }

// let login_btn = document.getElementById("login_btn") ; 
// login_btn.addEventListener("click", login_user_data) ;


// making the navigation barr vesible in the small devices

let open_nav = document.getElementById("open_nav") ;
let nav_list = document.getElementById("nav_list") ; 
let state = false ;

open_nav.addEventListener("click" ,()=> {
     
    if(!state){
        nav_list.style.display = "flex"  ;
        state =true ;
    }else{
        nav_list.style.display = "none" ; 
        state = false ; 
    }
    
})


// the logic to show the password 
let showPassIcon = document.getElementById("showpass");

showPassIcon.addEventListener("click", () => {
    if (password.type === "password") {
        password.type = "text"; // Show password
        showPassIcon.classList.remove("fa-eye");
        showPassIcon.classList.add("fa-eye-slash");
    } else {
        password.type = "password"; // Hide password
        showPassIcon.classList.remove("fa-eye-slash");
        showPassIcon.classList.add("fa-eye");
    }
});