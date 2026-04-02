(function () {
  const app = (window.PhotoPortfolio = window.PhotoPortfolio || {});
  const helpers = app.helpers || {};

  app.initPortfolioSlider = ({ gallery, getItems }) => {
    if (!gallery || typeof getItems !== "function") {
      console.warn("Слайдер не инициализирован: недостаточно данных.");
      return {
        refresh: () => undefined,
      };
    }

    const controls = helpers.createElement("div", {
      className: "portfolio-slider",
      attributes: {
        role: "region",
        "aria-label": "Слайдер портфолио",
      },
    });

    controls.innerHTML = [
      '<button type="button" class="portfolio-slider__btn" data-action="prev" aria-label="Предыдущий слайд">&#10094;</button>',
      '<p class="portfolio-slider__status" aria-live="polite"></p>',
      '<button type="button" class="portfolio-slider__btn" data-action="next" aria-label="Следующий слайд">&#10095;</button>',
    ].join("\n");

    gallery.after(controls);

    const prevButton = controls.querySelector('[data-action="prev"]');
    const nextButton = controls.querySelector('[data-action="next"]');
    const status = controls.querySelector(".portfolio-slider__status");

    let pageIndex = 0;

    const getPerPage = () => (window.innerWidth < 768 ? 1 : 2);

    const refresh = () => {
      const activeItems = getItems();
      const perPage = getPerPage();
      const pagesCount = Math.max(1, Math.ceil(activeItems.length / perPage));

      pageIndex = helpers.clampIndex(pageIndex, pagesCount);

      const start = pageIndex * perPage;
      const end = start + perPage;

      helpers.qsa(".gallery-item", gallery).forEach((item) => {
        item.classList.remove("is-slider-hidden");
      });

      activeItems.forEach((item, index) => {
        const inRange = index >= start && index < end;
        item.classList.toggle("is-slider-hidden", !inRange);
      });

      status.textContent = `Слайд ${pageIndex + 1} из ${pagesCount}`;

      const shouldDisable = activeItems.length <= perPage;
      prevButton.disabled = shouldDisable;
      nextButton.disabled = shouldDisable;
    };

    const move = (step) => {
      const activeItems = getItems();
      if (activeItems.length === 0) {
        return;
      }

      const perPage = getPerPage();
      const pagesCount = Math.max(1, Math.ceil(activeItems.length / perPage));
      pageIndex = helpers.clampIndex(pageIndex + step, pagesCount);
      refresh();
    };

    controls.addEventListener("click", (event) => {
      const button = event.target.closest(".portfolio-slider__btn");
      if (!button) {
        return;
      }

      const action = button.dataset.action;
      if (action === "prev") {
        move(-1);
      }

      if (action === "next") {
        move(1);
      }
    });

    document.addEventListener("keydown", (event) => {
      const modalIsOpen = document.body.classList.contains("is-modal-open");
      if (modalIsOpen) {
        return;
      }

      if (event.key === "ArrowLeft") {
        move(-1);
      }

      if (event.key === "ArrowRight") {
        move(1);
      }
    });

    window.addEventListener("resize", refresh);

    refresh();

    return {
      refresh,
      reset: () => {
        pageIndex = 0;
        refresh();
      },
    };
  };
})();
