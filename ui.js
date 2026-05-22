const UI = (() => {
  const resultEl = document.getElementById("result");
  const statusEl = document.getElementById("status");
  const errorEl = document.getElementById("error");

  function setStatus(msg) {
    statusEl.textContent = msg;
  }

  function setError(msg) {
    errorEl.textContent = msg;
  }

  function clear() {
    statusEl.textContent = "";
    errorEl.textContent = "";
    resultEl.innerHTML = "";
  }

  function render(users, analysisA, analysisB, comparison) {
    const [A, B] = users;

    const scoreA = comparison.scoreA;
    const scoreB = comparison.scoreB;

    const maxScore = Math.max(scoreA, scoreB);

    resultEl.innerHTML = `
      <div class="dashboard">
        ${renderCard(A, analysisA, comparison, scoreA, maxScore)}
        ${renderCard(B, analysisB, comparison, scoreB, maxScore)}
      </div>

      <div class="winner-banner">
        🏆 Winner: ${comparison.winner}
      </div>
    `;
  }

  function renderCard(data, analysis, comparison, score, maxScore) {
    const isWinner = data.user.login === comparison.winner;

    const percent = maxScore
      ? Math.max((score / maxScore) * 100, 8)
      : 0;

    return `
      <div class="card ${isWinner ? "winner" : ""}">

        <div class="profile">
          <img 
            src="${data.user.avatar_url}" 
            alt="${data.user.login} avatar"
          />

          <div>
            <h2>${data.user.login}</h2>
            <p>${data.user.bio || "No bio available"}</p>
          </div>
        </div>

        <div class="stats">
          ⭐ Stars: ${analysis.totalStars} <br/>
          👥 Followers: ${data.user.followers} <br/>
          📦 Repos: ${data.user.public_repos}
        </div>

        <div class="top-repo">
          🏆 ${analysis.topRepo?.name || "N/A"}
          ⭐ ${analysis.topRepo?.stargazers_count || 0}
        </div>

        <div class="languages">
          ${
            analysis.languages.length
              ? analysis.languages
                  .map(
                    (l) => `
              <span class="language-badge">
                ${l.lang} ${l.percent}%
              </span>
            `
                  )
                  .join("")
              : `<span class="language-badge">No languages</span>`
          }
        </div>

        <div class="score-bar">
          <div 
            class="score-fill"
            style="width:${percent}%"
          ></div>
        </div>

        <div class="score-text">
          Score: ${Math.round(score)}
        </div>

        <a
          class="profile-btn"
          href="${data.user.html_url}"
          target="_blank"
          rel="noopener noreferrer"
        >
          View GitHub Profile
        </a>

      </div>
    `;
  }

  return {
    setStatus,
    setError,
    clear,
    render
  };
})();