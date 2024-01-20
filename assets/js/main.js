$(document).ready(function(){
  let exams_path = 'https://api.github.com/repos/dfop02/exam-lab/git/trees/e48c8aef17aea807d500f8d23a546449961fc376'
  let exams_available = [];

  // Collect availables exams from assets/exams on the project's repo
  $.ajax({
    url : exams_path,
    type : 'GET',
    success:function(res){
      res.tree.forEach(function(file){
        exams_available.push(file.path);
      });

      addExams(exams_available);
    }
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
      `<a href="simulation.html?exam=${exam}"><span class='exam'>${removeExtension(snakeToCapitalize(exam))}</span><a>`
    );
  }
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
  let selectElement = document.querySelector('[class=lang-select]');
  let optionValues = [...selectElement.options].map(o => o.value);
  let browser_lang = navigator.language;

  // Check if browser lang is supported
  // Else, by default the locale is en
  if (optionValues.includes(browser_lang)) {
    document.documentElement.lang = browser_lang;
    selectElement.value = browser_lang;
    switchLanguage(browser_lang);
  }
}
