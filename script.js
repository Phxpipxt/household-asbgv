document.addEventListener("DOMContentLoaded", function () {
  // Extract the household ID from the URL
  const householdId = window.location.pathname.split("/").pop(); 

  clearStudentAndParentData();
  fetchStudentAndParentData(householdId);
});

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
  const apiEndpoint = `https://household-asbgv.replit.app/${householdId}`;

  fetch(apiEndpoint)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      const studentData = data.find(
        (row) => row["HOUSEHOLD ID"] === householdId
      );
      const siblings = data.filter(
        (row) =>
          row["HOUSEHOLD ID"] === householdId &&
          row["ASB ID#"] !== studentData["ASB ID#"]
      );

      if (studentData) {
        document.getElementById("student-id").textContent =
          studentData["ASB ID#"];
        document.getElementById(
          "student-name"
        ).textContent = `${studentData["FIRST NAME"]} ${studentData["LAST NAME"]}`;
        document.getElementById("student-nickname").textContent =
          studentData["NICKNAME"];
        document.getElementById("father-name").textContent =
          studentData["Father's Name"];
        document.getElementById("mother-name").textContent =
          studentData["Mother's Name"];
        document.getElementById("guardian-name").textContent =
          studentData["Guardian's Name"];
        document.getElementById("student-id").dataset.hid =
          studentData["HOUSEHOLD ID"];

        const studentPhoto = document.querySelector(".student-photo");
        studentPhoto.src = `/images/FamilyDB/Students/${studentData["ASB ID#"]}.JPG`;
        studentPhoto.onerror = () => {
          if (!studentPhoto.src.includes("/images/placeholder.jpg")) {
            studentPhoto.src = "/images/placeholder.jpg";
          }
        };

        const fatherPhoto = document.querySelector(".parent-photo-father");
        const motherPhoto = document.querySelector(".parent-photo-mother");
        const guardianPhoto = document.querySelector(".guardian-photo");
        const parentInfo = document.querySelector(".parent-info");
        let parentCount = 0;

        if (studentData["Father's Name"]) {
          fatherPhoto.src = `/images/FamilyDB/Parents/${studentData["ASB ID#"]}_f.jpg`;
          fatherPhoto.style.display = "block";
          fatherPhoto.onerror = () => {
            if (!fatherPhoto.src.includes("/images/placeholder.jpg")) {
              fatherPhoto.style.display = "none";
            }
          };
          parentCount++;
        } else {
          fatherPhoto.style.display = "none";
        }

        if (studentData["Mother's Name"]) {
          motherPhoto.src = `/images/FamilyDB/Parents/${studentData["ASB ID#"]}_m.jpg`;
          motherPhoto.style.display = "block";
          motherPhoto.onerror = () => {
            if (!motherPhoto.src.includes("/images/placeholder.jpg")) {
              motherPhoto.style.display = "none";
            }
          };
          parentCount++;
        } else {
          motherPhoto.style.display = "none";
        }

        if (studentData["Guardian's Name"]) {
          guardianPhoto.src = `/images/FamilyDB/Guardians/${studentData["HOUSEHOLD ID"]}_g.jpg`;
          guardianPhoto.style.display = "block";
          guardianPhoto.onerror = () => {
            if (!guardianPhoto.src.includes("/images/placeholder.jpg")) {
              guardianPhoto.style.display = "none";
            }
          };
          parentCount++;
        } else {
          guardianPhoto.style.display = "none";
        }

        if (parentCount === 1) {
          parentInfo.style.justifyContent = "center";
        }

        displaySiblings(siblings);
      } else {
        console.error("Student data not found for Household ID:", householdId);
      }
    })
    .catch((error) => console.error("Error fetching student data:", error));
}

function displaySiblings(siblingData) {
  const siblingDetailsContainer = document.getElementById("sibling-details");
  siblingDetailsContainer.innerHTML = "";

  siblingData.forEach((sibling) => {
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
