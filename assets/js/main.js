$(document).ready(function(){
  $.ajax({
    url : 'https://github.com/dfop02/exam-lab/assets/exams',
    type : "get",
    success:function(res){
      console.log(res)
    }
  });
});
