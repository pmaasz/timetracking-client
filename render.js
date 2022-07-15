const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resumeButton = document.getElementById('resume');
const endButton = document.getElementById('end');
const content = document.getElementById('content');
const buttonContainer = document.getElementById('button-container');
const clockContainer = document.getElementById('clock');
const timerContainer = document.getElementById('timer');

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

buttonContainer.removeChild(pauseButton);
buttonContainer.removeChild(resumeButton);
buttonContainer.removeChild(endButton);

startButton.addEventListener('click', () => {
    getRequest("http://0.0.0.0:9123/start").then(response => {
        let responseData = JSON.parse(response);
        startTime = unixTimestampToLocalTime(responseData.startTimestamp);
        currentWorkday = responseData.currentWorkday;
        currentTimeEntry = responseData.currentTimeEntry;

        buttonContainer.removeChild(startButton);
        buttonContainer.appendChild(pauseButton);
        buttonContainer.appendChild(endButton);
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
        pauseTime = unixTimestampToLocalTime(responseData.pauseStartTimestamp);

        buttonContainer.removeChild(pauseButton);
        buttonContainer.removeChild(endButton);
        buttonContainer.appendChild(resumeButton);
        buttonContainer.appendChild(endButton);
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
        resumeTime = unixTimestampToLocalTime(responseData.resumeTimestamp);

        buttonContainer.removeChild(resumeButton);
        buttonContainer.removeChild(endButton);
        //buttonContainer.appendChild(pauseButton); no second pause currently possible
        buttonContainer.appendChild(endButton);
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
        endTime = unixTimestampToLocalTime(responseData.endTimestamp);

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
    });
});

function unixTimestampToLocalTime(timestamp) {
    let unixtimestamp = timestamp * 1000;
    let date = new Date(unixtimestamp);

    return date.toLocaleString('de-DE', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
    });
}

function getTime() {
    clock = new Date().toLocaleTimeString('de-DE', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
    });
    clockContainer.innerHTML = clock
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