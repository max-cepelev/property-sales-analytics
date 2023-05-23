import ffmpeg from 'fluent-ffmpeg';
import { path } from '@ffmpeg-installer/ffmpeg';
import { createWriteStream, promises } from 'node:fs';
import { dirname, resolve } from 'node:path';
export class OggConverter {
  constructor() {
    ffmpeg.setFfmpegPath(path);
  }
  toMp3(input: string, output: string): Promise<string> {
    const outputPath = resolve(dirname(input), `${output}.mp3`);
    return new Promise((resolve, reject) => {
      ffmpeg(input)
        .inputOption('-t 30')
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err: { message: string }) => reject(err.message))
        .run();
    });
  }
  async create(url: string, filename: string): Promise<string> {
    const oggPath = resolve(__dirname, '../voices', `${filename}.ogg`);
    const { got } = await import('got');
    const response = got.stream(url);
    return new Promise((resolve, reject) => {
      const stream = createWriteStream(oggPath);
      response.pipe(stream);
      stream
        .on('finish', () => resolve(oggPath))
        .on('error', (err: { message: string }) => reject(err.message));
    });
  }
  async removeFile(path: string) {
    try {
      await promises.unlink(path);
    } catch (e) {
      console.log('Error while removing file');
    }
  }
}
