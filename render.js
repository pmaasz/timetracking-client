const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resumeButton = document.getElementById('resume');
const endButton = document.getElementById('end');
const content = document.getElementById('content');
const buttonContainer = document.getElementById('button-container');

let time = new Date();

content.innerText = time.toLocaleTimeString('de-DE', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
});

// todo remove and add buttons to DOM

buttonContainer.removeChild(pauseButton);
buttonContainer.removeChild(resumeButton);
buttonContainer.removeChild(endButton);

startButton.addEventListener('click', () => {
    buttonContainer.removeChild(startButton);
    buttonContainer.appendChild(pauseButton);
    buttonContainer.appendChild(endButton);
});

pauseButton.addEventListener('click', () => {
    buttonContainer.removeChild(pauseButton);
    buttonContainer.removeChild(endButton);

    buttonContainer.appendChild(resumeButton);
    buttonContainer.appendChild(endButton);
});

resumeButton.addEventListener('click', () => {
    buttonContainer.removeChild(resumeButton);
    buttonContainer.removeChild(endButton);

    buttonContainer.appendChild(pauseButton);
    buttonContainer.appendChild(endButton);
});

endButton.addEventListener('click', () => {
    buttonContainer.removeChild(pauseButton);
    buttonContainer.removeChild(endButton);

    buttonContainer.appendChild(startButton);
});