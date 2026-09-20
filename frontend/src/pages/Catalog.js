import { renderProductCard } from '../components/ProductCard.js';
import { api } from '../api.js';
import { icons } from '../components/icons.js';
import { bindCardActions } from './Home.js';
import { initScrollAnimations } from '../animations/scroll.js';
import { t } from '../i18n.js';

export function Catalog() {
  const html = `
    <!-- Главный контейнер страницы каталога -->
    <div class="catalog-page container">
      <!-- Заголовок каталога с названием и описанием -->
      <div class="catalog-header">
        <h1 class="section-title">${t('catalogTitle')}</h1>
        <p class="section-subtitle">${t('catalogSubtitle')}</p>
      </div>

      <!-- Блок с фильтрами и поиском -->
      <div class="catalog-filters" id="catalog-filters">
        <!-- Поле поиска товаров -->
        <div class="filter-search">
          ${icons.search}
          <input type="text" id="filter-search" placeholder="${t('searchPlaceholder')}" />
        </div>
        <!-- Кнопки категорий (заполняются динамически из API) -->
        <div id="category-filters"></div>
        <!-- Выпадающий список для сортировки товаров -->
        <select id="filter-sort">
          <option value="newest">${t('newest')}</option>          
          <option value="price_asc">${t('priceLow')}</option>    
          <option value="price_desc">${t('priceHigh')}</option> 
          <option value="name">${t('nameAZ')}</option>          
        </select>
      </div>

      <!-- Счетчик найденных товаров -->
      <div class="catalog-results" id="catalog-results"></div>
      <!-- Сетка товаров (заполняется динамически) -->
      <div class="product-grid" id="catalog-grid"><div class="spinner"></div></div>
      <!-- Блок пагинации для навигации по страницам -->
      <div class="pagination" id="catalog-pagination"></div>
    </div>
  `;
  return {
    html,           
    init() {        
      let currentFilter = { 
        page: 1,           // Текущая страница (начинаем с 1)
        pageSize: 12,      // Количество товаров на странице
        search: '',        // Поисковый запрос
        categoryId: null,  // ID выбранной категории
        sortBy: 'newest'   // Тип сортировки (по умолчанию - сначала новые)
      };

      // Получаем текущий hash из URL (например, "#/catalog?categoryId=123")
      const hash = window.location.hash;
      // Извлекаем строку запроса после знака '?'
      const queryStr = hash.split('?')[1];
      // Если есть параметры запроса
      if (queryStr) {
        // Создаем объект URLSearchParams для удобного разбора
        const params = new URLSearchParams(queryStr);
        // Если передан параметр categoryId - сохраняем его в фильтр
        if (params.get('categoryId')) currentFilter.categoryId = params.get('categoryId');
        // Если передан параметр featured - устанавливаем флаг избранных товаров
        if (params.get('featured')) currentFilter.isFeatured = true;
      }

      // Загружаем и отображаем кнопки фильтрации категорий
      loadCategories(currentFilter);
      // Загружаем и отображаем товары с текущими параметрами фильтрации
      loadProducts(currentFilter);

      // Находим поле поиска по ID
      const searchInput = document.getElementById('filter-search');
      // Переменная для хранения таймера задержки
      let searchTimeout;
      // Добавляем обработчик события ввода текста
      searchInput?.addEventListener('input', (e) => {
        // Сбрасываем предыдущий таймер (если есть)
        clearTimeout(searchTimeout);
        // Устанавливаем новый таймер на 400 мс
        searchTimeout = setTimeout(() => {
          // Обновляем поисковый запрос в фильтре
          currentFilter.search = e.target.value;
          // Сбрасываем пагинацию на первую страницу
          currentFilter.page = 1;
          // Перезагружаем товары с новым фильтром
          loadProducts(currentFilter);
        }, 400);  // Задержка 400 мс после последнего ввода
      });

      // Находим выпадающий список сортировки
      const sortSelect = document.getElementById('filter-sort');
      // Добавляем обработчик изменения выбора
      sortSelect?.addEventListener('change', (e) => {
        // Обновляем тип сортировки в фильтре
        currentFilter.sortBy = e.target.value;
        // Сбрасываем пагинацию на первую страницу
        currentFilter.page = 1;
        // Перезагружаем товары с новой сортировкой
        loadProducts(currentFilter);
      });
    }
  };
}

