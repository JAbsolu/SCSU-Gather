//////////////////////////////////////////////////////////////////
// get user info
//////////////////////////////////////////////////////////////////
const getUserInfo = () => {
  const xttp = new XMLHttpRequest();
  xttp.open("GET", "/user", true);

  xttp.onreadystatechange = function () {
    if (xttp.readyState === 4) {
      if (xttp.status === 200) {
        const user = JSON.parse(xttp.responseText);
        // console.log("User info:", user);
        // alert(JSON.stringify(user))
        setUserInfo(user);
      } else if (xttp.status === 401) {
        console.log("Not authenticated.");
        window.location.href = "client/auth.html"; // Redirect to login page
      }
    }
  };
  xttp.send();
}

const setUserInfo = (user) => {
  document.getElementById("userName").innerHTML = ` <h3>${user.firstname} ${user.lastname}</h3> <h5>${user.email_address}</h5>`;
  document.getElementById("name").innerHTML = `<strong>Name: </strong>${user.firstname} ${user.lastname}`;
  document.getElementById("email").innerHTML = `<strong>Email:</strong> ${user.email_address}`;
  document.getElementById("userType").innerHTML = `<strong>User Type:</strong> ${user.user_type}`;
  document.getElementById("userIntro").innerHTML = `Hello! I'm ${user.firstname} ${user.lastname}, a CS student at Southern Connecticut State University.`;
}

/////////////////////////////////////////////////////////////
// Call functions on page load
document.addEventListener("DOMContentLoaded", function() {
  getUserInfo();
});


//////////////////////////////////////////////////////////////////
// sign out
//////////////////////////////////////////////////////////////////
document.querySelectorAll(".signout").forEach((btn) => {
  btn.addEventListener("click", function() {
      localStorage.removeItem("user");
      window.location.href = "../auth.html";
  });  
})
