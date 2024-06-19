// textTransform.js
const { TranslationServiceClient } = require('@google-cloud/translate');

class TextTransform {
  constructor() {
    this.projectId = '<PROJECT_ID>';
    this.location = 'global';
    this.sourceLanguageCode = 'en';
    this.targetLanguageCode = 'pt-br';
    
    this.translationClient = new TranslationServiceClient();
  }

  async translate(text) {
    try {
      const request = {
        parent: `projects/${this.projectId}/locations/${this.location}`,
        contents: text,
        mimeType: 'text/plain',
        sourceLanguageCode: this.sourceLanguageCode,
        targetLanguageCode: this.targetLanguageCode,
        model: `projects/${this.projectId}/locations/${this.location}/model/general/translation-llm`
      };

      const [response] = await this.translationClient.translateText(request);

      return response.translations[0].translatedText;
    } catch (error) {
      console.error('Error translating text:', error);
      throw error;
    }
  }
}

module.exports = TextTransform;
