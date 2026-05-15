const MOVIES_API_BASE_URL = "https://moviesapi.ir/api/v1/movies";

class ApiService {
  constructor(title) {
    this.title = title;
  }
  async getMovieInfo() {
    const searchUrl = `${MOVIES_API_BASE_URL}?q=${encodeURIComponent(this.title)}`;

    try {
      const res = await fetch(searchUrl);
      if (!res.ok) {
        throw Error(`Error fetching movie data, status: ${res.status}`);
      }
      const data = await res.json();
      if (!data.data || data.data.length === 0) {
        showToast("فیلمی با این نام در سرور وجود ندارد", "info");
        return [];
      }
      return data.data;
    } catch (error) {
      throw error;
    }
  }
}
