createNavbar("profile");

const profileForm = document.getElementById("profileForm");
const profileMessage = document.getElementById("profileMessage");
const followButton = document.getElementById("followButton");

function paintProfile() {
  const profile = getProfile();

  document.getElementById("profileAvatar").textContent = profile.imageInitial;
  document.getElementById("profileName").textContent = profile.nickname;
  document.getElementById("profileBio").textContent = profile.bio;
  document.getElementById("savedNickname").textContent = profile.nickname;
  document.getElementById("savedBio").textContent = profile.bio;
  document.getElementById("savedInterests").textContent = profile.interests || "No interests saved.";

  document.getElementById("nickname").value = profile.nickname;
  document.getElementById("bio").value = profile.bio;
  document.getElementById("interests").value = profile.interests;
}

function paintFollowState() {
  const state = getFollowState();
  document.getElementById("followerCount").textContent = state.followers;
  document.getElementById("followingCount").textContent = state.following;
  followButton.textContent = state.followingProfile ? "Unfollow" : "Follow";
  followButton.classList.toggle("secondary", state.followingProfile);
}

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const nickname = document.getElementById("nickname").value.trim();
  const bio = document.getElementById("bio").value.trim();
  const interests = document.getElementById("interests").value.trim();

  if (!nickname || !bio) {
    showMessage(profileMessage, "Nickname and bio are required.", true);
    return;
  }

  saveProfile({
    nickname,
    bio,
    interests,
    imageInitial: nickname.charAt(0).toUpperCase()
  });

  paintProfile();
  showMessage(profileMessage, "Profile saved successfully.");
});

followButton.addEventListener("click", () => {
  const state = getFollowState();
  const followingProfile = !state.followingProfile;
  const followers = Math.max(0, state.followers + (followingProfile ? 1 : -1));

  saveFollowState({
    ...state,
    followers,
    followingProfile
  });

  paintFollowState();
});

paintProfile();
paintFollowState();
