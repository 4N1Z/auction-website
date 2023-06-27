import { auth, db } from "./firebase.js";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import {
  signInAnonymously,
  onAuthStateChanged,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";

// -- Sign up modal and logic --
const adminButton = document.getElementById("admin-button");
const authButton = document.getElementById("auth-button");
const signUpModal = document.getElementById("login-modal");
const signUpModalObject = new bootstrap.Modal(signUpModal);
const signUpModalInput = signUpModal.querySelector("input");
const signUpModalSubmit = signUpModal.querySelector(".btn-primary");


// -- Login modal and logic --
const loginModal = document.getElementById("login-modal");
const loginModalObject = new bootstrap.Modal(loginModal);
const loginModalInput = loginModal.querySelector("input");
const loginModalPasswordInput = loginModal.querySelector("#password-input");
const loginModalSubmit = loginModal.querySelector(".btn-primary");

// Get the dropdown items
const dropdownItems = document.querySelectorAll(".dropdown-item");

// Attach click event listener to each dropdown item
dropdownItems.forEach((item) => {
  item.addEventListener("click", () => {
    // Get the text of the clicked dropdown item
    const location = item.innerText;
    
    // Display an alert with the selected location
    alert("Selected Location: " + location);
  });
});
export function handleClickForLocation(event) {
  var location = event.target.innerHTML;
  localStorage.setItem("location", location);
  window.location.reload();
}
// Function called from index.html which creates anonymous account for user (or signs in if it already exists)
// export function autoSignIn() {
//   onAuthStateChanged(auth, (user) => {
//     if (user && user.displayName != null) {
//       // If user has an anonymous account and a displayName, treat them as signed in
//       const authButton = document.getElementById("auth-button");
//       if (authButton) {
//         authButton.innerText = "Logout";
//         document.getElementById("username-display").innerText =
//           "Hi " + user.displayName;
//           console.log(user.displayName);
//       }

//       // If user is admin, display the admin button
//       getDoc(doc(db, "users", user.uid)).then((user) => {
//         if ("admin" in user.data()) {
//           const adminButton = document.getElementById("admin-button");
//           if (adminButton) {
//             adminButton.style.display = "inline-block";
//           }
//         }
//       });
//     } else {
//       // Automatically create an anonymous account if user doesn't have one
//       signInAnonymously(auth);
//     }
//   });
// }

export function autoSignIn() {
  const authButton = document.getElementById("auth-button");
  const usernameDisplay = document.getElementById("username-display");
  const logoutButton = document.getElementById("logout-btn");
  console.log(usernameDisplay)

  onAuthStateChanged(auth, (user) => {

    
    const adminButton = document.getElementById("admin-button");
    if (adminButton) {
      adminButton.style.display = "inline-block";
    }
 
  
    if (user.displayName == null) {
      authButton.innerText = "Enter name";
      alert("Name not entered ! Enter again");

      // authButton.innerText = "Sign out";
  
    } else {
      // User is not signed in, change button text to "Sign up"
      // usernameDisplay.innerText = "";
      authButton.innerText = "sign out ";
      if (authButton.innerText.length!=0){
        // usernameDisplay.innerText = "";
        usernameDisplay.innerText = "Hi " + user.displayName;
  
          
        }
  
      return;
    }
  });

  // Add click event listener to the button
  authButton.addEventListener("click", () => {
    const user = auth.currentUser;
    if (user) {
      // User is signed in, sign out and redirect to login.js
      signOut(auth)
        .then(() => {
          window.location.href = "login.html";
        })
        .catch((error) => {
          console.log("Sign out error:", error);
        });
    } else {
      // User is not signed in, redirect to login.js
      window.location.href = "login.html";
    }
  });
}


// Function to show the login modal
function showLoginModal() {
  loginModalInput.value = "";
  loginModalPasswordInput.value = "";
  loginModalObject.show();
}

// Focus the username input once loginModal is visible
loginModal.addEventListener("shown.bs.modal", () => {
  loginModalInput.focus();
});



// Show the login modal when the "Sign in" button is clicked
authButton.addEventListener("click", () => {
  if (authButton.innerText == "Sign out") {
    // Doesn't actually sign out, just gives the user the option to rename their account
    authButton.innerText = "Sign in";
    document.getElementById("username-display").innerText = "";
  } else {
    showLoginModal();
  }
});

// Login can be triggered either by clicking the submit button or by pressing enter
loginModalSubmit.addEventListener("click", () => {
  login();
});
loginModalInput.addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    login();
  }
});

