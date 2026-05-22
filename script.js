const userAInput = document.getElementById("userA");
const userBInput = document.getElementById("userB");
const btn = document.getElementById("compare");

const status = document.getElementById("status");
const error = document.getElementById("error");
const result = document.getElementById("result");

btn.addEventListener("click", run);

async function run() {
  const userA = userAInput.value.trim();
  const userB = userBInput.value.trim();

  clearUI();

  if (!userA || !userB) {
    error.textContent = "Both usernames required";
    return;
  }

  status.textContent = "Fetching data...";

  try {
    const a = await fetchUser(userA);
    const b = await fetchUser(userB);

    result.innerHTML = `
      <div>
        <h2>${a.login}</h2>
        <p>${a.public_repos} repos</p>
      </div>

      <div>
        <h2>${b.login}</h2>
        <p>${b.public_repos} repos</p>
      </div>
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