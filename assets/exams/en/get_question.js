const fs = require("fs");
const path = require("path");

const folderPath = "./google_professional_cloud_architect.json";
const outputFilePrefix = "questions_set";

const outputFolder = path.join(
  folderPath.split(".")[0],
  "output_professional_cloud_architect"
);

fs.readFile(path.join(folderPath), "utf-8", (err, data) => {
  if (err) {
    console.error("Erro ao ler o arquivo JSON:", err);
    return;
  }

  try {
    const exams = JSON.parse(data);

    let questions = [];
    let setIndex = 1;

    exams.exam.forEach((exam) => {
      let alternatives = {};
      
      // Itera sobre as alternativas (A, B, C, D)
      for (let key in exam.alternatives) {
        alternatives[key] = exam.alternatives[key].answer;
      }

      questions.push({
        question: exam.question,
        alternatives: alternatives,
      });

      // Se 'questions' atingir 10 perguntas, cria um novo arquivo
      if (questions.length === 10) {
        const fileName = `${outputFilePrefix}_${setIndex}.json`;
        const filePath = path.join(outputFolder, fileName);

        fs.writeFileSync(filePath, JSON.stringify(questions, null, 2), "utf-8");
        console.log(`Criado arquivo: ${fileName}`);

        // Limpa o array 'questions' para a próxima série de 10 perguntas
        questions = [];
        setIndex++;
      } 
    });

    // Se sobrarem perguntas não agrupadas em um arquivo
    if (questions.length > 0) {
      const fileName = `${outputFilePrefix}_${setIndex}.json`;
      const filePath = path.join(outputFolder, fileName);

      fs.writeFileSync(filePath, JSON.stringify(questions, null, 2), "utf-8");
      console.log(`Criado arquivo: ${fileName}`);
    }

    console.log("Todos os conjuntos de perguntas foram criados com sucesso.");
  } catch (error) {
    console.error("Erro ao processar o arquivo JSON:", error);
  }
});
