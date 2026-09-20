import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Инициализирует все анимации при прокрутке страницы.
 * Функция вызывается на страницах, где требуется анимация
 */
export function initScrollAnimations() {
  // Находим все элементы с классом .reveal (появляются снизу вверх)
  gsap.utils.toArray('.reveal').forEach(el => {
    // Проверяем, не была ли анимация уже применена (чтобы не дублировать)
    if (el.dataset.animated) return;
    // Помечаем элемент как анимированный
    el.dataset.animated = 'true';
    
    // Создаем анимацию: от (прозрачный, смещен вниз) к (видимый, на месте)
    gsap.fromTo(el,
      // Начальное состояние
      { opacity: 0, y: 40 },           // Невидим, смещен вниз на 40px
      // Конечное состояние
      {
        opacity: 1,                    // Полностью видим
        y: 0,                          // На исходной позиции
        duration: 0.8,                // Длительность анимации 0.8 секунды
        ease: 'power3.out',           // Плавное замедление в конце
        scrollTrigger: {
          trigger: el,                 // Элемент-триггер (когда он появляется)
          start: 'top 85%',           // Анимация начинается, когда верх элемента на 85% от верха окна
          toggleActions: 'play none none none' // Запускаем один раз при появлении
        }
      }
    );
  });

  // Находим все элементы с классом .reveal-left (появляются слева направо)
  gsap.utils.toArray('.reveal-left').forEach(el => {
    if (el.dataset.animated) return;
    el.dataset.animated = 'true';
    
    gsap.fromTo(el,
      // Начальное состояние: прозрачный, смещен влево на 40px
      { opacity: 0, x: -40 },
      // Конечное состояние: видимый, на месте
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Находим все сетки товаров (product-grid)
  gsap.utils.toArray('.product-grid').forEach(grid => {
    if (grid.dataset.animated) return;
    grid.dataset.animated = 'true';
    
    // Находим все карточки товаров внутри сетки
    const cards = grid.querySelectorAll('.product-card');
    if (cards.length === 0) return;

    // Анимируем все карточки с задержкой - каждая следующая появляется чуть позже
    gsap.fromTo(cards,
      // Начальное состояние: прозрачные, смещены вниз, наклонены по оси X
      { opacity: 0, y: 60, rotateX: 15 },
      // Конечное состояние: видимые, на месте, без наклона
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.6,                // Длительность 0.6 секунды
        stagger: 0.08,               // Задержка между анимациями карточек 0.08 секунды
        ease: 'power3.out',          // Плавное замедление
        scrollTrigger: {
          trigger: grid,              // Триггер — вся сетка
          start: 'top 80%',          // Анимация начинается, когда верх сетки на 80% от верха окна
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Находим все элементы с классом .stat-number (цифры статистики)
  gsap.utils.toArray('.stat-number').forEach(el => {
    if (el.dataset.animated) return;
    el.dataset.animated = 'true';
    
    // Получаем целевое число из атрибута data-target
    const target = parseInt(el.dataset.target);
    if (!target) return;

    // Создаем триггер без анимации, который запускает анимацию счетчика
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        // Анимируем текстовое содержимое от текущего значения до целевого
        gsap.to(el, {
          textContent: target,       // Целевое значение
          duration: 2,              // Длительность 2 секунды
          ease: 'power2.out',       // Плавное замедление
          snap: { textContent: 1 }, // Округляем до целых чисел
          // Функция, вызываемая на каждом кадре анимации
          onUpdate() {
            // Обновляем текст элемента: округляем и форматируем с разделителями тысяч
            el.textContent = Math.round(parseFloat(el.textContent)).toLocaleString();
          }
        });
      }
    });
  });

  // Находим все сетки категорий
  gsap.utils.toArray('.categories-grid').forEach(grid => {
    if (grid.dataset.animated) return;
    grid.dataset.animated = 'true';
    
    const cards = grid.querySelectorAll('.category-card');
    if (!cards.length) return;
    
    // Анимируем карточки категорий с эффектом "пружины" (back.out)
    gsap.fromTo(cards,
      // Начальное состояние: прозрачные, уменьшены
      { opacity: 0, scale: 0.9 },
      // Конечное состояние: видимые, нормальный размер
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,               // Задержка 0.1 секунды между карточками
        ease: 'back.out(1.2)',     // Эффект "перелета" с небольшим отскоком
        scrollTrigger: {
          trigger: grid,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Находим все заголовки секций (.section-title)
  gsap.utils.toArray('.section-title').forEach(title => {
    // Проверяем, не был ли заголовок уже разделен на буквы
    if (title.dataset.split) return;
    title.dataset.split = 'true';
    
    // Сохраняем исходный текст заголовка
    const text = title.textContent;
    
    // Заменяем текст на HTML, где каждая буква обернута в <span>
    title.innerHTML = text.split('').map(char =>
      char === ' ' ? ' ' : `<span style="display:inline-block">${char}</span>`
    ).join('');
    
    // Находим все созданные спаны с буквами
    const spans = title.querySelectorAll('span');
    if (!spans.length) return;
    
    // Анимируем каждую букву: появляются снизу с задержкой (каждая буква по очереди)
    gsap.fromTo(spans,
      // Начальное состояние: прозрачные, смещены вниз
      { opacity: 0, y: 20 },
      // Конечное состояние: видимые, на месте
      {
        opacity: 1,
        y: 0,
        duration: 0.05,             // Очень быстрая анимация для каждой буквы
        stagger: 0.03,              // Задержка 0.03 секунды между буквами (эффект печати)
        ease: 'power2.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Обновляем все триггеры (пересчитываем позиции после загрузки контента)
  ScrollTrigger.refresh();

  // Возвращаем функцию, которая убивает все ScrollTrigger-анимации
  return () => {
    ScrollTrigger.getAll().forEach(st => st.kill());
  };
}