// Function that handles login logic
function login() {
  let username = loginModalInput.value;
  let password = loginModalPasswordInput.value;

  // Perform necessary login actions, such as checking the username and password in the database

  // If login is successful, update the UI and close the login modal
  authButton.innerText = "Sign out";
  document.getElementById("username-display").innerText = "Hi " + username;
  loginModalObject.hide();
}


// Only shows signUpModal if the user is not signed in. Otherwise, it pretends to sign out
authButton.addEventListener("click", () => {
  if (authButton.innerText == "Sign out") {
    // Doesn't actually sign out, just gives the user the option to rename their account
    authButton.innerText = "Sign in";
    document.getElementById("username-display").innerText = "";
  } else {
    signUpModalInput.value = "";
    signUpModalObject.show();
  }
});

// Focus the username input once signUpModal is visible
signUpModal.addEventListener("shown.bs.modal", () => {
  signUpModalInput.focus();
});

// Sign up can be triggered either by clicking the submit button or by pressing enter
signUpModalSubmit.addEventListener("click", () => {
  signUp();
});
signUpModalInput.addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    signUp();
  }
});

// Function that handles sign up logic
function signUp() {
  let username = signUpModalInput;
  // let password = passwordInput.value;

  let user = auth.currentUser;

  // setDoc(doc(db, "users", user.uid), { name: username, password: password });

  // let user = auth.currentUser;
  // updateProfile(user, { displayName: username });

  updateProfile(user, { displayName: username.value });
  setDoc(doc(db, "users", user.uid), { name: username.value, admin: false});
  console.debug("signUp() write to users/${auth.currentUser.uid}");

  authButton.innerText = "Sign out";
  document.getElementById("username-display").innerText =
    "Hi " + username.value;
  username.classList.add("is-valid");

  setTimeout(() => {
    signUpModalObject.hide();
    username.classList.remove("is-valid");
  }, 1000);
}

