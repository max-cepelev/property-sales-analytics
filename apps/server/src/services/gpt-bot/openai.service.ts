import fs from 'node:fs';
import {
  ChatCompletionRequestMessageRoleEnum,
  ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
} from 'openai';
export class OpenaiService {
  openai;
  roles;
  constructor(apiKey: string) {
    const configuration = new Configuration({
      apiKey,
    });
    this.openai = new OpenAIApi(configuration);
    this.roles = ChatCompletionRequestMessageRoleEnum;
  }
  async chat(messages: ChatCompletionRequestMessage[]) {
    try {
      const response = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages,
      });
      return response.data.choices[0].message;
    } catch (e) {
      console.log('Error while gpt chat');
    }
  }
  async transcription(filepath: string) {
    try {
      const response = await this.openai.createTranscription(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        fs.createReadStream(filepath),
        'whisper-1',
        undefined,
        'srt',
        0.1,
        'ja',
      );
      return response.data.text;
    } catch (e) {
      console.log(e);
    }
  }
}
