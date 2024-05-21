const portfolioId = "portfolioId";
const darkMode = "darkMode";

class LocalStorage {
  setPortfolioId(id: string) {
    localStorage.setItem(portfolioId, id);
  }
  getPortfolioId() {
    return localStorage.getItem(portfolioId);
  }

  setDarkMode(bool: "0" | "1") {
    localStorage.setItem(darkMode, bool);
  }
  getDarkMode() {
    return localStorage.getItem(darkMode);
  }
}

export const ls = new LocalStorage();
