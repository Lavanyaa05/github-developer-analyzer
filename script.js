const userAInput = document.getElementById("userA");
const userBInput = document.getElementById("userB");
const btn = document.getElementById("compare");

const status = document.getElementById("status");
const error = document.getElementById("error");
const result = document.getElementById("result");

btn.addEventListener("click", handleCompare);

async function handleCompare() {
  const users = getUsers();

  reset();

  if (!users.a || !users.b) {
    showError("Both usernames are required");
    return;
  }

  setStatus("Loading GitHub data...");

  try {
    const [a, b] = await Promise.all([
      fetchUser(users.a),
      fetchUser(users.b)
    ]);

    render(a, b);
  } catch (err) {
    showError(err.message);
  } finally {
    setStatus("");
  }
}

function getUsers() {
  return {
    a: userAInput.value.trim(),
    b: userBInput.value.trim()
  };
}

async function fetchUser(username) {
  const res = await fetch(
    `https://api.github.com/users/${username}`
  );

  if (res.status === 404) throw new Error("User not found");
  if (res.status === 403) throw new Error("Rate limit exceeded");
  if (!res.ok) throw new Error("API failed");

  return res.json();
}

function score(user) {
  return user.followers + user.public_repos * 2;
}

function render(a, b) {
  const scoreA = score(a);
  const scoreB = score(b);

  const winner =
    scoreA === scoreB
      ? "Tie"
      : scoreA > scoreB
      ? a.login
      : b.login;

  result.innerHTML = `
    <div>
      <h2>${a.login}</h2>
      <p>Followers: ${a.followers}</p>
      <p>Repos: ${a.public_repos}</p>
      <p>Score: ${scoreA}</p>
    </div>

    <div>
      <h2>${b.login}</h2>
      <p>Followers: ${b.followers}</p>
      <p>Repos: ${b.public_repos}</p>
      <p>Score: ${scoreB}</p>
    </div>

    <h3>Winner: ${winner}</h3>
  `;
}

function setStatus(msg) {
  status.textContent = msg;
}

function showError(msg) {
  error.textContent = msg;
}

function reset() {
  status.textContent = "";
  error.textContent = "";
  result.innerHTML = "";
}