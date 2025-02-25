async function findNonFollowers(username) {
  const followersUrl = `https://api.github.com/users/${username}/followers?per_page=100`;
  const followingUrl = `https://api.github.com/users/${username}/following?per_page=100`;

  // Helper function to fetch all pages of data
  async function fetchAllPages(url) {
    let results = [];
    const headers = {
      'Accept': 'application/vnd.github.v3+json'
    };

    while (url) {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        console.error(`Error fetching ${url}: ${response.status} ${response.statusText}`);
        break;
      }

      const data = await response.json();
      results = results.concat(data);

      // Check for a "next" page in the Link header
      const linkHeader = response.headers.get('link');
      if (linkHeader) {
        // The Link header may contain multiple links separated by commas.
        // We search for the one with rel="next"
        const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
        url = match ? match[1] : null;
      } else {
        url = null;
      }
    }
    return results;
  }

  try {
    // Fetch all followers and following pages
    const [followers, following] = await Promise.all([
      fetchAllPages(followersUrl),
      fetchAllPages(followingUrl)
    ]);

    // Create a set of follower usernames for fast look-up
    const followersUsernames = new Set(followers.map(user => user.login));
    
    // Filter out the users you're following who are not in your followers list
    const nonFollowers = following
      .filter(user => !followersUsernames.has(user.login))
      .map(user => user.login);

    console.log('Users you are following that are not following you back:', nonFollowers);
    return nonFollowers;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Example usage:
findNonFollowers('shadow1363');
