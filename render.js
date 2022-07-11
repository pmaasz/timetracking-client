const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resumeButton = document.getElementById('resume');
const endButton = document.getElementById('end');
const content = document.getElementById('content');
const buttonContainer = document.getElementById('button-container');
const clockContainer = document.getElementById('clock');
const timerContainer = document.getElementById('timer');

let timer = "00:00";
let startTime;
let pauseTime;
let resumeTime;
let endTime;
let clock = new Date().toLocaleTimeString('de-DE', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
});

clockContainer.innerText = clock;
timerContainer.innerText = timer;

buttonContainer.removeChild(pauseButton);
buttonContainer.removeChild(resumeButton);
buttonContainer.removeChild(endButton);

content.removeChild(timerContainer);

startButton.addEventListener('click', () => {
    postData( "http://0.0.0.0:9123/start", { answer: 42 }).then(data => {
        console.log(data); // JSON data parsed by `data.json()` call
        //@todo get Value from Backend
        startTime = new Date();

        buttonContainer.removeChild(startButton);
        buttonContainer.appendChild(pauseButton);
        buttonContainer.appendChild(endButton);

        content.removeChild(clockContainer);
        content.appendChild(timerContainer);
    });
});

pauseButton.addEventListener('click', () => {
    postData("http://0.0.0.0:9123/pause", { answer: 42 }).then(data => {
        console.log(data); // JSON data parsed by `data.json()` call
        //@todo get Value from Backend
        pauseTime = new Date();

        buttonContainer.removeChild(pauseButton);
        buttonContainer.removeChild(endButton);
        buttonContainer.appendChild(resumeButton);
        buttonContainer.appendChild(endButton);

        content.removeChild(timerContainer);
        content.appendChild(clockContainer);
    });
});

resumeButton.addEventListener('click', () => {
    postData("http://0.0.0.0:9123/resume", { answer: 42 }).then(data => {
        console.log(data); // JSON data parsed by `data.json()` call
        //@todo get Value from Backend
        resumeTime = new Date();

        buttonContainer.removeChild(resumeButton);
        buttonContainer.removeChild(endButton);
        //buttonContainer.appendChild(pauseButton); no second pause currently possible
        buttonContainer.appendChild(endButton);

        content.removeChild(clockContainer);
        content.appendChild(timerContainer);
    });
});

endButton.addEventListener('click', () => {
    postData("http://0.0.0.0:9123/endButton", { answer: 42 }).then(data => {
        console.log(data); // JSON data parsed by `data.json()` call
        //@todo get Value from Backend
        endTime = new Date();
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
    });
});

function toHHMM (timer) {
    timer = timer / 1000;
    let sec_num = parseInt(timer, 10);
    let hours   = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);

    if (hours   < 10) {
        hours   = "0"+hours;
    }

    if (minutes < 10) {
        minutes = "0"+minutes;
    }

    return hours+':'+minutes;
}

function getTime() {
    clock = new Date();
    clockContainer.innerHTML = clock.toLocaleTimeString('de-DE', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
    });

    if (startTime && !pauseTime) {
        timer = clock.getTime() - startTime.getTime();
    } else if (resumeTime) {
        let pause = resumeTime.getTime() - pauseTime.getTime();
        let beforePauseHours = clock.getTime() - startTime.getTime();
        let afterPauseHours = clock.getTime() - resumeTime.getTime();

        if(pause < (1000*60*30) && beforePauseHours >= (1000*60*60*6)) {
            pause = 1000*60*30;
        }

        if(beforePauseHours + afterPauseHours >= (1000*60*60*9) && pause < (1000*60*45)) {
            pause = 1000*60*45;
        }

        timer = beforePauseHours + afterPauseHours - pause;
        timer.toString();
    }

    if(timer){
        timerContainer.innerHTML = toHHMM(timer);
    }
}
setInterval(getTime, 1000);

// Example POST method implementation:
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'omit', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
        },
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    });
    return response.json();
}