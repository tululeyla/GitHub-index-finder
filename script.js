const form = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const errorMessage = document.getElementById("errorMsg");
const reposContainer = document.getElementById("reposContainer");

const elements = {
  avatar: document.getElementById("avatar"),
  name: document.getElementById("name"),
  username: document.getElementById("username"),
  bio: document.getElementById("bio"),
  location: document.getElementById("location"),
  date: document.getElementById("date"),
  profileLink: document.getElementById("viewProfileBtn"),
  publicRepos: document.getElementById("publicRepos"),
  followers: document.getElementById("followers"),
  following: document.getElementById("following"),
};

async function fetchGitHubUser(username) {
  const response = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}`
  );

  if (response.status === 404) {
    throw new Error("That GitHub username was not found. Please try again.");
  }

  if (!response.ok) {
    throw new Error("Could not load the profile. Please try again later.");
  }

  return response.json();
}

async function fetchUserRepos(username) {
  const response = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=6`
  );

  if (!response.ok) {
    throw new Error("Could not load this user's repositories.");
  }

  return response.json();
}

function formatNumber(value) {
  return new Intl.NumberFormat().format(value);
}

function displayProfile(user) {
  elements.avatar.src = user.avatar_url;
  elements.avatar.alt = `${user.login}'s GitHub avatar`;

  elements.name.textContent = user.name || user.login;
  elements.username.textContent = `@${user.login}`;
  elements.bio.textContent = user.bio || "No bio available.";
  elements.location.textContent = user.location
    ? `📍 ${user.location}`
    : "Location not specified";

  const joinedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(user.created_at));

  elements.date.textContent = `📅 Joined ${joinedDate}`;
  elements.profileLink.href = user.html_url;

  elements.publicRepos.textContent = formatNumber(user.public_repos);
  elements.followers.textContent = formatNumber(user.followers);
  elements.following.textContent = formatNumber(user.following);
}

function displayRepos(repositories) {
  reposContainer.replaceChildren();

  if (repositories.length === 0) {
    const message = document.createElement("p");
    message.className = "repo-message";
    message.textContent = "No public repositories found.";
    reposContainer.append(message);
    return;
  }

  for (const repo of repositories) {
    const card = document.createElement("article");
    card.className = "repo-card";

    const title = document.createElement("h3");
    title.textContent = repo.name;

    const description = document.createElement("p");
    description.textContent = repo.description || "No description available.";

    const link = document.createElement("a");
    link.className = "button";
    link.href = repo.html_url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "View repository";

    card.append(title, description, link);
    reposContainer.append(card);
  }
}

async function loadProfile(username) {
  errorMessage.textContent = "";
  reposContainer.replaceChildren();

  const loadingMessage = document.createElement("p");
  loadingMessage.className = "repo-message";
  loadingMessage.textContent = "Loading repositories…";
  reposContainer.append(loadingMessage);

  try {
    const user = await fetchGitHubUser(username);
    displayProfile(user);

    try {
      const repositories = await fetchUserRepos(user.login);
      displayRepos(repositories);
    } catch (error) {
      reposContainer.replaceChildren();

      const message = document.createElement("p");
      message.className = "repo-message";
      message.textContent = error.message;
      reposContainer.append(message);
    }
  } catch (error) {
    errorMessage.textContent = error.message;
    reposContainer.replaceChildren();

    const message = document.createElement("p");
    message.className = "repo-message";
    message.textContent = "Repositories will appear here when a profile loads.";
    reposContainer.append(message);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = searchInput.value.trim();
  if (!username) return;

  searchButton.disabled = true;
  searchButton.textContent = "Searching…";

  await loadProfile(username);

  searchButton.disabled = false;
  searchButton.textContent = "Search";
});

loadProfile("octocat");
