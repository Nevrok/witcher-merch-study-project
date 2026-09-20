import { api } from '../api.js';
import { store } from '../store.js';
import { icons } from '../components/icons.js';
import { showToast } from '../main.js';
import { navigate } from '../router.js';
import { t } from '../i18n.js';

export function Wishlist() {
  // Начальный HTML-шаблон страницы избранного с загрузчиком
  const html = `
    <!-- Основной контейнер страницы избранного с центрированием контента -->
    <div class="wishlist-page container">
      <!-- Главный заголовок страницы избранного -->
      <h1 class="section-title">${t('wishlistTitle')}</h1>
      <!-- Подзаголовок с дополнительной информацией -->
      <p class="section-subtitle">${t('wishlistSub')}</p>
      <!-- Сетка для отображения товаров из избранного с аниматированным спиннером при загрузке -->
      <div class="product-grid" id="wishlist-grid"><div class="spinner"></div></div>
    </div>`;
  
  return { 
    html,     
    init() { 
      if (!store.isAuthenticated()) {
        navigate('/auth');
        return; 
      }
      loadWishlist();
    } 
  };
}


async function loadWishlist() {
  const grid = document.getElementById('wishlist-grid');
  if (!grid) return;
  
  try {
    const items = await api.getWishlist();
    
    // Если массив избранного пуст
    if (items.length === 0) {
      // Отображаем сообщение о пустом избранном с предложением перейти в каталог
      grid.innerHTML = `
        <!-- Контейнер пустого состояния, растягивается на всю ширину сетки -->
        <div class="empty-state" style="grid-column:1/-1">
          <!-- Заголовок сообщения об отсутствии товаров в избранном -->
          <h3>${t('noWishlistItems')}</h3>           
          <!-- Описание с рекомендацией просмотреть каталог -->
          <p>${t('browseAndSave')}</p>               
          <!-- Кнопка перехода в каталог для просмотра товаров -->
          <a href="#/catalog" class="btn btn-primary">${t('browseCatalog')}</a> 
        </div>`;
      return;
    }
    
    grid.innerHTML = items.map(item => `
      <!-- Карточка товара в избранном -->
      <div class="card product-card">
        <!-- Блок с изображением товара -->
        <div class="card-image">
          <!-- Изображение товара с ленивой загрузкой -->
          <img src="${item.productImage}" alt="${item.productName}" loading="lazy" />
          <!-- Кнопки действий: добавление в корзину и удаление из избранного -->
          <div class="card-actions" style="opacity:1;transform:none">
            <!-- Кнопка добавления товара в корзину с иконкой -->
            <button class="btn-icon add-to-cart" data-id="${item.productId}" title="${t('addToCart')}">
              ${icons.cart}    
            </button>
            <!-- Кнопка удаления товара из избранного с иконкой крестика -->
            <button class="btn-icon remove-wish" data-id="${item.productId}" title="${t('remove')}">
              ${icons.x}     
            </button>
          </div>
        </div>
        <!-- Блок с информацией о товаре -->
        <div class="card-body">
          <!-- Название товара -->
          <h3 class="card-title">${item.productName}</h3>
          <!-- Блок с ценой товара -->
          <div class="card-price">
            <!-- Текущая цена (со скидкой если есть, иначе обычная цена) -->
            <span class="price">$${(item.discountPrice || item.price).toFixed(2)}</span>
            <!-- Старая цена, отображается только если есть скидка -->
            ${item.discountPrice ? `<span class="price-old">$${item.price.toFixed(2)}</span>` : ''}
          </div>
        </div>
      </div>
    `).join('');
        
    // Обработчики для кнопок "Добавить в корзину"
    grid.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await api.addToCart(btn.dataset.id);
          store.set('cartCount', (store.get('cartCount') || 0) + 1);
          showToast(t('addedToCart'), 'success');
        } catch (e) {
          showToast(e.message, 'error');
        }
      });
    });
    
    // Обработчики для кнопок "Удалить из избранного"
    grid.querySelectorAll('.remove-wish').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await api.removeFromWishlist(btn.dataset.id);
          showToast(t('removedFromWishlist'));
          loadWishlist();
        } catch (e) {
          showToast(e.message, 'error');
        }
      });
    });
    
  } catch (e) {
    // При ошибке загрузки отображаем сообщение об ошибке
    grid.innerHTML = `
      <!-- Контейнер для отображения ошибки -->
      <div class="empty-state">
        <!-- Текст ошибки с деталями проблемы -->
        <p>${e.message}</p>
      </div>`;
  }
}