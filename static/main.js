const logout = () => {
  localStorage.removeItem("userImg");
  localStorage.removeItem("userName");
  window.location.href = "/";
};

// Menu
const closeMenu = () => {
  const menuSelection = document.querySelector(".menu");
  menuSelection.style.display = "none";
};
const openMenu = () => {
  const menuSelection = document.querySelector(".menu");
  menuSelection.style.display = "grid";
};

// Room
const showRoom = () => {
  const roomSelection = document.querySelector(".room");
  roomSelection.style.display = "grid";
};
const closeRoom = () => {
  const roomSelection = document.querySelector(".room");
  roomSelection.style.display = "none";
};

// to Call 
const startBtn = () => {
  closeMenu();
  showRoom();
};



// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
  // Get elements from the DOM
  const unauthorizedSection = document.querySelector(".unauthorized");
  const authorizedSection = document.querySelector(".authorized");
  const menuSelection = document.querySelector(".menu");
  const userAvatar = document.getElementById("user-avatar");
  const userNameElement = document.getElementById("user-name");

  // Extract query parameters from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get("username");
  const avatarUrl = urlParams.get("avatar_url");
  const name = urlParams.get("name");

  // If query parameters exist, store them in localStorage
  if (username && avatarUrl && name) {
    localStorage.setItem("userImg", avatarUrl);
    localStorage.setItem("userName", name);
  }

  // Retrieve user details from localStorage
  const userImg = localStorage.getItem("userImg");
  const userName = localStorage.getItem("userName");

  // Check if user details exist
  if (userImg && userName) {
    unauthorizedSection.style.display = "none";
    authorizedSection.style.display = "block";
    menuSelection.style.display = "grid";
    userAvatar.src = userImg;
    userNameElement.textContent = userName || "Guest"; // Fallback to "Guest" if name is not available
  } else {
    unauthorizedSection.style.display = "block";
    authorizedSection.style.display = "none";
    menuSelection.style.display = "none";
  }
});
