import { renderProductCard } from '../components/ProductCard.js';
import { api } from '../api.js';
import { store } from '../store.js';
import { showToast } from '../main.js';
import { initScrollAnimations } from '../animations/scroll.js';
import { initParallax } from '../animations/parallax.js';
import { t } from '../i18n.js';

export function Home() {
  const html = `
    <!-- Секция Hero (главный баннер) -->
    <section class="hero" id="hero">
      <div class="hero-bg" id="hero-bg"></div>           <!-- Фоновое изображение для параллакса -->
      <div class="hero-overlay"></div>                  <!-- Затемняющий оверлей -->
      <div class="hero-content">
        <div class="hero-badge reveal-scale">${t('heroBadge')}</div>  <!-- Бейдж "Коллекция фан-мерча" -->
        <h1 class="hero-title reveal">${t('heroTitle')}</h1>          <!-- Заголовок с возможностью HTML-тегов -->
        <p class="hero-desc reveal">${t('heroDesc')}</p>              <!-- Описание -->
        <div class="hero-buttons reveal">
          <a href="#/catalog" class="btn btn-primary">${t('browseCatalog')}</a>          <!-- Кнопка перехода в каталог -->
          <a href="#/catalog?featured=true" class="btn btn-outline">${t('featuredItems')}</a> <!-- Кнопка избранных товаров -->
        </div>
      </div>
    </section>

    <!-- Секция категорий товаров -->
    <section class="section categories-section">
      <div class="container">
        <h2 class="section-title reveal">${t('shopByCategory')}</h2>           <!-- Заголовок "Категории" -->
        <p class="section-subtitle reveal">${t('shopByCategorySub')}</p>       <!-- Подзаголовок -->
        <div class="categories-grid" id="categories-grid">
          <div class="spinner"></div>                                           <!-- Спиннер загрузки -->
        </div>
      </div>
    </section>

    <!-- Секция популярных товаров (Featured) -->
    <section class="section featured-section">
      <div class="container">
        <h2 class="section-title reveal">${t('featuredMerch')}</h2>            <!-- "Популярные товары" -->
        <p class="section-subtitle reveal">${t('featuredMerchSub')}</p>        <!-- Подзаголовок -->
        <div class="product-grid" id="featured-grid">
          <div class="spinner"></div>                                           <!-- Спиннер загрузки -->
        </div>
      </div>
    </section>
    <!-- Секция статистики с анимированными счетчиками -->
    <section class="section stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item reveal">
            <div class="stat-number" data-target="350">0</div>                  <!-- Счетчик товаров -->
            <div class="stat-label">${t('statProducts')}</div>
          </div>
          <div class="stat-item reveal">
            <div class="stat-number" data-target="12000">0</div>                <!-- Счетчик клиентов -->
            <div class="stat-label">${t('statCustomers')}</div>
          </div>
          <div class="stat-item reveal">
            <div class="stat-number" data-target="5">0</div>                    <!-- Счетчик категорий -->
            <div class="stat-label">${t('statCategories')}</div>
          </div>
          <div class="stat-item reveal">
            <div class="stat-number" data-target="98">0</div>                   <!-- Счетчик удовлетворенности -->
            <div class="stat-label">${t('statSatisfaction')}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Секция отзывов покупателей -->
    <section class="section reviews-section">
      <div class="container">
        <h2 class="section-title reveal">${t('reviews')}</h2>                   <!-- "Отзывы покупателей" -->
        <p class="section-subtitle reveal">${t('reviewsSub')}</p>               <!-- Подзаголовок -->
        <div class="reviews-grid">
          <!-- Карточка отзыва 1 -->
          <div class="review-card reveal">
            <div class="review-stars">★★★★★</div>                              <!-- 5 звезд -->
            <p class="review-text">"${t('review1')}"</p>                        <!-- Текст отзыва -->
            <div class="review-author">
              <div class="review-avatar">В</div>                                <!-- Аватар (инициал) -->
              <div>
                <div class="review-name">${t('review1Author')}</div>            <!-- Имя автора -->
                <div class="review-role">${t('review1Role')}</div>              <!-- Роль/звание -->
              </div>
            </div>
          </div>
          <!-- Карточка отзыва 2 -->
          <div class="review-card reveal">
            <div class="review-stars">★★★★★</div>
            <p class="review-text">"${t('review2')}"</p>
            <div class="review-author">
              <div class="review-avatar">Т</div>
              <div>
                <div class="review-name">${t('review2Author')}</div>
                <div class="review-role">${t('review2Role')}</div>
              </div>
            </div>
          </div>
          <!-- Карточка отзыва 3 -->
          <div class="review-card reveal">
            <div class="review-stars">★★★★★</div>
            <p class="review-text">"${t('review3')}"</p>
            <div class="review-author">
              <div class="review-avatar">Л</div>
              <div>
                <div class="review-name">${t('review3Author')}</div>
                <div class="review-role">${t('review3Role')}</div>
              </div>
            </div>
          </div>
          <!-- Карточка отзыва 4 -->
          <div class="review-card reveal">
            <div class="review-stars">★★★★★</div>
            <p class="review-text">"${t('review4')}"</p>
            <div class="review-author">
              <div class="review-avatar">Й</div>
              <div>
                <div class="review-name">${t('review4Author')}</div>
                <div class="review-role">${t('review4Role')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
  return {
    html,           
    init() {        
      loadCategories();   // Загружаем и рендерим категории
      loadFeatured();     // Загружаем популярные товары
      
      const cleanupScroll = initScrollAnimations();   // Инициализируем анимации при скролле
      const cleanupParallax = initParallax();         // Инициализируем параллакс-эффекты
      
      // Возвращаем функцию очистки, которая будет вызвана при уходе со страницы
      return () => {
        cleanupScroll?.();    // Очищаем ScrollTrigger-анимации
        cleanupParallax?.();  // Очищаем параллакс-эффекты
      };
    }
  };
}

// Объект, сопоставляющий slug категории с URL изображения.
// Если для категории нет картинки — используется дефолтная.
const categoryImages = {
  'swords-weapons': 'https://avatars.mds.yandex.net/i?id=d906a94de0792fb90c03008fec24c910_l-5232624-images-thumbs&n=13',
  'apparel': 'https://cdn1.ozone.ru/s3/multimedia-0/c600/6108443880.jpg',
  'potions-alchemy': 'https://ir.ozone.ru/s3/multimedia-1-q/wc1000/8209420406.jpg',
  'books-lore': 'https://ir.ozone.ru/s3/multimedia-1-l/wc1000/8343628869.jpg',
  'collectibles-figures': 'https://img-edg.joomcdn.net/cae20835fb69888149bf29c04fcec8c4fb16d064_original.jpeg'
};

async function loadCategories() {
  // Находим контейнер для категорий
  const grid = document.getElementById('categories-grid');
  if (!grid) return;  // Если контейнера нет — выходим
  
  try {
    const categories = await api.getCategories();
        grid.innerHTML = categories.map(cat => `
      <a href="#/catalog?categoryId=${cat.id}" class="category-card reveal">
        <!-- Изображение категории: берем из объекта categoryImages или дефолтное -->
        <img src="${categoryImages[cat.slug] || 'https://img-edg.joomcdn.net/cae20835fb69888149bf29c04fcec8c4fb16d064_original.jpeg'}" 
             alt="${cat.name}" />
        <div class="category-overlay">
          <div class="category-name">${cat.name}</div>
          <div class="category-count">${cat.productCount} ${t('items')}</div>  <!-- Количество товаров в категории -->
        </div>
      </a>
    `).join('');
    
    initScrollAnimations();
  } catch {
    grid.innerHTML = `<p style="text-align:center;color:#6B5B4E">${t('noProducts')}</p>`;
  }
}
async function loadFeatured() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;
  
  try {
    const products = await api.getFeatured(8);
      grid.innerHTML = '';
    
    // Для каждого товара создаем карточку через renderProductCard и добавляем в grid
    products.map(p => renderProductCard(p)).forEach(node => grid.appendChild(node));
    
    // Привязываем обработчики кнопок (добавление в корзину, избранное)
    bindCardActions(grid);
    
    // Повторно инициализируем анимации
    initScrollAnimations();
  } catch {
    grid.innerHTML = `<p style="text-align:center;color:#6B5B4E">${t('noProducts')}</p>`;
  }
}

/**
 * @param {HTMLElement} container 
 */
function bindCardActions(container) {
  container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();       // Предотвращаем переход по ссылке
      e.stopPropagation();      // Останавливаем всплытие события
      
      // Проверяем авторизацию
      if (!store.isAuthenticated()) {
        showToast(t('signInFirst'), 'error');
        return;
      }
      
      try {
        // Отправляем запрос на добавление в корзину
        await api.addToCart(btn.dataset.productId);
        
        // Обновляем счетчик корзины в store
        store.set('cartCount', (store.get('cartCount') || 0) + 1);
        
        // Показываем уведомление об успехе
        showToast(t('addedToCart'), 'success');
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  });

  container.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Проверяем авторизацию
      if (!store.isAuthenticated()) {
        showToast(t('signInFirst'), 'error');
        return;
      }
      
      try {
        // Отправляем запрос на добавление в избранное
        await api.addToWishlist(btn.dataset.productId);
        
        // Переключаем визуальное состояние кнопки (активное/неактивное)
        btn.classList.toggle('active');
        
        // Меняем цвет иконки при активации
        if (btn.classList.contains('active')) {
          btn.style.color = '#ff3366';  // Красный/золотой для активного состояния
        } else {
          btn.style.color = '';         
        }
        
        showToast(t('addedToWishlist'), 'success');
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  });
}
export { bindCardActions };