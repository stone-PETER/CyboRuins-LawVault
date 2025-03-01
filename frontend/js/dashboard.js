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
    }document.addEventListener("DOMContentLoaded", function () {
        checkUserRole(); // Ensure access control
    
        // Detect which dashboard is open
        const pageTitle = document.querySelector("header h1").textContent;
        
        if (pageTitle.includes("Civilian")) {
            setupCivilianDashboard();
        } else if (pageTitle.includes("Officials")) {
            setupOfficialsDashboard();
        }
    });
    
    /* ---------------- Access Control ---------------- */
    function checkUserRole() {
        const userRole = localStorage.getItem("userRole"); // Example storage (Can be session-based)
    
        if (!userRole || (window.location.pathname.includes("official") && userRole !== "official")) {
            alert("Access Denied. Please log in as an authorized user.");
            window.location.href = "login.html"; // Redirect to login
        }
    }
    
    /* ---------------- Civilian Dashboard Functions ---------------- */
    function setupCivilianDashboard() {
        document.querySelector("button[onclick='uploadEvidence()']")?.addEventListener("click", uploadEvidence);
        document.querySelector("button[onclick='viewCaseStatements()']")?.addEventListener("click", viewCaseStatements);
    }
    
    function submitCase() {
        alert("Submit case functionality coming soon!");
    }
    
    function trackCase() {
        alert("Track case functionality coming soon!");
    }
    
    function uploadEvidence() {
        alert("Upload evidence for scrutiny coming soon!");
    }
    
    function viewCaseStatements() {
        document.getElementById("case-statements").classList.toggle("hidden");
    }
    
    /* ---------------- Officials Dashboard Functions ---------------- */
    function setupOfficialsDashboard() {
        document.querySelector("button[onclick='fileFIR()']").addEventListener("click", fileFIR);
        document.querySelector("button[onclick='reviewEvidence()']").addEventListener("click", reviewEvidence);
        document.querySelector("button[onclick='addDesignationDetails()']").addEventListener("click", addDesignationDetails);
    }
    
    function fileFIR() {
        alert("Filing FIR functionality coming soon!");
    }
    
    function reviewEvidence() {
        alert("Review evidence functionality coming soon!");
    }
    
    function addDesignationDetails() {
        alert("Add designation details functionality coming soon!");
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

