document.addEventListener("DOMContentLoaded", function () {
  const householdId = getHouseholdIdFromURL(); // Automatically get householdId from URL
  clearStudentAndParentData();
  fetchStudentAndParentData(householdId);
});

function getHouseholdIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('householdId') || 'San0014'; // Default to 'San0014' if not provided
}

function clearStudentAndParentData() {
  const textFields = [
    "student-id",
    "student-name",
    "student-lastname",
    "student-nickname",
    "father-name",
    "mother-name",
    "guardian-name"
  ];

  const imageFields = [
    ".student-photo",
    ".parent-photo-father",
    ".parent-photo-mother",
    ".guardian-photo"
  ];

  textFields.forEach(id => {
    const element = document.getElementById(id);
    if (element) element.textContent = "";
  });

  imageFields.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) element.src = "";
  });
}

function fetchStudentAndParentData(householdId) {
  // Use a CORS proxy. Remove this in production and set up proper CORS headers on your server.
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const apiEndpoint = `${proxyUrl}https://household-asbgv.replit.app/${householdId}`;

  fetch(apiEndpoint)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      if (data && data.length > 0) {
        const studentData = data.find(row => row["HOUSEHOLD ID"] === householdId);
        const siblings = data.filter(row => row["HOUSEHOLD ID"] === householdId && row["ASB ID#"] !== studentData["ASB ID#"]);

        if (studentData) {
          updateStudentAndParentData(studentData);
          displaySiblings(siblings);
        } else {
          console.error("Student data not found for Household ID:", householdId);
        }
      } else {
        console.error("No data returned from the API");
      }
    })
    .catch(error => console.error("Error fetching student data:", error));
}

function updateStudentAndParentData(studentData) {
  document.getElementById("student-id").textContent = studentData["ASB ID#"];
  document.getElementById("student-name").textContent = `${studentData["FIRST NAME"]} ${studentData["LAST NAME"]}`;
  document.getElementById("student-nickname").textContent = studentData["NICKNAME"];
  document.getElementById("father-name").textContent = studentData["Father's Name"];
  document.getElementById("mother-name").textContent = studentData["Mother's Name"];
  document.getElementById("guardian-name").textContent = studentData["Guardian's Name"];
  document.getElementById("student-id").dataset.hid = studentData["HOUSEHOLD ID"];

  updatePhoto(".student-photo", `/images/FamilyDB/Students/${studentData["ASB ID#"]}.JPG`);
  updatePhoto(".parent-photo-father", `/images/FamilyDB/Parents/${studentData["ASB ID#"]}_f.jpg`, studentData["Father's Name"]);
  updatePhoto(".parent-photo-mother", `/images/FamilyDB/Parents/${studentData["ASB ID#"]}_m.jpg`, studentData["Mother's Name"]);
  updatePhoto(".guardian-photo", `/images/FamilyDB/Guardians/${studentData["HOUSEHOLD ID"]}_g.jpg`, studentData["Guardian's Name"]);
}

function updatePhoto(selector, src, displayCondition = true) {
  const photoElement = document.querySelector(selector);
  if (displayCondition) {
    photoElement.src = src;
    photoElement.style.display = "block";
    photoElement.onerror = () => {
      if (!photoElement.src.includes("/images/placeholder.jpg")) {
        photoElement.style.display = "none";
      }
    };
  } else {
    photoElement.style.display = "none";
  }
}

function displaySiblings(siblingData) {
  const siblingDetailsContainer = document.getElementById("sibling-details");
  siblingDetailsContainer.innerHTML = "";

  siblingData.forEach(sibling => {
    const siblingDiv = document.createElement("div");
    siblingDiv.className = "sibling";
    siblingDiv.innerHTML = `
      <img src="/images/FamilyDB/Students/${sibling["ASB ID#"]}.JPG" alt="Sibling Photo" class="mx-auto w-36 h-44 object-cover rounded-lg sibling-photo mb-2">
      <p>${sibling["NICKNAME"]}</p>
      <p>${sibling["FIRST NAME"]} ${sibling["LAST NAME"]}</p>
      <p>Student ID: ${sibling["ASB ID#"]}</p>
    `;
    const siblingPhoto = siblingDiv.querySelector("img");
    siblingPhoto.onerror = () => {
      if (!siblingPhoto.src.includes("/images/placeholder.jpg")) {
        siblingPhoto.src = "/images/placeholder.jpg";
      }
    };
    siblingDetailsContainer.appendChild(siblingDiv);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const currentYearElement = document.getElementById("current-year");
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }
});
