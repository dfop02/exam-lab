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
