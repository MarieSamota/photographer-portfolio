(function () {
  const app = (window.PhotoPortfolio = window.PhotoPortfolio || {});
  const helpers = app.helpers || {};

  const STORAGE_KEY = "photoportfolio-contact-draft";

  app.initContactForm = ({ host }) => {
    if (!host) {
      console.warn("Форма не инициализирована: контейнер не найден.");
      return {
        validateForm: () => false,
      };
    }

    const form = helpers.createElement("form", {
      className: "contact-form",
      attributes: {
        novalidate: "novalidate",
      },
    });

    form.innerHTML = [
      '<h4 class="contact-form__title">Заявка на съемку</h4>',
      '<div class="contact-form__field">',
      '  <label for="contact-name">Имя</label>',
      '  <input id="contact-name" name="name" type="text" required />',
      "</div>",
      '<div class="contact-form__field">',
      '  <label for="contact-email">Email</label>',
      '  <input id="contact-email" name="email" type="email" required />',
      "</div>",
      '<div class="contact-form__field">',
      '  <label for="contact-message">Сообщение</label>',
      '  <textarea id="contact-message" name="message" rows="3" required></textarea>',
      "</div>",
      '<button class="contact-form__submit" type="submit">Отправить</button>',
      '<p class="contact-form__status" aria-live="polite"></p>',
    ].join("\n");

    host.append(form);

    const nameInput = form.querySelector("#contact-name");
    const emailInput = form.querySelector("#contact-email");
    const messageInput = form.querySelector("#contact-message");
    const status = form.querySelector(".contact-form__status");

    const fields = [nameInput, emailInput, messageInput];

    const restoreDraft = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          return;
        }

        const data = JSON.parse(raw);
        nameInput.value = data.name || "";
        emailInput.value = data.email || "";
        messageInput.value = data.message || "";
      } catch (error) {
        console.warn("Черновик формы не удалось восстановить.", error);
      }
    };

    const saveDraft = () => {
      const payload = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    };

    const validateField = (field) => {
      const value = field.value.trim();
      helpers.clearFieldError(field);

      if (!value) {
        helpers.showFieldError(field, "Поле обязательно для заполнения");
        return false;
      }

      if (field.name === "email" && !helpers.validateEmail(value)) {
        helpers.showFieldError(field, "Введите корректный email");
        return false;
      }

      return true;
    };

    const validateForm = () => {
      const results = fields.map((field) => validateField(field));
      return results.every(Boolean);
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!validateForm()) {
        status.textContent = "Проверьте форму: есть ошибки в заполнении.";
        status.classList.add("is-error");
        return;
      }

      status.textContent = "Форма успешно проверена и готова к отправке.";
      status.classList.remove("is-error");
      localStorage.removeItem(STORAGE_KEY);
      form.reset();
    });

    form.addEventListener("input", (event) => {
      const field = event.target.closest("input, textarea");
      if (!field) {
        return;
      }

      helpers.clearFieldError(field);
      saveDraft();
    });

    form.addEventListener(
      "blur",
      (event) => {
        const field = event.target.closest("input, textarea");
        if (!field) {
          return;
        }

        validateField(field);
      },
      true
    );

    restoreDraft();

    return {
      validateForm,
    };
  };
})();
