$(document).ready(function () {
  let exams_path = 'https://api.github.com/repos/dfop02/exam-lab/git/trees/main?recursive=1'
  let exams_available = [];

  // Collect availables exams from assets/exams on the project's repo
  $.ajax({
    url: exams_path,
    type: 'GET',
    success: function (res) {
      res.tree.filter(f => f.path.includes('assets/exams/'))
        .map(f => f.path.split('/').pop())
        .forEach(exam => exams_available.push(exam))
      addExams(exams_available);
    }
  });

  $('.btn-close').click(function (e) {
    e.preventDefault();
    $('.modal').addClass('hidden');
    $('.overlay').addClass('hidden');
  });

  $('.overlay').click(function (e) {
    e.preventDefault();
    $('.modal').addClass('hidden');
    $('.overlay').addClass('hidden');
  });
});

function removeExtension(filename) {
  return filename.substring(0, filename.lastIndexOf('.')) || filename;
}

function snakeToCapitalize(str) {
  var arr = str.split('_');
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  return arr.join(' ');
}

function addExams(exams) {
  for (exam of exams) {
    $('.exams').append(
      `<a class="exam-btn" href="#" onclick="updateModal('${exam}')"><span class='exam'>${removeExtension(snakeToCapitalize(exam))}</span><a>`
    );
  }
}

function updateModal(exam) {
  $('.modal-actions > a.random').attr('href', `random.html?exam=${exam}`);
  $('.modal-actions > a.simulation').attr('href', `introduction.html?exam=${exam}`);

  $('.modal').removeClass('hidden');
  $('.overlay').removeClass('hidden');
}