// --Bidding modal and logic --
const bidModal = document.getElementById("bid-modal");
if (bidModal) {
  const bidModalObject = new bootstrap.Modal(bidModal);
  const bidModalTitle = bidModal.querySelector("strong");
  const bidModalInput = bidModal.querySelector("input");
  const bidModalSubmit = bidModal.querySelector(".btn-primary");

  // Populate bidModal with the correct information before it is visible
  bidModal.addEventListener("show.bs.modal", (event) => {
    const button = event.relatedTarget;
    const card =
      button.closest(".card") ||
      document.getElementById(bidModal.dataset.activeAuction);
    bidModalTitle.innerText = card.dataset.title;
    bidModal.dataset.activeAuction = card.dataset.id;
  });

  // Focus the amount input once bidModal is visible
  bidModal.addEventListener("shown.bs.modal", () => {
    // If not logged in, open signUpModal instead
    if (authButton.innerText == "Sign in") {
      bidModalObject.hide();
      signUpModalObject.show();
    } else {
      bidModalInput.focus();
    }
  });

  // Once bidModal is no longer visible, clear the auction specific information
  bidModal.addEventListener("hidden.bs.modal", () => {
    bidModalInput.value = "";
    bidModalInput.classList.remove("is-invalid");
    bidModal.removeAttribute("data-active-auction");
  });

  // A bid can be triggered either by clicking the submit button or by pressing enter
  bidModalSubmit.addEventListener("click", () => {
    placeBid();
  });
  bidModalInput.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
      placeBid();
    }
  });

  // Function that handles bidding logic
  function placeBid() {
    let nowTime = new Date().getTime();
    bidModalSubmit.setAttribute("disabled", ""); // disable the button while we check
    let i = Number(bidModal.dataset.activeAuction.match("[0-9]+"));
    let endTime = document.querySelector(`.card[data-id="${i}"]`).dataset
      .endTime;
    let feedback = bidModal.querySelector(".invalid-feedback");
    // Cleanse input
    let amountElement = bidModal.querySelector("input");
    let amount = Number(amountElement.value);
    if (endTime - nowTime < 0) {
      feedback.innerText = "The auction is already over!";
      amountElement.classList.add("is-invalid");
      setTimeout(() => {
        bidModalObject.hide();
        amountElement.classList.remove("is-invalid");
        bidModalSubmit.removeAttribute("disabled", "");
      }, 1000);
    } else if (amount == 0) {
      // amount was empty
      feedback.innerText = "Please specify an amount!";
      amountElement.classList.add("is-invalid");
      bidModalSubmit.removeAttribute("disabled", "");
    } else if (!/^-?\d*\.?\d{0,2}$/.test(amount)) {
      // field is does not contain money
      feedback.innerText = "Please specify a valid amount!";
      amountElement.classList.add("is-invalid");
      bidModalSubmit.removeAttribute("disabled", "");
    } else {
      // Check auction database
      let docRef = doc(db, "auction", "items");
      getDoc(docRef).then(function (doc) {
        console.debug("placeBid() read from auction/items");
        let data = doc.data();
        let itemId = `item${i.toString().padStart(5, "0")}`;
        let bids = Object.keys(data).filter((key) => key.includes(itemId));
        let bidId = `bid${bids.length.toString().padStart(5, "0")}`;
        let currentBid = data[bids[bids.length - 1]].amount;
        if (amount >= 1 + currentBid) {
          updateDoc(docRef, {
            [`${itemId}_${bidId}`]: {
              amount: amount,
              uid: auth.currentUser.uid,
            },
          });
          console.debug("placeBid() write to auction/items");
          amountElement.classList.add("is-valid");
          amountElement.classList.remove("is-invalid");
          setTimeout(() => {
            bidModalObject.hide();
            amountElement.classList.remove("is-valid");
            bidModalSubmit.removeAttribute("disabled", "");
          }, 1000);
        } else {
          amountElement.classList.add("is-invalid");
          feedback.innerText =
            "You must bid at least £" + (currentBid + 1).toFixed(2) + "!";
          bidModalSubmit.removeAttribute("disabled", "");
        }
      });
    }
  }
}

// -- Info modal --
const infoModal = document.getElementById("info-modal");
if (infoModal) {
  // Populate infoModal with the correct information before it is visible
  infoModal.addEventListener("show.bs.modal", (event) => {
    const infoModalTitle = infoModal.querySelector(".modal-title");
    const infoModalDetail = infoModal.querySelector(".modal-body > p");
    const infoModalSecondaryImage =
      infoModal.querySelector(".modal-body > img");
    // Update variable content elements
    const button = event.relatedTarget;
    const card = button.closest(".card");
    infoModalTitle.innerText = card.dataset.title;
    infoModalDetail.innerText = card.dataset.detail;
    infoModalSecondaryImage.src = card.dataset.secondaryImage;
    // Add the auction ID to the bidModal, in case the user clicks "Submit bid" in infoModal
    bidModal.dataset.activeAuction = card.dataset.id;
  });

  // Clear the auction specific information from bidModal when hiding infoModal
  bidModal.addEventListener("hide.bs.modal", () => {
    bidModal.removeAttribute("data-active-auction");
  });
}
