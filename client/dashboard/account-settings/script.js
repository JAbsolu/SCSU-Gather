// get user id globally
const user_id = JSON.parse(localStorage.getItem("user")).user_id; 

//update user information 
const updateUserInfo = () => {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/user", true);

  xhttp.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status === 200) {
        const user = JSON.parse(xhttp.responseText);
        setFormData(user);
      }
    }
  }

  xhttp.send()
}

const setFormData = (user) => {
  document.getElementById("firstName").value = user.firstname;
  document.getElementById("lastName").value = user.lastname;
  document.getElementById("email").value = user.email_address;
  document.getElementById("userType").value = user.user_type;
}

//////////////////////////////////////////////////////////////////
// sign out
//////////////////////////////////////////////////////////////////
document.querySelectorAll(".signout").forEach((btn) => {
  btn.addEventListener("click", function() {
      localStorage.removeItem("user");
      window.location.href = "../auth.html";
  });  
})

////////////////// enable field on pencil click ////////////////
///////////////////////////////////////////////////////////////
const pencilIcon = document.querySelectorAll(".pencilIcon");

pencilIcon.forEach((icon) => {
  icon.addEventListener("click", function() {
   icon.previousElementSibling.toggleAttribute("disabled");
  })
})

///////////////////////////////////////////////////////////////////
///////////////////////// edit user information //////////////////
/////////////////////////////////////////////////////////////////
const userInfoBtn = document.getElementById("personalInfoBtn");

userInfoBtn.addEventListener("click", function(){
  const user_id = JSON.parse(localStorage.getItem("user")).user_id; 
  const firstname = document.getElementById("firstName").value;
  const lastname = document.getElementById("lastName").value;
  const emailAddress = document.getElementById("email").value;
  const userType = document.getElementById("userType").value;

  const xhttp = new XMLHttpRequest();
  const params = `firstname=${encodeURIComponent(firstname)}&lastname=${encodeURIComponent(lastname)}&emailAddress=${encodeURIComponent(emailAddress)}&userType=${encodeURIComponent(userType)}`;
  const url = `/edit-user?user_id=${encodeURIComponent(user_id)}`;

  xhttp.open("POST", url, true);

  xhttp.onreadystatechange = function() {
    if (xhttp.readyState === 4) {
      if (xhttp.status === 200) {
        const response = JSON.parse(xhttp.responseText);
        window.location.href = window.location.href;
      } else {
        const response = JSON.parse(xhttp.responseText);
        console.log(response.message);
      }
    }
    console.log(xhttp.readyState);
    alert(`Ready state: ${xhttp.readyState}`);
  }

  xhttp.send(params);
})


////////////////////////////////////////////////////////////////////////
///////////////////////////// change password //////////////////////////
///////////////////////////////////////////////////////////////////////

document.getElementById("changePassword").addEventListener("click", function(evt){
  evt.preventDefault();

  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const formMessage = document.getElementById("formMessage");

  if (newPassword !== confirmPassword) {
    formMessage.classList.add("text-danger");
    formMessage.innerHTML = "Passwords do not match";
    return;
  } else {
    formMessage.innerHTML = "";
  }

  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/user-password", true);

  xhttp.onreadystatechange = function() {
    if (xhttp.readyState === 4) {
      if (xhttp.status === 200) {
        const user = JSON.parse(xhttp.responseText);
        if (user.password === currentPassword) {
          updatePassword(user.user_id, newPassword);
        } else {
          formMessage.classList.add("text-danger");
          formMessage.innerHTML = "Wrong current password is entered.";
          console.log("password does not match");
        }
      }
    }
  }

  xhttp.send();
})

//make request to update the password
const updatePassword = (user_id, password) => {
  const formMessage = document.getElementById("formMessage"); // get errors field

  const xhttp = new XMLHttpRequest();
  const url = `/update-password`;
  const params = `user_id=${encodeURIComponent(user_id)}&password=${encodeURIComponent(password)}`;  

  xhttp.open("POST", url, true);

  xhttp.onreadystatechange = function () {
    if (xhttp.readyState === 4) {
      if (xhttp.status === 200) {
        const response = JSON.parse(xhttp.responseText);
        const form = document.getElementById("updatePasswordForm"); //get form
        form.reset(); // reset the form
        formMessage.classList.add("text-success");
        formMessage.innerText = response.message;
        console.log(response.message);
      } else {
        const response = JSON.parse(xhttp.responseText);
        console.log(response.message);
        formMessage.innerText = response.message;
      }
    }
  };

  xhttp.send(params);
};

///////////////////////////////////////////////////////////////////////////
//////////////////////////// delete user account /////////////////////////
const deleteAccount = (evt) => {
  evt.preventDefault();
  openModal()
}

// open modal
function openModal() {
  const user_id = JSON.parse(localStorage.getItem("user")).user_id; 
  const url = `/delete-account?user_id=${encodeURIComponent(user_id)}`;
  const error = document.getElementById("DeactivateAcctError");

  const modal = new bootstrap.Modal(document.getElementById("deactivateAccountModal"));
  modal.show();

  const deactivateAccount = document.getElementById("deactivateAccount"); // get the button to delete the account (yes button)
  deactivateAccount.addEventListener("click", function() { // listen for a click
    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", url, true);
  
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState === 4) {
        if (xhttp.status === 200) {
          const response = xhttp.responseText;
          // alert(response);
          location.href = "http://localhost/auth.html"
          console.log(response);
        } else {
          const response = JSON.parse(xhttp.responseText);
          console.log(response.message); 
          error.innerText = "You must delete all events before you can deactivate your account!"
        }
      }
    }
    xhttp.send();
  })
}

document.getElementById("deactivate-account").addEventListener("click", deleteAccount) // add event listener to delete account

//update on load
document.addEventListener("DOMContentLoaded", updateUserInfo);