import { icons } from './icons.js';
import { store } from '../store.js';
import { api } from '../api.js';
import { navigate } from '../router.js';
import { showToast } from '../main.js';
import { t } from '../i18n.js';


export function renderCartDrawer() {
  return `
  <!-- Полупрозрачный оверлей позади шторки корзины, закрывает шторку при клике -->
  <div class="cart-drawer-overlay" id="cart-overlay"></div>
  
  <!-- Боковая шторка со списком товаров в корзине -->
  <aside class="cart-drawer" id="cart-drawer">
    <!-- Верхняя часть шторки: заголовок и кнопка закрытия -->
    <div class="drawer-header">
      <!-- Заголовок "Ваша корзина" -->
      <h3>${t('yourCart')}</h3>                    
      <!-- Кнопка закрытия шторки с иконкой крестика -->
      <button class="btn-icon" id="cart-close">${icons.x}</button>
    </div>
    
    <!-- Основная часть шторки: список товаров со спиннером при загрузке -->
    <div class="drawer-body" id="cart-drawer-body">
      <!-- Аниматированный спиннер, заменяется на список товаров при загрузке -->
      <div class="spinner"></div>                 
    </div>
    
    <!-- Нижняя часть шторки: итоговая сумма и кнопка "Оформить заказ" -->
    <div class="drawer-footer" id="cart-drawer-footer"></div>
  </aside>`;
}

/**
 * Инициализирует интерактивность корзины-шторки:
 * - Открытие/закрытие шторки (через оверлей и кнопку закрытия)
 * - Подписка на изменения состояния cartOpen в store
 * - Загрузка корзины при открытии
 */
export function initCartDrawer() {
  // Находим DOM-элементы: оверлей, шторка, кнопка закрытия
  const overlay = document.getElementById('cart-overlay');
  const drawer = document.getElementById('cart-drawer');
  const closeBtn = document.getElementById('cart-close');

  // Функция закрытия корзины (устанавливает cartOpen = false в store)
  const close = () => store.toggleCart(false);

  // При клике на оверлей — закрываем корзину
  if (overlay) overlay.addEventListener('click', close);
  
  // При клике на кнопку закрытия — закрываем корзину
  if (closeBtn) closeBtn.addEventListener('click', close);

  // Подписываемся на изменения в store
  store.subscribe((key, value) => {
    // Если изменилось состояние cartOpen (открыта/закрыта)
    if (key === 'cartOpen') {
      // Переключаем класс 'open' у шторки и оверлея
      drawer?.classList.toggle('open', value);
      overlay?.classList.toggle('open', value);
      
      // Если корзина открыта — загружаем актуальные данные корзины
      if (value) loadCart();
    }
  });
}

/**
 * - Получает корзину через api.getCart()
 * - Обновляет счетчик корзины в store
 * - Отображает список товаров с контроллерами количества
 * - Показывает итоговую сумму и кнопку оформления заказа
 */
async function loadCart() {
  // Находим DOM-элементы: тело и подвал шторки
  const body = document.getElementById('cart-drawer-body');
  const footer = document.getElementById('cart-drawer-footer');
  
  // Если элементы не найдены — выходим
  if (!body || !footer) return;

  try {
    // Запрашиваем текущую корзину у API
    const cart = await api.getCart();
    
    // Обновляем счетчик корзины в store (суммируем количество всех товаров)
    store.set('cartCount', cart.items.reduce((sum, i) => sum + i.quantity, 0));

    // Если в корзине нет товаров
    if (cart.items.length === 0) {
      // Показываем сообщение о пустой корзине
      body.innerHTML = `
        <!-- Контейнер пустого состояния корзины -->
        <div class="empty-state">
          <!-- Заголовок "Корзина пуста" -->
          <h3>${t('cartEmpty')}</h3>
          <!-- Описание с рекомендацией -->
          <p>${t('cartEmptyDesc')}</p>
        </div>`;
      // Очищаем подвал (нет итоговой суммы)
      footer.innerHTML = '';
      return;
    }

    // Формируем HTML для каждого товара
    body.innerHTML = cart.items.map(item => `
      <!-- Карточка товара в корзине -->
      <div class="drawer-item">
        <!-- Изображение товара -->
        <img src="${item.productImage}" alt="${item.productName}" />
        
        <!-- Основная информация о товаре -->
        <div class="item-info">
          <!-- Название товара -->
          <div class="item-name">${item.productName}</div>                         
          <!-- Цена жза единицу и количество -->
          <div class="item-price">$${(item.discountPrice || item.price).toFixed(2)} × ${item.quantity}</div> 
          
          <!-- Контроль количества: кнопки минус/плюс и текущее количество -->
          <div class="qty-control">
            <!-- Кнопка уменьшения количества -->
            <button data-action="dec" data-id="${item.id}">−</button>   
            <!-- Количество товара -->
            <span>${item.quantity}</span>                              
            <!-- Кнопка увеличения количества -->
            <button data-action="inc" data-id="${item.id}">+</button>   
          </div>
        </div>
        
        <!-- Кнопка удаления товара из корзины с иконкой корзины -->
        <button class="item-remove" data-action="remove" data-id="${item.id}">${icons.trash}</button>
      </div>
    `).join('');  // join('') объединяет все позиции в одну строку  // join('') объединяет все позиции в одну строку

    footer.innerHTML = `
      <!-- Блок итоговой суммы заказа -->
      <div class="total-row">
        <!-- Лабель "u0418того" -->
        <span>${t('total')}</span>                     
        <!-- Общая стоимость всех товаров в корзине -->
        <span class="total-price">$${cart.total.toFixed(2)}</span> 
      </div>
      <!-- Кнопка для прехода к оформлению заказа -->
      <button class="btn btn-primary" id="drawer-checkout">${t('checkout')}</button>
    `;

    // Обработчики для кнопок изменения количества и удаления
    body.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const action = btn.dataset.action;  // 'dec', 'inc' или 'remove'
        const id = btn.dataset.id;          // ID позиции в корзине
        
        // Находим элемент корзины по ID
        const item = cart.items.find(i => i.id === id);
        
        try {
          // УДАЛЕНИЕ
          if (action === 'remove') {
            await api.removeCartItem(id);
            showToast(t('itemRemoved'));
          } 
          // УМЕНЬШЕНИЕ КОЛИЧЕСТВА
          else if (action === 'dec') {
            // Если количество равно 1 — удаляем позицию
            if (item.quantity <= 1) {
              await api.removeCartItem(id);
            } else {
              // Иначе уменьшаем на 1
              await api.updateCartItem(id, item.quantity - 1);
            }
          } 
          // УВЕЛИЧЕНИЕ КОЛИЧЕСТВА
          else if (action === 'inc') {
            await api.updateCartItem(id, item.quantity + 1);
          }
          
          // После любого изменения - перезагружаем корзину
          loadCart();
        } catch (e) {
          showToast(e.message, 'error');
        }
      });
    });

    // Находим кнопку оформления заказа
    const checkoutBtn = document.getElementById('drawer-checkout');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        // Закрываем шторку
        store.toggleCart(false);
        // Переходим на страницу оформления заказа
        navigate('/checkout');
      });
    }
    
  } catch (e) {
    // Показываем сообщение "Сначала войдите в аккаунт" если пользователь ене авторизован
    body.innerHTML = `<div class="empty-state"><p>${t('signInFirst')}</p></div>`;
    footer.innerHTML = '';
  }
}