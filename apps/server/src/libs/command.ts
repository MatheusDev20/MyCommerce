import { asyncLocalStorage } from '../libs/async-local-storage';
import { randomUUID } from 'crypto';

export type CommandProps<T> = Omit<T, 'id' | 'metadata'> & Partial<Command>;

type CommandMetadata = {
  /** ID for correlation purposes (for commands that
   *  arrive from other microservices,logs correlation, etc). */
  readonly id: string;

  /**
   * ID of a user who invoked the command. Can be useful for
   * logging and tracking execution of commands and events
   */
  readonly userId?: string;

  /**
   * Time when the command occurred. Mostly for tracing purposes
   */
  readonly timestamp: number;
};

export class Command {
  /**
   * Command id, in case if we want to save it
   * for auditing purposes and create a correlation/causation chain
   */
  readonly metadata: CommandMetadata;

  constructor(props: CommandProps<unknown>) {
    if (!props) throw new Error('Command Args should not be empty');

    const store = asyncLocalStorage.getStore();
    const requestId = store?.requestId || randomUUID();

    this.metadata = {
      id: props?.metadata?.id || requestId,
      timestamp: props?.metadata?.timestamp || Date.now(),
      userId: props?.metadata?.userId ?? '',
    };
  }
}
