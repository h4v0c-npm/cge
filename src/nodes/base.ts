import { EventEmitter } from '@h4v0c/event-emitter';
import { uid } from '@h4v0c/uid';

export abstract class Base extends EventEmitter {
    readonly id: string = uid();
    readonly type: string = this.constructor.name;

    name: string = this.constructor.name;
}
