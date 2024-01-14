let original_exam;
let user_exam = [];
let current_question = 0;
const max_questions = 30;

$(document).ready(function(){
  const exams_path = 'https://raw.githubusercontent.com/dfop02/exam-lab/main/assets/exams/';
  const searchParams = new URLSearchParams(window.location.search);
  const exam_name = searchParams.get('exam');

  // Collect exam info
  $.getJSON(exams_path + exam_name, (json) => {
    // Randomize the questions since we have more than exam needs
    original_exam = shuffle(json.exam);
    // Generate user answers card
    user_exam = new Array(max_questions).fill('');
    // Build first question
    buildQuestion(original_exam[current_question]);
  });
});

// Alert progress lose before leave page
window.onbeforeunload = function(e){
  e.preventDefault();
  // TO-DO: Currently the custom message is not working
  return event.returnValue = 'If you leave now, will lose the progress of current exam. Are you sure you want to leave?';
};

function buildQuestion(question) {
  var question = original_exam[current_question]
  // Before empty previous question if exists
  $('.exam-simulation').empty();
  // Build question element
  $('.exam-simulation').append(
    `
    <div class="question-number">
      Question ${current_question+1}
    </div>
    <div class="question">
      ${question.question}
    </div>
    <div class="alternatives">
      ${buildAlternatives(question.alternatives)}
    </div>
    <div class="actions">
      ${buildActionButtons()}
    </div>
    `
  );

  if (checkIfFinishedExam()) {
    $('.review-btn').show();
  }
}

function buildSelectedQuestion(selected_question) {
  current_question = selected_question
  buildQuestion(original_exam[current_question]);

  $('.review-btn').show();
  $('.finish-btn').hide();
}

function buildReview() {
  // Before empty previous question if exists
  $('.exam-simulation').empty();
  // Build question element
  $('.exam-simulation').append(
    `
    <div class="exam-resume">
      ${buildQuestionResume()}
    </div>
    `
  );

  $('.review-btn').hide();
  $('.finish-btn').show();
}

function buildQuestionResume() {
  resume = '';
  for (let i = 0; i <= user_exam.length - 1; i++) {
    resume += `<span class="exam-resume-answer" onclick="buildSelectedQuestion(${i})">Question ${i+1}: ${user_exam[i]}</span>`
  };
  return resume;
}

function buildFinishResults() {
  // Before empty previous question if exists
  $('.exam-simulation').empty();
  // Build question element
  $('.exam-simulation').append(
    `
    <div class="exam-finish-results">
      ${buildFinishStatistics()}
    </div>
    `
  );

  $('.finish-btn').hide();
}

function buildFinishStatistics() {
  corrects = 0;
  for (let i = 0; i <= user_exam.length - 1; i++) {
    var correct_answer = Object.fromEntries(Object.entries(original_exam[i].alternatives).filter(([k,v]) => v.correct));
    if (user_exam[i] == Object.keys(correct_answer)[0]) {
      corrects += 1
    }
  };
  return `<span class="exam-result-statics">You got ${(corrects/max_questions)*100}% score.</span>`;
}

function buildAlternatives(alternatives) {
  let alts = '';
  Object.keys(alternatives).forEach((alternative) => {
    alts += `
      <div class="alternative" onclick="selectAlternative(this)">
        <span class="alternative-letter${checkIfAlreadySelected(alternative)}">${alternative}.</span> ${alternatives[alternative].answer}
      </div>
    `
  });
  return alts;
}

function buildActionButtons() {
  actions = ''
  if (current_question > 0) {
    actions += `<button class="action-button" role="button" onclick="previousQuestion()">Previous</button>`
  }

  if (current_question < max_questions-1) {
    actions += `<button class="action-button" role="button" onclick="nextQuestion()">Next</button>`
  }

  return actions
}

function selectAlternative(event) {
  let span = $(event).find('span');
  if (!span.hasClass('selected')) {
    $('.alternatives').find('span').removeClass('selected');
    span.addClass('selected');
    user_exam[current_question] = span.text().replace('.', '')
  }

  if (checkIfFinishedExam()) {
    $('.review-btn').show();
  }
}

function previousQuestion() {
  if (current_question - 1 >= 0) {
    current_question -= 1;
    buildQuestion(original_exam[current_question])
  }
}

function nextQuestion() {
  if (current_question + 1 <= max_questions) {
    current_question += 1;
    buildQuestion(original_exam[current_question])
  }
}

function checkIfAlreadySelected(current_alternative) {
  if (user_exam[current_question] != '' && user_exam[current_question] == current_alternative) {
    return ' selected';
  }
  return '';
}

function checkIfFinishedExam() {
  if (user_exam.some(el => el === '')) {
    return false
  }

  return true
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
