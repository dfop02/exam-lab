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
      
      for (let key in exam.alternatives) {
        alternatives[key] = exam.alternatives[key].answer;
      }

      questions.push({
        question: exam.question,
        alternatives: alternatives,
      });

      if (questions.length === 10) {
        const fileName = `${outputFilePrefix}_${setIndex}.json`;
        const filePath = path.join(outputFolder, fileName);

        fs.writeFileSync(filePath, JSON.stringify(questions, null, 2), "utf-8");
        console.log(`Criado arquivo: ${fileName}`);

        questions = [];
        setIndex++;
      } 
    });

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