/**
@param {Object} filter
 */
async function loadCategories(filter) {
  // Находим контейнер для кнопок категорий
  const container = document.getElementById('category-filters');
  // Если контейнер не найден - выходим
  if (!container) return;
  
  try {
    // Получаем список категорий от API
    const categories = await api.getCategories();
    
    container.innerHTML = `
      <button class="filter-btn ${!filter.categoryId ? 'active' : ''}" data-id="">${t('all')}</button>
      ${categories.map(c => `
        <button class="filter-btn ${filter.categoryId === c.id ? 'active' : ''}" 
                data-id="${c.id}">
          ${c.name}
        </button>
      `).join('')}
    `;
    
    // Добавляем обработчики клика на каждую кнопку
    container.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        // Устанавливаем выбранную категорию (или null для "Все")
        filter.categoryId = btn.dataset.id || null;
        // Сбрасываем пагинацию на первую страницу
        filter.page = 1;
        // Убираем класс active у всех кнопок
        container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        // Добавляем класс active на текущую кнопку
        btn.classList.add('active');
        // Перезагружаем товары с новым фильтром категории
        loadProducts(filter);
      });
    });
  } catch {
    // В случае ошибки просто игнорируем (контейнер останется пустым)
  }
}

async function loadProducts(filter) {
  const grid = document.getElementById('catalog-grid');           // Сетка товаров
  const results = document.getElementById('catalog-results');     // Счетчик результатов
  const pagination = document.getElementById('catalog-pagination'); // Блок пагинации
  
  // Если сетка не найдена - выходим
  if (!grid) return;

  // Показываем спиннер загрузки
  grid.innerHTML = '<div class="spinner"></div>';

  try {
    const params = {};
    // Добавляем номер страницы (если задан)
    if (filter.page) params.page = filter.page;
    // Добавляем размер страницы (количество товаров на странице)
    if (filter.pageSize) params.pageSize = filter.pageSize;
    // Добавляем поисковый запрос (если есть)
    if (filter.search) params.search = filter.search;
    // Добавляем ID категории (если выбран)
    if (filter.categoryId) params.categoryId = filter.categoryId;
    // Добавляем тип сортировки (если задан)
    if (filter.sortBy) params.sortBy = filter.sortBy;
    // Добавляем флаг избранных товаров (если задан)
    if (filter.isFeatured) params.isFeatured = true;

    // Выполняем запрос к API с параметрами
    const data = await api.getProducts(params);

    // Если элемент результатов существует - обновляем текст с количеством найденных товаров
    if (results) results.textContent = `${data.totalCount} ${t('productsFound')}`;

    // Если массив товаров пуст
    if (data.items.length === 0) {
      // Показываем сообщение о том, что товары не найдены
      grid.innerHTML = `<div class="empty-state"><h3>${t('noProducts')}</h3><p>${t('adjustFilters')}</p></div>`;
      // Очищаем блок пагинации
      if (pagination) pagination.innerHTML = '';
      return;
    }

    // Очищаем сетку
    grid.innerHTML = '';
    // Для каждого товара:
    // - создаем карточку через renderProductCard
    data.items.map(p => renderProductCard(p)).forEach(node => grid.appendChild(node));
    // Привязываем обработчики кнопок
    bindCardActions(grid);

    // Если блок пагинации существует и общее количество страниц > 1
    if (pagination && data.totalPages > 1) {
      let html = '';
      // Создаем кнопку для каждой страницы
      for (let i = 1; i <= data.totalPages; i++) {
        html += `<button class="${i === data.page ? 'active' : ''}" data-page="${i}">${i}</button>`;
      }
      // Вставляем кнопки в блок пагинации
      pagination.innerHTML = html;
      
      // Добавляем обработчики клика на каждую кнопку
      pagination.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
          filter.page = parseInt(btn.dataset.page);
          loadProducts(filter);
        });
      });
    } else if (pagination) {
      // Если страница всего одна или totalPages не определено - очищаем блок пагинации
      pagination.innerHTML = '';
    }

    // Инициализируем анимации при скролле для новых элементов
    initScrollAnimations();
  } catch (e) {
    grid.innerHTML = `<div class="empty-state"><p>${e.message}</p></div>`;
  }
}