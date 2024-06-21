let original_exam;
let user_exam = [];
let current_question = 0;
let max_questions = 0;

$(document).ready(function(){
  const exams_path = 'https://raw.githubusercontent.com/dfop02/exam-lab/main/assets/exams/';
  const searchParams = new URLSearchParams(window.location.search);
  const exam_name = searchParams.get('exam');

  // Collect exam info
  $.getJSON(exams_path + exam_name, (json) => {
    // Randomize the questions since we have more than exam needs
    original_exam = shuffleAllAnswers(json.exam);
    // Get max questions
    max_questions = original_exam.length
    // Generate user answers card
    user_exam = new Array(max_questions).fill('');
    // Build first question
    buildQuestion();
  });
});

$(document).keydown(function(event){
  if (event.which == 39) {
    nextQuestion();
  }
});

// Alert progress lose before leave page
window.onbeforeunload = function(e) {
  e.preventDefault();
  // To avoid scamming, chromium and hence chrome have decided to remove
  // the ability to set a custom message in the onbeforeunload dialog.
  return event.returnValue;
};

function shuffleAllAnswers(exam) {
  // Shuffle all questions
  let shuffledExam = shuffle(exam);

  for (let question = 0; question < shuffledExam.length; question++) {
    // Get and Shuffle all keys as an array from the question
    let keys = shuffle(Object.keys(shuffledExam[question].alternatives));

    // Create a new object with shuffled keys and original values
    let shuffledObj = { alternatives: {} };
    let shuffledValues = shuffle(Object.values(shuffledExam[question].alternatives));

    for (const key of keys) {
      shuffledObj.alternatives[key] = shuffledValues.pop();
    }
    shuffledExam[question].alternatives = shuffledObj.alternatives;
  }

  return shuffledExam;
}

function buildQuestion() {
  let question = original_exam[current_question]
  // Before empty previous question if exists
  $('.exam-random').empty();
  // Build question element
  $('.exam-random').append(
    `
    <div class="question-number">
      <img id="red-flag" src="assets/icons/red-flag.svg" alt="Marked Question"/>
      Question ${current_question+1}
    </div>
    <div class="question">
      ${question.question}
    </div>
    <div class="alternatives">
      ${question.multichoice ? buildMultichoiceAlternatives(question.alternatives) : buildAlternatives(question.alternatives)}
    </div>
    <div class="actions">
      ${buildActionButtons()}
    </div>
    `
  );
}

function buildMultichoiceAlternatives(alternatives) {
  let alts = '';
  Object.keys(alternatives).forEach((alternative) => {
    alts += `
      <div class="alternative" onclick="selectMultiAlternative(this)">
        <span class="alternative-choice">${alternative}</span> ${alternatives[alternative].answer}
      </div>
    `
  });
  return alts;
}

function buildAlternatives(alternatives) {
  let alts = '';
  Object.keys(alternatives).forEach((alternative) => {
    alts += `
      <div class="alternative" onclick="selectAlternative(this)">
        <span class="alternative-letter">${alternative}.</span> ${alternatives[alternative].answer}
      </div>
    `
  });
  return alts;
}

function setCorrectAnswer(div) {
  let correct_answer = Object.fromEntries(Object.entries(original_exam[current_question].alternatives).filter(([k,v]) => v.correct));
  correct_answers = Object.keys(correct_answer);

  correct_answers.forEach((letter) => {
    let alter = div.parent().find(`span:contains('${letter}')`).parent();
    if (!alter.hasClass('correct-alternative')) {
      alter.addClass('correct-alternative');
    }
  });

  div.parent().find('.alternative').each((index, alt) => {
    if ($(alt).find('span').hasClass('selected') && !$(alt).hasClass('correct-alternative')) {
      $(alt).addClass('incorrect-alternative');
    }

    if (!$(alt).find('span').hasClass('selected') && $(alt).hasClass('incorrect-alternative')) {
      $(alt).removeClass('incorrect-alternative');
    }
  });
}

function buildActionButtons() {
  let actions = '';

  actions += `<button class="action-button" role="button" onclick="nextQuestion()" ${current_question < max_questions-1 ? '' : 'disabled'}>Next</button>`;

  return actions;
}

function nextQuestion() {
  if (current_question + 1 < max_questions) {
    current_question += 1;
    buildQuestion();
  }
}

function selectMultiAlternative(event) {
  $(event).find('span').toggleClass('selected');
  new_selecteds = $('.alternatives').find('.selected').toArray().map((i) => { return i.innerText }).join()

  let max_selections = parseInt($('.question').text().match(/\(choose (\d)\)/i)[1]);
  let qnt_selected = $('.alternatives').find('.selected').toArray().length;

  user_exam[current_question] = new_selecteds;

  if (qnt_selected == max_selections) {
    setCorrectAnswer($(event));
  }
}

function selectAlternative(event) {
  let span = $(event).find('span');

  if (!span.hasClass('selected')) {
    $('.alternatives').find('span').removeClass('selected');
    span.addClass('selected');
    user_exam[current_question] = span.text().replace(/[^A-Z]+/g, '');
  }

  setCorrectAnswer($(event));
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
