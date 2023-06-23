
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1ITe0x0UhM_HGknrVRW08dRau9vLBY4M",
  authDomain: "auction-website-2e890.firebaseapp.com",
  databaseURL: "https://auction-website-2e890-default-rtdb.firebaseio.com/",
  projectId: "auction-website-2e890",
  storageBucket: "auction-website-2e890.appspot.com",
  messagingSenderId: "828406663883",
  appId: "1:828406663883:web:334e550bf253a01386694e"
};

// Initialize Firebase
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Auth and Database
const auth = firebase.auth();
const database = firebase.database();

// Set up our register function
function register() {
    console.log('register clicked');
    // Get all our input fields
    const full_name = document.getElementById('register_full_name').value;
    const email = document.getElementById('register_email').value;
    const password = document.getElementById('register_password').value;
    // Validate input fields
    if (validate_email(email) === false || validate_password(password) === false) {
      alert('Email or Password is Outta Line!!');
      return;
      // Don't continue running the code
    }
    if (validate_field(full_name) === false) {
      alert('One or More Fields not filled!!');
      return;
    }
  
    // Move on with Auth
    auth.createUserWithEmailAndPassword(email, password)
      .then(function () {
        // Declare user variable
        const user = auth.currentUser;
  
        // Add this user to Firebase Database
        const database_ref = database.ref();
  
        // Create User data
        const user_data = {
          email: email,
          full_name: full_name,
          last_login: Date.now(),
        };
  
        // Push to Firebase Database
        database_ref.child('users/' + user.uid).set(user_data);
  
        // Done
        alert('User Created!!');
        window.location.href = 'index.html';
      })
      .catch(function (error) {
        // Firebase will use this to alert of its errors
        const error_code = error.code;
        const error_message = error.message;
  
        alert(error_message);
      });
  }
  // Set up our login function
  function login () {
    // Get all our input fields
    email = document.getElementById('email').value
    password = document.getElementById('password').value
  
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
      alert('Email or Password is Outta Line!!')
      return
      // Don't continue running the code
    }
  
    auth.signInWithEmailAndPassword(email, password)
    .then(function() {
      // Declare user variable
      var user = auth.currentUser
  
      // Add this user to Firebase Database
      var database_ref = database.ref()
  
      // Create User data
      var user_data = {
        last_login : Date.now()
      }
  
      // Push to Firebase Database
      database_ref.child('users/' + user.uid).update(user_data)
      // DOne
      alert('User Logged In!!')
      window.location.href = 'index.html';

  
    })
    .catch(function(error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code
      var error_message = error.message
  
      alert(error_message)
    })
  }
  
  
// Set up the onAuthStateChanged event listener
auth.onAuthStateChanged(function(user) {
    if (user && display_name != null) {
      // User is logged in
      var usernameDisplay = document.getElementById('username-display');
      if (usernameDisplay) {
        usernameDisplay.textContent = user.displayName;
      }
  
      // Show the logout button and hide the signup button
      var authButton = document.getElementById('auth-button');
      if (authButton) {
        authButton.textContent = 'Logout';
        authButton.addEventListener('click', function() {
          auth.signOut();
        });
      }
    } else {
      // User is logged out
      var usernameDisplay = document.getElementById('username-display');
      if (usernameDisplay) {
        usernameDisplay.textContent = '';
      }
  
      // Show the signup button and hide the logout button
      var authButton = document.getElementById('auth-button');
      if (authButton) {
        authButton.textContent = 'Sign up';
        authButton.removeEventListener('click', function() {
          auth.signOut();
        });
      }
    }
  });
  
  
// Function to toggle between login and register forms
function toggleForm() {
    const loginForm = document.getElementById('login_form');
    const registerForm = document.getElementById('register_form');
    const loginBtn = document.getElementById('login_btn');
    const registerBtn = document.getElementById('register_btn');
  
    if (loginForm.style.display === 'none') {
      // Show login form, hide register form
      loginForm.style.display = 'block';
      registerForm.style.display = 'none';
      loginBtn.style.display = 'none';
      registerBtn.style.display = 'block';
    } else {
      // Show register form, hide login form
      loginForm.style.display = 'none';
      registerForm.style.display = 'block';
      loginBtn.style.display = 'block';
      registerBtn.style.display = 'none';
    }
  }

  
  // Validate Functions
  function validate_email(email) {
    expression = /^[^@]+@\w+(\.\w+)+\w$/
    if (expression.test(email) == true) {
      // Email is good
      return true
    } else {
      // Email is not good
      return false
    }
  }
  
  function validate_password(password) {
    // Firebase only accepts lengths greater than 6
    if (password < 6) {
      return false
    } else {
      return true
    }
  }
  
  function validate_field(field) {
    if (field == null) {
      return false
    }
  
    if (field.length <= 0) {
      return false
    } else {
      return true
    }
  }