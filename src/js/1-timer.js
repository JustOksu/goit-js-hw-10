import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

document.getElementById('start-btn').addEventListener('click', () => {
  startTimer();
  document.getElementById('start-btn').disabled = true;
  document.getElementById('datetime-picker').disabled = true;
});

const datePicker = flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const userSelectedDate = selectedDates[0];
    const currentDate = new Date();
    if (userSelectedDate < currentDate) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      document.getElementById('start-btn').disabled = true;
    } else {
      document.getElementById('start-btn').disabled = false;
    }
  },
});

document.getElementById('start-btn').addEventListener('click', startTimer);

function startTimer() {
  const userSelectedDate = datePicker.selectedDates[0];
  document.getElementById('start-btn').disabled = true;
  document.getElementById('datetime-picker').disabled = true;
  const timerInterval = setInterval(() => {
    const remainingTime = userSelectedDate - new Date();
    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      updateTimer(0);
      document.getElementById('datetime-picker').disabled = false;
      return;
    }
    updateTimer(remainingTime);
  }, 1000);
}

function updateTimer(remainingTime) {
  const time = convertMs(remainingTime);
  document.querySelector('[data-days]').textContent = addLeadingZero(time.days);
  document.querySelector('[data-hours]').textContent = addLeadingZero(
    time.hours
  );
  document.querySelector('[data-minutes]').textContent = addLeadingZero(
    time.minutes
  );
  document.querySelector('[data-seconds]').textContent = addLeadingZero(
    time.seconds
  );
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

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}