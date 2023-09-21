let timer;
let totalTime;
let elapsed = 0;
let mode = 'time_input';
// When jquery is ready, show the input
$(document).ready(() => {
    showInput();
});

function showInput() {
    // Hide the task div
    let taskDiv = document.querySelector('#task');
    $(taskDiv).hide();
    // Show the input
    let input = document.querySelector('#minutes');
    $(input).fadeIn(500);
}
// When the enter key is pressed, start the timer
document.addEventListener('keydown', (event) => {
    if (mode === 'times_up') {
        // Reset the timer
        clearInterval(timer);
        // Reset the background color
        let timerContainer = document.querySelector('.timer-container');
        $(timerContainer).css('background-color', '#ffffff');
        // Stop the flashing
        clearInterval(timesUpInterval);
        // Show the input
        showInput();
        mode = 'time_input';
        return;
    }
    if (mode === 'time_input') {
        if (event.key === 'Enter') {
            // Get the value of the input
            let input = document.querySelector('#minutes');
            // Convert the minutes to seconds
            let seconds = input.value * 60;
            startTimer(seconds);
            mode = 'task_input';
            return;
        }
        // Hide the intro text
        let introText = document.querySelector('.intro_text');
        $(introText).fadeOut(500);
        // Focus the input
        let input = document.querySelector('#minutes');
        input.focus();
    }
    if (mode === 'task_input') {
        if (event.key === 'Enter') {
            console.log('Enter pressed in task_input mode');
            let taskDiv = document.querySelector('#task');
            let taskInput = $(taskDiv).find('input');
            let taskValue = taskInput.val();
            console.log(taskValue);
            // Unfocus the input
            taskInput.blur();
            lockInTask();
        } else {
            taskInput.focus();
        }
    }
});

function lockInTask() {
    let taskDiv = document.querySelector('#task');
    let taskInput = $(taskDiv).find('input');
    let taskValue = taskInput.val();
    let remainingTimeDiv = document.querySelector('.remaining_time');
    if (taskValue === '') {
        // Unfocus the input
        taskInput.blur();
        $(remainingTimeDiv).addClass('shown');
        return;
    }
    $('#task').addClass('shown');
    $(remainingTimeDiv).addClass('lifted');
    $(remainingTimeDiv).addClass('shown');
}

function startTimer(seconds) {
    // Hide the input
    let input = document.querySelector('#minutes');
    input.style.display = 'none';
    taskDiv = document.querySelector('#task');
    $(taskDiv).fadeIn(500);
    taskInput = $(taskDiv).find('input');
    $(taskInput).addClass('placeholder_shown');
    // After 2 seconds, remove the class again
    setTimeout(() => {
        $(taskInput).removeClass('placeholder_shown');
    }, 3000);
    taskInput.focus();

    let remainingTimeDiv = document.querySelector('.remaining_time');
    if (timer) {
        clearInterval(timer);
    }
    totalTime = seconds;
    elapsed = 0;
    updateTimerDisplay(1);

    timer = setInterval(() => {
        elapsed += 1;
        let percentageLeft = 1 - (elapsed / totalTime);
        updateTimerDisplay(percentageLeft);

        if (elapsed >= totalTime) {
            clearInterval(timer);
        }
    }, 1000);

    // Lock in the task after 2 seconds only if the user hasn't typed anything
    setTimeout(() => {
        if (taskInput.val() === '') {
            lockInTask();
        }
    }
    , 4000);
}

function updateTimerDisplay(percentage) {
    if (percentage < 0) {
        percentage = 0;
    }
    let timerDisc = document.querySelector('.timer-disc');
    timerDisc.style.transform = `scale(${percentage})`;
    let remainingTimeDiv = document.querySelector('.remaining_time');
    let remainingTime = totalTime - elapsed;
    let minutes = Math.floor(remainingTime / 60);
    let seconds = remainingTime % 60;
    if (remainingTime < 60 && remainingTime > 0) {
        remainingTimeDiv.innerHTML = `${seconds}`;
        return;
    }
    if (remainingTime === 0) {
        timesUp();
        return;
    }
    remainingTimeDiv.innerHTML = `${minutes}:${seconds}`;

}

function timesUp() {
    // Make the timer container background red
    let timerContainer = document.querySelector('.timer-container');
    $(timerContainer).addClass('times_up');
    // Replace the remaining time with "Time's up!"
    let remainingTimeDiv = document.querySelector('.remaining_time');
    remainingTimeDiv.innerHTML = 'Done';
    mode = 'times_up';
}
