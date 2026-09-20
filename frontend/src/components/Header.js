import { icons } from './icons.js';
import { store } from '../store.js';
import { navigate, getCurrentPath } from '../router.js';
import { t, getLang, toggleLang } from '../i18n.js';


export function renderHeader() {
  // Получаем данные пользователя из store (null, если не авторизован)
  const user = store.get('user');
  
  // Получаем количество товаров в корзине (или 0, если не задано)
  const cartCount = store.get('cartCount') || 0;
  
  // Получаем текущий путь для подсветки активной ссылки
  const path = getCurrentPath();
  
  // Получаем текущий язык
  const lang = getLang();

  const navLink = (href, label) =>
    `<a href="#${href}" class="${path === href ? 'active' : ''}">${label}</a>`;

  return `
  <header class="site-header" id="site-header">
    <div class="header-inner">
      <a href="#/" class="logo"><span>Witcher</span>Merch</a>
      
      <nav id="main-nav">
        ${navLink('/', t('home'))}                    
        ${navLink('/catalog', t('catalog'))}         
        ${user ? navLink('/wishlist', t('wishlist')) : ''} 
        ${user ? navLink('/orders', t('orders')) : ''}   
      </nav>
      
      <div class="header-actions">
        <button class="lang-toggle" id="lang-toggle" title="Сменить язык">
          <span class="lang-flag">${lang === 'ru' ? '🇷🇺' : '🇬🇧'}</span>
          <span class="lang-code">${lang.toUpperCase()}</span>
        </button>
        
        ${user ? `
          <button class="btn-icon" id="cart-toggle" title="${t('cart')}" style="position:relative">
            ${icons.cart}                               
            ${cartCount > 0 ? `<span class="cart-count">${cartCount}</span>` : ''} 
          </button>
          
          <div class="user-dropdown-container">
            <button class="btn-icon" id="user-menu-btn" title="${user.username}">
              ${icons.user}
            </button>
            
            <div class="user-dropdown" id="user-dropdown">
              <div class="user-info">
                <strong>${user.username}</strong>        
                <span>${user.email || ''}</span>          
              </div>
              <a href="#/wishlist" class="dropdown-link">${t('wishlist')}</a>
              <a href="#/orders" class="dropdown-link">${t('orders')}</a>
              <div style="padding: 12px; border-top: 1px solid #2a221f;">
                <button id="logout-btn" class="btn btn-outline" style="width:100%; padding:8px;">${t('logout')}</button>
              </div>
            </div>
          </div>
        ` : `
          <a href="#/auth" class="btn btn-outline" style="padding:8px 20px;font-size:0.8rem;">${t('signIn')}</a>
        `}
        
        <div class="mobile-menu-btn" id="mobile-menu-btn">
          <span></span><span></span><span></span>       
        </div>
      </div>
    </div>
  </header>`;
}

/**
 * Инициализирует интерактивность шапки:
 * - Эффект скролла (прозрачность/заливка)
 * - Открытие/закрытие корзины
 * - Выход из аккаунта
 * - Выпадающее меню пользователя
 * - Мобильное меню
 * - Переключение языка
 */
export function initHeader() {
  // Находим элемент шапки по ID
  const header = document.getElementById('site-header');
  // Если шапка не найдена — выходим
  if (!header) return;

  // Функция добавляет/удаляет класс 'scrolled' при прокрутке более 50px
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 50);
  
  // Подписываемся на событие прокрутки
  window.addEventListener('scroll', onScroll);
  
  // Вызываем сразу, чтобы установить начальное состояние
  onScroll();

  // Находим кнопку корзины
  const cartBtn = document.getElementById('cart-toggle');
  if (cartBtn) {
    // При клике открываем корзину (шторку)
    cartBtn.addEventListener('click', () => store.toggleCart(true));
  }

  // Находим кнопку выхода
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      store.setAuth(null);       // Очищаем данные авторизации
      navigate('/');             // Перенаправляем на главную
      location.reload();         // Перезагружаем страницу для обновления состояния
    });
  }

  // Находим кнопку профиля и выпадающее меню
  const userMenuBtn = document.getElementById('user-menu-btn');
  const userDropdown = document.getElementById('user-dropdown');
  
  if (userMenuBtn && userDropdown) {
    // При клике на кнопку профиля — переключаем видимость меню
    userMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();       // Останавливаем всплытие, чтобы не закрылось сразу
      userDropdown.classList.toggle('show');
    });
    
    // При клике в любом месте страницы — закрываем меню
    document.addEventListener('click', (e) => {
      // Если клик был НЕ внутри меню И НЕ по кнопке профиля
      if (!userDropdown.contains(e.target) && e.target !== userMenuBtn) {
        userDropdown.classList.remove('show');
      }
    });
  }

  // Находим кнопку мобильного меню и навигационный блок
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const nav = document.getElementById('main-nav');
  
  if (mobileBtn && nav) {
    // При клике на гамбургер — переключаем класс open (показывает/скрывает меню)
    mobileBtn.addEventListener('click', () => nav.classList.toggle('open'));
  }

  // Находим кнопку переключения языка
  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      toggleLang();              // Переключаем язык (ru <-> en)
      location.reload();         // Перезагружаем страницу для применения всех переводов
    });
  }

  // Возвращаем функцию, удаляющую обработчик скролла (для предотвращения утечек памяти)
  return () => window.removeEventListener('scroll', onScroll);
}