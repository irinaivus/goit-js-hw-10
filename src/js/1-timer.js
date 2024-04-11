import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector('button');
const inputDate = document.querySelector('#dateTime-picker');

let userSelectedDate;
let timerCount;

flatpickr(inputDate, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];

    if (userSelectedDate < new Date()) {
      iziToast.warning({
        position: 'topCenter',
        title: 'Warning',
        message: 'Please choose a date in the future!',
      });
      disableStartBtn();
    } else {
      enableStartBtn();
    }
  },
});

function disableStartBtn() {
  startBtn.disabled = true;
}
disableStartBtn();

function enableStartBtn() {
  startBtn.disabled = false;
  startBtn.addEventListener('click', startTimer);
}

function startTimer() {
  disableStartBtn();
  inputDate.disabled = true;

  if (timerCount) {
    clearInterval(timerCount);
  }

  timerCount = setInterval(function () {
    const currentTime = new Date().getTime();
    const remainingTime = userSelectedDate.getTime() - currentTime;

    if (remainingTime <= 0) {
      clearInterval(timerCount);
      updateTimerDisplay(0);
      enableStartBtn();
      iziToast.success({
        title: 'Success',
        message: 'Countdown finished!',
        position: 'topCenter',
      });
    } else {
      updateTimerDisplay(remainingTime);
    }
  }, 1000);
}

function updateTimerDisplay(remainingTime) {
  const { days, hours, minutes, seconds } = convertMs(remainingTime);
  function addLeadingZero(value) {
    return String(value).padStart(2, '0');
  }

  document.querySelector('[data-days]').textContent = addLeadingZero(days);
  document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
  document.querySelector('[data-minutes]').textContent =
    addLeadingZero(minutes);
  document.querySelector('[data-seconds]').textContent =
    addLeadingZero(seconds);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(iziToast);
console.log(flatpickr);
