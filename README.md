# WhoIsNotFollowingMe
A simple JS command that can be run in the terminal to see who you are following that isn't following you back.

# why?
Recently, I've noticed an influx of people trying to bait followers—they follow me, I follow them back, and then they unfollow me shortly after. To combat this, I "made" this.
# how to use
1. **Copy the Code:**
```js
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
```
2. **Open Your Browser's Developer Console:**
   - **Chrome:** F12 or right-click and select "Inspect"
   - **Firefox:** Ctrl+Shift+I
   - **Safari:** Command+Option+I

3. **Paste the Code:** Paste the code into the console.
4. **Replace Username:** Replace `'shadow1363'` with your username.
5. **Enter:** Press Enter to run the code.

**Note:**
- The execution time may vary depending on the number of followers and following you have.
- You'll receive an array of usernames that you're following but who aren't following you back.
- **Important:** GitHub has rate limits for API requests. If you're making a large number of requests, you might encounter errors. Consider using a personal access token for more consistent access.
