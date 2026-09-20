import './styles/main.scss';
import { registerRoute, initRouter, handleRoute } from './router.js';
import { store } from './store.js';
import { renderHeader, initHeader } from './components/Header.js';
import { renderFooter } from './components/Footer.js';
import { renderCartDrawer, initCartDrawer } from './components/CartDrawer.js';
import { Home } from './pages/Home.js';           // Главная страница
import { Catalog } from './pages/Catalog.js';     // Каталог товаров
import { ProductDetail } from './pages/ProductDetail.js'; // Детальная страница товара
import { Cart } from './pages/Cart.js';           // Страница корзины
import { Checkout } from './pages/Checkout.js';   // Страница оформления заказа
import { Auth } from './pages/Auth.js';           // Страница авторизации/регистрации
import { Wishlist } from './pages/Wishlist.js';   // Страница избранного
import { Orders } from './pages/Orders.js';       // Страница заказов пользователя
import { NotFound } from './pages/NotFound.js';   // Страница 404 (не найдено)

store.loadAuth();


// Главная страница (корневой путь)
registerRoute('/', () => Home());

// Каталог товаров
registerRoute('/catalog', () => Catalog());

// Детальная страница товара. :slug — динамический параметр (уникальный идентификатор товара)
// Функция ProductDetail получит объект params с полем slug
registerRoute('/product/:slug', (params) => ProductDetail(params));

// Корзина
registerRoute('/cart', () => Cart());

// Оформление заказа
registerRoute('/checkout', () => Checkout());

// Авторизация/регистрация
registerRoute('/auth', () => Auth());

// Избранное
registerRoute('/wishlist', () => Wishlist());

// Заказы пользователя
registerRoute('/orders', () => Orders());

// Страница 404
registerRoute('/404', () => NotFound());

// Сохраняем оригинальную функцию handleRoute для возможного расширения функциональности
const originalHandleRoute = handleRoute;

// Получаем ссылку на корневой элемент приложения
const appDiv = document.getElementById('app');

// Сохраняем оригинальную функцию инициализации роутера
const originalInit = initRouter;

// Эта функция вставляет шапку (header) и корзину-шторку (cart drawer) на страницу, если они ещё не были добавлены
function renderLayout() {
  // Ищем элемент шапки по ID
  let headerEl = document.getElementById('site-header');
  
  // Если шапки нет на странице — добавляем её
  if (!headerEl) {
    // Вставляем шапку в начало body
    document.body.insertAdjacentHTML('afterbegin', renderHeader());
    
    // Вставляем HTML корзины-шторки в конец body
    document.body.insertAdjacentHTML('beforeend', renderCartDrawer());
    
    // Инициализируем интерактивность шапки
    initHeader();
    
    // Инициализируем интерактивность корзины
    initCartDrawer();
  }
}

// При изменении хеша URL (hashchange) перерисовываем шапку, чтобы обновить активные ссылки навигации
window.addEventListener('hashchange', () => {
  // Находим существующую шапку
  const existingHeader = document.getElementById('site-header');
  
  if (existingHeader) existingHeader.remove();
  
  // Вставляем новую шапку
  document.body.insertAdjacentHTML('afterbegin', renderHeader());
  
  initHeader();
});

// Подписываемся на изменения в глобальном store
store.subscribe((key) => {
  // Если изменился пользователь (авторизация) или количество товаров в корзине
  if (key === 'user' || key === 'cartCount') {
    // Обновляем шапку (в ней отображается аватар пользователя и счетчик корзины)
    const existingHeader = document.getElementById('site-header');
    if (existingHeader) existingHeader.remove();
    document.body.insertAdjacentHTML('afterbegin', renderHeader());
    initHeader();
  }
});

// Сохраняем оригинальную функцию registerRoute
const origRegisterRoute = registerRoute;

// Пустой объект для хранения маршрутов
const _routes = {};

// Переменная для ссылки на appDiv
const originalAppend = appDiv;

// MutationObserver — API для отслеживания изменений в DOM
// В данном случае используется для автоматического добавления подвала (footer) после рендера страницы
const observer = new MutationObserver(() => {
  // Если подвал уже есть на странице — ничего не делаем
  if (appDiv.querySelector('.site-footer')) return;
  
  // Получаем последний дочерний элемент в appDiv
  const lastChild = appDiv.lastElementChild;
  
  // Если последний элемент существует и это не подвал — добавляем подвал в конец
  if (lastChild && !lastChild.classList.contains('site-footer')) {
    appDiv.insertAdjacentHTML('beforeend', renderFooter());
  }
});

// Начинаем наблюдение за изменениями в appDiv: отслеживаем добавление/удаление дочерних элементов
observer.observe(appDiv, { childList: true });

// Экспортируемая функция для показа всплывающих уведомлений
export function showToast(message, type = 'success') {
  // Находим контейнер для уведомлений
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  // Создаем элемент уведомления
  const toast = document.createElement('div');
  
  // Устанавливаем классы: toast + toast-success или toast-error
  toast.className = `toast toast-${type}`;
  
  // Вставляем HTML: иконки и текст сообщения
  toast.innerHTML = `<span>${type === 'success' ? '✓' : '✕'}</span> ${message}`;
  
  // Добавляем уведомление в контейнер
  container.appendChild(toast);
  
  // Автоматическое скрытие через 3 секунды
  setTimeout(() => {
    // Анимация исчезновения
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    
    // Удаляем элемент из DOM после завершения анимации
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Рендерим шапку и корзину
renderLayout();

// Запускаем роутер (начинаем слушать изменения URL и рендерить соответствующие страницы)
initRouter();

// При событии смены языка перезагружаем страницу, чтобы обновить все тексты
window.addEventListener('lang-change', () => {
  location.reload();
});

const scrollUpBtn = document.getElementById('scroll-up-btn');

// Если кнопка существует — добавляем обработчики
if (scrollUpBtn) {
  // При прокрутке страницы показываем/скрываем кнопку
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollUpBtn.classList.add('visible');
    } else {
      scrollUpBtn.classList.remove('visible');
    }
  });
  
  // При клике на кнопку плавно прокручиваем страницу наверх
  scrollUpBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}