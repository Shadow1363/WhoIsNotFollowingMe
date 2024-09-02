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
