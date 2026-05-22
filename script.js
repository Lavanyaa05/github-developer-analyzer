const userAInput = document.getElementById("userA");
const userBInput = document.getElementById("userB");
const button = document.getElementById("compare");

const statusEl = document.getElementById("status");
const errorEl = document.getElementById("error");
const resultEl = document.getElementById("result");

button.addEventListener("click", handleCompare);

async function handleCompare() {
  const { a, b } = getInputs();

  resetUI();

  if (!a || !b) {
    showError("Both usernames are required");
    return;
  }

  setStatus("Fetching GitHub profiles...");

  try {
    const [userA, userB] = await Promise.all([
      fetchUser(a),
      fetchUser(b)
    ]);

    renderComparison(userA, userB);
  } catch (err) {
    showError(err.message);
  } finally {
    setStatus("");
  }
}

function getInputs() {
  return {
    a: userAInput.value.trim(),
    b: userBInput.value.trim()
  };
}

async function fetchUser(username) {
  const res = await fetch(`https://api.github.com/users/${username}`);

  if (res.status === 404) throw new Error(`User "${username}" not found`);
  if (res.status === 403) throw new Error("GitHub API rate limit exceeded");
  if (!res.ok) throw new Error("Failed to fetch data");

  return res.json();
}

function calculateScore(user) {
  return user.followers + user.public_repos * 2;
}

function renderComparison(a, b) {
  const scoreA = calculateScore(a);
  const scoreB = calculateScore(b);

  const winner =
    scoreA === scoreB
      ? "Tie"
      : scoreA > scoreB
      ? a.login
      : b.login;

  resultEl.innerHTML = `
    <div class="grid">
      ${createCard(a, scoreA, winner)}
      ${createCard(b, scoreB, winner)}
    </div>

    <div class="winner">
      Winner: ${winner}
    </div>
  `;
}

function createCard(user, score, winner) {
  return `
    <div class="card ${winner === user.login ? "winner" : ""}">
      <img src="${user.avatar_url}" />

      <h2>${user.login}</h2>
      <p>${user.bio || "No bio available"}</p>

      <div class="stats">
        <div>Followers: ${user.followers}</div>
        <div>Repos: ${user.public_repos}</div>
        <div>Score: ${score}</div>
      </div>

      <a href="${user.html_url}" target="_blank">View Profile</a>
    </div>
  `;
}

function setStatus(msg) {
  statusEl.textContent = msg;
}

function showError(msg) {
  errorEl.textContent = msg;
}

function resetUI() {
  statusEl.textContent = "";
  errorEl.textContent = "";
  resultEl.innerHTML = "";
}