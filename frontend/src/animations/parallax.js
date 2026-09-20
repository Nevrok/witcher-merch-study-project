import gsap from 'gsap';

/**
 * Инициализирует все параллакс-эффекты на странице.
 * Создает два типа эффектов:
 * 1. Параллакс при прокрутке — фон движется медленнее контента
 * 2. Параллакс от движения мыши — фон слегка смещается в сторону курсора
 */
export function initParallax() {
  // Находим элемент фона hero-секции по ID
  const heroBg = document.getElementById('hero-bg');
  
  // Если элемент не найден — выходим из функции, возвращаем null
  if (!heroBg) return null;

  /**
   * Обработчик события прокрутки страницы.
   * При прокрутке фон смещается вверх медленнее, чем контент.
   */
  const onScroll = () => {
    // Получаем текущую позицию прокрутки по вертикали (в пикселях)
    const scrollY = window.scrollY;
    
    // Находим высоту hero-секции (если не найдено, используем 800px по умолчанию)
    const heroHeight = document.querySelector('.hero')?.offsetHeight || 800;
    
    // Пока прокрутка не превысила высоту hero-секции
    if (scrollY < heroHeight) {
      // Изменяем transform фона:
      heroBg.style.transform = `scale(1.1) translateY(${scrollY * 0.3}px)`;
    }
  };

  /**
   * Обработчик движения мыши.
   */
  const onMouseMove = (e) => {
    // Рассчитываем смещение по горизонтали:
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    
    // Рассчитываем смещение по вертикали (аналогично, диапазон -10..10)
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    
    // Плавно анимируем смещение фона с помощью GSAP
    gsap.to(heroBg, {
      x: x,                     // Смещение по горизонтали
      y: y,                     // Смещение по вертикали
      duration: 1,              // Длительность анимации 1 секунда
      ease: 'power2.out'        // Плавное замедление в конце
    });
  };

  // Регистрируем обработчики событий
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('mousemove', onMouseMove, { passive: true });

  // Эти анимации срабатывают сразу при загрузке страницы (без ожидания скролла)
  // Анимация для элементов с классом .reveal-scale внутри .hero-content
  // Появляются с эффектом увеличения
  gsap.fromTo(
    '.hero-content .reveal-scale',           // Целевые элементы
    { opacity: 0, scale: 0.8 },              // Начальное состояние: прозрачные, уменьшены
    { 
      opacity: 1,                            // Конечное состояние: видимые
      scale: 1,                              // Нормальный размер
      duration: 1,                           // Длительность 1 секунда
      delay: 0.3,                            // Задержка 0.3 секунды
      ease: 'back.out(1.4)'                  // Эффект "перелета" с отскоком (пружина)
    }
  );
  
  // Анимация для элементов с классом .reveal внутри .hero-content
  // Появляются снизу вверх с эффектом каскада (stagger)
  gsap.fromTo(
    '.hero-content .reveal',                 // Целевые элементы
    { opacity: 0, y: 40 },                   // Начальное состояние: прозрачные, смещены вниз
    {
      opacity: 1,                            // Конечное состояние: видимые
      y: 0,                                  // На исходной позиции
      duration: 0.8,                         // Длительность 0.8 секунды
      stagger: 0.15,                         // Задержка между анимациями элементов 0.15 сек (каскад)
      delay: 0.5,                            // Общая задержка 0.5 секунды
      ease: 'power3.out'                     // Плавное замедление в конце
    }
  );

  // Возвращаем функцию, которая удаляет обработчики событий
  // Это важно для предотвращения утечек памяти при уходе со страницы
  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('mousemove', onMouseMove);
  };
}