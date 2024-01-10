let original_exam;
let user_exam = [];
let current_question = 0;
const max_questions = 60;

$(document).ready(function(){
  const exams_path = 'https://raw.githubusercontent.com/dfop02/exam-lab/main/assets/exams/';
  const searchParams = new URLSearchParams(window.location.search);
  const exam_name = searchParams.get('exam');

  // Collect exam info
  $.getJSON(exams_path + exam_name, (json) => {
    // Randomize the questions since we have more than exam needs
    original_exam = shuffle(json.exam);
    // Generate user answers card
    user_exam = new Array(original_exam.length).fill('');
    // Build first question
    buildQuestion(original_exam[current_question]);
  });
});

function buildQuestion(question) {
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
      <button class="action-button" role="button" onclick="previousQuestion()">Previous</button>
      <button class="action-button" role="button" onclick="nextQuestion()">Next</button>
    </div>
    `
  );
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

function selectAlternative(event) {
  let span = $(event).find('span');
  if (!span.hasClass('selected')) {
    $('.alternatives').find('span').removeClass('selected');
    span.addClass('selected');
    user_exam[current_question] = span.text().replace('.', '')
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

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
