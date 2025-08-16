/**
 * Main application state and configuration.
 */
const App = {
  imdbId: null,
  mediaType: "movie",
  totalSeasons: 0,
  seriesCache: {},
  elements: {},
};

/**
 * Adds the interactive aurora background effect.
 */
function initBackgroundEffect() {
  document.body.addEventListener("mousemove", (e) => {
    document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
    document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
  });
}

/**
 * Fetches media details from the OMDb API.
 * @returns {Promise<object|null>} The media data object, or null if not found.
 */
async function fetchMediaDetails() {
  try {
    /**
     * Replace with your actual API key you can get one from www.omdbapi.com/apikey.aspx (free tier 1000 requests per day)
     */
    const response = await fetch(
      `https://www.omdbapi.com/?i=${App.imdbId}&apikey=thewdb`
    );
    const data = await response.json();
    if (data.Response !== "True") {
      console.warn("Media not found in OMDb API.");
      return null;
    }
    App.mediaType = data.Type;
    App.totalSeasons = data.totalSeasons;
    return data;
  } catch (error) {
    console.error("Error fetching media details:", error);
    return null;
  }
}

/**
 * Renders the initial layout with all necessary skeleton placeholders.
 */
function renderInitialLayout() {
  const serverCount = Object.keys(STREAMING_PROVIDERS).length;
  const serverSkeletons = Array(serverCount)
    .fill(
      '<div class="skeleton" style="height: 42px; border-radius: 0.75rem;"></div>'
    )
    .join("");

  App.elements.root.innerHTML = `
        <div class="container">
            <div class="top-section">
                <div>
                    <div class="stream-player-section skeleton" id="stream-player-section"></div>
                    <div id="series-controls-placeholder"></div>
                </div>
                <aside class="sidebar">
                    <h2>Servers</h2>
                    <div class="stream-buttons" id="stream-buttons">${serverSkeletons}</div>
                </aside>
            </div>
            <div class="info-container" id="info-container">
                <div class="info-section" id="info-section">
                    <div class="poster skeleton"></div>
                    <div class="details" style="flex: 1;">
                        <div class="skeleton skeleton-text" style="width: 80%; height: 2.5rem; margin-bottom: 0.5rem;"></div>
                        <div class="skeleton skeleton-text" style="width: 60%; height: 1rem; margin-bottom: 1rem;"></div>
                        <div class="skeleton skeleton-text" style="width: 100%;"></div>
                        <div class="skeleton skeleton-text" style="width: 100%;"></div>
                        <div class="skeleton skeleton-text" style="width: 40%;"></div>
                        <div style="display: flex; gap: 1.5rem; margin: 1.5rem 0;">
                            <div class="skeleton" style="width: 80px; height: 40px; border-radius: 0.5rem;"></div>
                            <div class="skeleton" style="width: 80px; height: 40px; border-radius: 0.5rem;"></div>
                        </div>
                        <div class="skeleton skeleton-text" style="width: 80%;"></div>
                        <div class="skeleton skeleton-text" style="width: 90%;"></div>
                    </div>
                </div>
            </div>
        </div>
    `;

  // Cache all necessary elements right after they are created
  App.elements.playerSection = document.getElementById("stream-player-section");
  App.elements.seriesControlsPlaceholder = document.getElementById(
    "series-controls-placeholder"
  );
  App.elements.serverButtons = document.getElementById("stream-buttons");
  App.elements.infoContainer = document.getElementById("info-container");
  App.elements.infoSection = document.getElementById("info-section");
}

/**
 * Populates the info section with media details, replacing its skeleton.
 * @param {object} data - The media data from OMDb API.
 */
function renderMediaDetails(data) {
  document.title = `${data.Title} - Stream It`;

  const ratingsHTML = data.Ratings.map(
    (rating) => `
        <div class="rating">
            <svg class="icon" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            <div><div class="value">${rating.Value}</div><div class="source">${rating.Source}</div></div>
        </div>`
  ).join("");

  App.elements.infoSection.innerHTML = `
        <div class="poster" style="background-image: url(${data.Poster})"></div>
        <div class="details">
            <h1>${data.Title}</h1>
            <div class="meta">
                <span>${data.Year}</span> • <span>${data.Runtime}</span> • <span>${data.Rated}</span> • <span>${data.Genre}</span>
            </div>
            <p class="plot">${data.Plot}</p>
            <div class="ratings">${ratingsHTML}</div>
            <div class="extra-details">
                <div><strong>Director:</strong> ${data.Director}</div>
                <div><strong>Actors:</strong> ${data.Actors}</div>
            </div>
        </div>
    `;
}

