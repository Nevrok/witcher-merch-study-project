import { icons } from './icons.js';

/**
 * Создает и возвращает карточки товара.
 * Функция клонирует содержимое тега <template id="product-card-template">,
 * заполняет его данными товара и возвращает готовую карточку.
 */
export function renderProductCard(product) {
  // Находим элемент <template> с id="product-card-template"
  // .content возвращает DocumentFragment с содержимым шаблона
  // .cloneNode(true) создает глубокую копию (со всеми дочерними элементами)
  const tpl = document.getElementById('product-card-template').content.cloneNode(true);
  
  // Находим внутри клона главный элемент карточки (div с классом .product-card)
  const card = tpl.querySelector('.product-card');
  
  // Определяем, есть ли скидка:
  // discountPrice существует И меньше обычной цены
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  // Устанавливаем data-slug для карточки (может использоваться для аналитики или идентификации)
  card.dataset.slug = product.slug;

  // Находим изображение (класс .p-img)
  const img = card.querySelector('.p-img');
  // Устанавливаем URL изображения
  img.src = product.imageUrl;
  // Устанавливаем alt-текст для доступности (название товара)
  img.alt = product.name;

  // Если есть скидка — показываем бейдж "Sale" (убираем display:none)
  if (hasDiscount) {
    card.querySelector('.badge-sale').style.display = '';
  }
  
  // Если товар является рекомендуемым/новинкой — показываем бейдж "Featured"
  if (product.isFeatured) {
    card.querySelector('.badge-new').style.display = '';
  }

  // Кнопка "Добавить в корзину" — устанавливаем data-product-id
  card.querySelector('.add-to-cart-btn').dataset.productId = product.id;
  
  // Кнопка "В избранное" — устанавливаем data-product-id
  card.querySelector('.wishlist-btn').dataset.productId = product.id;

  // ========== 6. ЗАПОЛНЕНИЕ ТЕКСТОВОЙ ИНФОРМАЦИИ ==========
  // Ссылка на детальную страницу товара (формируем по slug)
  card.querySelector('.p-link').href = `#/product/${product.slug}`;
  
  // Категория товара
  card.querySelector('.p-category').textContent = product.categoryName;
  
  // Название товара
  card.querySelector('.p-title').textContent = product.name;

  // Основная цена (актуальная):
  // - если есть скидка — показываем цену со скидкой
  // - иначе — обычную цену
  card.querySelector('.p-price').textContent = `$${(hasDiscount ? product.discountPrice : product.price).toFixed(2)}`;
  
  // Если есть скидка — показываем старую цену (зачеркнутую)
  if (hasDiscount) {
    // Устанавливаем текст старой цены
    card.querySelector('.p-price-old').textContent = `$${product.price.toFixed(2)}`;
    // Делаем элемент видимым (убираем display:none)
    card.querySelector('.p-price-old').style.display = '';
  }

  // Возвращаем карточки, готовый к вставке в страницу
  return card;
}