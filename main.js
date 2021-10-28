const popupReg = document.querySelector('.popup-reg');
const btnReg = document.querySelector('.form-reg__btn');
const btnNoReg = document.querySelector('.form-reg__btn-noreg');
const input = document.querySelector('.form-reg__input');
const btn = document.querySelectorAll('.btn');
const buttons = document.querySelector('.buttons');
const btnLevels = document.querySelectorAll('.btn-level');
const timer = document.querySelector('#timer');
const balloons = document.querySelectorAll('.game__item');
const board = document.querySelector('.game__board');
const count = document.querySelector('.statistic__score-num');
const popup = document.querySelector('.popup');
const message = document.querySelector('.popup__title');
const nameGamer = document.querySelector('.statistic__name-gamer');
const popupScore = document.querySelector('.popup__score-num');
const audio = document.querySelector('#audio');
const btnMusic = document.querySelector('.btn-music');
const btnResult = document.querySelector('.btn-result');
const btnVolume = document.querySelector('.muted');
const data = {}
const messages = [
  'Do not despair. Try again!',
  'Well so good!',
  'Very good!',
  'Delightfully!!!'
];
const colors = [
  'var(--color-one)',
  'var(--color-two)',
  'var(--color-three)',
  'var(--color-four)',
  'var(--color-five)',
  'var(--color-six)',
  'var(--color-seven)',
  'var(--color-eight)',
  'var(--color-nine)',
  'var(--color-default)',
];

let regName;
const stack = ['easy'];
const time = 20000;
let timeStart = 20;
let counter = 0;
count.textContent = 0;
timer.textContent = timeStart;
const playSound = (code) => {
  const audio = document.querySelector(`audio[data-elem="${code}"`);
  audio.currentTime = 0;
  audio.play();
}
const gamePlay = () => {
  timeStart = 20;
  let level = stack.pop();
  switch (level) {
    case 'easy':
      timeActive = 950;
      break;
    case 'medium':
      timeActive = 800;
      break;
    case 'hard':
      timeActive = 650;
      break;
  }
  const timerChangeColor = setInterval(() => {
    const balloonRandomIndex = Math.floor(Math.random() * 10);
    balloons.forEach((balloon, index) => {
      if (index === balloonRandomIndex) {
        balloon.style.background = colors[index];
        balloon.firstElementChild.style.background = colors[index];
        balloon.firstElementChild.classList.add('active');
        setTimeout(() => {
          balloon.style.background = colors[9];
          balloon.firstElementChild.style.background = colors[9];
          balloon.firstElementChild.classList.remove('active');
        }, timeActive)
      }
    });
  }, timeActive);

  setTimeout(() => {
    clearInterval(timerChangeColor);
    btn.forEach(item => item.disabled = false);
    setTimeout(() => {
      popup.classList.add('popup--active');
      playSound('04');
    }, 1000)
    setTimeout(() => {
      popup.classList.remove('popup--active');
    }, 5000)
  }, time);
}
const timerInit = () => {
  const timeUpdate = setInterval(() => {
    let second;
    if (timeStart < 10) second = '0' + timeStart;
    else second = timeStart;
    timer.innerHTML = `${second}`;
    timeStart--;
  }, 1000);
  setTimeout(() => {
    clearInterval(timeUpdate);
  }, time + 1000);
}
const scoreCounter = () => {
  message.textContent = messages[0];
  board.addEventListener('click', (e) => {
    if (e.target.classList.contains('game__item-center') &&
      e.target.classList.contains('active')) {
      counter++;
      e.target.classList.remove('active');
      const dataElem = e.target.dataset.elem;
      playSound(dataElem);
      count.textContent = counter;
      data.score = counter;
      popupScore.textContent = counter;
      localStorage.setItem('name', JSON.stringify(data));
      if (counter < 5) message.textContent = messages[0];
      else if (counter >= 5 && counter < 10) message.textContent = messages[1];
      else if (counter >= 10 && counter < 15) message.textContent = messages[2];
      else message.textContent = messages[3];
    }
  });
}
btnReg.addEventListener('click', (e) => {
  if (e.target && input.value != '') {
    e.preventDefault();
    regName = input.value;
    nameGamer.textContent = regName;
    popupReg.classList.add('popup--close');
  }
});
btnNoReg.addEventListener('click', (e) => {
  if (e.target) {
    e.preventDefault();
    popupReg.classList.add('popup--close');
  }
});
buttons.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-level')) {
    const dataElem = e.target.dataset.elem;
    playSound(dataElem);
    const id = e.target.id;
    if (stack.length === 0) stack.push(id);
    else {
      stack.pop();
      stack.push(id);
    }
    btnLevels.forEach(btn => {
      if (btn.classList.contains('btn--active'))
        btn.classList.remove('btn--active');
      e.target.classList.add('btn--active');
    });
  }
  if (e.target.classList.contains('btn-start')) {
    input.value = '';
    data.name = regName;
    data.score = 0;
    const dataElem = e.target.dataset.elem;
    playSound(dataElem);
    btn.forEach(item => item.disabled = true);
    counter = 0;
    count.textContent = 0;
    gamePlay();
    scoreCounter();
    timerInit();
  }
});
btnMusic.addEventListener('click', () => {
  playSound('02');
  if (!btnMusic.classList.contains('btn--active')) {
    const dataElem = btnMusic.dataset.elem;
    playSound(dataElem);
    btnMusic.classList.add('btn--active');
  } else {
    btnMusic.classList.remove('btn--active');
    audio.pause()
  }
});
btnResult.addEventListener('click', () => {
  playSound('02');
  const strData = localStorage.getItem('name');
  const objData = JSON.parse(strData);
  if (nameGamer.textContent === objData.name) {
    const result = document.createElement('div');
    result.classList.add('popup--active', 'popup');
    result.innerHTML = `<div class="popup__statistic statistic__box">
        <h2 class="popup__score-title title">Your result:</h2>
        <span class="popup__score-num num">${objData.score}</span>
      </div>`
    document.body.appendChild(result);
    setTimeout(() => {
      result.parentNode.removeChild(result);
    }, 5000)
  }
});
btnVolume.addEventListener('click', () => {
  if (!btnVolume.classList.contains('muted--active')) {
    btnVolume.classList.add('muted--active');
    document.querySelectorAll('audio')
      .forEach(item => item.muted = true);
  } else {
    btnVolume.classList.remove('muted--active');
    document.querySelectorAll('audio')
      .forEach(item => item.muted = false);
  }
});




