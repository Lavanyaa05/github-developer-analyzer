const btn = document.getElementById("compare");
const userA = document.getElementById("userA");
const userB = document.getElementById("userB");

btn.addEventListener("click", handleCompare);

async function handleCompare() {
  const a = userA.value.trim();
  const b = userB.value.trim();

  UI.clear();

  if (!a || !b) {
    UI.setError("Both usernames required");
    return;
  }

  UI.setStatus("Analyzing developers...");

  try {
    const [aData, bData] = await Promise.all([
      GitHubAPI.getUserData(a),
      GitHubAPI.getUserData(b)
    ]);

    const analysisA = Analyzer.analyzeRepos(aData.repos);
    const analysisB = Analyzer.analyzeRepos(bData.repos);

    const comparison = Analyzer.compare(
      { user: aData.user, analysis: analysisA },
      { user: bData.user, analysis: analysisB }
    );

    UI.render(
      [
        { user: aData.user },
        { user: bData.user }
      ],
      analysisA,
      analysisB,
      comparison
    );

  } catch (err) {
    console.error("DEBUG ERROR:", err); // 🔥 IMPORTANT

    UI.setError(mapError(err));
  } finally {
    UI.setStatus("");
  }
}

function mapError(err) {
  console.error("RAW ERROR:", err);

  // 🔥 MOST IMPORTANT FIX
  if (!err || !err.message) {
    return "Network error (check Live Server / internet)";
  }

  if (err.message.includes("Failed to fetch")) {
    return "Cannot reach GitHub API (CORS / Live Server issue)";
  }

  switch (err.message) {
    case "NOT_FOUND":
      return "User not found";
    case "RATE_LIMIT":
      return "GitHub API rate limit reached";
    case "API_ERROR":
      return "GitHub API error";
    default:
      return err.message || "Something went wrong";
  }
}