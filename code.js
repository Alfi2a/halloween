const cube = document.getElementById("pumpkin");
const front = document.querySelector(".front");
const countdown = document.getElementById("countdown");

let targetX = 0;
let targetY = 0;

let currentX = 0;
let currentY = 0;

document.addEventListener("mousemove", (event) => {
    const mouseX = event.clientX / window.innerWidth;
    const mouseY = event.clientY / window.innerHeight;

    targetX = (mouseX - 0.5) * 35;
    targetY = -(mouseY - 0.5) * 35;
});

function animatePumpkin() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    cube.style.transform = `rotateX(${currentY}deg) rotateY(${currentX}deg)`;

    requestAnimationFrame(animatePumpkin);
}

animatePumpkin();

document.addEventListener("click", () => {
    /* Pumpkin glow */
    front.classList.remove("glowing");
    void front.offsetWidth;
    front.classList.add("glowing");

    /* Glow EVERY orange countdown outline */
    countdown.classList.remove("glowing");
    void countdown.offsetWidth;
    countdown.classList.add("glowing");
});

function createDigit(value) {
    const digit = document.createElement("div");
    digit.className = "digit";
    digit.textContent = value;
    digit.dataset.value = value;
    return digit;
}

function createNumber(value, key) {
    const wrapper = document.createElement("div");
    wrapper.className = "number-group";
    wrapper.dataset.key = key;

    const digits = String(value).padStart(2, "0");

    wrapper.appendChild(createDigit(digits[0]));
    wrapper.appendChild(createDigit(digits[1]));

    return wrapper;
}

function createSeparator() {
    const separator = document.createElement("div");
    separator.className = "separator";
    separator.textContent = ":";
    return separator;
}

function getCountdown() {
    const now = new Date();

    let halloween = new Date(
        now.getFullYear(),
        9,
        31,
        0,
        0,
        0
    );

    if (now >= halloween) {
        halloween = new Date(
            now.getFullYear() + 1,
            9,
            31,
            0,
            0,
            0
        );
    }

    const difference = halloween - now;

    return {
        days: Math.floor(
            difference / (1000 * 60 * 60 * 24)
        ),

        hours: Math.floor(
            (difference / (1000 * 60 * 60)) % 24
        ),

        minutes: Math.floor(
            (difference / (1000 * 60)) % 60
        ),

        seconds: Math.floor(
            (difference / 1000) % 60
        )
    };
}

function createBoard() {
    countdown.innerHTML = "";

    const days = createNumber(0, "days");
    const hours = createNumber(0, "hours");
    const minutes = createNumber(0, "minutes");
    const seconds = createNumber(0, "seconds");

    countdown.appendChild(days);
    countdown.appendChild(createSeparator());
    countdown.appendChild(hours);
    countdown.appendChild(createSeparator());
    countdown.appendChild(minutes);
    countdown.appendChild(createSeparator());
    countdown.appendChild(seconds);

    addLabel(days, "DAYS");
    addLabel(hours, "HOURS");
    addLabel(minutes, "MINUTES");
    addLabel(seconds, "SECONDS");
}

function addLabel(group, text) {
    const label = document.createElement("div");
    label.className = "unit-label";
    label.textContent = text;
    group.appendChild(label);
}

function updateDigit(element, newValue) {
    if (element.dataset.value === newValue) {
        return;
    }

    const oldDigit = element.dataset.value || element.textContent;
    element.dataset.value = newValue;

    const newDigit = document.createElement("span");
    newDigit.className = "digit-value new-value";
    newDigit.textContent = newValue;

    const oldValue = document.createElement("span");
    oldValue.className = "digit-value old-value";
    oldValue.textContent = oldDigit;

    element.innerHTML = "";
    element.appendChild(oldValue);
    element.appendChild(newDigit);

    requestAnimationFrame(() => {
        element.classList.add("changing");
    });

    setTimeout(() => {
        element.classList.remove("changing");
        element.innerHTML = newValue;
        element.dataset.value = newValue;
    }, 450);
}

function updateCountdown() {
    const time = getCountdown();

    const values = [
        String(time.days).padStart(2, "0"),
        String(time.hours).padStart(2, "0"),
        String(time.minutes).padStart(2, "0"),
        String(time.seconds).padStart(2, "0")
    ];

    const groups = countdown.querySelectorAll(".number-group");

    groups.forEach((group, groupIndex) => {
        const digits = group.querySelectorAll(".digit");
        const value = values[groupIndex];

        digits.forEach((digit, digitIndex) => {
            updateDigit(
                digit,
                value[digitIndex]
            );
        });
    });
}

createBoard();

const initialTime = getCountdown();

const initialValues = [
    String(initialTime.days).padStart(2, "0"),
    String(initialTime.hours).padStart(2, "0"),
    String(initialTime.minutes).padStart(2, "0"),
    String(initialTime.seconds).padStart(2, "0")
];

const initialGroups = countdown.querySelectorAll(".number-group");

initialGroups.forEach((group, groupIndex) => {
    const digits = group.querySelectorAll(".digit");

    digits.forEach((digit, digitIndex) => {
        const val = initialValues[groupIndex][digitIndex];
        digit.textContent = val;
        digit.dataset.value = val;
    });
});

setInterval(updateCountdown, 1000);