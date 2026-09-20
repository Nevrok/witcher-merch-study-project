const API_BASE = '/api';


function getToken() {
  // Получаем строку с данными авторизации из localStorage под ключом 'witcher_auth'
  const auth = localStorage.getItem('witcher_auth');
  
  // Если данные есть - парсим JSON и возвращаем поле token, если нет - возвращаем null
  return auth ? JSON.parse(auth).token : null;
}

async function request(url, options = {}) {
  // Получаем текущий токен авторизации
  const token = getToken();
  
  // Формируем заголовки:
  // - Всегда добавляем Content-Type: application/json
  // - Добавляем все заголовки из options.headers (если есть)
  // - Если токен существует, добавляем Authorization: Bearer <token>
  const headers = { 
    'Content-Type': 'application/json', 
    ...options.headers 
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Выполняем fetch-запрос:
  // - Объединяем опции: options + headers
  const res = await fetch(`${API_BASE}${url}`, { ...options, headers });

  // Если сервер вернул 401 (Unauthorized) — пробуем обновить токен
  if (res.status === 401) {
    // Пытаемся обновить токен через refreshToken
    const refreshed = await tryRefreshToken();
    
    // Если обновление прошло успешно — повторяем исходный запрос
    if (refreshed) {
      return request(url, options);
    }
    
    // Если обновление не удалось — удаляем данные авторизации
    localStorage.removeItem('witcher_auth');
    
    // Диспатчим событие, чтобы приложение узнало об изменении статуса авторизации
    window.dispatchEvent(new Event('auth-change'));
    
    // Бросаем ошибку
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    // Пытаемся получить тело ошибки в формате JSON
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    
    // Бросаем ошибку с текстом из ответа сервера или стандартным сообщением
    throw new Error(err.error || 'Request failed');
  }

  // Если статус 204 No Content — возвращаем null (нет данных)
  if (res.status === 204) return null;
  
  // Иначе парсим и возвращаем JSON-ответ
  return res.json();
}

async function tryRefreshToken() {
  // Получаем данные авторизации из localStorage
  const auth = localStorage.getItem('witcher_auth');
  if (!auth) return false;
  
  const { refreshToken } = JSON.parse(auth);
  
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    if (!res.ok) return false;
    
    // Получаем новые токены (access + refresh)
    const data = await res.json();
    
    // Сохраняем обновленные данные в localStorage
    localStorage.setItem('witcher_auth', JSON.stringify(data));
    
    return true;
  } catch {
    return false;
  }
}

export const api = {
  // Получение списка товаров с возможностью фильтрации и пагинации
  getProducts: (params = {}) => {
    // Преобразуем объект параметров в строку запроса (например, "page=1&limit=10")
    const qs = new URLSearchParams(params).toString();
    // Выполняем GET-запрос к /products с добавленной строкой параметров
    return request(`/products?${qs}`);
  },

  // Получение избранных/рекомендуемых товаров (по умолчанию 8 штук)
  getFeatured: (count = 8) => request(`/products/featured?count=${count}`),

  // Получение детальной информации о товаре по его slug (уникальному идентификатору)
  getProduct: (slug) => request(`/products/${slug}`),

  // Получение списка всех категорий товаров
  getCategories: () => request('/products/categories'),

  // Авторизация: вход пользователя (передаём email и password)
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  // Регистрация нового пользователя (передаём username, email, password)
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  // Получение текущей корзины пользователя
  getCart: () => request('/cart'),

  // Добавление товара в корзину (productId и количество, по умолчанию 1)
  addToCart: (productId, quantity = 1) =>
    request('/cart', { method: 'POST', body: JSON.stringify({ productId, quantity }) }),

  // Обновление количества товара в корзине (itemId – идентификатор позиции)
  updateCartItem: (itemId, quantity) =>
    request(`/cart/${itemId}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),

  // Удаление товара из корзины
  removeCartItem: (itemId) => request(`/cart/${itemId}`, { method: 'DELETE' }),

  // Полная очистка корзины
  clearCart: () => request('/cart', { method: 'DELETE' }),

  // Получение списка избранных товаров
  getWishlist: () => request('/wishlist'),

  // Добавление товара в избранное
  addToWishlist: (productId) => request(`/wishlist/${productId}`, { method: 'POST' }),

  // Удаление товара из избранного
  removeFromWishlist: (productId) => request(`/wishlist/${productId}`, { method: 'DELETE' }),

  // Проверка, находится ли товар в избранном (возвращает { inWishlist: boolean })
  checkWishlist: (productId) => request(`/wishlist/${productId}/check`),

  // Создание нового заказа (передаём данные доставки)
  createOrder: (data) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),

  // Получение списка заказов текущего пользователя
  getOrders: () => request('/orders'),

  // Получение детальной информации о конкретном заказе по его ID
  getOrder: (id) => request(`/orders/${id}`),
};