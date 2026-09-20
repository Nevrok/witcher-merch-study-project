//  Страница 404 
import { t } from '../i18n.js';

export function NotFound() {
  return {
    html: `
      <!-- Основной контейнер страницы ошибки 404 -->
      <div class="not-found">
        <!-- Код ошибки 404 с крупным шрифтом -->
        <div class="nf-code">404</div>
        <!-- Заголовок ошибки -->
        <h2>${t('lostInFog')}</h2>
        <!-- Описание ошибки с предложением вернуться -->
        <p>${t('notFoundDesc')}</p>
        <!-- Кнопка для возврата на главную страницу -->
        <a href="#/" class="btn btn-primary">${t('returnHome')}</a>
      </div>`
  };
}
