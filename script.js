const userAInput = document.getElementById("userA");
const userBInput = document.getElementById("userB");
const btn = document.getElementById("compare");

const status = document.getElementById("status");
const error = document.getElementById("error");
const result = document.getElementById("result");

btn.addEventListener("click", run);

async function run() {
  const aName = userAInput.value.trim();
  const bName = userBInput.value.trim();

  clearUI();

  if (!aName || !bName) {
    error.textContent = "Both usernames required";
    return;
  }

  status.textContent = "Analyzing developers...";

  try {
    const [a, b] = await Promise.all([
      fetchUser(aName),
      fetchUser(bName)
    ]);

    const scoreA = a.public_repos + a.followers;
    const scoreB = b.public_repos + b.followers;

    const winner =
      scoreA > scoreB ? a.login : b.login;

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
  } catch (e) {
    error.textContent = e.message;
  } finally {
    status.textContent = "";
  }
}

async function fetchUser(username) {
  const res = await fetch(`https://api.github.com/users/${username}`);

  if (res.status === 404) throw new Error("User not found");
  if (!res.ok) throw new Error("API error");

  return res.json();
}

function clearUI() {
  status.textContent = "";
  error.textContent = "";
  result.innerHTML = "";
}