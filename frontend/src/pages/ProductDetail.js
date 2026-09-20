import { api } from '../api.js';
import { store } from '../store.js';
import { icons } from '../components/icons.js';
import { showToast } from '../main.js';
import { navigate } from '../router.js';
import { t } from '../i18n.js';

export function ProductDetail({ slug }) {
  // Начальный HTML-шаблон компонента с загрузчиком
  const html = `
    <!-- Контейнер детальной страницы товара с центрированным контентом -->
    <div class="product-detail container" id="product-detail">
      <!-- Аниматированный спиннер, показываемый во время загрузки данных -->
      <div class="spinner"></div>
    </div>`;

  return {
    html,                     
    init() {                 
      loadProduct(slug);
    }
  };
}


async function loadProduct(slug) {
  const container = document.getElementById('product-detail');
  if (!container) return;

  try {
    const product = await api.getProduct(slug);
        if (!product) {
      navigate('/404');
      return; 
    }

    const images = [product.imageUrl, product.imageUrl2, product.imageUrl3].filter(Boolean);
    
    const hasDiscount = product.discountPrice && product.discountPrice < product.price;
    
    // Определяем CSS-класс для статуса наличия:
    const stockClass = product.stockQuantity > 10 ? 'in-stock' 
                     : product.stockQuantity > 0 ? 'low-stock' 
                     : 'out-of-stock';
    
    // Формируем текст статуса наличия:
    const stockText = product.stockQuantity > 10 
      ? t('inStock') 
      : product.stockQuantity > 0 
        ? `${t('lowStock')} (${product.stockQuantity})` 
        : t('outOfStock');

    container.innerHTML = `
      <!-- Основная сетка для макета: галерея изображений слева, информация о товаре справа -->
      <div class="detail-grid">
        <!-- Секция с галереей изображений товара -->
        <div class="detail-gallery">
          <!-- Основное/главное изображение товара -->
          <div class="main-image">
            <!-- Основное изображение товара высокого разрешения -->
            <img src="${images[0]}" alt="${product.name}" id="main-img" />
          </div>
          <!-- Миниатюры для переключения между изображениями (если их несколько) -->
          ${images.length > 1 ? `
            <div class="gallery-thumbs">
              <!-- Каждая миниатюра переключает основное изображение при клике -->
              ${images.map((img, i) => `
                <!-- Миниатюра с активным классом для первого изображения -->
                <img src="${img}" alt="Thumb ${i + 1}" 
                     class="${i === 0 ? 'active' : ''}" 
                     data-src="${img}" />
              `).join('')}
            </div>
          ` : ''}
        </div>
        
        <!-- Секция с информацией о товаре: название, цена, описание, действия -->
        <div class="detail-info">
          <!-- Категория товара для навигации и контекста -->
          <div class="detail-category">${product.categoryName}</div>
          <!-- Название товара главным заголовком -->
          <h1>${product.name}</h1>
            <!-- Блок с ценой товара: текущая цена и зачеркнутая старая цена при скидке -->
            <div class="detail-price">
            <!-- Текущая цена (со скидкой если есть, иначе обычная цена) -->
            <span class="price">$${(hasDiscount ? product.discountPrice : product.price).toFixed(2)}</span>
            <!-- Старая цена отображается только если есть скидка -->
            ${hasDiscount ? `<span class="price-old">$${product.price.toFixed(2)}</span>` : ''}
          </div>
          
          <!-- Статус наличия товара: в наличии/заканчивается/нет в наличии с цветовым кодированием -->
          <div class="detail-stock ${stockClass}">${stockText}</div>
          
          <!-- Полное описание товара -->
          <p class="detail-desc">${product.description}</p>
          
          <!-- Действия с товаром: количество, добавление в корзину, избранное -->
          <div class="detail-actions">
            <!-- Управление количеством: кнопки - и +, текущее значение -->
            <div class="qty-control">
              <!-- Кнопка уменьшения количества -->
              <button id="qty-dec">−</button>          
              <!-- Текущее выбранное количество товара -->
              <span id="qty-val">1</span>              
              <!-- Кнопка увеличения количества -->
              <button id="qty-inc">+</button>        
            </div>
            
            <!-- Главная кнопка добавления товара в корзину (отключается если нет в наличии) -->
            <button class="btn btn-primary" id="add-to-cart-btn" 
                    ${product.stockQuantity === 0 ? 'disabled' : ''}>
              <!-- Иконка корзины и текст кнопки -->
              ${icons.cart} ${t('addToCart')}
            </button>
            
            <!-- Кнопка добавления товара в список желаемого (wishlist) -->
            <button class="btn-icon" id="wishlist-btn" title="${t('wishlist')}">
              <!-- Иконка сердца -->
              ${icons.heart}
            </button>
          </div>
        </div>
      </div>
    `;

    // Добавляем обработчики на все миниатюры
    container.querySelectorAll('.gallery-thumbs img').forEach(thumb => {
      thumb.addEventListener('click', () => {
        // Меняем основное изображение на выбранное
        document.getElementById('main-img').src = thumb.dataset.src;
        
        // Убираем класс active у всех миниатюр
        container.querySelectorAll('.gallery-thumbs img').forEach(t => t.classList.remove('active'));
        
        // Добавляем класс active на текущую миниатюру
        thumb.classList.add('active');
      });
    });

    let qty = 1;  // Текущее выбранное количество товара
    
    document.getElementById('qty-dec')?.addEventListener('click', () => {
      if (qty > 1) {            
        qty--;
        document.getElementById('qty-val').textContent = qty;
      }
    });
    
    document.getElementById('qty-inc')?.addEventListener('click', () => {
      if (qty < product.stockQuantity) {  
        qty++;
        document.getElementById('qty-val').textContent = qty;
      }
    });

    document.getElementById('add-to-cart-btn')?.addEventListener('click', async () => {
      if (!store.isAuthenticated()) {
        showToast(t('signInFirst'), 'error');
        return;
      }
      
      try {
        // Отправляем запрос на добавление товара в корзину с выбранным количеством
        await api.addToCart(product.id, qty);
        
        // Обновляем счетчик корзины в store (увеличиваем на выбранное количество)
        store.set('cartCount', (store.get('cartCount') || 0) + qty);
          showToast(t('addedToCart'), 'success');
      } catch (e) {
        showToast(e.message, 'error');
      }
    });

    document.getElementById('wishlist-btn')?.addEventListener('click', async () => {
      if (!store.isAuthenticated()) {
        showToast(t('signInFirst'), 'error');
        return;
      }
      
      try {
        // Отправляем запрос на добавление товара в избранное
        await api.addToWishlist(product.id);
        showToast(t('addedToWishlist'), 'success');
      } catch (e) {
        showToast(e.message, 'error');
      }
    });
    
  } catch (e) {
    // При ошибке отображаем пустое состояние с сообщением об ошибке
    container.innerHTML = `
      <!-- Контейнер для отображения ошибки или отсутствия данных -->
      <div class="empty-state">
        <!-- Заголовок сообщения об отсутствии товаров -->
        <h3>${t('noProducts')}</h3>
        <!-- Текст ошибки с деталями проблемы -->
        <p>${e.message}</p>
      </div>`;
  }
}