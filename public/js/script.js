document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.cars-track');
    const cards = document.querySelectorAll('.car-card');
    let currentPosition = 0;
    const cardWidth = cards[0].offsetWidth + 54; // ширина карточки + gap

    const container = track.parentElement; // родительский элемент, ограничивающий ширину
    const containerWidth = container.offsetWidth;
    const trackWidth = cardWidth * cards.length;

    const maxTranslate = 0;
    const minTranslate = Math.min(containerWidth - trackWidth, 0); // может быть 0 или отрицательное

    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

  // Функция для перемещения слайдера
  function moveSlider(direction) {
    if (direction === 'next' && currentPosition > minTranslate) {
      currentPosition -= cardWidth;
    } else if (direction === 'prev' && currentPosition < maxTranslate) {
      currentPosition += cardWidth;
    }
    track.style.transform = `translateX(${currentPosition}px)`;
  }

  // Обработчики для перетаскивания мышью
  track.addEventListener('mousedown', dragStart);
  track.addEventListener('mousemove', drag);
  track.addEventListener('mouseup', dragEnd);
  track.addEventListener('mouseleave', dragEnd);

  // Обработчики для сенсорных устройств
  track.addEventListener('touchstart', dragStart);
  track.addEventListener('touchmove', drag);
  track.addEventListener('touchend', dragEnd);

  function dragStart(event) {
    isDragging = true;
    startPos = getPositionX(event);
    track.style.transition = 'none';
  }

  function drag(event) {
    if (!isDragging) return;
    const currentPosition = getPositionX(event);
    const diff = currentPosition - startPos;
    currentTranslate = prevTranslate + diff;
    
    currentTranslate = Math.max(Math.min(currentTranslate, maxTranslate), minTranslate);
    track.style.transform = `translateX(${currentTranslate}px)`;
  }

  function dragEnd() {
    isDragging = false;
    track.style.transition = 'transform 0.3s ease';
    
    // Выравниваем по ближайшей карточке
    const movedBy = currentTranslate - prevTranslate;
    if (Math.abs(movedBy) > cardWidth / 3) {
      if (movedBy < 0 && currentPosition > minTranslate) {
        currentPosition -= cardWidth;
      } else if (movedBy > 0 && currentPosition < maxTranslate) {
        currentPosition += cardWidth;
      }
    }
    
    currentPosition = Math.max(Math.min(currentPosition, maxTranslate), minTranslate);
    track.style.transform = `translateX(${currentPosition}px)`;
    prevTranslate = currentPosition;
  }

  function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }

  // Добавляем обработчики для кнопок
  const prevButton = document.querySelector('.cars-prev');
  const nextButton = document.querySelector('.cars-next');

  if (prevButton) {
    prevButton.addEventListener('click', () => moveSlider('prev'));
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => moveSlider('next'));
  }
});
