(function () {
  const app = (window.PhotoPortfolio = window.PhotoPortfolio || {});

  const qsa = (selector, scope = document) =>
    Array.from(scope.querySelectorAll(selector));

  const createElement = (tagName, options = {}) => {
    const element = document.createElement(tagName);
    const { className, text, attributes = {}, parent } = options;

    if (className) {
      element.className = className;
    }

    if (typeof text === "string") {
      element.textContent = text;
    }

    Object.entries(attributes).forEach(([name, value]) => {
      element.setAttribute(name, String(value));
    });

    if (parent) {
      parent.append(element);
    }

    return element;
  };

  const normalizeCategory = (value) =>
    value.trim().toLowerCase().replace(/\s+/g, "-");

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(String(email).trim());
  };

  const clearFieldError = (input) => {
    if (!input) {
      return;
    }

    input.classList.remove("is-invalid");

    const parent = input.closest(".contact-form__field");

    if (!parent) {
      return;
    }

    const error = parent.querySelector(".contact-form__error");
    if (error) {
      error.remove();
    }
  };

  const showFieldError = (input, message) => {
    if (!input) {
      return;
    }

    clearFieldError(input);
    input.classList.add("is-invalid");

    const parent = input.closest(".contact-form__field");
    if (!parent) {
      return;
    }

    createElement("p", {
      className: "contact-form__error",
      text: message,
      parent,
    });
  };

  const clampIndex = (value, length) => {
    if (length <= 0) {
      return 0;
    }

    const normalized = value % length;
    return normalized < 0 ? normalized + length : normalized;
  };

  app.helpers = {
    qsa,
    createElement,
    normalizeCategory,
    validateEmail,
    clearFieldError,
    showFieldError,
    clampIndex,
  };
})();
