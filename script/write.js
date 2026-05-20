createNavbar("write");

const titleInput = document.getElementById("postTitle");
const contentInput = document.getElementById("postContent");
const previewContent = document.getElementById("previewContent");
const publishButton = document.getElementById("publishButton");
const writeMessage = document.getElementById("writeMessage");

function updatePreview() {
  const content = contentInput.value.trim();
  previewContent.innerHTML = content
    ? renderMarkdown(content)
    : '<p class="muted">Your preview will appear here.</p>';
}

contentInput.addEventListener("input", updatePreview);

publishButton.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    showMessage(writeMessage, "Title and content are required.", true);
    return;
  }

  const currentUser = getCurrentUser();
  const author = currentUser || "guest.writer";
  const plainContent = content.replace(/[#*]/g, "").replace(/\s+/g, " ").trim();
  const description = plainContent.slice(0, 92) + (plainContent.length > 92 ? "..." : "");

  savePost({
    id: `post-${Date.now()}`,
    title,
    description,
    content,
    author,
    date: formatDate(new Date()),
    hearts: 0
  });

  showMessage(writeMessage, "Post published. Moving to main page.");
  setTimeout(() => {
    window.location.href = "Main.html";
  }, 600);
});

updatePreview();
