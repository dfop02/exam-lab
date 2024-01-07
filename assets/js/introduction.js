function openSimulator() {
  const searchParams = new URLSearchParams(window.location.search);
  const exam_name = searchParams.get('exam');

  window.location.href = `simulation.html?exam=${exam_name}`;
}
