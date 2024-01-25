$(document).ready(function(){
  let exams_path = 'https://api.github.com/repos/dfop02/exam-lab/git/trees/main?recursive=1'
  let exams_available = [];

  // Collect availables exams from assets/exams on the project's repo
  $.ajax({
    url : exams_path,
    type : 'GET',
    success:function(res){
      res.tree.filter(f => f.path.includes('assets/exams/'))
              .map(f => f.path.split('/').pop())
              .forEach(exam => exams_available.push(exam))
      addExams(exams_available);
    }
  });

  $('.btn-close').click(function(e) {
    e.preventDefault();
    $('.modal').addClass('hidden');
    $('.overlay').addClass('hidden');
  });

  $('.overlay').click(function(e) {
    e.preventDefault();
    $('.modal').addClass('hidden');
    $('.overlay').addClass('hidden');
  });

  setLocale();
});

function removeExtension(filename){
  return filename.substring(0, filename.lastIndexOf('.')) || filename;
}

function snakeToCapitalize(str){
  var arr = str.split('_');
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  return arr.join(' ');
}

function addExams(exams){
  for (exam of exams) {
    $('.exams').append(
      `<a class="exam-btn" href="#" onclick="updateModal('${exam}')"><span class='exam'>${removeExtension(snakeToCapitalize(exam))}</span><a>`
    );
  }
}

function updateModal(exam) {
  $('.modal-actions > a.random').attr('href', `random.html?exam=${exam}`);
  $('.modal-actions > a.simulation').attr('href', `simulation.html?exam=${exam}`);

  $('.modal').removeClass('hidden');
  $('.overlay').removeClass('hidden');
}

function switchLanguage(language) {
  document.documentElement.lang = language;
  let lang = ':lang(' + language + ')';
  let hide = '[lang]:not(' + lang + ')';
  document.querySelectorAll(hide).forEach(function (node) {
    node.style.display = 'none';
  });
  let show = '[lang]' + lang;
  document.querySelectorAll(show).forEach(function (node) {
    node.style.display = 'unset';
  });
}

function setLocale() {
  let optionValues = $('.label-select img').map((i, o) => o.title).toArray()
  let browser_lang = navigator.language;

  // Check if browser lang is supported
  // Else, by default the locale is en
  if (optionValues.includes(browser_lang)) {
    document.documentElement.lang = browser_lang;
    selectElement.value = browser_lang;
    switchLanguage(browser_lang);
  }
}
