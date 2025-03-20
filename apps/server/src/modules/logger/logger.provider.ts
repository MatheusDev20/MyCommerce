import { Injectable, Logger } from '@nestjs/common';
import { LoggerFunctions } from 'src/@types';

@Injectable()
export class CustomLogger extends Logger implements LoggerFunctions {
  generatedCompletion(completion: string) {
    this.log(
      `Generated Completion for \n ${JSON.stringify(completion)} Timestamp: ${new Date().toISOString()}`,
    );
  }
}
