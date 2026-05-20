createNavbar("main");

const postGrid = document.getElementById("postGrid");

function renderPostCard(post) {
  const card = document.createElement("article");
  card.className = "post-card";
  card.tabIndex = 0;
  card.setAttribute("role", "link");
  card.setAttribute("aria-label", `Open ${post.title}`);

  card.innerHTML = `
    <div class="thumbnail" aria-hidden="true"></div>
    <div class="post-card-body">
      <h3>${escapeHtml(post.title)}</h3>
      <p>${escapeHtml(post.description)}</p>
      <div class="post-meta">
        <span>${escapeHtml(post.author)} · ${escapeHtml(post.date)}</span>
        <span class="heart">♥ ${getHeartCount(post)}</span>
      </div>
    </div>
  `;

  const openDetail = () => {
    window.location.href = `BlogDetail.html?id=${encodeURIComponent(post.id)}`;
  };

  card.addEventListener("click", openDetail);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter") openDetail();
  });

  return card;
}

function renderPosts() {
  postGrid.innerHTML = "";
  getAllPosts().forEach((post) => {
    postGrid.appendChild(renderPostCard(post));
  });
}

renderPosts();
