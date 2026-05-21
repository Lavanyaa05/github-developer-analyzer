// DOM
const input = document.getElementById("username");
const btn = document.getElementById("search");

const statusEl = document.getElementById("status");
const errorEl = document.getElementById("error");
const resultEl = document.getElementById("result");

// Controller
btn.addEventListener("click", handleSearch);

async function handleSearch() {
  const username = input.value.trim();

  clearUI();

  if (!username) {
    setError("Username required");
    return;
  }

  setStatus("Loading...");

  try {
    const user = await fetchUser(username);
    const repos = await fetchRepos(username);

    renderUser(user, repos);

  } catch (err) {
    setError(err.message);
  } finally {
    clearStatus();
  }
}

// API layer
async function fetchUser(username) {
  const res = await fetch(`https://api.github.com/users/${username}`);

  if (res.status === 404) throw new Error("User not found");
  if (!res.ok) throw new Error("API error");

  return res.json();
}

async function fetchRepos(username) {
  const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=10`);

  if (!res.ok) throw new Error("Failed to fetch repos");

  return res.json();
}

// UI layer
function renderUser(user, repos) {
  const topRepos = repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5);

  resultEl.innerHTML = `
    <div class="card">
      <img src="${user.avatar_url}" width="80" />
      <h3>${user.login}</h3>
      <p>${user.bio || "No bio"}</p>

      <p>Followers: ${user.followers}</p>
      <p>Repos: ${user.public_repos}</p>

      <h4>Top Repositories</h4>
      <ul>
        ${topRepos.map(repo => `
          <li>
            <a href="${repo.html_url}" target="_blank">
              ${repo.name} ⭐ ${repo.stargazers_count}
            </a>
          </li>
        `).join("")}
      </ul>
    </div>
  `;
}

// UI helpers
function setStatus(msg) {
  statusEl.textContent = msg;
}

function clearStatus() {
  statusEl.textContent = "";
}

function setError(msg) {
  errorEl.textContent = msg;
}

function clearUI() {
  statusEl.textContent = "";
  errorEl.textContent = "";
  resultEl.innerHTML = "";
}