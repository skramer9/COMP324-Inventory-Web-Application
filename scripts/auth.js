document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");
  
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Successful login
        alert("Login successful!");
        window.location.href = "main.html"; // Redirect
      })
      .catch((error) => {
        errorMessage.textContent = error.message;
      });
  });
  