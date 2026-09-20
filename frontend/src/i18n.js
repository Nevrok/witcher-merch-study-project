const translations = {
  // ========== РУССКИЙ ЯЗЫК ==========
  ru: {
    // ----- Навигация -----
    home: 'Главная',                    // Пункт меню "Главная"
    catalog: 'Каталог',                 // Пункт меню "Каталог"
    wishlist: 'Избранное',              // Пункт меню "Избранное"
    orders: 'Заказы',                   // Пункт меню "Заказы"
    signIn: 'Войти',                    // Кнопка входа в аккаунт
    logout: 'Выйти',                    // Кнопка выхода из аккаунта

    // ----- Герой (Hero-секция на главной странице) -----
    heroBadge: 'Коллекция фан-мерча',   // Бейдж над заголовком
    heroTitle: 'Экипируйся как<br/><span>Настоящий Ведьмак</span>', // Главный заголовок с HTML-разметкой
    heroDesc: 'Премиальный мерч по мотивам вселенной Ведьмака. От легендарных мечей до зачарованных коллекционных фигурок.', // Описание
    browseCatalog: 'Каталог',            // Кнопка просмотра каталога
    featuredItems: 'Избранное',          // Кнопка избранного

    // ----- Секции (заголовки и подзаголовки) -----
    shopByCategory: 'Категории',         // Заголовок секции категорий
    shopByCategorySub: 'Найди снаряжение для своего Пути', // Подзаголовок секции категорий
    featuredMerch: 'Популярные товары',  // Заголовок секции популярных товаров
    featuredMerchSub: 'Отобрано лучшими торговцами Новиграда', // Подзаголовок
    witcherRecommends: 'Ведьмак рекомендует', // Заголовок секции рекомендаций
    witcherRecommendsSub: 'Личный выбор Геральта из Ривии', // Подзаголовок
    reviews: 'Отзывы покупателей',       // Заголовок секции отзывов
    reviewsSub: 'Что говорят наши клиенты с Континента', // Подзаголовок

    // ----- Статистика (счетчики на главной) -----
    statProducts: 'Товаров',             // Количество товаров
    statCustomers: 'Довольных клиентов', // Количество клиентов
    statCategories: 'Категорий',         // Количество категорий
    statSatisfaction: '% Удовлетворённости', // Процент удовлетворенности

    // ----- Каталог -----
    catalogTitle: 'Каталог',             // Заголовок страницы каталога
    catalogSubtitle: 'Полная коллекция мерча по Ведьмаку', // Подзаголовок
    searchPlaceholder: 'Поиск товаров...', // Плейсхолдер поля поиска
    all: 'Все',                         // Фильтр "Все товары"
    newest: 'Сначала новые',             // Сортировка: новинки первыми
    priceLow: 'Цена: по возрастанию',    // Сортировка: дешевле сначала
    priceHigh: 'Цена: по убыванию',      // Сортировка: дороже сначала
    nameAZ: 'Название А-Я',              // Сортировка: по названию
    productsFound: 'товаров найдено',    // Текст счетчика результатов
    noProducts: 'Товары не найдены',     // Сообщение об отсутствии товаров
    adjustFilters: 'Попробуйте изменить фильтры', // Подсказка при пустом результате

    // ----- Товар (карточка и детальная страница) -----
    inStock: 'В наличии',                // Статус "в наличии"
    lowStock: 'Осталось мало',           // Статус "мало осталось"
    outOfStock: 'Нет в наличии',         // Статус "нет в наличии"
    addToCart: 'В корзину',              // Кнопка добавления в корзину
    addedToCart: 'Добавлено в корзину!', // Уведомление об успешном добавлении
    addedToWishlist: 'Добавлено в избранное!', // Уведомление об успешном добавлении в избранное
    signInFirst: 'Сначала войдите в аккаунт', // Сообщение при попытке действия без авторизации

    // ----- Корзина -----
    cart: 'Корзина',                     // Название раздела
    yourCart: 'Ваша корзина',            // Заголовок корзины
    cartEmpty: 'Корзина пуста',          // Сообщение о пустой корзине
    cartEmptyDesc: 'Добавьте немного ведьмачьего снаряжения!', // Подсказка при пустой корзине
    total: 'Итого',                      // Общая сумма
    checkout: 'Оформить заказ',          // Кнопка оформления заказа
    itemRemoved: 'Товар удалён',         // Уведомление об удалении
    shoppingCart: 'Корзина',             // Альтернативное название
    orderSummary: 'Итого по заказу',     // Сводка заказа
    subtotal: 'Подитог',                 // Промежуточная сумма
    shipping: 'Доставка',                // Стоимость доставки
    free: 'Бесплатно',                   // Бесплатная доставка
    proceedCheckout: 'Перейти к оплате', // Кнопка перехода к оформлению
    startShopping: 'Начать покупки',     // Кнопка начала покупок
    remove: 'Удалить',                   // Кнопка удаления товара

    // ----- Оформление заказа -----
    checkoutTitle: 'Оформление заказа',  // Заголовок страницы оформления
    shippingInfo: 'Информация о доставке', // Заголовок блока доставки
    address: 'Адрес',                    // Поле адреса
    city: 'Город',                       // Поле города
    zip: 'Индекс',                       // Поле почтового индекса
    phone: 'Телефон',                    // Поле телефона
    placeOrder: 'Оформить заказ',        // Кнопка оформления
    processing: 'Обработка...',          // Текст во время отправки запроса
    orderPlaced: '🎉 Заказ оформлен!',   // Уведомление об успешном оформлении
    thankYou: 'Спасибо за покупку, Ведьмак.', // Благодарность
    gearPreparing: 'Ваше снаряжение готовится к отправке.', // Статус заказа
    viewOrders: 'Мои заказы',            // Ссылка на заказы

    // ----- Авторизация -----
    signInTab: 'Вход',                   // Вкладка входа
    registerTab: 'Регистрация',          // Вкладка регистрации
    email: 'Email',                      // Поле email
    password: 'Пароль',                  // Поле пароля
    username: 'Имя пользователя',        // Поле имени
    welcomeBack: 'С возвращением, Ведьмак!', // Приветствие при входе
    welcomeNew: 'Добро пожаловать в WitcherMerch!', // Приветствие при регистрации

    // ----- Избранное -----
    wishlistTitle: 'Избранное',          // Заголовок страницы избранного
    wishlistSub: 'Ваши сохранённые сокровища', // Подзаголовок
    noWishlistItems: 'Пока ничего нет',  // Сообщение о пустом избранном
    browseAndSave: 'Просматривайте каталог и сохраняйте понравившиеся товары.', // Подсказка
    removedFromWishlist: 'Убрано из избранного', // Уведомление об удалении

    // ----- Заказы -----
    ordersTitle: 'Мои заказы',           // Заголовок страницы заказов
    ordersSub: 'Отслеживание доставки вашего мерча', // Подзаголовок
    noOrders: 'Заказов пока нет',        // Сообщение об отсутствии заказов
    ordersWillAppear: 'Здесь появится история ваших заказов.', // Подсказка

    // ----- 404 (Страница не найдена) -----
    lostInFog: 'Заблудился в тумане',    // Заголовок 404
    notFoundDesc: 'Этот путь ведёт в никуда. Даже Геральт не смог бы найти то, что вы ищете.', // Описание
    returnHome: 'На главную',            // Кнопка возврата

    // ----- Футер (подвал сайта) -----
    footerDesc: 'Премиальный фан-мерч по вселенной Ведьмака. Сталь — для людей, серебро — для чудовищ, мерч — для фанатов.', // Описание магазина
    shop: 'Магазин',                     // Заголовок раздела "Магазин"
    allProducts: 'Все товары',           // Ссылка на все товары
    swords: 'Мечи и Оружие',             // Ссылка на категорию мечей
    apparel: 'Одежда',                   // Ссылка на категорию одежды
    collectibles: 'Коллекционки',        // Ссылка на категорию коллекционных предметов
    account: 'Аккаунт',                  // Заголовок раздела "Аккаунт"
    info: 'Информация',                  // Заголовок раздела "Информация"
    aboutUs: 'О нас',                    // Ссылка "О нас"
    shippingInfo2: 'Доставка',           // Ссылка "Доставка"
    returns: 'Возврат',                  // Ссылка "Возврат"
    contact: 'Контакты',                 // Ссылка "Контакты"
    copyright: 'Все права защищены. Фанатский проект. Не аффилирован с CD Projekt Red.', // Копирайт

    // ----- Отзывы (4 отзыва на главной) -----
    review1: 'Качество меча просто невероятное! Точная копия Аэрондайта, каждая руна выгравирована вручную. Доставили за 3 дня.',
    review1Author: 'Весемир',            // Автор отзыва
    review1Role: 'Мастер-ведьмак',       // Роль автора
    review2: 'Медальон волчьей школы — лучший подарок, что я получала. Тяжёлый, металлический, на настоящем кожаном шнурке.',
    review2Author: 'Трисс Меригольд',
    review2Role: 'Чародейка',
    review3: 'Заказал полный набор карт Гвинта — Northern Realms. Карты отличного качества, фольгированная карта лидера шикарна!',
    review3Author: 'Лютик',
    review3Role: 'Бард и коллекционер',
    review4: 'Плащ Нильфгаарда идеально подходит для косплея. Ткань плотная, эмблема вышита безупречно.',
    review4Author: 'Йеннифэр',
    review4Role: 'Чародейка из Венгерберга',

    items: 'товаров',                    // Слово "товаров" для счетчика
  },

  // ========== АНГЛИЙСКИЙ ЯЗЫК ==========
  // Аналогичная структура, но все значения на английском языке
  en: {
    home: 'Home',
    catalog: 'Catalog',
    wishlist: 'Wishlist',
    orders: 'Orders',
    signIn: 'Sign In',
    logout: 'Logout',

    heroBadge: 'Fan Merchandise Collection',
    heroTitle: 'Gear Up Like a<br/><span>True Witcher</span>',
    heroDesc: 'Premium merchandise inspired by the world of The Witcher. From legendary swords to enchanted collectibles.',
    browseCatalog: 'Browse Catalog',
    featuredItems: 'Featured Items',

    shopByCategory: 'Shop by Category',
    shopByCategorySub: 'Find the perfect gear for your journey on the Path',
    featuredMerch: 'Featured Merchandise',
    featuredMerchSub: 'Hand-picked by the finest merchants of Novigrad',
    witcherRecommends: 'Witcher Recommends',
    witcherRecommendsSub: 'Personal picks by Geralt of Rivia',
    reviews: 'Customer Reviews',
    reviewsSub: 'What our clients from the Continent say',

    statProducts: 'Products',
    statCustomers: 'Happy Customers',
    statCategories: 'Categories',
    statSatisfaction: '% Satisfaction',

    catalogTitle: 'Catalog',
    catalogSubtitle: 'Browse our complete collection of Witcher merchandise',
    searchPlaceholder: 'Search products...',
    all: 'All',
    newest: 'Newest First',
    priceLow: 'Price: Low to High',
    priceHigh: 'Price: High to Low',
    nameAZ: 'Name A-Z',
    productsFound: 'products found',
    noProducts: 'No Products Found',
    adjustFilters: 'Try adjusting your filters',

    inStock: 'In Stock',
    lowStock: 'low left',
    outOfStock: 'Out of Stock',
    addToCart: 'Add to Cart',
    addedToCart: 'Added to cart!',
    addedToWishlist: 'Added to wishlist!',
    signInFirst: 'Please sign in first',

    cart: 'Cart',
    yourCart: 'Your Cart',
    cartEmpty: 'Cart is Empty',
    cartEmptyDesc: 'Add some Witcher gear!',
    total: 'Total',
    checkout: 'Checkout',
    itemRemoved: 'Item removed',
    shoppingCart: 'Shopping Cart',
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    free: 'Free',
    proceedCheckout: 'Proceed to Checkout',
    startShopping: 'Start Shopping',
    remove: 'Remove',

    checkoutTitle: 'Checkout',
    shippingInfo: 'Shipping Information',
    address: 'Street Address',
    city: 'City',
    zip: 'ZIP Code',
    phone: 'Contact Phone',
    placeOrder: 'Place Order',
    processing: 'Processing...',
    orderPlaced: '🎉 Order Placed!',
    thankYou: 'Thank you for your purchase, Witcher.',
    gearPreparing: 'Your gear is being prepared for the journey.',
    viewOrders: 'View Orders',

    signInTab: 'Sign In',
    registerTab: 'Register',
    email: 'Email',
    password: 'Password',
    username: 'Username',
    welcomeBack: 'Welcome back, Witcher!',
    welcomeNew: 'Welcome to WitcherMerch!',

    wishlistTitle: 'Wishlist',
    wishlistSub: 'Your saved Witcher treasures',
    noWishlistItems: 'No Items Yet',
    browseAndSave: 'Browse the catalog and save items you love.',
    removedFromWishlist: 'Removed from wishlist',

    ordersTitle: 'My Orders',
    ordersSub: 'Track your Witcher merchandise deliveries',
    noOrders: 'No Orders Yet',
    ordersWillAppear: 'Your order history will appear here.',

    lostInFog: 'Lost in the Fog',
    notFoundDesc: "This path leads nowhere. Even Geralt couldn't find what you're looking for.",
    returnHome: 'Return Home',

    footerDesc: 'Premium fan merchandise inspired by the world of The Witcher. Steel for humans, silver for monsters, merch for fans.',
    shop: 'Shop',
    allProducts: 'All Products',
    swords: 'Swords & Weapons',
    apparel: 'Apparel',
    collectibles: 'Collectibles',
    account: 'Account',
    info: 'Info',
    aboutUs: 'About Us',
    shippingInfo2: 'Shipping',
    returns: 'Returns',
    contact: 'Contact',
    copyright: 'All rights reserved. Fan project. Not affiliated with CD Projekt Red.',

    review1: 'The sword quality is incredible! An exact replica of Aerondight, each rune hand-engraved. Delivered in 3 days.',
    review1Author: 'Vesemir',
    review1Role: 'Master Witcher',
    review2: "The Wolf School medallion is the best gift I've ever received. Heavy, metal, on a genuine leather cord.",
    review2Author: 'Triss Merigold',
    review2Role: 'Sorceress',
    review3: 'Ordered the full Gwent set — Northern Realms. Cards are excellent quality, the foil leader card is gorgeous!',
    review3Author: 'Dandelion',
    review3Role: 'Bard & Collector',
    review4: "The Nilfgaardian cloak is perfect for cosplay. Thick fabric, flawlessly embroidered emblem.",
    review4Author: 'Yennefer',
    review4Role: 'Sorceress of Vengerberg',

    items: 'items',
  }
};

