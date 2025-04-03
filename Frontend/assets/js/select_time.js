// Retrieve stored details from localStorage
let shpname = JSON.parse(localStorage.getItem("shopDetails"));
let past_data = JSON.parse(localStorage.getItem("upcoming"));
let cu_email = localStorage.getItem("email");
console.log("past", past_data);

// Set shop image, name, and location on the page
let simage = document.getElementById("ad1");
simage.style.width = "150px";
simage.style.marginTop = "10px";
simage.src = shpname["image"];

let sname = document.getElementById("ad2");
sname.innerText = shpname["name"];

let sadd = document.getElementById("ad3");
sadd.innerText = shpname["location"];

// Set total amount on the page
let total = document.getElementById("total");
let totalamount = JSON.parse(localStorage.getItem("totalamount"));
total.innerText = `Rs. ${totalamount}.00/-`;

// Get the date picker and time slot container elements
const startdate = document.getElementById("startDate");
let selecttime = document.getElementById("sltime");
let choosedate = document.getElementById("choose");

/**
 * Function to send booking details to backend.
 * @param {Object} orderData - The order data to be sent.
 */
async function sentMail(orderData) {
  try {
    // First endpoint to book appointment
    let res1 = await fetch("https://saloon-booking-project-backend.onrender.com/book/appo", {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: localStorage.getItem("token")
      },
      body: JSON.stringify(orderData)
    });

    // Second endpoint to store booking data locally on the backend
    let res2 = await fetch("https://saloon-booking-project-backend.onrender.com/addDataToBackend/add", {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: localStorage.getItem("token")
      },
      body: JSON.stringify({
        ...orderData,
        name: shpname.name,
        location: shpname.location,
        image: shpname.image
      })
    });

    if (res1.ok && res2.ok) {
      alert("Appointment booked successfully!");
      // Redirect to confirmation page after a delay
      setTimeout(() => {
        window.location.href = "./confirmation_page.html";
      }, 2000);
    } else {
      throw new Error("Failed to save appointment");
    }
  } catch (error) {
    alert("Something went wrong: " + error.message);
    console.log(error);
  }
}

/**
 * Append available time slots to the page.
 * @param {Array} data - Array of available times.
 */
let append = (data) => {
  data.forEach((el) => {
    // Create a container for each time slot
    let div1 = document.createElement("div");
    div1.setAttribute("id", "timelist");

    let time = document.createElement("h4");
    time.setAttribute("id", "selectedtime");
    time.innerText = `${el}`;

    // When a time slot is clicked
    div1.addEventListener("click", () => {
      // Validate that a date has been selected
      if (startdate.value === "") {
        choosedate.style.color = "#D50000";
        choosedate.style.textShadow = "1px 1px black";
        choosedate.innerText = "\u{26A0} Please Select The Date";
        return;
      } else {
        console.log("Date selected:", startdate.value);
        choosedate.style.color = "#00C853";
        choosedate.style.textShadow = "1px 1px black";
        choosedate.innerText = "\u{2713} Awesome";

        // Update the order data with the chosen time, date, and other details
        past_data["time"] = el;
        past_data["date"] = startdate.value;
        past_data["email"] = cu_email;
        past_data["salon"] = shpname;

        // Save the updated order data to localStorage
        localStorage.setItem("orderData", JSON.stringify(past_data));
        localStorage.setItem("pastdata", JSON.stringify(past_data));

        // Call sentMail to trigger the booking process
        sentMail(past_data);
      }
    });

    // Append the time element to the div and the div to the time slot container
    div1.append(time);
    selecttime.append(div1);
  });
};

// Retrieve available time slots from shopDetails stored in localStorage
let data = JSON.parse(localStorage.getItem("shopDetails"));
let res = data["availableTime"];
append(res);
