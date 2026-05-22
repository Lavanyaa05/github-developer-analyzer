const Analyzer = (() => {

  function analyzeRepos(repos) {
    const languageCount = {};
    let totalStars = 0;
    let topRepo = null;

    for (const repo of repos) {
      totalStars += repo.stargazers_count || 0;

      if (!topRepo || repo.stargazers_count > topRepo.stargazers_count) {
        topRepo = repo;
      }

      if (repo.language) {
        languageCount[repo.language] =
          (languageCount[repo.language] || 0) + 1;
      }
    }

    const totalLangs = Object.values(languageCount)
      .reduce((a, b) => a + b, 0);

    const languages = Object.entries(languageCount)
      .map(([lang, count]) => ({
        lang,
        percent: totalLangs ? ((count / totalLangs) * 100).toFixed(1) : 0
      }))
      .sort((a, b) => b.percent - a.percent);

    return {
      totalStars,
      topRepo,
      languages
    };
  }

  function computeScore(user, analysis) {
    return (
      (user.followers || 0) * 2 +
      (user.public_repos || 0) * 1.5 +
      (analysis.totalStars || 0) * 3
    );
  }

  function compare(a, b) {
    const scoreA = computeScore(a.user, a.analysis);
    const scoreB = computeScore(b.user, b.analysis);

    return {
      scoreA,
      scoreB,
      winner:
        scoreA === scoreB
          ? "tie"
          : scoreA > scoreB
          ? a.user.login
          : b.user.login
    };
  }

  return {
    analyzeRepos,
    computeScore,
    compare
  };
})();