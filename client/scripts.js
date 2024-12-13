/////////////////////////////// sign up /////////////////////////////////
const error = document.getElementById('error'); // get the error handling field
const signuperror = document.getElementById('signupError'); // get the error handling field

document.getElementById('signup_button').addEventListener('click', function(event) {
  event.preventDefault();

  const firstname = document.getElementById('firstname').value;
  const lastname = document.getElementById('lastname').value;
  const email_signup = document.getElementById('email_signup').value;
  const user_type = document.getElementById('user_type').value;
  const password = document.getElementById('password_signup').value;
  const confirm_password = document.getElementById('password_signup_confirmation').value;
  const errors = [];

  // error handling
  signuperror.innerHTML = '';

  if (password !== confirm_password) {
    errors.push("Passwords don't match<br>");
    document.getElementById('password_signup').value = '';
    document.getElementById('password_signup_confirmation').value = '';
  } 

  if (email_signup.endsWith('outhernct.edu') === false) {
    errors.push("You must use a southern email to sign up<br>");
    document.getElementById('email_signupy').value = '';
  }

  if (errors.length > 0) {
    signuperror.innerHTML = errors.join('');
    return; // Stop execution if there are validation errors
  }

  /////////// Make AJAX Request ///////////////////////
  const xhttp = new XMLHttpRequest(); // create new xttp request
  const params = `firstname=${encodeURIComponent(firstname)}&lastname=${encodeURIComponent(lastname)}&email_signup=${encodeURIComponent(email_signup)}&user_type=${encodeURIComponent(user_type)}&password_signup=${encodeURIComponent(password)}`;

  xhttp.open("POST", "/signup", true);
  xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  // Handle response
  xhttp.onreadystatechange = function () {
    if (xhttp.readyState === 4) { // Request finished
      if (xhttp.status === 200) {
        const response = JSON.parse(xhttp.responseText);
        if (response.success) {
          window.location.href = './auth.html'; // Redirect after success
        } else {
          signuperror.innerHTML = response.error || 'Signup failed!';
          console.log('response error', response.error);
        }
      } else if (xhttp.status === 400) {
        const response = JSON.parse(xhttp.responseText);
        signuperror.innerHTML = response.error || 'Invalid data submitted!';
        console.log('response error', response.error);
      } else {
        signuperror.innerHTML = 'An unexpected error occurred.';
        console.log('An unexpected error occurred.');
      }
    }
  };

  xhttp.send(params);
});

//////////////////////////////////////////////////////////////////////////
////////////////////////////// sign in //////////////////////////////////
////////////////////////////////////////////////////////////////////////

document.getElementById("signinForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the form from submitting the traditional way

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Create an AJAX request
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/signin", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        // Save session token or user information to localStorage
        document.cookie = `session=${response.sessionToken}; Path=/; HttpOnly`;
        localStorage.setItem("user", JSON.stringify(response));
        // Redirect to the dashboard
        window.location.href = "dashboard/index.html";
      } else if (xhr.status === 401) {
        const response = JSON.parse(xhr.responseText);
        error.innerText = response.message || 'Invalid credentials'; // Invalid credentials
      } else if (xhr.status === 500) {
        error.innerHTML = "An account was not found with this email address. <br> Sign up for an account."
      } else {
        error.innerHTML = "An unexpected error occurred.";
      }
    }
  };

  // Send the email and password as JSON
  xhr.send(JSON.stringify({ email, password }));
});

// Toggle between Sign-In and Sign-Up forms
function toggleForm() {
  const signinForm = document.getElementById("signinForm");
  const signupForm = document.getElementById("signupForm");
  const formTitle = document.getElementById("formTitle");

  if (signinForm.style.display === "none") {
    signinForm.style.display = "block";
    signupForm.style.display = "none";
    formTitle.innerText = "Sign In";
  } else {
    signinForm.style.display = "none";
    signupForm.style.display = "block";
    formTitle.innerText = "Sign Up";
  }
}