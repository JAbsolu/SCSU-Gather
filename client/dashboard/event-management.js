//////////////////////////////////////////////////////////////////
/////////////////////// get user info ////////////////////////////
//////////////////////////////////////////////////////////////////
const getUserInfo = () => {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/user", true);

  xhttp.onreadystatechange = function () {
    if (xhttp.readyState === 4) {
      if (xhttp.status === 200) {
        const user = JSON.parse(xhttp.responseText);
        console.log("User info:", user);
        document.getElementById("userName").innerHTML = ` <h4>${user.firstname} ${user.lastname}</h4>
                                                            <p>${user.email_address} <br> ${user.user_type}</p>`;
        document.getElementById("eventAdmin").value = `${user.user_id}`;
      } else if (xhttp.status === 401) {
        console.log("Not authenticated.");
        window.location.href = "client/auth.html"; // Redirect to login page
      }
    }
  };
  xhttp.send();
}

////////////////////////// get all events ///////////////////////////
/////////////////////////////////////////////////////////////////////
const getAllEvents = () => {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "/events", true);

  xhttp.onreadystatechange = function () {
    if (xhttp.readyState === 4) {
      if (xhttp.status === 200) {
        const response = JSON.parse(xhttp.responseText).data;
        // alert(JSON.stringify(response));
        showAllEvents(response);
      } else {
        console.log("Error 404, no events found!")
      }

    } 
  }
  xhttp.send();
}

///////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// show all events //////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
const showAllEvents = (events) => {
  // convert time to 12h format
  const formatTime = (t) => {
    const [hours, minutes, seconds] = t.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const standardHours = hours % 12 || 12;
    return `${standardHours}:${String(minutes).padStart(2, '0')} ${period}`;
}

// format date to MM-DD-YYYY
const formatDate = (d) => {
    const date = new Date(d);
    // Extract the month, day, and year
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    // Format the date as MM-DD-YYYY
    return `${month}-${day}-${year}`;
} 

  const eventsCardBody = document.getElementById("all-events-card-body");
  if (!eventsCardBody) {
    console.error("Error: eventsCardBody element not found.");
    return;
  }

  let eventsHTML = ""; // Accumulate HTML string for better performance

  events.forEach((event) => {    
    eventsHTML += `<div class="card event-management-all-cards mt-1 event-${event.event_id}">
        <div class="card-header bg-light">
            <h5 class='text-dark fw-bold mb-0'>${event.event_name}</h5>
            <input type='text' value='${event.event_id}' id="eventId-${event.event_id}" disabled hidden>
        </div>
        <div class="card-body">
            <div class=''>
                <div class="d-flex justify-content-between">
                  <p>Date: ${formatDate(event.event_date)}</p>
                  <p>Time: ${formatTime(event.event_time)}</p>
                </div>
                <div class="d-flex justify-content-between">
                  <p>Location: ${event.event_location}</p>
                </div>
            </div>
            <hr class="mt-2 mb-2">
            <div class='d-flex flex-row justify-content-between align-items-end'>
                <a href="#" class="register" id="${event.event_id}" ><i class="bi bi-calendar-plus"></i> Register</a>
                <a href="#" class="attendeesModalBtn" data-bs-toggle="modal" data-bs-target="#attendeesModal" id="${event.event_id}" ><i class="bi bi-view-list"></i> View Guests</a>
            </div>
        </div>
    </div>`;
  });

  eventsCardBody.innerHTML = eventsHTML;

  // check if the user has registered for an event, and remove the open to register
  events.forEach((event) => {
    try {
      if (localStorage.getItem(String(event.event_id))) {
        const eventElement = document.getElementById(String(event.event_id));
        if (eventElement) {
          eventElement.classList.add("d-none");
        }
      }
    } catch (err) {
      console.log(err);
    }
  });

  // View Event Attenddees
  const attendeesModalBtn = document.querySelectorAll(".attendeesModalBtn");

  attendeesModalBtn.forEach((eventBtn) => {
      const event_id = eventBtn.id;  // Get the event id
      eventBtn.addEventListener("click", function () {
          const url = `/attendees?event_id=${encodeURIComponent(event_id)}`;  // URL to get event id
  
          const xhttp = new XMLHttpRequest();  // Create request
          xhttp.open("GET", url, true);
  
          xhttp.onreadystatechange = function () {
              if (xhttp.readyState === 4) {
                  if (xhttp.status === 200) {
                      const attendees = JSON.parse(xhttp.responseText).data;
                      displayAttendees(attendees);
                      // alert(JSON.stringify(attendees));
                  } else {
                      console.log("No events found");
                      const response = JSON.parse(xhttp.responseText);
                      console.log(response.message);  // Assuming the server sends a response in JSON format
                  }
              }
          }
  
          xhttp.send();
      });
  });
  
  // Display attendees function
  const displayAttendees = (attendees) => {
      let modalBody = document.getElementById("modalBody");
      modalBody.innerHTML = "";  // Clear previous content
  
      attendees.forEach((attendee) => {
          modalBody.innerHTML += `
              <li class="list-group-item">${attendee.user_type}: ${attendee.firstname} ${attendee.lastname} (${attendee.email_address})</li>
          `;
      });
  }  

  //Register for an event
  const registerBtn = document.querySelectorAll(".register");

  registerBtn.forEach((evt) => {
    const event_id = evt.id; // get the event id
    const user_id = JSON.parse(localStorage.getItem("user")).user_id; // get the user id from localstorage

    evt.addEventListener("click", function(){
      localStorage.setItem(String(event_id), String(event_id));
      //create request
      const xhttp = new XMLHttpRequest();
      const url = `/event-registration?event_id=${encodeURIComponent(event_id)}&user_id=${encodeURIComponent(user_id)}`;

      xhttp.open("GET", url, true) // fetch

      xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
          if (xhttp.status === 200) {
            const response = JSON.parse(xhttp.responseText);
            console.log(response.message);
            if (localStorage.getItem(String(event_id)))
            evt.classList.add("d-none");
            window.location.reload();
          } else {
            const response = JSON.parse(xhttp.responseText);
            console.log(response.message)
            evt.classList.add("d-none");
            window.location.reload();
          }
        }
      }

      xhttp.send(); //send request
    })
  })

}