// Переменная, хранящая текущий выбранный язык.
let currentLang = localStorage.getItem('witcher_lang') || 'ru';

// Устанавливаем атрибут lang для HTML-элемента (document.documentElement).
document.documentElement.lang = currentLang;

/**
 * Функция перевода.
 * Получает строку по ключу для текущего языка.
 * Принцип работы:
 * 1. Ищет перевод в объекте translations[currentLang] по ключу
 * 2. Если не находит — ищет в английском языке как запасной вариант (fallback)
 * 3. Если и там нет — возвращает сам ключ (чтобы не показывать пустоту)
 */
export function t(key) {
  // translations[currentLang]?.[key] — безопасный доступ (optional chaining)
  // Если ключ не найден — ищем в английском
  return translations[currentLang]?.[key] || translations['en']?.[key] || key;
}

/**
 * Возвращает текущий язык приложения.
 */
export function getLang() {
  return currentLang;
}

/**
 * Устанавливает новый язык приложения.
 */
export function setLang(lang) {
  currentLang = lang;                               // Обновляем переменную
  document.documentElement.lang = lang;             // Обновляем атрибут html lang
  localStorage.setItem('witcher_lang', lang);       // Сохраняем в localStorage
  
  // Диспатчим событие для оповещения всех компонентов о смене языка
  // В main.js есть обработчик этого события, который перезагружает страницу
  window.dispatchEvent(new Event('lang-change'));
}

export function toggleLang() {
  // Тернарный оператор: если currentLang === 'ru', то 'en', иначе 'ru'
  setLang(currentLang === 'ru' ? 'en' : 'ru');
}