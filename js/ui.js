class WatchAppUI {
  constructor({
    watchList,
    currentMovies = [],
    searchResultsId = "search-results",
    watchlistId = "watchlist",
    searchBtnId = "search-btn",
  } = {}) {
    this.watchList = watchList;
    this.currentMovies = currentMovies;

    this.searchResultsEl = document.getElementById(searchResultsId);
    this.watchlistEl = document.getElementById(watchlistId);
    this.searchBtnEl = document.getElementById(searchBtnId);
  }

  renderMovieCards(movies) {
    const container = this.searchResultsEl;
    container.innerHTML = "";

    movies.forEach((movie) => {
      const card = document.createElement("div");
      card.className = "movie-card";

      const inList = this.watchList.isMovieInList(movie.id);

      card.innerHTML = `
        <img
          class="movie-image"
          src="${movie.image || movie.poster || "https://via.placeholder.com/400x600?text=No+Image"}"
          alt="${movie.title}"
          onerror="this.src='https://via.placeholder.com/400x600?text=No+Image'"
        />
        <div class="movie-content">
          <div class="movie-info">
            <div class="movie-title">${movie.title}</div>
            <div class="movie-meta">
              ${movie.year ? `<div>سال: ${movie.year}</div>` : ""}
              ${movie.country ? `<div>کشور: ${movie.country}</div>` : ""}
            </div>
          </div>
          <div class="movie-actions-wrapper">
          <button
            ${
              inList
                ? `<div class="danger add-watchlist-btn" data-id="${movie.id}">اضافه شده به واچ‌لیست</div>`
                : `<button type="button" class="success add-watchlist-btn" data-id="${movie.id}">افزودن به واچ‌لیست</button>`
            }
          </button>
          </div>
        </div>
      `;

      const btn = card.querySelector(".add-watchlist-btn");

      if (inList && btn) btn.disabled = true;

      if (btn) {
        btn.addEventListener("click", () => {
          const added = this.watchList.addMovie(movie);
          if (added) {
            this.renderMovieCards(this.currentMovies);
            this.renderWatchlist();
          }
        });
      }

      container.appendChild(card);
    });
  }

  renderWatchlist() {
    const container = this.watchlistEl;
    const list = this.watchList.getList();
    container.innerHTML = "";
    const clearAllBtn = document.getElementById("clear-all-btn");
    if (list.length === 0) {
      container.innerHTML = "<p>واچ‌لیست شما خالی است.</p>";
      if (clearAllBtn) clearAllBtn.style.display = "none";
      const counter = document.getElementById("counter");
      if (counter) counter.innerText = "0";
      return;
    }

    if (clearAllBtn) clearAllBtn.style.display = "";

    list.forEach((movie) => {
      const card = document.createElement("div");
      card.className = "watchlist-card" + (movie.watched ? " watched" : "");

      let statusButtonHtml;
      if (movie.watched) {
        statusButtonHtml = `
            <button type="button" class="btn-status seen" data-movie-id="${movie.id}" data-status="seen">
              <i class="fas fa-eye"></i> دیده شده
            </button>
          `;
      } else {
        statusButtonHtml = `
            <button type="button" class="btn-status unseen" data-movie-id="${movie.id}" data-status="unseen">
              <i class="fas fa-eye-slash"></i> دیده نشده
            </button>
          `;
      }
      card.innerHTML = `
          <img
            class="movie-image"
            src="${movie.image || movie.poster || "https://via.placeholder.com/400x600?text=No+Image"}"
            alt="${movie.title}"
            onerror="this.src='https://via.placeholder.com/400x600?text=No+Image'"
          />
          <div class="movie-content">
            <div class="movie-info">
              <div class="movie-title">${movie.title}</div>
              <div class="movie-meta">
                ${movie.year ? `<div>سال: ${movie.year}</div>` : ""}
                ${movie.country ? `<div>کشور: ${movie.country}</div>` : ""}
              </div>
            </div>
            <div class="movie-actions-wrapper">
              ${statusButtonHtml}
              <button type="button" class="remove-watchlist-btn danger" data-movie-id="${movie.id}">
                حذف
              </button>
            </div>
          </div>
        `;

      const statusButton = card.querySelector(".btn-status");
      if (statusButton) {
        statusButton.addEventListener("click", () => {
          const currentStatus = statusButton.getAttribute("data-status");
          const newStatus = currentStatus === "unseen";

          const updated = this.watchList.updateMovieStatus(movie.id, newStatus);

          if (updated) {
            this.renderWatchlist();
            showToast(
              newStatus
                ? "وضعیت به 'دیده شده' تغییر کرد."
                : "وضعیت به 'دیده نشده' تغییر کرد.",
              "info",
            );
          }
        });
      }

      const removeButton = card.querySelector(".remove-watchlist-btn");
      if (removeButton) {
        removeButton.addEventListener("click", () => {
          const removed = this.watchList.removeMovie(movie.id);
          if (removed) {
            this.renderMovieCards(this.currentMovies);
            this.renderWatchlist();
            showToast("حذف شد", "error");
          }
        });
      }

      container.appendChild(card);
    });

    const watchListCount = this.watchList.getList().length;
    const counterElement = document.getElementById("counter");
    if (counterElement) {
      counterElement.innerText = watchListCount;
    }
  }

  loading(status) {
    const loading = this.searchResultsEl;
    const searchBtn = this.searchBtnEl;

    if (status) {
      loading.innerHTML = `
        <div id="loading" class="circular-spinner"></div>
      `;
      searchBtn.disabled = true;
    } else {
      loading.innerHTML = "";
      searchBtn.disabled = false;
    }
  }

  setMovies(movies) {
    this.currentMovies = movies;
  }

  initUIElements() {
    const clearAllBtn = document.getElementById("clear-all-btn");
    if (clearAllBtn) {
      clearAllBtn.addEventListener("click", () => {
        this.watchList.clearAllMovies();
        this.renderWatchlist();
        this.renderMovieCards(this.currentMovies);
        const counter = document.getElementById("counter");
        if (counter) counter.innerText = "0";
        showToast("حذف شد", "error");
      });
    }
  }
}