////////////////// get user events ///////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
const getUserEvents = () => {
  const user_id = JSON.parse(localStorage.getItem('user')).user_id;

  if (!user_id) {
    alert("User ID is required to fetch events.");
    return;
  }

  const xttp = new XMLHttpRequest();
  const url = `/get-user-events?userid=${encodeURIComponent(user_id)}`;
                        
  xttp.open("GET", url, true);
                        
  xttp.onreadystatechange = function () {
      
      if (xttp.readyState === 4) {
      if (xttp.status === 200) {
          const response = JSON.parse(xttp.responseText);
          // alert(`Response ${JSON.stringify(response.events)}`)
          console.log(`Response ${JSON.stringify(response.events)}`)
          console.log(response.events);
          if (response.success) {
          console.log("Events:", response.events);
          displayEvents(response.events); // Display events in the UI
          } else {
          console.log( "No events found.");
          }
      } else if (xttp.status === 400) {
          const response = JSON.parse(xttp.responseText);
          alert(response.error);
          console.log("Response error:", response.error);
      } else {
          console.log('unexpected error occured');
      }
      }
  };
                        
  xttp.send();
};


///////////////////////////////////////////////////////////////////
/////////////////////// DISPLAY EVENTS ///////////////////////////
///////////////////////////////////////////////////////////////////
const displayEvents = (events) => {
  // convert time to 12h format
  const formatTime = (t) => {
      const [hours, minutes, seconds] = t.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const standardHours = hours % 12 || 12;
      return `${standardHours}:${String(minutes).padStart(2, '0')} ${period}`;
  }

  // format date to MM-DD-YYYY
  const formatDate = (d) => {
      const date = new Date(d);
      // Extract the month, day, and year
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      // Format the date as MM-DD-YYYY
      return `${month}-${day}-${year}`;
  } 

  const eventTableBody = document.getElementById("dasboard-event-table-body");
  eventTableBody.innerHTML = ""; // Clear existing table rows

  events.forEach((event) => {
    const td =` <td>${event.event_name}</td>
                <td>${formatDate(event.event_date)}</td>
                <td>${formatTime(event.event_time)}</td>
                <td>${event.event_location}</td>
                <td>${event.event_capacity}</td>
                <td>
                   <div>
                      <i class="bi bi-pencil mx-2 pencilIcon" id="${event.event_id}"></i>
                      <i class="bi bi-trash trashIcon" id="${event.event_id}"></i>
                  </div>
                </td>`;

    eventTableBody.innerHTML += td;
  });

  //////////////////////////// DELETE EVENT ////////////////////////
  //////////////////////////////////////////////////////////////////
  const trashIcon = document.querySelectorAll('.trashIcon');

  trashIcon.forEach((icon) => {
      icon.addEventListener('click', () => {
          const event_id = icon.id;
          const xhttp = new XMLHttpRequest();
          const url = `/delete-event?event_id=${encodeURIComponent(event_id)}`;
      
          xhttp.open("DELETE", url, true);
          xhttp.onreadystatechange = function () {
          if (xhttp.readyState === 4) {
              if (xhttp.status === 200) {
              const response = JSON.parse(xhttp.responseText);
              console.log("Event deleted successfully!");
              console.log(response.message);
              window.location.reload();
              } else {
              const response = JSON.parse(xhttp.responseText);
              alert(response.message || "An error occurred.");
              console.error(response.message);
              }
          }
          };
          //send request to delte evebt
          xhttp.send();
      })
  }); // end of deletion function

    ///////////////////// EDIT EVENT ///////////////////////////
    ///////////////////////////////////////////////////////////
    const pencilIcon = document.querySelectorAll('.pencilIcon');

    pencilIcon.forEach((icon) => {
        icon.addEventListener('click', () => {
            const event_id = icon.id;
    
            // Make request to get event details
            const xhttp = new XMLHttpRequest();
            const url = `/get-event?event_id=${encodeURIComponent(event_id)}`;
            xhttp.open("GET", url, true);
    
            // Handle request and pre-fill fields with data from backend
            xhttp.onreadystatechange = function () {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200) {
                        const response = JSON.parse(xhttp.responseText);
                        const data = response.data;
                        document.getElementById('editEventAdmin').value = data[0].event_admin_id;
                        document.getElementById('editEventName').value = data[0].event_name;
                        document.getElementById('editEventDate').value = data[0].event_date.split('T')[0]; // Format date
                        document.getElementById('editEventTime').value = data[0].event_time; // Use SQL time format
                        document.getElementById('editEventLocation').value = data[0].event_location;
                        document.getElementById('editEventCapacity').value = data[0].event_capacity;
                    } else {
                        alert('Failed to fetch event details.');
                    }
                }
            };
            xhttp.send();
    
            // Open the edit event modal
            openEditEventModal();
    
            // Ensure the edit button has only one listener
            const editEventForm = document.getElementById('editEventForm');
            editEventForm.onsubmit = (event) => handleFormSubmit(event, event_id);
        });
    });
    
    // Function to handle form submission
    function handleFormSubmit(event, event_id) {
        event.preventDefault(); // Prevent default form submission
    
        const data = {
            event_id,
            event_admin_id: document.getElementById('editEventAdmin').value,
            event_name: document.getElementById('editEventName').value,
            event_date: document.getElementById('editEventDate').value,
            event_time: document.getElementById('editEventTime').value,
            event_location: document.getElementById('editEventLocation').value,
            event_capacity: document.getElementById('editEventCapacity').value,
        };
    
        // Send AJAX request to update event
        const xhttp = new XMLHttpRequest();
        xhttp.open('PUT', '/edit-event', true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
    
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200) {
                    alert('Event updated successfully!');
                    window.location.reload(); // Reload the page to reflect changes
                } else {
                    const response = JSON.parse(xhttp.responseText);
                    alert(`Error: ${response.message}`);
                }
            }
        };
    
        xhttp.send(JSON.stringify(data)); // Send data as JSON
    }    
};

  /////////////////////////////////////////////////////////////
