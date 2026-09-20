import { api } from '../api.js';
import { store } from '../store.js';
import { showToast } from '../main.js';
import { navigate } from '../router.js';
import { t } from '../i18n.js';

export function Auth() {
  const html = `
    <!-- Страница авторизации -->
    <div class="auth-page">
      <!-- Карточка авторизации -->
      <div class="auth-card">
        <!-- Вкладки для переключения между входом и регистрацией -->
        <div class="auth-tabs">
          <!-- Кнопка вкладки "Вход" с активным классом по умолчанию -->
          <button class="active" id="tab-login">${t('signInTab')}</button>
          <!-- Кнопка вкладки "Регистрация" -->
          <button id="tab-register">${t('registerTab')}</button>
        </div>
        <!-- Контейнер для динамического отображения форм входа или регистрации -->
        <div id="auth-forms"></div>
      </div>
    </div>`;
  
  return {
    html,           
    init() {        
      const tabLogin = document.getElementById('tab-login');       // Кнопка "Вход"
      const tabRegister = document.getElementById('tab-register'); // Кнопка "Регистрация"
      const forms = document.getElementById('auth-forms');         // Контейнер для форм

      // Объявляем функцию showLogin, которая отображает форму входа
      const showLogin = () => {
        // Активируем вкладку "Вход", деактивируем вкладку "Регистрация"
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
                // Заполняем контейнер формой входа с полями email и password
                forms.innerHTML = `
                  <form class="auth-form" id="login-form">
                    <div>
                      <!-- Поле для ввода email адреса -->
                      <label for="login-email">${t('email')}</label>
                      <input type="email" id="login-email" required placeholder="geralt@kaermorhen.com" />
                    </div>
                    <div>
                      <!-- Поле для ввода пароля -->
                      <label for="login-password">${t('password')}</label>
                      <input type="password" id="login-password" required placeholder="••••••••" />
                    </div>
                    <!-- Кнопка отправки формы входа -->
                    <button type="submit" class="btn btn-primary">${t('signInTab')}</button>
                  </form>`;
        
        bindLogin();
      };

      // Объявляем функцию showRegister, которая отображает форму регистрации
      const showRegister = () => {
        // Активируем вкладку "Регистрация", деактивируем вкладку "Вход"
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        
        // Заполняем контейнер формой регистрации с полями username, email и password
        forms.innerHTML = `
          <form class="auth-form" id="register-form">
            <div>
              <!-- Поле для ввода имени пользователя -->
              <label for="reg-username">${t('username')}</label>
              <input type="text" id="reg-username" required placeholder="WhiteWolf" />
            </div>
            <div>
              <!-- Поле для ввода email адреса -->
              <label for="reg-email">${t('email')}</label>
              <input type="email" id="reg-email" required placeholder="geralt@kaermorhen.com" />
            </div>
            <div>
              <!-- Поле для ввода пароля с минимальной длиной 6 символов -->
              <label for="reg-password">${t('password')}</label>
              <input type="password" id="reg-password" required placeholder="Мин. 6 символов" minlength="6" />
            </div>
            <!-- Кнопка отправки формы регистрации -->
            <button type="submit" class="btn btn-primary">${t('registerTab')}</button>
          </form>`;
        
        bindRegister();
      };

      // Добавляем обработчик клика на кнопку "Вход" - при клике показываем форму входа
      tabLogin.addEventListener('click', showLogin);
      
      // Добавляем обработчик клика на кнопку "Регистрация" - при клике показываем форму регистрации
      tabRegister.addEventListener('click', showRegister);
      
      showLogin();

      // Внутренняя функция для привязки обработчика отправки формы входа
      function bindLogin() {
        // Находим форму входа по ID и добавляем обработчик submit
        document.getElementById('login-form')?.addEventListener('submit', async (e) => {
          // Предотвращаем стандартную отправку формы (перезагрузку страницы)
          e.preventDefault();
          
          // Находим кнопку отправки формы и блокируем её (чтобы избежать повторных кликов)
          const btn = e.target.querySelector('button');
          btn.disabled = true;
          
          try {
            // Получаем значения из полей email и password
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Выполняем запрос на сервер для входа пользователя
            const data = await api.login({ email, password });
            
            // Сохраняем данные авторизации (токены и информацию о пользователе) в store и localStorage
            store.setAuth(data);
            
            // Показываем уведомление об успешном входе
            showToast(t('welcomeBack'), 'success');
            
            // Перенаправляем пользователя на главную страницу
            navigate('/');
            
            // Перезагружаем страницу для полного обновления состояния приложения
            location.reload();
          } catch (err) {
            // В случае ошибки (неверный email/пароль и т.д.) показываем сообщение об ошибке
            showToast(err.message, 'error');
            
            // Разблокируем кнопку, чтобы пользователь мог попробовать снова
            btn.disabled = false;
          }
        });
      }
      
      // Внутренняя функция для привязки обработчика отправки формы регистрации
      function bindRegister() {
        // Находим форму регистрации по ID и добавляем обработчик submit
        document.getElementById('register-form')?.addEventListener('submit', async (e) => {
          // Предотвращаем стандартную отправку формы
          e.preventDefault();
          
          // Находим кнопку отправки и блокируем её
          const btn = e.target.querySelector('button');
          btn.disabled = true;
          
          try {
            // Получаем значения из полей username, email и password
            const username = document.getElementById('reg-username').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            
            // Выполняем запрос на сервер для регистрации нового пользователя
            const data = await api.register({ username, email, password });
            
            // Сохраняем данные авторизации
            store.setAuth(data);
            
            // Показываем приветственное уведомление
            showToast(t('welcomeNew'), 'success');
            
            // Перенаправляем пользователя на главную страницу
            navigate('/');
            
            // Перезагружаем страницу для полного обновления состояния приложения
            location.reload();
          } catch (err) {
            // В случае ошибки (email уже существует и т.д.) показываем сообщение
            showToast(err.message, 'error');
            
            // Разблокируем кнопку
            btn.disabled = false;
          }
        });
      }
    }
  };
}