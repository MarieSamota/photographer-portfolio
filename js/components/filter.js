(function () {
  const app = (window.PhotoPortfolio = window.PhotoPortfolio || {});
  const helpers = app.helpers || {};

  app.initPortfolioFilter = ({ gallery, onFilterChange }) => {
    if (!gallery) {
      console.warn("Фильтр не инициализирован: галерея не найдена.");
      return {
        getActiveCategory: () => "all",
      };
    }

    const figures = helpers.qsa(".gallery-item", gallery);
    if (figures.length === 0) {
      console.warn("Фильтр не инициализирован: в галерее нет карточек.");
      return {
        getActiveCategory: () => "all",
      };
    }

    const categoriesMap = new Map();
    figures.forEach((figure) => {
      const caption = figure.querySelector(".gallery-item__caption");
      const label = caption ? caption.textContent.trim() : "Без категории";
      const key = helpers.normalizeCategory(label || "без-категории");
      figure.dataset.category = key;

      if (!categoriesMap.has(key)) {
        categoriesMap.set(key, label);
      }
    });

    const filterWrap = helpers.createElement("div", {
      className: "portfolio-filter",
      attributes: {
        role: "group",
        "aria-label": "Фильтр работ по категориям",
      },
    });

    gallery.before(filterWrap);

    const options = [{ key: "all", label: "Все" }].concat(
      Array.from(categoriesMap.entries()).map(([key, label]) => ({
        key,
        label,
      }))
    );

    options.forEach(({ key, label }) => {
      helpers.createElement("button", {
        className: "portfolio-filter__btn",
        text: label,
        parent: filterWrap,
        attributes: {
          type: "button",
          "data-filter": key,
          "aria-pressed": key === "all" ? "true" : "false",
        },
      });
    });

    const emptyState = helpers.createElement("p", {
      className: "portfolio-filter__empty",
      text: "По выбранной категории пока нет фотографий.",
    });
    emptyState.hidden = true;
    gallery.after(emptyState);

    let activeCategory = "all";

    const applyFilter = (category) => {
      activeCategory = category;
      const shown = [];

      figures.forEach((figure) => {
        const matches =
          category === "all" || figure.dataset.category === category;
        figure.classList.toggle("is-filter-hidden", !matches);

        if (matches) {
          shown.push(figure);
        }
      });

      emptyState.hidden = shown.length !== 0;

      helpers.qsa(".portfolio-filter__btn", filterWrap).forEach((button) => {
        const isCurrent = button.dataset.filter === category;
        button.classList.toggle("is-active", isCurrent);
        button.setAttribute("aria-pressed", String(isCurrent));
      });

      if (typeof onFilterChange === "function") {
        onFilterChange({ activeCategory, shownItems: shown });
      }
    };

    filterWrap.addEventListener("click", (event) => {
      const button = event.target.closest(".portfolio-filter__btn");
      if (!button) {
        return;
      }

      applyFilter(button.dataset.filter || "all");
    });

    applyFilter(activeCategory);

    return {
      getActiveCategory: () => activeCategory,
      applyFilter,
    };
  };
})();