// Call functions on page load
document.addEventListener("DOMContentLoaded", function() {
  getUserInfo();
  getUserEvents();
  getAllEvents();
});




////////////////////////////////////////////////////////////////////////////////////////
// Function to open the Create Event Modal
////////////////////////////////////////////////////////////////////////////////////////
function openCreateEventModal() {
  const modal = new bootstrap.Modal(document.getElementById("createEventModal"));
  modal.show();
}

////////////////////////////////////////////////////////////////////////////////////////
// Function to open the edit event moal
////////////////////////////////////////////////////////////////////////////////////////
function openEditEventModal() {
  const modal = new bootstrap.Modal(document.getElementById("editEventModal"));
  modal.show();
}

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

// Format time for SQL
function formatTime(timeString) {
  if (!timeString || typeof timeString !== "string") {
      throw new Error("Invalid time string");
  }

  // Extract the time and period (AM/PM)
  const [time, period] = timeString.trim().toUpperCase().split(/(AM|PM)/).filter(Boolean);

  if (!time || !period) {
      throw new Error("Time string must be in the format 'HH:MMAM' or 'HH:MMPM'");
  }

  let [hours, minutes] = time.split(":").map(Number);

  // Convert to 24-hour format
  if (period === "PM" && hours !== 12) {
      hours += 12;
  } else if (period === "AM" && hours === 12) {
      hours = 0;
  }

  // Pad hours and minutes with leading zeros if necessary
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:00`;
}


//// create events on event management dashboard
function createEvent(event) {
  event.preventDefault();

  // Collect event data from form
  const eventAdmin = document.getElementById("eventAdmin").value;
  const eventName = document.getElementById("eventName").value;
  const eventDate = formatDate(document.getElementById("eventDate").value);
  const eventTime = document.getElementById("eventTime").value;
  const eventLocation = document.getElementById("eventLocation").value;
  const eventCapacity = document.getElementById("eventCapacity").value;

  const xhttp = new XMLHttpRequest();
  const params = `name=${encodeURIComponent(eventName)}&date=${encodeURIComponent(eventDate)}&time=${encodeURIComponent(eventTime)}&location=${encodeURIComponent(eventLocation)}&capacity=${encodeURIComponent(eventCapacity)}&admin=${encodeURIComponent(eventAdmin)}`;
  xhttp.open("POST", "/create-event", true);
  xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  // Handle response
  xhttp.onreadystatechange = function () {
      if (xhttp.readyState === 4) { // Request finished
        if (xhttp.status === 200) {
          const response = JSON.parse(xhttp.responseText);
          if (response.success) {
              window.location.reload();
          } else {
            console.log('response error', response.error);
          }
        } else if (xhttp.status === 400) {
          const response = JSON.parse(xhttp.responseText);
          error.innerHTML = response.error || 'Invalid data submitted!';
          console.log('response error', response.error);
        } else {
          error.innerHTML = 'An unexpected error occurred.';
          console.log('An unexpected error occurred.');
        }
      }
    };
  xhttp.send(params);

  // Reset form and close modal
  document.getElementById("createEventForm").reset();
  const modal = bootstrap.Modal.getInstance(document.getElementById("createEventModal"));
  modal.hide();
  window.location.reload();
};

document.getElementById("CreateEventBtn").addEventListener("click", createEvent)


//////////////////////////////////////////////////////////////////
// sign out
//////////////////////////////////////////////////////////////////
document.querySelectorAll(".signout").forEach((btn) => {
  btn.addEventListener("click", function() {
      localStorage.removeItem("user");
      window.location.href = "../auth.html";
  });  
})


// show dialog for creating event when hover on the plus sign icon
const newEventLink = document.getElementById("squarePlusIcon");
const plus_icon = document.getElementById("plusIcon");

newEventLink.addEventListener("mouseover", function(){
    document.getElementById("plusIcon").classList.remove("d-none");
});

newEventLink.addEventListener("mouseout", function(){
    document.getElementById("plusIcon").classList.add("d-none");
});