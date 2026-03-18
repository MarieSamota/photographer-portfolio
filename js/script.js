// Ждем, пока прогрузится весь HTML
document.addEventListener("DOMContentLoaded", () => {
  console.log("Скрипт успешно подключен и работает");

  // Бургер-меню: переключение видимости навигации на мобильных устройствах
  const menuToggle = document.getElementById("menu-toggle");
  const navList = document.querySelector(".nav__list");

  if (menuToggle && navList) {
    menuToggle.addEventListener("click", () => {
      navList.classList.toggle("active");
      menuToggle.setAttribute(
        "aria-expanded",
        navList.classList.contains("active")
      );
    });
  }
});
