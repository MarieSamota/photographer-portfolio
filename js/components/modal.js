(function () {
  const app = (window.PhotoPortfolio = window.PhotoPortfolio || {});
  const helpers = app.helpers || {};

  const getImageMeta = (figure) => {
    const image = figure?.querySelector(".gallery-item__img");
    const caption = figure?.querySelector(".gallery-item__caption");

    return {
      src: image?.getAttribute("src") || "",
      alt: image?.getAttribute("alt") || "Фотография",
      title: image?.getAttribute("title") || caption?.textContent || "Фото",
    };
  };

  app.initModal = ({ gallery, getItems }) => {
    if (!gallery || typeof getItems !== "function") {
      console.warn(
        "Модальное окно не инициализировано: нет галереи или источника фото."
      );
      return {
        refresh: () => undefined,
      };
    }

    const overlay = helpers.createElement("div", {
      className: "portfolio-modal",
      attributes: {
        role: "dialog",
        "aria-modal": "true",
        "aria-hidden": "true",
      },
    });

    overlay.innerHTML = [
      '<div class="portfolio-modal__content">',
      '  <button class="portfolio-modal__close" type="button" aria-label="Закрыть окно">&times;</button>',
      '  <button class="portfolio-modal__side-btn portfolio-modal__side-btn--left" type="button" data-action="prev" aria-label="Предыдущее фото">&#10094;</button>',
      '  <img class="portfolio-modal__image" alt="Увеличенное фото" />',
      '  <button class="portfolio-modal__side-btn portfolio-modal__side-btn--right" type="button" data-action="next" aria-label="Следующее фото">&#10095;</button>',
      '  <p class="portfolio-modal__caption"></p>',
      "</div>",
    ].join("\n");

    document.body.append(overlay);

    const imageElement = overlay.querySelector(".portfolio-modal__image");
    const captionElement = overlay.querySelector(".portfolio-modal__caption");
    const closeButton = overlay.querySelector(".portfolio-modal__close");
    const prevButton = overlay.querySelector('[data-action="prev"]');
    const nextButton = overlay.querySelector('[data-action="next"]');

    let currentItems = [];
    let currentIndex = 0;
    let isOpen = false;

    const refresh = () => {
      currentItems = getItems();
      if (!Array.isArray(currentItems)) {
        currentItems = [];
      }

      if (currentItems.length === 0) {
        currentIndex = 0;
      } else {
        currentIndex = helpers.clampIndex(currentIndex, currentItems.length);
      }
    };

    const render = () => {
      if (currentItems.length === 0) {
        captionElement.textContent = "Нет доступных фотографий";
        imageElement.removeAttribute("src");
        imageElement.alt = "Фотографии не найдены";
        return;
      }

      const item = currentItems[currentIndex];
      const { src, alt, title } = getImageMeta(item);
      imageElement.src = src;
      imageElement.alt = alt;
      captionElement.textContent = title;
    };

    const open = (index = 0) => {
      refresh();
      if (currentItems.length === 0) {
        console.warn("Модальное окно: нет элементов для отображения.");
        return;
      }

      currentIndex = helpers.clampIndex(index, currentItems.length);
      render();

      isOpen = true;
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("is-modal-open");
      closeButton.focus();
    };

    const close = () => {
      isOpen = false;
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("is-modal-open");
    };

    const move = (step) => {
      if (!isOpen || currentItems.length === 0) {
        return;
      }

      currentIndex = helpers.clampIndex(
        currentIndex + step,
        currentItems.length
      );
      render();
    };

    imageElement.addEventListener("error", () => {
      captionElement.textContent = "Изображение не удалось загрузить";
      imageElement.alt = "Ошибка загрузки изображения";
      imageElement.removeAttribute("src");
    });

    closeButton.addEventListener("click", close);
    prevButton.addEventListener("click", () => move(-1));
    nextButton.addEventListener("click", () => move(1));

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        close();
      }
    });

    gallery.addEventListener("click", (event) => {
      const image = event.target.closest(".gallery-item__img");
      if (!image) {
        return;
      }

      const figure = image.closest(".gallery-item");
      refresh();

      const figureIndex = currentItems.findIndex((item) => item === figure);
      if (figureIndex === -1) {
        console.warn("Выбранное изображение недоступно в текущем списке.");
        return;
      }

      open(figureIndex);
    });

    document.addEventListener("keydown", (event) => {
      if (!isOpen) {
        return;
      }

      if (event.key === "Escape") {
        close();
      }

      if (event.key === "ArrowLeft") {
        move(-1);
      }

      if (event.key === "ArrowRight") {
        move(1);
      }
    });

    return {
      refresh,
      close,
    };
  };
})();
