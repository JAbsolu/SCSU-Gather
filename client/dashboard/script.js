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
          console.log("User info:", user);
          document.getElementById("userName").innerHTML = ` <h4>${user.firstname} ${user.lastname}</h4>
                                                            <p>${user.email_address} <br> ${user.user_type}</p>`;
          document.getElementById("eventAdmin").value = `${user.user_id}`;
        } else if (xttp.status === 401) {
          console.log("Not authenticated.");
          window.location.href = "client/auth.html"; // Redirect to login page
        }
      }
    };
    xttp.send();
}


///////////////////////////////////////////////////////////////////
///////////////////// get event attendees ////////////////////////
/////////////////////////////////////////////////////////////////

const getEventAttendees = (event_id) => {
    const xhttp = new XMLHttpRequest();
    const url = `/attendees?event_id=${event_id}`;
    xhttp.open("GET", url, true);

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                const response = JSON.parse(xhttp.responseText);
                // alert(`Event attendee res ${response.data.length}`);
            } else {
                console.log("Error, status", xhttp.status);
            }
        }
    }
    xhttp.send();
}


///////////////////////////////////////////////////////////////////
///////////// get user events
///////////////////////////////////////////////////////////////////
const getUserEvents = () => {
    const user_id = JSON.parse(localStorage.getItem('user')).user_id
  
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

            if (response.success) {
            displayEvents(response.events); // Display events in the UI
            document.getElementById('total-events').innerText = response.events.length;

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
    const convertTime = (t) => {
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

    const eventTableBody = document.getElementById("event-list");
    eventTableBody.innerHTML = ""; // Clear existing table rows

    events.forEach((event) => {
      const card = `
        <div class="card mt-1" class="${event.event_id}">
            <div class="card-header bg-light">
                <h5 class='text-dark fw-bold mb-0'>${event.event_name}</h5>
                <input type='text' value='${event.event_id}' id="eventId" disabled hidden>
            </div>
            <div class="card-body">
                <div class='d-flex flex-row justify-content-between'>
                    <div>
                    <p>Date: ${formatDate(event.event_date)}</p>
                    <p>Location: ${event.event_location}</p>
                    </div>
                    <div>
                    <p>Time: ${convertTime(event.event_time)}</p>
                    <p>Capacity: ${event.event_capacity}</p>
                    <p>Guests: ${event.attendee_count}</p>
                    </div>
                </div>
                <div class='d-flex flex-row justify-content-between align-items-end'>
                    <a href="#" class="btn btn-primary analyctics" id="analyctic${event.event_id}">Analyctics</a>
                    <div>
                        <i class="bi bi-pencil mx-2 pencilIcon" id="${event.event_id}"></i>
                        <i class="bi bi-trash trashIcon" id="${event.event_id}"></i>
                    </div>
                </div>
            </div>
        </div>
      `;

    eventTableBody.innerHTML += card;
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
                        console.log('Failed to fetch event details.');
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
                    console.log('Event updated successfully!');
                    window.location.reload(); // Reload the page to reflect changes
                } else {
                    const response = JSON.parse(xhttp.responseText);
                    alert(`Error: ${response.message}`);
                }
            }
        };
    
        xhttp.send(JSON.stringify(data)); // Send data as JSON
    }    

    // get specifc event analyctics
    const analycticsBtns = document.querySelectorAll(".analyctics"); // get the analyctics 

    // generate analyctics
    analycticsBtns.forEach((btn) => {
        btn.addEventListener("click", function() {
            const event_id = btn.id.replace("analyctic", "");
            
            const xhttp = new XMLHttpRequest();
            const url = `/attendees?event_id=${encodeURIComponent(event_id)}`;

            xhttp.open("GET", url, true);

            xhttp.onreadystatechange = function () {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200) {
                        const eventAttendees = JSON.parse(xhttp.responseText).data;
                        // alert(JSON.stringify(eventAttendees))
                        displayDoughnutChart(eventAttendees);
                    }
                }
            }

            xhttp.send()
        })
    })

    const canvas = document.getElementById("doughnutChart"); // get the canvas for the chart
    const canvas2 = document.getElementById("doughnutChart2"); // get the canvas for the chart
    let doughnutChart;

    // Function to display the doughnut chart
    const displayDoughnutChart = (attendees) => {
        canvas.classList.add("d-none");
        canvas2.classList.remove("d-none");
        canvas2.classList.add("d-block");

        if (doughnutChart) doughnutChart.destroy();
        
        doughnutChart = new Chart(canvas2, {
        type: "doughnut",
        data: {
            labels: ["Student", "Staff", "Faculty"],
            datasets: [
            {
                label: "Event Analytics",
                data: [0, 0, 0],
                backgroundColor: [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
                "rgb(255, 205, 86)",
                ],
                hoverOffset: 4,
            },
            ],
        },
        })

        attendees.forEach((attendee) => {
            if (attendee.user_type.toLowerCase() === "student") {
              doughnutChart.data.datasets[0].data[0]++;
            } else if (attendee.user_type.toLowerCase() === "staff") {
              doughnutChart.data.datasets[0].data[1]++;
            } else if (attendee.user_type.toLowerCase() === "faculty") {
              doughnutChart.data.datasets[0].data[2]++;
            }
        });
        doughnutChart.update(); // Update the chart with new data
    } // end of display doughnut chart
    
};

  /////////////////////////////////////////////////////////////
// Call functions on page load
document.addEventListener("DOMContentLoaded", function() {
    getUserInfo();
    getUserEvents();
    getEventAttendees(8)
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

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////// Format date to SQL-friendly format (YYYY-MM-DD) /////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

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
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

// Function to add event to the list
// document.getElementById("CreateEventBtn").addEventListener("click", function(event) 
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

// show dialog for creating event when hover on the plus sign icon
const newEventLink = document.getElementById("squarePlusIcon");
const plus_icon = document.getElementById("plusIcon");

newEventLink.addEventListener("mouseover", function(){
    document.getElementById("plusIcon").classList.remove("d-none");
});

newEventLink.addEventListener("mouseout", function(){
    document.getElementById("plusIcon").classList.add("d-none");
});

