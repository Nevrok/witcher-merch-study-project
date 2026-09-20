import { api } from '../api.js';
import { store } from '../store.js';
import { icons } from '../components/icons.js';
import { showToast } from '../main.js';
import { navigate } from '../router.js';
import { t } from '../i18n.js';

export function Cart() {
  // Начальный HTML-шаблон страницы корзины с пустым контейнером
  const html = `
    <!-- Основной контейнер страницы корзины с центрированием контента -->
    <div class="cart-page container">
      <!-- Заголовок страницы -->
      <h1 class="section-title">${t('shoppingCart')}</h1>
      <!-- Контейнер для содержимого корзины (товары и итоговая сумма) -->
      <div class="cart-grid" id="cart-content">
      </div>
    </div>`;
  
  return { 
    html,    
    init() {  
      if (!store.isAuthenticated()) {
        // Если не авторизован - перенаправляем на страницу входа
        navigate('/auth');
        return; // Прерываем выполнение
      }
      // Если пользователь авторизован - загружаем и отображаем корзину
      loadCartPage();
    } 
  };
}


// Асинхронная функция загрузки и отображения страницы корзины.
 
async function loadCartPage() {
  const content = document.getElementById('cart-content');
  if (!content) return;
  
  try {
    // Выполняем GET-запрос к API для получения текущей корзины пользователя
    const cart = await api.getCart();
    
    // Вычисляем общее количество товаров в корзине (суммируем quantity всех позиций)
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    // Обновляем счетчик в глобальном хранилище (для отображения в шапке сайта)
    store.set('cartCount', totalItems);
    
    // Если в корзине нет товаров
    if (cart.items.length === 0) {
      // Отображаем сообщение о пустой корзине с предложением перейти в каталог
      content.innerHTML = `
        <!-- Контейнер пустого состояния, растягивается на всю ширину сетки -->
        <div class="empty-state" style="grid-column:1/-1">
          <!-- Заголовок "Корзина пуста" -->
          <h3>${t('cartEmpty')}</h3>              
          <!-- Описание с рекомендацией -->
          <p>${t('cartEmptyDesc')}</p>            
          <!-- Кнопка перехода в каталог для покупок -->
          <a href="#/catalog" class="btn btn-primary">${t('browseCatalog')}</a>
        </div>`;
      return;
    }
    
    content.innerHTML = `
      <div class="cart-items">
        ${cart.items.map(item => `
          <div class="cart-item">
            <!-- Изображение товара -->
            <img src="${item.productImage}" alt="${item.productName}" />
            <div class="cart-item-info">
              <!-- Название товара -->
              <div class="cart-item-name">${item.productName}</div>
              <!-- Цена товара (с учетом скидки, если есть) -->
              <div class="cart-item-price">$${(item.discountPrice || item.price).toFixed(2)}</div>
              <!-- Контрольная панель количества: кнопки минус/плюс и текущее количество -->
              <div class="qty-control">
                <button data-action="dec" data-id="${item.id}">−</button>  
                <span>${item.quantity}</span>                             
                <button data-action="inc" data-id="${item.id}">+</button>  
              </div>
            </div>
            
            <div style="text-align:right">
              <!-- Итоговая стоимость позиции (цена * количество) -->
              <div class="price" style="margin-bottom:8px">
                $${((item.discountPrice || item.price) * item.quantity).toFixed(2)}
              </div>
              <!-- Кнопка удаления товара из корзины -->
              <button class="cart-item-remove" data-action="remove" data-id="${item.id}">
                ${icons.trash} ${t('remove')}
              </button>
            </div>
          </div>
        `).join('')}  
      </div>
      
      <!-- Блок с итоговой суммой заказа -->
      <div class="cart-summary">
        <!-- Заголовок блока итоговой суммы -->
        <h3>${t('orderSummary')}</h3>
        <!-- Подитог без доставки -->
        <div class="summary-row">
          <!-- Лабель "Подитог" -->
          <span>${t('subtotal')}</span>
          <!-- Сумма всех товаров -->
          <span>$${cart.total.toFixed(2)}</span>
        </div>
        <!-- Стоимость доставки -->
        <div class="summary-row">
          <!-- Лабель "Доставка" -->
          <span>${t('shipping')}</span>
          <!-- Статус доставки "Бесплатно" -->
          <span>${t('free')}</span>
        </div>
        <!-- Общая стоимость заказа -->
        <div class="summary-row total">
          <!-- Лабель "Итого" -->
          <span>${t('total')}</span>
          <!-- Итоговая сумма заказа -->
          <span>$${cart.total.toFixed(2)}</span>
        </div>
        <!-- Кнопка перехода к оформлению заказа -->
        <a href="#/checkout" class="btn btn-primary">${t('proceedCheckout')}</a>
      </div>`;
    
    // Находим все элементы с атрибутом data-action 
    content.querySelectorAll('[data-action]').forEach(btn => {
      // Добавляем обработчик клика на каждую кнопку
      btn.addEventListener('click', async () => {
        // Извлекаем action (dec/inc/remove) и id товара из data-атрибутов
        const { action, id } = btn.dataset;
        
        // Находим позицию в корзине по id
        const item = cart.items.find(i => i.id === id);
        
        try {
          if (action === 'remove') {
            // Удаляем позицию из корзины
            await api.removeCartItem(id);
            // Показываем уведомление об удалении
            showToast(t('itemRemoved'));
          } 
          else if (action === 'dec') {
            // Если количество товара равно 1 - удаляем позицию
            if (item.quantity <= 1) {
              await api.removeCartItem(id);
            } else {
              // Иначе уменьшаем количество на 1
              await api.updateCartItem(id, item.quantity - 1);
            }
          } 
          else if (action === 'inc') {
            // Увеличиваем количество на 1
            await api.updateCartItem(id, item.quantity + 1);
          }
          
          // После любого изменения корзины - перезагружаем страницу корзины
          loadCartPage();
        } catch (e) {
          showToast(e.message, 'error');
        }
      });
    });
    
  } catch (e) {
    // В случае ошибки отображаем сообщение
    content.innerHTML = `<div class="empty-state"><p>${e.message}</p></div>`;
  }
}