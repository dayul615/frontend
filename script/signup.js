const signupForm = document.getElementById("signupForm");
const signupMessage = document.getElementById("signupMessage");

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const userId = document.getElementById("signupUserId").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("signupConfirmPassword").value;
  const favoriteColor = document.getElementById("favoriteColor").value.trim();
  const elementarySchool = document.getElementById("elementarySchool").value.trim();

  if ([userId, password, confirmPassword, favoriteColor, elementarySchool].some((value) => !value)) {
    showMessage(signupMessage, "Please fill in every field.", true);
    return;
  }

  if (password.length < 4) {
    showMessage(signupMessage, "Password must be at least 4 characters.", true);
    return;
  }

  if (password !== confirmPassword) {
    showMessage(signupMessage, "Password and confirm password do not match.", true);
    return;
  }

  const users = getUsers();
  const alreadyExists = users.some((user) => user.userId === userId);

  if (alreadyExists) {
    showMessage(signupMessage, "This user ID is already registered.", true);
    return;
  }

  users.push({
    userId,
    password,
    favoriteColor,
    elementarySchool
  });

  saveUsers(users);
  setCurrentUser(userId);
  showMessage(signupMessage, "Signup successful. Moving to login page.");
  setTimeout(() => {
    window.location.href = "Login.html";
  }, 700);
});
