createNavbar("");

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");
const post = getPostById(postId) || getAllPosts()[0];
const heartButton = document.getElementById("heartButton");
const heartCount = document.getElementById("heartCount");
const heartIcon = document.getElementById("heartIcon");

function paintPost() {
  document.title = `${post.title} | greenlog`;
  document.getElementById("detailTitle").textContent = post.title;
  document.getElementById("detailAuthor").textContent = post.author;
  document.getElementById("detailDate").textContent = post.date;
  document.getElementById("detailContent").innerHTML = renderMarkdown(post.content);
}

function paintHeart() {
  const liked = isPostLiked(post.id);
  heartCount.textContent = getHeartCount(post);
  heartIcon.textContent = liked ? "♥" : "♡";
  heartButton.classList.toggle("liked", liked);
}

heartButton.addEventListener("click", () => {
  toggleHeart(post.id, getHeartCount(post));
  paintHeart();
});

paintPost();
paintHeart();
