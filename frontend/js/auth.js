document.getElementById("google-login-btn").addEventListener("click", googleLogin);

function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    firebase.auth().signInWithPopup(provider)
        .then(result => {
            const user = result.user;
            console.log("User signed in:", user);
            
            // Check user role (example logic)
            if (user.email.includes("@gov.com")) {
                window.location.href = "dashboard-officials.html";
            } else {
                window.location.href = "dashboard-civilians.html";
            }
        })
        .catch(error => {
            console.error("Error during Google Sign-In:", error);
        });
}

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "login.html";
    }).catch(error => {
        console.error("Error logging out:", error);
    });
}