/**
 * Renders the server buttons, replacing their skeleton.
 */
function renderServerButtons() {
  App.elements.serverButtons.innerHTML = "";
  Object.entries(STREAMING_PROVIDERS).forEach(([id, provider]) => {
    const button = document.createElement("button");
    button.className = "stream-button";
    button.textContent = provider.name;
    button.dataset.provider = id;
    button.onclick = () => {
      document
        .querySelectorAll(".stream-button")
        .forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      showStream(id);
    };
    App.elements.serverButtons.appendChild(button);
  });
}

/**
 * Fetches and populates episodes for a given season.
 * @param {string} season - The season number to fetch.
 */
async function fetchEpisodes(season) {
  const { episodeSelect } = App.elements;
  episodeSelect.innerHTML = "";

  if (App.seriesCache[season]) {
    App.seriesCache[season].forEach((episode) => {
      const option = document.createElement("option");
      option.value = episode.Episode;
      option.textContent = `Episode ${episode.Episode}: ${episode.Title}`;
      episodeSelect.appendChild(option);
    });
    return;
  }
  /**
   * Replace with your actual API key you can get one from www.omdbapi.com/apikey.aspx (free tier 1000 requests per day)
   */
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?i=${App.imdbId}&Season=${season}&apikey=thewdb`
    );
    const data = await response.json();
    if (data.Response === "True" && data.Episodes) {
      App.seriesCache[season] = data.Episodes;
      data.Episodes.forEach((episode) => {
        const option = document.createElement("option");
        option.value = episode.Episode;
        option.textContent = `Episode ${episode.Episode}: ${episode.Title}`;
        episodeSelect.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Error fetching episodes:", error);
  }
}

/**
 * Renders the series navigation controls, replacing the skeleton placeholder.
 */
function setupSeriesControls() {
  const controlsPlaceholder = App.elements.seriesControlsPlaceholder;
  controlsPlaceholder.className = "series-controls";
  controlsPlaceholder.innerHTML = `
        <div class="series-selector">
            <label for="season-select">Season:</label>
            <select id="season-select"></select>
        </div>
        <div class="series-selector">
            <label for="episode-select">Episode:</label>
            <select id="episode-select"></select>
        </div>
        <div class="episode-nav-container">
            <button id="prev-episode" class="episode-nav-btn">Previous Episode</button>
            <button id="next-episode" class="episode-nav-btn">Next Episode</button>
        </div>
    `;

  App.elements.seasonSelect = document.getElementById("season-select");
  App.elements.episodeSelect = document.getElementById("episode-select");
  App.elements.prevEpisodeBtn = document.getElementById("prev-episode");
  App.elements.nextEpisodeBtn = document.getElementById("next-episode");

  const { seasonSelect, episodeSelect, prevEpisodeBtn, nextEpisodeBtn } =
    App.elements;

  for (let i = 1; i <= App.totalSeasons; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `Season ${i}`;
    seasonSelect.appendChild(option);
  }

  const updateEpisodeNavButtons = () => {
    const currentSeason = parseInt(seasonSelect.value);
    const currentEpisode = parseInt(episodeSelect.value);
    prevEpisodeBtn.disabled = currentSeason === 1 && currentEpisode === 1;
    nextEpisodeBtn.disabled =
      currentSeason == App.totalSeasons &&
      currentEpisode === episodeSelect.options.length;
  };

  const navigateEpisode = async (direction) => {
    let currentSeason = parseInt(seasonSelect.value);
    let currentEpisode = parseInt(episodeSelect.value);

    if (direction === "next") {
      if (currentEpisode < episodeSelect.options.length) {
        currentEpisode++;
      } else if (currentSeason < App.totalSeasons) {
        currentSeason++;
        currentEpisode = 1;
        seasonSelect.value = currentSeason;
        await fetchEpisodes(currentSeason);
      }
    } else {
      // prev
      if (currentEpisode > 1) {
        currentEpisode--;
      } else if (currentSeason > 1) {
        currentSeason--;
        seasonSelect.value = currentSeason;
        await fetchEpisodes(currentSeason);
        currentEpisode = episodeSelect.options.length;
      }
    }
    episodeSelect.value = currentEpisode;
    episodeSelect.dispatchEvent(new Event("change"));
  };

  seasonSelect.addEventListener("change", async () => {
    await fetchEpisodes(seasonSelect.value);
    updateEpisodeNavButtons();
    showStream(
      document.querySelector(".stream-button.active").dataset.provider
    );
  });

  episodeSelect.addEventListener("change", () => {
    updateEpisodeNavButtons();
    showStream(
      document.querySelector(".stream-button.active").dataset.provider
    );
  });

  prevEpisodeBtn.addEventListener("click", () => navigateEpisode("prev"));
  nextEpisodeBtn.addEventListener("click", () => navigateEpisode("next"));

  updateEpisodeNavButtons();
}

/**
 * Displays the selected stream in the player and updates the URL.
 * @param {string} streamId - The ID of the streaming provider.
 */
function showStream(streamId) {
  const provider = STREAMING_PROVIDERS[streamId];
  if (!provider) return;

  const params = new URLSearchParams(window.location.search);
  let url;

  if (App.mediaType === "series") {
    const season = App.elements.seasonSelect.value;
    const episode = App.elements.episodeSelect.value;
    url = generateEmbedUrl(streamId, "series", App.imdbId, season, episode);
    params.set("season", season);
    params.set("episode", episode);
  } else {
    url = generateEmbedUrl(streamId, "movie", App.imdbId);
  }
  params.set("server", streamId);
  history.pushState({}, "", `${window.location.pathname}?${params.toString()}`);
  App.elements.playerSection.classList.remove("skeleton");
  App.elements.playerSection.innerHTML = `<iframe src="${url}" title="Stream It Player" allowfullscreen></iframe>`;
}

/**
 * Displays an error message.
 * @param {string} message - The error message to display.
 */
function renderError(message) {
  App.elements.root.innerHTML = `<div class="error-message">${message}</div>`;
}

/**
 * Initializes the application.
 */
async function init() {
  initBackgroundEffect();
  App.elements.root = document.getElementById("app-root");
  const params = new URLSearchParams(window.location.search);
  App.imdbId = params.get("id");

  if (!App.imdbId) {
    renderError("No IMDb ID provided.");
    return;
  }

  renderInitialLayout();

  const data = await fetchMediaDetails();

  if (data) {
    renderMediaDetails(data);
    renderServerButtons();

    if (App.mediaType === "series") {
      setupSeriesControls();
      const season = params.get("season") || "1";
      const episode = params.get("episode");

      App.elements.seasonSelect.value = season;
      await fetchEpisodes(season);

      if (episode) {
        App.elements.episodeSelect.value = episode;
      }
      App.elements.episodeSelect.dispatchEvent(new Event("change"));
    }
  } else {
    renderError("Media not found.");
    return;
  }

  const serverId = params.get("server") || Object.keys(STREAMING_PROVIDERS)[0];

  document
    .querySelector(`.stream-button[data-provider="${serverId}"]`)
    .classList.add("active");
  showStream(serverId);
}

// IMDb Search Logic
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const searchResults = document.getElementById("search-results");

if (searchInput && searchBtn && searchResults) {
  searchBtn.onclick = async function () {
    const q = searchInput.value.trim();
    if (!q) return;
    // Hide error message when searching
    const errorMsg = document.querySelector(".error-message");
    if (errorMsg) errorMsg.style.display = "none";

    searchResults.innerHTML = '<div style="color:#fff;">Searching...</div>';
    /**
     * Replace with your actual API key you can get one from www.omdbapi.com/apikey.aspx (free tier 1000 requests per day)
     */
    const res = await fetch(
      `https://www.omdbapi.com/?s=${encodeURIComponent(q)}&apikey=thewdb`
    );
    const data = await res.json();
    if (data.Response !== "True") {
      searchResults.innerHTML =
        '<div style="color:#f00;">No results found.</div>';
      return;
    }
    searchResults.innerHTML = data.Search.map(
      (item) => `
            <div style="display:flex;align-items:center;gap:1rem;padding:0.5rem 0;border-bottom:1px solid #334155;cursor:pointer;" onclick="location.href='?id=${
              item.imdbID
            }'">
                <img src="${
                  item.Poster !== "N/A" ? item.Poster : ""
                }" alt="" style="width:40px;height:60px;object-fit:cover;border-radius:0.25rem;background:#222;">
                <div>
                    <div style="color:#fff;font-weight:600;">${item.Title}</div>
                    <div style="color:#cbd5e1;font-size:0.9em;">${
                      item.Year
                    } • ${item.Type}</div>
                </div>
            </div>
        `
    ).join("");
  };
}
// Start the application
init();
