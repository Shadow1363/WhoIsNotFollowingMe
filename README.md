# WhoIsNotFollowingMe
A simple JS command that can be run in the terminal to see who you are following that isn't following you back.

# why?
Recently, I've noticed an influx of people trying to bait followers—they follow me, I follow them back, and then they unfollow me shortly after. To combat this, I "made" this.
# how to use
1. **Copy the Code:**
```js
async function findNonFollowers(username) {
    const followersUrl = `https://api.github.com/users/${username}/followers`;
    const followingUrl = `https://api.github.com/users/${username}/following`;

    // Helper function to fetch paginated data
    async function fetchAllPages(url) {
        let results = [];
        let response = await fetch(url);
        while (response.ok) {
            let data = await response.json();
            results = results.concat(data);
            // Check if there's another page
            const nextPage = response.headers.get('link')?.match(/<(.*?)>; rel="next"/);
            if (nextPage) {
                response = await fetch(nextPage[1]);
            } else {
                break;
            }
        }
        return results;
    }

    // Fetch followers and following lists
    const followers = await fetchAllPages(followersUrl);
    const following = await fetchAllPages(followingUrl);

    // Extract usernames
    const followersUsernames = new Set(followers.map(user => user.login));
    const followingUsernames = following.map(user => user.login);

    // Find users you are following that are not following you back
    const nonFollowers = followingUsernames.filter(username => !followersUsernames.has(username));

    console.log('Users you are following that are not following you back:', nonFollowers);
    return nonFollowers;
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
