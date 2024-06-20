let original_exam;
let user_exam = [];
let current_question = 0;
let countDown;
let countDownStart;
let countDownFinish;
let examFinished = false;
let examName = "";
const max_questions = 60;

$(document).ready(function () {
  const searchParams = new URLSearchParams(window.location.search);
  const exam_filename = searchParams.get("exam");
  examName = titleCase(exam_filename);

  const examLang = exam_filename.split(".")[0].split("-");
  console.log(examLang);
  let exams_path =
    "https://raw.githubusercontent.com/MatthewAraujo/exam-lab/main/assets/exams/";

  if (examLang.length > 1) {
    exams_path += examLang[1] + "-" + examLang[2] + "/";
  } else {
    exams_path += examLang[1] + "/";
  }

  console.log(exams_path);

  // Collect exam info
  $.getJSON(exams_path + exam_filename, (json) => {
    // Randomize the questions since we have more than exam needs
    original_exam = shuffle(json.exam);
    // Generate user answers card
    user_exam = new Array(max_questions).fill("");
    // Build first question
    buildQuestion();
  });

  $(".review-btn").show();
  generateCountdown();
});

$(document).keydown(function (event) {
  if (event.which == 37) {
    previousQuestion();
  }

  if (event.which == 39) {
    nextQuestion();
  }
});

// Alert progress lose before leave page
window.onbeforeunload = function (e) {
  e.preventDefault();
  // To avoid scamming, chromium and hence chrome have decided to remove
  // the ability to set a custom message in the onbeforeunload dialog.
  return event.returnValue;
};

function buildQuestion() {
  let question = original_exam[current_question];
  let has_mark = user_exam[current_question].includes("?");
  // Before empty previous question if exists
  $(".exam-simulation").empty();
  // Build question element
  $(".exam-simulation").append(
    `
    <div class="question-number">
      <img id="red-flag" src="assets/icons/red-flag.svg" alt="Marked Question"/>
      Question ${current_question + 1}
    </div>
    <div class="question">
      ${question.question}
    </div>
    <div class="alternatives">
      ${
        question.multichoice
          ? buildMultichoiceAlternatives(question.alternatives)
          : buildAlternatives(question.alternatives)
      }
    </div>
    <div class="actions">
      ${buildActionButtons()}
    </div>
    `
  );

  if (user_exam[current_question].includes("?")) {
    $("#red-flag").show();
  }
}

function buildSelectedQuestion(selected_question) {
  current_question = selected_question;
  buildQuestion();

  $(".review-btn").show();
  $(".finish-btn").hide();
}

function buildReview() {
  // Before empty previous question if exists
  $(".exam-simulation").empty();
  // Build question element
  $(".exam-simulation").append(
    `
    <div class="exam-resume">
      ${buildQuestionResume()}
    </div>
    `
  );

  $(".review-btn").hide();

  if (checkIfMarkedAllQuestions()) {
    $(".finish-btn").show();
  }
}

function buildQuestionResume() {
  let resume = "";
  for (let i = 0; i <= user_exam.length - 1; i++) {
    resume += `<span class="exam-resume-answer${isQuestionCorrectMarked(
      i
    )}" onclick="buildSelectedQuestion(${i})">Question ${i + 1}: ${
      user_exam[i]
    }</span>`;
  }
  return resume;
}

function buildFinishResults() {
  // Before empty previous question if exists
  $(".exam-simulation").empty();
  // Build question element
  $(".exam-simulation").append(
    `
    <div class="exam-finish-results">
      ${buildFinishStatistics()}
    </div>
    `
  );

  $(".finish-btn").hide();
}

function buildFinishStatistics() {
  let body = "";
  let corrects = 0;

  // Stops countdown
  clearInterval(countDown);
  countDownFinish = new Date().getTime();
  examFinished = true;

  for (let i = 0; i <= user_exam.length - 1; i++) {
    let correct_answer = Object.fromEntries(
      Object.entries(original_exam[i].alternatives).filter(
        ([k, v]) => v.correct
      )
    );
    let selected_answers = user_exam[i].replace(/[^A-Z]+/g, "");
    // If is a multichoice question
    if (Object.keys(correct_answer).length > 1) {
      correct_answers = Object.keys(correct_answer).join("");
      if (selected_answers == correct_answers) {
        corrects += 1;
      }
    }
    // If is a single choice question
    if (Object.keys(correct_answer).length == 1) {
      if (selected_answers == Object.keys(correct_answer)[0]) {
        corrects += 1;
      }
    }
  }

  let correct_percent = ((corrects / max_questions) * 100).toFixed(2);
  let pass = correct_percent >= 70.0;
  let success_msg = `Congratulations! You pass on ${examName} exam!`;
  let failure_msg =
    "Oh, sorry, you failed this time. Try again, you can do it!";
  body += `<span class="exam-result-statics ${pass ? "pass" : "fail"}">${
    pass ? success_msg : failure_msg
  }</span>`;
  body += `<span class="exam-result-statics">You finished the exam in ${getTimeToFinishExam()}.</span>`;
  body += `<span class="exam-result-statics">You got ${corrects} questions out of ${max_questions} questions correct.</span>`;
  body += `<span class="exam-result-statics">You got ${correct_percent}% score.</span>`;
  body += `<button class="action-button finished-review-btn" onclick="buildReview(true)">Review Finished Exam</button>`;
  return body;
}

