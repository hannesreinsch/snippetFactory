import axios from "axios";

const service = axios.create({
  baseURL:
    process.env.NODE_ENV === "production" ? "/api" : "http://localhost:3030/api"
});

const errHandler = err => {
  console.error(err);
  throw err;
};

export default {
  service: service,

  getSnippets() {
    return service
      .get("/snippets/")
      .then(res => res.data)
      .catch(errHandler);
  },

  getRecentSnippets() {
    return service
      .get("/snippets/recent")
      .then(res => res.data)
      .catch(errHandler);
  },

  getPopularSnippets() {
    return service
      .get("/snippets/most-popular")
      .then(res => res.data)
      .catch(errHandler);
  },

  postSnippet(data) {
    return service
      .post("/snippets", data)
      .then(res => res.data)
      .catch(errHandler);
  },

  deleteSnippet(snippetId) {
    return service
      .delete("/snippets/delete/" + snippetId, snippetId)
      .then(res => res.data)
      .catch(errHandler);
  },

  getProfile(username) {
    return service
      .get("/profile/" + username)
      .then(res => res.data)
      .catch(errHandler);
  },

  updateProfile(username, data) {
    return service
      .put("/profile/" + username, data)
      .then(res => res.data)
      .catch(errHandler);
  },

  deleteProfile(username) {
    return service
      .delete("/profile/" + username)
      .then(res => res.data)
      .catch(errHandler);
  },

  postFavorite(snippetId) {
    return service
      .post(`profile/snippets/${snippetId}/favorites`)
      .then(res => res.data)
      .catch(errHandler);
  },

  removeFavorite(snippetId) {
    return service
      .delete(`profile/snippets/${snippetId}/favorites`)
      .then(res => res.data)
      .catch(errHandler);
  },

  signup(userInfo) {
    return service
      .post("/signup", userInfo)
      .then(res => res.data)
      .catch(errHandler);
  },

  login(email, password) {
    return service
      .post("/login", {
        email,
        password
      })
      .then(res => {
        const { data } = res;
        localStorage.setItem("user", JSON.stringify(data));
        axios.defaults.headers.common["Authorization"] = "Bearer " + data.token;
        return data;
      })
      .catch(errHandler);
  },

  logout() {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("user");
  },

  loadUser() {
    const userData = localStorage.getItem("user");
    if (!userData) return false;
    const user = JSON.parse(userData);
    if (user.token && user.username) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + user.token;
      return user;
    }
    return false;
  },

  isLoggedIn() {
    return localStorage.getItem("user") != null;
  },

  addPicture(file) {
    const formData = new FormData();
    formData.append("picture", file);
    return service
      .post("/users/first-user/pictures", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(res => res.data)
      .catch(errHandler);
  },

  formatDate(date, format = "shortdate") {
    let jsDate = new Date(Date.parse(date));
    let formatted = jsDate.toLocaleDateString();
    return formatted;
  }
};
