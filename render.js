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

let currentWorkday;
let currentTimeEntry;
let currentPause;

let pauseTotal;
let hoursTotal;

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
    getRequest("http://0.0.0.0:9123/start").then(response => {
        let responseData = JSON.parse(response);
        startTime = unixTimestampToLocalTime(responseData.startTimestamp);
        currentWorkday = responseData.currentWorkday;
        currentTimeEntry = responseData.currentTimeEntry;

        buttonContainer.removeChild(startButton);
        buttonContainer.appendChild(pauseButton);
        buttonContainer.appendChild(endButton);

        content.removeChild(clockContainer);
        content.appendChild(timerContainer);
    });
});

pauseButton.addEventListener('click', () => {
    getRequest("http://0.0.0.0:9123/pause", {
        "currentWorkday": currentWorkday,
        "currentTimeEntry": currentTimeEntry,
    }).then(response => {
        let responseData = JSON.parse(response);
        currentWorkday = responseData.currentWorkday;
        currentPause = responseData.currentPause;
        pauseTime = responseData.pauseStartTimestamp;

        buttonContainer.removeChild(pauseButton);
        buttonContainer.removeChild(endButton);
        buttonContainer.appendChild(resumeButton);
        buttonContainer.appendChild(endButton);

        content.removeChild(timerContainer);
        content.appendChild(clockContainer);
    });
});

resumeButton.addEventListener('click', () => {
    getRequest("http://0.0.0.0:9123/resume", {
        "currentWorkday": currentWorkday,
        "currentPause": currentPause,
    }).then(response => {
        let responseData = JSON.parse(response);
        currentWorkday = responseData.currentWorkday;
        currentTimeEntry = responseData.currentTimeEntry;
        resumeTime = responseData.resumeTimestamp;

        buttonContainer.removeChild(resumeButton);
        buttonContainer.removeChild(endButton);
        //buttonContainer.appendChild(pauseButton); no second pause currently possible
        buttonContainer.appendChild(endButton);

        content.removeChild(clockContainer);
        content.appendChild(timerContainer);
    });
});

endButton.addEventListener('click', () => {
    getRequest("http://0.0.0.0:9123/end", {
        "currentWorkday": currentWorkday,
        "currentTimeEntry": currentTimeEntry,
    }).then(response => {
        let responseData = JSON.parse(response);
        currentWorkday = responseData.currentWorkday;
        pauseTotal = responseData.pauseTotal;
        hoursTotal = responseData.hoursTotal;
        endTime = responseData.endTimestamp;

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

function unixTimestampToLocalTime(timestamp) {
    let unixtimestamp = timestamp * 1000;
    let date = new Date(unixtimestamp);
    return date.toLocaleString('de-DE', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
    });
}

function updateClock() {
    return new Date().toLocaleTimeString('de-DE', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
    });
}

function getTime() {
    clock = updateClock();
    clockContainer.innerHTML = clock;

    if (startTime) {
        //@todo here is a bug, timer is NaN
        timer = clock - startTime;
    } else if (resumeTime) {
        let pause = resumeTime - pauseTime;
        let beforePauseHours = clock - startTime;
        let afterPauseHours = clock - resumeTime;

        if(pause < (1000*60*30) && beforePauseHours >= (1000*60*60*6)) {
            pause = 1000*60*30;
        }

        if(beforePauseHours + afterPauseHours >= (1000*60*60*9) && pause < (1000*60*45)) {
            pause = 1000*60*45;
        }

        timer = beforePauseHours + afterPauseHours - pause;
    }

    timer.toString();
    timerContainer.innerHTML = toHHMM(timer);
}
setInterval(getTime, 1000);

const getRequest = (url, params) => {
    let formData = new FormData();

    if(params){
        for (let key in params) {
            formData.append(key, params[key]);
            console.log(key + ": "+ params[key])
        }
    }

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.response);
            } else {
                reject(new Error(xhr.statusText));
            }
        };
        xhr.onerror = () => {
            reject(new Error('Network Error'));
        };
        xhr.send(formData);
    });
};