class WatchListManager {
  constructor(storageKey = "watchlist") {
    this.storageKey = storageKey;
    this.list = JSON.parse(localStorage.getItem(this.storageKey)) || [];
  }

  getList() {
    return this.list;
  }

  saveList(list) {
    this.list = list;
    localStorage.setItem(this.storageKey, JSON.stringify(list));
  }

  isMovieInList(movieId) {
    return this.getList().some((m) => String(m.id) === String(movieId));
  }

  addMovie(movie) {
    const list = this.getList();
    const alreadyInWatchlist = list.some(
      (m) => String(m.id) === String(movie.id),
    );
    if (alreadyInWatchlist) {
      return false;
    }
    const newMovie = { ...movie, watched: false };

    list.push(newMovie);
    this.saveList(list);
    showToast("اضافه شد", "success");

    return true;
  }

  updateMovieStatus(movieId, watchedStatus) {
    const list = this.getList();
    const movieIndex = list.findIndex((m) => String(m.id) === String(movieId));

    if (movieIndex > -1) {
      list[movieIndex].watched = watchedStatus;
      this.saveList(list);
      return true;
    }
    return false;
  }

  removeMovie(movieId) {
    const oldLength = this.list.length;

    const newList = this.list.filter((m) => String(m.id) !== String(movieId));

    if (newList.length === oldLength) return false;

    this.saveList(newList);
    return true;
  }

  clearAllMovies() {
    this.list = [];
    localStorage.removeItem(this.storageKey);
  }
}
