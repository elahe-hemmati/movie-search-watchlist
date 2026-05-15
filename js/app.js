const searchForm = document.getElementById("search");
const searchInput = document.getElementById("search-input");
const clearBtn = document.getElementById("clear-search-btn");
const watchList = new WatchListManager();

const app = new WatchAppUI({
  watchList: watchList,
  currentMovies: [],
});
app.initUIElements();

if (searchForm && searchInput) {
  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const searchTerm = searchInput.value.trim();

    if (!searchTerm) {
      app.loading(false);
      showToast("نام فیلم را وارد کنید", "warn");
      return;
    }

    app.loading(true);
    try {
      const apiServis = new ApiService(searchTerm);
      const movieData = await apiServis.getMovieInfo();
      app.setMovies(movieData);

      app.loading(false);
      app.renderMovieCards(movieData);
      app.renderWatchlist();
      app.initUIElements();
    } catch (error) {
      app.loading(false);
      showToast("خطا در دریافت اطلاعات فیلم. لطفاً دوباره تلاش کنید.", "error");
    }
  });
} else {
  console.error("Could not find the search form or input element.");
}

document.addEventListener("DOMContentLoaded", () => {
  app.renderWatchlist();
});

if (clearBtn && searchInput) {
  clearBtn.addEventListener("click", (e) => {
    e.preventDefault();
    searchInput.value = "";
    searchInput.focus();
  });
}

// set year
date.innerHTML = new Date().getFullYear();