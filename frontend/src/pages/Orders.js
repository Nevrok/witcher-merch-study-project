import { api } from '../api.js';
import { store } from '../store.js';
import { navigate } from '../router.js';
import { t } from '../i18n.js';

export function Orders() {
  const html = `
    <!-- Основной контейнер страницы заказов -->
    <div class="wishlist-page container">
      <!-- Заголовок страницы -->
      <h1 class="section-title">${t('ordersTitle')}</h1>
      <!-- Подзаголовок с описанием -->
      <p class="section-subtitle">${t('ordersSub')}</p>
      <!-- Контейнер для списка заказов со спиннером загрузки -->
      <div id="orders-list"><div class="spinner"></div></div>
    </div>`;
  
  return { 
    html,     
    init() { 
      if (!store.isAuthenticated()) {
        navigate('/auth');
        return;
      }
      loadOrders();
    } 
  };
}
async function loadOrders() {
  const container = document.getElementById('orders-list');
  if (!container) return;
  
  try {
    const orders = await api.getOrders();
        if (orders.length === 0) {
      container.innerHTML = `
        <!-- Блок пустого состояния (нет заказов) -->
        <div class="empty-state">
          <!-- Заголовок пустого состояния -->
          <h3>${t('noOrders')}</h3>                 
          <!-- Описание пустого состояния -->
          <p>${t('ordersWillAppear')}</p>              
          <!-- Кнопка перехода в каталог для совершения покупки -->
          <a href="#/catalog" class="btn btn-primary">${t('startShopping')}</a> 
        </div>`;
      return;
    }
    
    // Для каждого заказа создаем HTML-карточку и объединяем все в одну строку
    container.innerHTML = orders.map(order => `
      <!-- Карточка заказа -->
      <div class="card" style="padding:24px;margin-bottom:16px;">
        <!-- Верхняя строка: информация о заказе и статус -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:12px">
          <!-- Левая часть: номер заказа и дата -->
          <div>
            <!-- Номер заказа -->
            <div style="font-family:'Cinzel',serif;font-size:1.1rem;color:#E8DCC8">${order.orderNumber}</div>
            <!-- Дата создания заказа -->
            <div style="font-size:0.8rem;color:#6B5B4E">${new Date(order.createdAt).toLocaleDateString()}</div>
          </div>
          <!-- Правая часть: статус и общая сумма -->
          <div style="display:flex;gap:12px;align-items:center">
            <!-- Бейдж со статусом доставки -->
            <span class="badge ${order.status === 'Delivered' ? 'badge-new' : 'badge-sale'}">${order.status}</span>
            <!-- Общая сумма заказа -->
            <span class="price">$${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
        
        <!-- Список товаров в заказе -->
        <div style="display:flex;flex-wrap:wrap;gap:12px">
          ${order.items.map(item => `
            <!-- Карточка товара -->
            <div style="display:flex;gap:10px;background:#1A1416;padding:10px;border-radius:8px;flex:1;min-width:200px">
              <!-- Изображение товара -->
              <img src="${item.productImage}" alt="${item.productName}" 
                   style="width:48px;height:48px;object-fit:cover;border-radius:4px" />
              <!-- Информация о товаре: название, количество, цена -->
              <div>
                <!-- Название товара -->
                <div style="font-size:0.85rem;color:#E8DCC8">${item.productName}</div>
                <!-- Количество и цена за единицу -->
                <div style="font-size:0.8rem;color:#6B5B4E">× ${item.quantity} — $${item.unitPrice.toFixed(2)}</div>
              </div>
            </div>
          `).join('')} 
        </div>
      </div>
    `).join('');
    
  } catch (e) {
      container.innerHTML = `<div class="empty-state"><p>${e.message}</p></div>`;
  }
}