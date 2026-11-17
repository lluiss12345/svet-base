document.addEventListener("DOMContentLoaded", function() {
    // 1. ОПРЕДЕЛЯЕМ ПУТЬ (мы в папке content или в корне?)
    const isContentPage = window.location.pathname.includes('/content/');
    const prefix = isContentPage ? '../' : '';

    // 2. ВСТАВЛЯЕМ ЧЕРНУЮ ПАНЕЛЬ, ЕСЛИ ЕЁ НЕТ
    if (!document.querySelector(".topnav")) {
        const navHTML = `
            <nav class="topnav">
                <div class="topnav-inner">
                    <a href="${prefix}index.html" class="topnav-link">База знаний</a>
                    <a href="https://svethotel.ru" target="_blank" rel="noopener" class="topnav-link">Сайт отеля</a>
                    <a href="${prefix}trainer.html" class="topnav-link">Тренажёр знаний</a>
                </div>
            </nav>
        `;
        // Вставляем панель в самое начало body
        document.body.insertAdjacentHTML("afterbegin", navHTML);
    }

    // 3. СОЗДАЕМ КНОПКУ "ВВЕРХ"
    if (!document.getElementById("scrollTopBtn")) {
        const btn = document.createElement("button");
        btn.id = "scrollTopBtn";
        btn.title = "Наверх";
        btn.innerHTML = "↑";
        document.body.appendChild(btn);

        window.addEventListener("scroll", function() {
            if (window.scrollY > 300) {
                btn.classList.add("show");
            } else {
                btn.classList.remove("show");
            }
        });

        btn.addEventListener("click", function() {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // 4. ВОЗВРАЩАЕМ ОТСТУПЫ ДЛЯ СТАТЕЙ (чтобы текст не прилипал)
    if (isContentPage) {
        document.body.classList.add('has-topnav');
    }
});