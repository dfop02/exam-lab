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

    // Itera sobre cada objeto de pergunta dentro do array 'exam'
    exams.exam.forEach((exam) => {
      // Adiciona cada pergunta ao array 'questions'
      questions.push(exam);

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

    console.log("All question sets created successfully:", questionSets);
  } catch (error) {
    console.error("Erro ao processar o arquivo JSON:", error);
  }
});
