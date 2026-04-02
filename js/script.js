document.addEventListener("DOMContentLoaded", () => {
  const app = window.PhotoPortfolio || {};

  const header = document.querySelector(".header");
  const allCards = document.querySelectorAll(".gallery-item");
  const mainContainer = document.getElementById("main");

  console.log("Найдено элементов:", {
    header,
    cardsCount: allCards.length,
    mainContainer,
  });

  const projectTitle = document.querySelector(".header__logo");
  if (projectTitle) {
    projectTitle.textContent = "Alina Photography | Portfolio";
  }

  const menuToggle = document.getElementById("menu-toggle");
  const navList = document.querySelector(".nav__list");

  if (menuToggle && navList) {
    menuToggle.addEventListener("click", () => {
      navList.classList.toggle("active");
      menuToggle.setAttribute(
        "aria-expanded",
        String(navList.classList.contains("active"))
      );
    });
  }

  const gallery = document.querySelector(".portfolio__gallery");
  if (!gallery) {
    console.warn(
      "Галерея не найдена: интерактивные компоненты портфолио не запущены."
    );
    return;
  }

  const getFilteredItems = () =>
    Array.from(gallery.querySelectorAll(".gallery-item")).filter(
      (item) => !item.classList.contains("is-filter-hidden")
    );

  const slider = app.initPortfolioSlider
    ? app.initPortfolioSlider({
        gallery,
        getItems: getFilteredItems,
      })
    : null;

  if (app.initPortfolioFilter) {
    app.initPortfolioFilter({
      gallery,
      onFilterChange: () => {
        if (slider && typeof slider.reset === "function") {
          slider.reset();
        }
      },
    });
  }

  if (app.initModal) {
    app.initModal({
      gallery,
      getItems: getFilteredItems,
    });
  }

  const contactsInfo = document.querySelector(".business-info");
  if (app.initContactForm) {
    app.initContactForm({ host: contactsInfo });
  }
});
