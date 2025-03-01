<button onclick="logout()">Logout</button>

document.addEventListener("DOMContentLoaded", () => {
    checkAuthentication();
    document.getElementById("designation-form").addEventListener("submit", saveDesignation);
});

function checkAuthentication() {
    const userRole = localStorage.getItem("userRole"); // Example role-based authentication
    if (!userRole || (userRole !== "police" && userRole !== "court")) {
        alert("Access Denied! Officials only.");
        window.location.href = "login.html";
    }
}

function saveDesignation(event) {
    event.preventDefault();
    const designation = document.getElementById("designation").value;
    if (designation) {
        localStorage.setItem("designation", designation);
        alert("Designation saved successfully!");
    }
}

function fileFIR() {
    alert("FIR filing functionality coming soon!");
}

function uploadPoliceEvidence() {
    alert("Police evidence upload feature coming soon!");
}

function addCaseStatement() {
    alert("Case statement addition coming soon!");
}

function uploadCourtEvidence() {
    alert("Court evidence upload feature coming soon!");
}

function logout() {
    localStorage.removeItem("userRole");
    window.location.href = "login.html";
}

