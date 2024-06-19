const fs = require('fs');
const path = require('path');
const TextTransform = require('./textTransform'); 
const inputFilePath = './google_professional_cloud_architect.json';

const outputFolder = './output_professional_cloud_architect';

async function translateQuestions() {
  try {
    const jsonData = fs.readFileSync(inputFilePath, 'utf-8');
    const exams = JSON.parse(jsonData);

    const textTransform = new TextTransform()

    exams.exam.forEach(async (exam, index) => {
      try {
        let translatedAlternatives = {};

        for (let key in exam.alternatives) {
            translatedAlternatives[key] = await textTransform.translate(exam.alternatives[key].answer);
        }
            
        const translatedQuestion = {
          question: await textTransform.translate(exam.question),
          alternatives: translatedAlternatives,
        };

        translatedQuestions.push(translatedQuestion);

        if (index === exams.exam.length - 1) {
          const outputFilePath = path.join(outputFolder, 'question_set_translate.json');
          fs.writeFileSync(outputFilePath, JSON.stringify(translatedQuestions, null, 2), 'utf-8');
          console.log(`Perguntas traduzidas foram salvas em: ${outputFilePath}`);
        }
      } catch (error) {
        console.error('Erro ao traduzir pergunta:', error);
      }
    });
  } catch (error) {
    console.error('Erro ao ler o arquivo JSON:', error);
  }
}


function readAllFiles() {
  return new Promise((resolve, reject) => {
    const directoryPath = path.join(__dirname, 'output_professional_cloud_architect');

    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        return reject('Erro ao ler a pasta: ' + err);
      }

      resolve(files);
    });
  });
}

async function translateAllFiles(){
  const files = await readAllFiles()
  files.map((file) => {
    translateQuestions(file)
  })
}
