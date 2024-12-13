const ctx = document.getElementById("myChart");
const canvas = document.getElementById("doughnutChart");

// Function to fetch user events
const userEvents = () => {
  const user_id = JSON.parse(localStorage.getItem("user")).user_id;

  const xttp = new XMLHttpRequest();
  const url = `/get-user-events?userid=${encodeURIComponent(user_id)}`;

  xttp.open("GET", url, true);

  xttp.onreadystatechange = function () {
    if (xttp.readyState === 4) {
      if (xttp.status === 200) {
        const response = JSON.parse(xttp.responseText);
        if (response.success) {
          console.log("Events:", response.events);
          displayBarChart(response.events); // Display bar chart
          displayDoughnutChart(response.events); // Display doughnut chart
          document.getElementById("total-events").innerText = response.events.length;
        } else {
          console.log("No events found.");
        }
      } else if (xttp.status === 400) {
        const response = JSON.parse(xttp.responseText);
        alert(response.error);
        console.log("Response error:", response.error);
      } else {
        console.log("Unexpected error occurred");
      }
    }
  };

  xttp.send();
};

// Function to display the bar chart
const displayBarChart = (events) => {
  const labels = events.map((event) => event.event_name);
  const data = events.map((event) => event.attendee_count);

  const barChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "# of Attendees",
          data: data,
          borderWidth: 1,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

// Function to display the doughnut chart
const displayDoughnutChart = (events) => {
  const doughnutChart = new Chart(canvas, {
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
  });

  events.forEach((event) => {
    const id = event.event_id;
    const xhttp = new XMLHttpRequest();
    const url = `/attendees?event_id=${encodeURIComponent(id)}`;

    xhttp.open("GET", url, true);

    xhttp.onreadystatechange = function () {
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        const attendees = JSON.parse(xhttp.responseText).data;
        // alert(`attendees ${JSON.stringify(attendees)}`)
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

      }
    };
    xhttp.send();

  });

};
// Call functions on page load
document.addEventListener("DOMContentLoaded", function () {
  userEvents();
});