function buildMultichoiceAlternatives(alternatives) {
  let alts = "";
  Object.keys(alternatives).forEach((alternative) => {
    alts += `
      <div class="alternative${isCorrectAnswer(
        alternatives[alternative].correct
      )}" onclick="selectMultiAlternative(this)">
        <span class="alternative-choice${checkIfAlreadySelected(
          alternative
        )}">${alternative}</span> ${alternatives[alternative].answer}
      </div>
    `;
  });
  return alts;
}

function buildAlternatives(alternatives) {
  let alts = "";
  Object.keys(alternatives).forEach((alternative) => {
    let correct_answer = alternatives[alternative].correct;
    alts += `
      <div class="alternative${isCorrectAnswer(
        correct_answer
      )}" onclick="selectAlternative(this)">
        <span class="alternative-letter${checkIfAlreadySelected(
          alternative
        )}">${alternative}.</span> ${alternatives[alternative].answer}
      </div>
    `;
  });
  return alts;
}

function isQuestionCorrectMarked(index) {
  if (!examFinished) {
    return "";
  }

  let correct_answer = Object.fromEntries(
    Object.entries(original_exam[index].alternatives).filter(
      ([k, v]) => v.correct
    )
  );
  correct_answers = Object.keys(correct_answer).join("");

  if (user_exam[index].replace(/[^A-Z]+/g, "").includes(correct_answers)) {
    return " question-correct-marked";
  } else {
    return " question-wrong-marked";
  }
}

function isCorrectAnswer(correct_answer) {
  if (correct_answer && examFinished) {
    return " correct-alternative";
  }

  return "";
}

function buildActionButtons() {
  let actions = "";

  actions += `<button class="action-button" role="button" onclick="previousQuestion()" ${
    current_question > 0 ? "" : "disabled"
  }>Previous</button>`;
  actions += `<button class="action-button" role="button" onclick="markQuestionToggle()">?</button>`;
  actions += `<button class="action-button" role="button" onclick="nextQuestion()" ${
    current_question < max_questions - 1 ? "" : "disabled"
  }>Next</button>`;

  return actions;
}

function selectMultiAlternative(event) {
  if (examFinished) {
    return;
  }

  $(event).find("span").toggleClass("selected");
  new_selecteds = $(".alternatives")
    .find(".selected")
    .toArray()
    .map((i) => {
      return i.innerText;
    })
    .join();
  has_mark = user_exam[current_question].includes("?");
  user_exam[current_question] = new_selecteds;

  if (has_mark) {
    user_exam[current_question] += "?";
  }
}

function selectAlternative(event) {
  if (examFinished) {
    return;
  }

  let span = $(event).find("span");
  if (!span.hasClass("selected")) {
    $(".alternatives").find("span").removeClass("selected");
    span.addClass("selected");
    has_mark = user_exam[current_question].includes("?");
    user_exam[current_question] = span.text().replace(/[^A-Z]+/g, "");
    if (has_mark) {
      user_exam[current_question] += "?";
    }
  }
}

function getTimeToFinishExam(exam_hours = 1.5) {
  let difference = countDownFinish - countDownStart;
  let hourDifference, minuteDifference, secondDifference;

  difference = difference / 1000;
  hourDifference = Math.floor(difference / 3600);

  difference -= hourDifference * 3600;
  minuteDifference = Math.floor(difference / 60);

  difference -= minuteDifference * 60;
  secondDifference = Math.floor(difference);

  return `${hourDifference} hours, ${minuteDifference} minutes, ${secondDifference} seconds`;
}

function markQuestionToggle() {
  if (user_exam[current_question].includes("?")) {
    user_exam[current_question] = user_exam[current_question].replace("?", "");
    $("#red-flag").hide();
  } else {
    user_exam[current_question] += "?";
    $("#red-flag").show();
  }
}

function previousQuestion() {
  if (current_question - 1 >= 0) {
    current_question -= 1;
    buildQuestion();
  }
}

function nextQuestion() {
  if (current_question + 1 < max_questions) {
    current_question += 1;
    buildQuestion();
  }
}

function checkIfAlreadySelected(current_alternative) {
  if (
    user_exam[current_question] != "" &&
    user_exam[current_question]
      .replace(/[^A-Z]+/g, "")
      .includes(current_alternative)
  ) {
    return " selected";
  }
  return "";
}

function checkIfMarkedAllQuestions() {
  if (examFinished || user_exam.some((el) => el === "")) {
    return false;
  }

  return true;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function titleCase(s) {
  return s
    .replace(".json", "")
    .replace(/^_*(.)|_+(.)/g, (s, c, d) =>
      c ? c.toUpperCase() : " " + d.toUpperCase()
    );
}

// COUNTDOWN

function generateCountdown(hours = 1.5) {
  // Define time of countdown in hours
  let date = new Date();
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);

  // Set the date we're counting down to
  var countDownDate = date.getTime();

  // Register when starts countdown
  countDownStart = new Date().getTime();

  // Update the count down every 1 second
  countDown = setInterval(function () {
    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    )
      .toString()
      .padStart(2, "0");
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      .toString()
      .padStart(2, "0");
    var seconds = Math.floor((distance % (1000 * 60)) / 1000)
      .toString()
      .padStart(2, "0");

    // Display the result in the element with id="demo"
    document.getElementById(
      "countdown"
    ).innerHTML = `Remaining time: ${hours}:${minutes}:${seconds}`;

    // If the count down is finished, write some text
    if (distance < 0) {
      clearInterval(countDown);
      document.getElementById("countdown").innerHTML = "EXPIRED";
      alert("Your time is over :(");
    }
  }, 1000);
}
