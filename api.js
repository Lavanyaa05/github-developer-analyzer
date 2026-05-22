const GitHubAPI = (() => {
  const BASE = "https://api.github.com/users";

  async function fetchUser(username) {
    try {
      const res = await fetch(`${BASE}/${username}`);

      if (res.status === 404) throw new Error("NOT_FOUND");
      if (res.status === 403) throw new Error("RATE_LIMIT");
      if (!res.ok) throw new Error("API_ERROR");

      return await res.json();
    } catch (err) {
      console.error("fetchUser error:", err);
      throw err;
    }
  }

  async function fetchRepos(username) {
    try {
      const res = await fetch(`${BASE}/${username}/repos?per_page=100`);

      if (res.status === 404) throw new Error("NOT_FOUND");
      if (res.status === 403) throw new Error("RATE_LIMIT");
      if (!res.ok) throw new Error("API_ERROR");

      return await res.json();
    } catch (err) {
      console.error("fetchRepos error:", err);
      throw err;
    }
  }

  async function getUserData(username) {
    try {
      const [user, repos] = await Promise.all([
        fetchUser(username),
        fetchRepos(username)
      ]);

      return { user, repos };
    } catch (err) {
      console.error("getUserData error:", err);
      throw err;
    }
  }

  return { getUserData };
})();