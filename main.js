// Setting Game Name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").textContent = gameName;
document.querySelector(
  "footer"
).textContent = `${gameName} Game Created By Soufiane Naji`;

// Setting Game Options
let numberOfTries = 6;
let numberOfLetters = 6;
let currentTry = 1;
let numberOfHints = 2;

// Manage Words
let wordToGuess = "";
const words = [
  "Create",
  "Update",
  "Delete",
  "Master",
  "Branch",
  "Mainly",
  "Elzero",
  "School",
];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
let messageArea = document.querySelector(".message");
console.log(wordToGuess);

// Manage Hints
document.querySelector(".hint span").innerHTML = numberOfHints;
const getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click", getHint);

function generateInputs() {
  const inputsContainer = document.querySelector(".inputs");

  // Create Main Try Div
  for (let i = 1; i <= numberOfTries; i++) {
    const tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>Try ${i}</span>`;

    if (i !== 1) tryDiv.classList.add("disabled-inputs");

    // Create Inputes
    for (let j = 1; j <= numberOfLetters; j++) {
      let input = document.createElement("input");
      input.type = "text";
      input.id = `guess-${i}-letter-${j}`;
      input.setAttribute("maxlength", "1");
      tryDiv.appendChild(input);
    }

    inputsContainer.appendChild(tryDiv);
  }
  // Focus On First Input In First Try Element
  inputsContainer.children[0].children[1].focus();

  // Disable All Inputs Except First One
  const inputsInDisableDiv = document.querySelectorAll(
    ".disabled-inputs > input"
  );
  inputsInDisableDiv.forEach((el) => (el.disabled = true));

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    // Convert Input Value To Uppercase
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
      const nextInput = inputs[index + 1];
      if (nextInput) nextInput.focus();
    });

    input.addEventListener("keydown", function (even) {
      const currentIndex = Array.from(inputs).indexOf(even.target);
      if (even.key === "ArrowRight") {
        const nextInput = currentIndex + 1;
        if (nextInput < inputs.length) inputs[nextInput].focus();
      }
      if (even.key === "ArrowLeft") {
        const previousInput = currentIndex - 1;
        if (previousInput >= 0) inputs[previousInput].focus();
      }
    });
  });
}

const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuesses);

function handleGuesses() {
  let successGuess = true;
  for (let i = 1; i <= numberOfLetters; i++) {
    const inputFiled = document.querySelector(
      `#guess-${currentTry}-letter-${i}`
    );
    const letter = inputFiled.value.toLowerCase();
    const actualLetter = wordToGuess[i - 1];

    // Game Logic
    if (letter === actualLetter) {
      // Letter Is Correct And In Place
      inputFiled.classList.add("yes-in-place");
    } else if (wordToGuess.includes(letter) && letter != "") {
      // Letter Is Correct And Not In Place
      inputFiled.classList.add("not-in-place");
      successGuess = false;
    } else {
      // Letter Is Wrong
      inputFiled.classList.add("no");
      successGuess = false;
    }
  }

  // Check If User Ein Or Lose
  if (successGuess) {
    messageArea.innerHTML = `You Win The Word Is <span>${wordToGuess}</span>`;

    if (numberOfHints === 2)
      messageArea.innerHTML = `<p>Congrate You Didn't Use Hints</p>`;

    // Add Disable Class On All Try Divs
    let allTries = document.querySelectorAll(".inputs > div");
    allTries.forEach((item) => item.classList.add("disabled-inputs"));

    // Disable Guess Button
    guessButton.disabled = true;
    getHintButton.disabled = true;
  } else {
    document
      .querySelector(`.try-${currentTry}`)
      .classList.add("disabled-inputs");
    let currentTryInput = document.querySelectorAll(
      `.try-${currentTry} > input`
    );
    currentTryInput.forEach((prev) => (prev.disabled = true));
    currentTry++;

    let element = document.querySelector(`.try-${currentTry}`);
    if (element) {
      let nextTryInput = document.querySelectorAll(
        `.try-${currentTry} > input`
      );
      nextTryInput.forEach((next) => (next.disabled = false));
      document
        .querySelector(`.try-${currentTry}`)
        .classList.remove("disabled-inputs");
      element.children[1].focus();
    } else {
      // Disable Guess Button
      guessButton.disabled = true;
      getHintButton.disabled = true;
      messageArea.innerHTML = `You Lose The Word Is <span>${wordToGuess}</span>`;
    }
  }
}

function getHint() {
  if (numberOfHints > 0) {
    numberOfHints--;
    document.querySelector(".hint span").innerHTML = numberOfHints;
  }
  if (numberOfHints === 0) {
    getHintButton.disabled = true;
  }
  const inputsTryHint = document.querySelectorAll(`input`);
  const enabledInputs = document.querySelectorAll("input:not([disabled])");
  const emptyEnabledInputs = Array.from(enabledInputs).filter(
    (e) => e.value === ""
  );

  if (emptyEnabledInputs.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
    const randomInput = emptyEnabledInputs[randomIndex];
    const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
    if (indexToFill !== -1) {
      randomInput.value = wordToGuess[indexToFill].toUpperCase();
    }
  }
}

function handleBackspace(even) {
  if (even.key === "Backspace") {
    const inputs = document.querySelectorAll("input:not([disabled])");
    const currentIndex = Array.from(inputs).indexOf(even.target);
    if (currentIndex >= 0) {
      inputs[currentIndex].value = "";
      inputs[currentIndex - 1].value = "";
      inputs[currentIndex - 1].focus();
    }
  }
}
document.addEventListener("keydown", handleBackspace);

window.onload = function () {
  generateInputs();
};
