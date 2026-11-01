const searchInput = document.getElementById('searchInput');
const form = document.querySelector('form');

async function fetchGitHubUser(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) {
      throw new Error(`User not found: ${response.status}`);
    }
    const userData = await response.json();
    return userData;

  } catch (error) {
    console.error('Error fetching GitHub user data:', error);
  }}
  


form.addEventListener('submit', async(e) => {
  e.preventDefault();
  await updateProfileUI();
  /*await fetchUserRepos(profile);*/
  form.reset();
  });


  async function updateProfileUI() {
  const profileImage = document.getElementById('avatar');
  const name = document.getElementById('name');
  const username = document.getElementById('username');
  const bio = document.getElementById('bio');
  const location = document.getElementById('location');
  const errorMsg = document.getElementById('errorMsg');
  const profile = searchInput.value.trim();
  const user =  await fetchGitHubUser(profile);
 if(!user) {
    errorMsg.textContent = 'User not found. Please try again.';
    return;
  }

  profileImage.src = user.avatar_url;
  name.textContent = user.name || user.login;
  username.textContent = `@${user.login}`;
  bio.textContent = user.bio || 'No bio available.';
  location.textContent = user.location ? `📍 ${user.location}` : 'Location not specified.';
    const viewProfileBtn = document.getElementById('viewProfileBtn');
    viewProfileBtn.href = user.html_url;
    
    const publicRepos = document.getElementById('publicRepos');
    publicRepos.textContent = user.public_repos;
    
    const followers = document.getElementById('followers');
    followers.textContent = user.followers;
    
    const following = document.getElementById('following');
    following.textContent = user.following;
    
    const dateJoined = document.getElementById('date');
    const date = new Date(user.created_at);
    const options = new Intl.DateTimeFormat('en-US', 
      { month: 'short',
        day: 'numeric',
        year: 'numeric' }).format(date);

      dateJoined.textContent = `📅 Joined ${options}`;

  }
  /*async function fetchUserRepos(username) {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos`);
      if (!response.ok) {
        throw new Error(`Error fetching repositories: ${response.status}`);
      }
      const reposData = await response.json();
      console.log(reposData);
      const reposContainer = document.getElementById('reposContainer');
      const repoList = reposData.map(repo => {
        return `
          <div class="repo-card">
            <h3>${repo.name}</h3>
            <p>${repo.description || 'No description available.'}</p>
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">View Repository</a>
          </div>
        `;
      }).join('');
      reposContainer.innerHTML = repoList;
    } catch (error) {
      console.error('Error fetching user repositories:', error);
    }
  }
  window.addEventListener('DOMContentLoaded', async (e) => {
    e.preventDefault();
    await fetchUserRepos('octocat');
  });
  */
