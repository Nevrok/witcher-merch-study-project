import { api } from '../api.js';
import { store } from '../store.js';
import { showToast } from '../main.js';
import { navigate } from '../router.js';
import { t } from '../i18n.js';

export function Checkout() {
  const html = `
    <!-- Главная страница оформления заказа -->
    <div class="checkout-page container">
      <!-- Заголовок страницы -->
      <h1 class="section-title">${t('checkoutTitle')}</h1>
      
      <!-- Основная сетка: форма доставки слева, сводка заказа справа -->
      <div class="checkout-grid" id="checkout-content">
        <!-- Левая часть: форма ввода адреса доставки -->
        <div class="checkout-form">
          <h2>${t('shippingInfo')}</h2>
          
          <!-- Форма оформления заказа -->
          <form id="checkout-form">
            <!-- Поле адреса доставки -->
            <div class="form-group">
              <label for="address">${t('address')}</label>
              <input type="text" id="address" required placeholder="ул. Новиградская 123" />
            </div>
            
            <!-- Город и почтовый индекс в одной строке -->
            <div class="form-row">
              <div class="form-group">
                <label for="city">${t('city')}</label>
                <input type="text" id="city" required placeholder="Новиград" />
              </div>
              <div class="form-group">
                <label for="zip">${t('zip')}</label>
                <input type="text" id="zip" required placeholder="00000" />
              </div>
            </div>
            
            <!-- Поле контактного телефона -->
            <div class="form-group">
              <label for="phone">${t('phone')}</label>
              <input type="tel" id="phone" required placeholder="+7 999 123 4567" />
            </div>
            
            <!-- Кнопка отправки заказа -->
            <button type="submit" class="btn btn-primary">${t('placeOrder')}</button>
          </form>
        </div>
        
        <!-- Правая часть: сводка корзины с товарами и итоговой суммой -->
        <div class="cart-summary" id="checkout-summary">
          <!-- Спиннер загрузки (заменяется на содержимое при загрузке) -->
          <div class="spinner"></div>
        </div>
      </div>
    </div>`;
  
  return {
    html,     
    init() {  
      if (!store.isAuthenticated()) {
        navigate('/auth');
        return; 
      }
      
      // Загружаем и отображаем сводку заказа (товары в корзине, итоговая сумма)
      loadCheckoutSummary();
      
      // Находим форму оформления заказа и добавляем обработчик отправки
      document.getElementById('checkout-form')?.addEventListener('submit', async (e) => {
        // Предотвращаем стандартную отправку формы (перезагрузку страницы)
        e.preventDefault();
        
        // Находим кнопку отправки
        const btn = e.target.querySelector('button[type="submit"]');
        
        // Блокируем кнопку и меняем текст на "Обработка..." пока идет запрос
        btn.disabled = true;
        btn.textContent = t('processing');
        
        try {
          // Отправляем запрос на создание заказа с данными доставки
          const order = await api.createOrder({
            shippingAddress: document.getElementById('address').value,   // Адрес доставки
            shippingCity: document.getElementById('city').value,         // Город
            shippingZip: document.getElementById('zip').value,           // Почтовый индекс
            contactPhone: document.getElementById('phone').value         // Контактный телефон
          });
          
          // После успешного создания заказа - обнуляем счетчик корзины в store
          store.set('cartCount', 0);
          
          // Заменяем содержимое checkout-content на страницу успеха
          document.getElementById('checkout-content').innerHTML = `
            <!-- Блок подтверждения успешного оформления заказа -->
            <div class="order-success" style="grid-column:1/-1">
              <!-- Заголовок: уведомление об успехе -->
              <h2>${t('orderPlaced')}</h2>
              <!-- Благодарность пользователю -->
              <p>${t('thankYou')}</p>
              <!-- Номер заказа для отслеживания -->
              <div class="order-number">${order.orderNumber}</div>
              <!-- Сообщение о подготовке товара -->
              <p style="margin-top:16px;color:#6B5B4E">${t('gearPreparing')}</p>
              <!-- Ссылка на страницу просмотра заказов -->
              <a href="#/orders" class="btn btn-primary" style="margin-top:24px">${t('viewOrders')}</a>
            </div>`;
        } catch (err) {
          showToast(err.message, 'error');
          
          // Разблокируем кнопку и возвращаем исходный текст
          btn.disabled = false;
          btn.textContent = t('placeOrder');
        }
      });
    }
  };
}

async function loadCheckoutSummary() {
  const summary = document.getElementById('checkout-summary');
  if (!summary) return;
  
  try {
    // Получаем текущую корзину пользователя
    const cart = await api.getCart();
    
    // Если в корзине нет товаров - перенаправляем на страницу корзины
    if (cart.items.length === 0) {
      navigate('/cart');
      return;
    }
    
    summary.innerHTML = `
      <h3>${t('orderSummary')}</h3>
      <!-- Список товаров в корзине: название, количество и стоимость -->
          ${cart.items.map(i => `
        <div class="summary-row">
          <span>${i.productName} × ${i.quantity}</span>
          <span>$${((i.discountPrice || i.price) * i.quantity).toFixed(2)}</span>
        </div>
      `).join('')}
      
      <!-- Строка с информацией о доставке -->
      <div class="summary-row">
        <span>${t('shipping')}</span>
        <span>${t('free')}</span>
      </div>
      
      <!-- Итоговая сумма заказа -->
      <div class="summary-row total">
        <span>${t('total')}</span>
        <span>$${cart.total.toFixed(2)}</span>
      </div>`;
  } catch (e) {
    summary.innerHTML = `<p>${e.message}</p>`;
  }
}