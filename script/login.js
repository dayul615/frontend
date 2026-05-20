const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const resetForm = document.getElementById("resetForm");
const resetMessage = document.getElementById("resetMessage");
const showResetButton = document.getElementById("showResetButton");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const userId = document.getElementById("loginUserId").value.trim();
  const password = document.getElementById("loginPassword").value;
  const user = getUsers().find((item) => item.userId === userId);

  if (!userId || !password) {
    showMessage(loginMessage, "Please enter both user ID and password.", true);
    return;
  }

  if (!user || user.password !== password) {
    showMessage(loginMessage, "User ID or password is incorrect.", true);
    return;
  }

  setCurrentUser(userId);
  showMessage(loginMessage, "Login successful. Moving to main page.");
  setTimeout(() => {
    window.location.href = "Main.html";
  }, 600);
});

showResetButton.addEventListener("click", () => {
  resetForm.classList.toggle("show");
});

resetForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const userId = document.getElementById("resetUserId").value.trim();
  const favoriteColor = document.getElementById("resetColor").value.trim().toLowerCase();
  const elementarySchool = document.getElementById("resetSchool").value.trim().toLowerCase();
  const newPassword = document.getElementById("newPassword").value;
  const confirmNewPassword = document.getElementById("confirmNewPassword").value;
  const users = getUsers();
  const userIndex = users.findIndex((item) => item.userId === userId);

  if ([userId, favoriteColor, elementarySchool, newPassword, confirmNewPassword].some((value) => !value)) {
    showMessage(resetMessage, "Please fill in every reset field.", true);
    return;
  }

  if (userIndex === -1) {
    showMessage(resetMessage, "No account found for this user ID.", true);
    return;
  }

  const user = users[userIndex];
  const colorMatches = user.favoriteColor.toLowerCase() === favoriteColor;
  const schoolMatches = user.elementarySchool.toLowerCase() === elementarySchool;

  if (!colorMatches || !schoolMatches) {
    showMessage(resetMessage, "Identity verification answers do not match.", true);
    return;
  }

  if (newPassword !== confirmNewPassword) {
    showMessage(resetMessage, "New password and confirmation do not match.", true);
    return;
  }

  users[userIndex] = { ...user, password: newPassword };
  saveUsers(users);
  resetForm.reset();
  showMessage(resetMessage, "Password reset successful. You can log in now.");
});
