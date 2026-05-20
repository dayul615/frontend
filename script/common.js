const BLOG_APP_KEYS = {
  users: "velogCloneUsers",
  currentUser: "velogCloneCurrentUser",
  posts: "velogClonePosts",
  profile: "velogCloneProfile",
  follows: "velogCloneFollows",
  hearts: "velogCloneHearts"
};

const mockPosts = [
  {
    id: "mock-1",
    title: "처음 시작하는 프론트엔드 기록",
    description: "HTML, CSS, JavaScript만으로 블로그 UI를 구성하며 배운 점을 정리했습니다.",
    content: "# 처음 시작하는 프론트엔드 기록\n\nHTML과 CSS만 잘 써도 생각보다 많은 화면을 만들 수 있습니다.\n\n## 오늘 배운 것\n\n**레이아웃**을 먼저 잡고 컴포넌트를 반복하면 관리하기 쉬워집니다.",
    author: "green.dev",
    date: "2026-05-11",
    hearts: 18
  },
  {
    id: "mock-2",
    title: "localStorage로 만드는 임시 로그인",
    description: "백엔드 없이 회원가입, 로그인, 비밀번호 재설정 흐름을 연습하는 방법입니다.",
    content: "# localStorage로 만드는 임시 로그인\n\n프로젝트 초기에는 localStorage로 화면 흐름을 빠르게 검증할 수 있습니다.\n\n## 주의점\n\n실서비스에서는 **절대 비밀번호를 localStorage에 저장하면 안 됩니다.**",
    author: "frontend.note",
    date: "2026-05-09",
    hearts: 34
  },
  {
    id: "mock-3",
    title: "마크다운 미리보기 만들기",
    description: "# 제목, ## 소제목, 굵은 글씨와 문단을 간단히 렌더링해 봅니다.",
    content: "# 마크다운 미리보기 만들기\n\n작성 화면에서 바로 결과를 보는 경험은 글쓰기를 편하게 만듭니다.\n\n## 지원 문법\n\n지금은 **기본 문법**만 지원합니다.",
    author: "board.writer",
    date: "2026-05-07",
    hearts: 12
  }
];

function getStorage(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
}

function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getUsers() {
  return getStorage(BLOG_APP_KEYS.users, []);
}

function saveUsers(users) {
  setStorage(BLOG_APP_KEYS.users, users);
}

function getCurrentUser() {
  return localStorage.getItem(BLOG_APP_KEYS.currentUser) || "";
}

function setCurrentUser(userId) {
  localStorage.setItem(BLOG_APP_KEYS.currentUser, userId);
}

function getAllPosts() {
  const savedPosts = getStorage(BLOG_APP_KEYS.posts, []);
  return [...savedPosts, ...mockPosts];
}

function savePost(post) {
  const posts = getStorage(BLOG_APP_KEYS.posts, []);
  posts.unshift(post);
  setStorage(BLOG_APP_KEYS.posts, posts);
}

function getPostById(postId) {
  return getAllPosts().find((post) => post.id === postId);
}

function updateStoredPost(postId, updates) {
  const savedPosts = getStorage(BLOG_APP_KEYS.posts, []);
  const nextPosts = savedPosts.map((post) =>
    post.id === postId ? { ...post, ...updates } : post
  );
  setStorage(BLOG_APP_KEYS.posts, nextPosts);
}

function getHeartCount(post) {
  const hearts = getStorage(BLOG_APP_KEYS.hearts, {});
  return hearts[post.id]?.count ?? post.hearts ?? 0;
}

function isPostLiked(postId) {
  const hearts = getStorage(BLOG_APP_KEYS.hearts, {});
  return Boolean(hearts[postId]?.liked);
}

function toggleHeart(postId, baseCount) {
  const hearts = getStorage(BLOG_APP_KEYS.hearts, {});
  const current = hearts[postId] || { count: baseCount, liked: false };
  const liked = !current.liked;
  const count = Math.max(0, current.count + (liked ? 1 : -1));
  hearts[postId] = { count, liked };
  setStorage(BLOG_APP_KEYS.hearts, hearts);
  updateStoredPost(postId, { hearts: count });
  return hearts[postId];
}

function getProfile() {
  const currentUser = getCurrentUser();
  const profiles = getStorage(BLOG_APP_KEYS.profile, {});
  return profiles[currentUser] || {
    nickname: currentUser || "guest.writer",
    bio: "아직 소개글이 없습니다.",
    interests: "JavaScript, CSS, Blog",
    imageInitial: (currentUser || "G").charAt(0).toUpperCase()
  };
}

function saveProfile(profile) {
  const currentUser = getCurrentUser() || "guest";
  const profiles = getStorage(BLOG_APP_KEYS.profile, {});
  profiles[currentUser] = profile;
  setStorage(BLOG_APP_KEYS.profile, profiles);
}

function getFollowState() {
  return getStorage(BLOG_APP_KEYS.follows, {
    followers: 26,
    following: 8,
    followingProfile: false
  });
}

function saveFollowState(state) {
  setStorage(BLOG_APP_KEYS.follows, state);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderMarkdown(markdown) {
  const lines = escapeHtml(markdown || "").split(/\n/);
  return lines
    .map((line) => {
      const withBold = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

      if (withBold.startsWith("# ")) {
        return `<h1>${withBold.slice(2)}</h1>`;
      }

      if (withBold.startsWith("## ")) {
        return `<h2>${withBold.slice(3)}</h2>`;
      }

      if (!withBold.trim()) {
        return "<br>";
      }

      return `<p>${withBold}</p>`;
    })
    .join("");
}

function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

function showMessage(element, message, isError = false) {
  if (!element) return;
  element.textContent = message;
  element.classList.toggle("error", isError);
  element.classList.add("show");
}

function createNavbar(activePage = "") {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  const links = [
    { label: "Main", href: "Main.html", key: "main" },
    { label: "Profile", href: "Profile.html", key: "profile" },
    { label: "Write", href: "Write.html", key: "write" },
    { label: "Login", href: "Login.html", key: "login" },
    { label: "Signup", href: "Signup.html", key: "signup" }
  ];

  navbar.innerHTML = `
    <div class="nav-inner">
      <a class="logo" href="Main.html">greenlog</a>
      <nav class="nav-links" aria-label="Primary navigation">
        ${links
          .map(
            (link) =>
              `<a class="${activePage === link.key ? "active" : ""}" href="${link.href}">${link.label}</a>`
          )
          .join("")}
      </nav>
    </div>
  `;
}
