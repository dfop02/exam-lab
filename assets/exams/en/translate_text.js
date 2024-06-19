// textTransform.js
const { TranslationServiceClient } = require('@google-cloud/translate');

class TextTransform {
  constructor() {
    // Configurações padrão (substitua com suas configurações reais)
    this.projectId = '<PROJECT_ID>';
    this.location = 'global';
    this.sourceLanguageCode = 'en';
    this.targetLanguageCode = 'pt-br';
    
    // Criação do cliente de serviço de tradução
    this.translationClient = new TranslationServiceClient();
  }

  async translate(text) {
    try {
      // Construct request
      const request = {
        parent: `projects/${this.projectId}/locations/${this.location}`,
        contents: text,
        mimeType: 'text/plain',
        sourceLanguageCode: this.sourceLanguageCode,
        targetLanguageCode: this.targetLanguageCode,
        model: `projects/${this.projectId}/locations/${this.location}/model/general/translation-llm`
      };

      // Run request
      const [response] = await this.translationClient.translateText(request);

      return response.translations[0].translatedText;
    } catch (error) {
      console.error('Error translating text:', error);
      throw error;
    }
  }
}

module.exports = TextTransform;
