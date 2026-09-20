import { t } from '../i18n.js';


export function renderFooter() {
  return `
  <!-- Подвал сайта -->
  <footer class="site-footer">
    <!-- Основной контейнер с центрированием контента -->
    <div class="container">
      <!-- Сетка подвала с информацией о бренде и ссылками -->
      <div class="footer-grid">
        
        <!-- Секция с брендом и описанием -->
        <div class="footer-brand">
          <!-- Логотип компании (название) -->
          <div class="logo">
            <span>Witcher</span>Merch
          </div>
          <!-- Описание компании -->
          <p>${t('footerDesc')}</p>
        </div>
        
        <!-- Колонка со ссылками на основные страницы (Аккаунт) -->
        <div class="footer-col">
          <!-- Заголовок колонки -->
          <h4>${t('account')}</h4>
          <!-- Список ссылок -->
          <ul>
            <!-- Ссылка на страницу входа -->
            <li><a href="#/auth">${t('signIn')}</a></li>
            <!-- Ссылка на страницу корзины -->
            <li><a href="#/cart">${t('cart')}</a></li>
            <!-- Ссылка на страницу избранного -->
            <li><a href="#/wishlist">${t('wishlist')}</a></li>
            <!-- Ссылка на страницу заказов -->
            <li><a href="#/orders">${t('orders')}</a></li>
          </ul>
        </div>
      </div>
      
      <!-- Нижняя часть подвала с информацией о копирайте -->
      <div class="footer-bottom">
        <!-- Текст копирайта с текущим годом -->
        <p>&copy; ${new Date().getFullYear()} WitcherMerch. ${t('copyright')}</p>
      </div>
    </div>
  </footer>`;
}