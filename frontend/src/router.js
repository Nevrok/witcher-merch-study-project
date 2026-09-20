// Объект для хранения зарегистрированных маршрутов.
const routes = {};

// Переменная для хранения функции очистки текущей страницы.
let currentCleanup = null;


// Регистрирует новый маршрут в роутере

export function registerRoute(path, handler) {
  routes[path] = handler;
}


// Выполняет навигацию на указанный путь.

export function navigate(path) {
  window.location.hash = path;
}

export function getCurrentPath() {
  // window.location.hash возвращает строку с '#'
  // .slice(1) удаляет первый символ, оставляя '/catalog'
  // Если hash пустой, используем '/' как значение по умолчанию
  const hash = window.location.hash.slice(1) || '/';
  
  // split('?')[0] отбрасывает query-параметры (например, '/product?id=1' превращается в '/product')
  return hash.split('?')[0];
}


// Основная функция обработки маршрута.

export async function handleRoute() {
  // Получаем текущий путь из URL
  const path = getCurrentPath();
  
  // Находим DOM-элемент, в который будет вставлен контент страницы
  const app = document.getElementById('app');

  // Если у предыдущей страницы была функция очистки — вызываем её
  if (currentCleanup) {
    currentCleanup();      // Удаляем обработчики, отписываемся от событий
    currentCleanup = null; // Обнуляем ссылку, чтобы не вызвать повторно
  }

  // Сначала ищем точное совпадение пути в объекте routes
  let handler = routes[path];
  let params = {}; // Объект для хранения динамических параметров (например, { slug: 'wolf-sword' })

  // Если точное совпадение не найдено — ищем динамический маршрут
  if (!handler) {
    // Перебираем все зарегистрированные маршруты
    for (const [pattern, h] of Object.entries(routes)) {
      // Преобразуем паттерн маршрута в регулярное выражение
      // Заменяем :param на именованную захватывающую группу
      // Например, '/product/:slug' превращается в '^/product/(?<slug>[^/]+)$'
      const regex = pattern.replace(/:([^/]+)/g, '(?<$1>[^/]+)');
      
      // Проверяем, соответствует ли текущий путь этому регулярному выражению
      const match = path.match(new RegExp(`^${regex}$`));
      
      if (match) {
        // Если совпадение найдено — сохраняем обработчик
        handler = h;
        // Сохраняем параметры из именованных групп (например, { slug: 'wolf-sword' })
        params = match.groups || {};
        break; // Выходим из цикла, так как маршрут найден
      }
    }
  }

  // Если обработчик всё ещё не найден — используем обработчик 404
  if (!handler) {
    // Берем маршрут '/404' или, если его нет, встроенную заглушку
    handler = routes['/404'] || (() => '<div class="not-found container"><div class="nf-code">404</div><h2>Page Not Found</h2></div>');
  }

  // Делаем элемент #app прозрачным (анимация исчезновения)
  app.style.opacity = '0';
  
  // Прокручиваем страницу наверх (instant — мгновенно, без анимации)
  window.scrollTo({ top: 0, behavior: 'instant' });
  
  // Ждем 200 миллисекунд, чтобы анимация исчезновения успела завершиться
  await new Promise(r => setTimeout(r, 200));

  // Вызываем обработчик, передавая ему параметры из URL
  const result = await handler(params);
  
  // Если обработчик вернул строку — просто вставляем её в #app
  if (typeof result === 'string') {
    app.innerHTML = result;
  }

  // Если обработчик вернул объект с полями html и init — расширенный режим
  if (result && typeof result === 'object') {
    // Вставляем HTML-код страницы
    if (result.html) app.innerHTML = result.html;
    
    // Если есть функция инициализации — вызываем её и сохраняем cleanup-функцию
    // cleanup вызывается при уходе со страницы для очистки ресурсов
    if (result.init) currentCleanup = result.init() || null;
  }

  // requestAnimationFrame гарантирует, что изменение opacity произойдет после
  // того, как браузер завершит текущий цикл рендеринга
  requestAnimationFrame(() => {
    app.style.opacity = '1'; // Плавное появление новой страницы
  });
}

/**
 * Инициализирует роутер.
 */
export function initRouter() {
  // Подписываемся на событие изменения hash в URL
  // При каждом изменении будет вызываться handleRoute
  window.addEventListener('hashchange', handleRoute);
  
  // Если в URL нет hash — устанавливаем '/'
  if (!window.location.hash) {
    window.location.hash = '/';
  } else {
    // Если hash уже есть — обрабатываем текущий маршрут сразу
    handleRoute();
  }
}