const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resumeButton = document.getElementById('resume');
const endButton = document.getElementById('end');
const content = document.getElementById('content');
const buttonContainer = document.getElementById('button-container');
const clockContainer = document.getElementById('clock');
const timerContainer = document.getElementById('timer');

let timer = null;

let clock = new Date();
clockContainer.innerText = clock.toLocaleTimeString('de-DE', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
});

// todo remove and add buttons to DOM

buttonContainer.removeChild(pauseButton);
buttonContainer.removeChild(resumeButton);
buttonContainer.removeChild(endButton);
content.removeChild(timerContainer);

startButton.addEventListener('click', () => {
    buttonContainer.removeChild(startButton);

    buttonContainer.appendChild(pauseButton);
    buttonContainer.appendChild(endButton);

    content.removeChild(clockContainer);
    content.appendChild(timerContainer);

    timerContainer.innerText = '00:00';
});

pauseButton.addEventListener('click', () => {
    buttonContainer.removeChild(pauseButton);
    buttonContainer.removeChild(endButton);

    buttonContainer.appendChild(resumeButton);
    buttonContainer.appendChild(endButton);

    content.removeChild(timerContainer);
    content.appendChild(clockContainer);

    timerContainer.innerText = clock.toLocaleTimeString('de-DE', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
    });
});

resumeButton.addEventListener('click', () => {
    buttonContainer.removeChild(resumeButton);
    buttonContainer.removeChild(endButton);

    buttonContainer.appendChild(pauseButton);
    buttonContainer.appendChild(endButton);

    content.removeChild(clockContainer);
    content.appendChild(timerContainer);

    timerContainer.innerText = '00:00';
});

endButton.addEventListener('click', () => {
    //if buttonContainer has child pausebutton, remove it
    if (buttonContainer.contains(pauseButton)) {
        buttonContainer.removeChild(pauseButton);
    }

    //if buttonContainer has child resumebutton, remove it
    if (buttonContainer.contains(resumeButton)) {
        buttonContainer.removeChild(resumeButton);
    }

    buttonContainer.removeChild(endButton);
    buttonContainer.appendChild(startButton);

    content.removeChild(timerContainer);
    content.appendChild(clockContainer);

    timerContainer.innerText = clock.toLocaleTimeString('de-DE', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
    });
});