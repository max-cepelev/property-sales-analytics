import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { code } from 'telegraf/format';
import { fastifyPlugin } from 'fastify-plugin';
import { OggConverter } from './utils/ogg-converter';
import { OpenaiService } from './openai.service';
import { ChatCompletionRequestMessage } from 'openai';

export const gptBotService = fastifyPlugin(
  async function (
    app: FastifyInstance,
    opts: FastifyPluginOptions,
    done: (err?: Error | undefined) => void,
  ) {
    const bot = new Telegraf(app.config.TELEGRAM_BOT, {
      handlerTimeout: 350_000,
    });
    const ogg = new OggConverter();
    const openai = new OpenaiService(app.config.OPENAI_KEY);
    bot.start((ctx) => ctx.reply('Welcome'));
    bot.help((ctx) => ctx.reply('Send me a sticker'));
    bot.on(message('sticker'), (ctx) => ctx.reply('👍'));
    bot.hears('hi', (ctx) => ctx.reply('Hey there'));
    bot.on(message('voice'), async (ctx) => {
      try {
        await ctx.reply(code('Сообщение принял. Жду ответ от сервера...'));
        const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
        const userId = String(ctx.message.from.id);
        const oggPath = await ogg.create(link.href, userId);
        const mp3Path: string = await ogg.toMp3(oggPath, userId);
        await ogg.removeFile(oggPath);
        const text = await openai.transcription(mp3Path);
        if (text) {
          await ctx.reply(code(`Ваш запрос: ${text}`));
          const messages: ChatCompletionRequestMessage[] = [
            { role: openai.roles.User, content: text || '' },
          ];
          const response = await openai.chat(messages);
          await ctx.reply(response?.content || 'нет ответа(');
        } else {
          await ctx.reply('текст не распознан');
        }
      } catch (e) {
        app.log.error(e, 'Error while proccessing voice message');
      }
    });
    bot.launch();

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
    done();
  },
  { name: 'gpt' },
);
