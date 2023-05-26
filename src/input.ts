import { EventEmitter } from '@h4v0c/event-emitter';
import { vec2 } from 'gl-matrix';

export declare type InputStateType = number;

const DEFAULT_INPUT_THRESHOLD: number = 200;
const INPUT_STATE_UP: InputStateType = 0.0;
const INPUT_STATE_DOWN: InputStateType = 1.0;
const INPUT_STATE_PRESSED: InputStateType = INPUT_STATE_UP;

export enum InputState {
    UP = INPUT_STATE_UP,
    DOWN = INPUT_STATE_DOWN,
    PRESSED = INPUT_STATE_PRESSED,
    CLICKED = INPUT_STATE_PRESSED,
};

export enum Key {
    Backspace, Tab, Enter, ShiftLeft, ShiftRight,
    ControlLeft, ControlRight, AltLeft, AltRight,
    Pause, CapsLock, Escape, Space, PageUp,
    PageDown, End, Home, ArrowLeft, ArrowUp,
    ArrowRight, ArrowDown, PrintScreen, Insert,
    Delete, Digit0, Digit1, Digit2, Digit3,
    Digit4, Digit5, Digit6, Digit7, Digit8,
    Digit9, KeyA, KeyB, KeyC, KeyD, KeyE,
    KeyF, KeyG, KeyH, KeyI, KeyJ, KeyK, KeyL,
    KeyM, KeyN, KeyO, KeyP, KeyQ, KeyR, KeyS,
    KeyT, KeyU, KeyV, KeyW, KeyX, KeyY, KeyZ,
    MetaLeft, MetaRight, ContextMenu, Numpad0, Numpad1,
    Numpad2, Numpad3, Numpad4, Numpad5, Numpad6,
    Numpad7, Numpad8, Numpad9, NumpadMultiply, NumpadAdd,
    NumpadSubtract, NumpadDecimal, NumpadDivide, F1, F2,
    F3, F4, F5, F6, F7, F8, F9, F10, F11,
    F12, NumLock, ScrollLock, Semicolon, Equal, Comma,
    Minus, Period, Slash, Backquote, BracketLeft,
    Backslash, BracketRight, Quote,
};

const KeyMap = {
    Backspace: 0, Tab: 1, Enter: 2, ShiftLeft: 3, ShiftRight: 4,
    ControlLeft: 5, ControlRight: 6, AltLeft: 7, AltRight: 8,
    Pause: 9, CapsLock: 10, Escape: 11, Space: 12, PageUp: 13,
    PageDown: 14, End: 15, Home: 16, ArrowLeft: 17, ArrowUp: 18,
    ArrowRight: 19, ArrowDown: 20, PrintScreen: 21, Insert: 22,
    Delete: 23, Digit0: 24, Digit1: 25, Digit2: 26, Digit3: 27,
    Digit4: 28, Digit5: 29, Digit6: 30, Digit7: 31, Digit8: 32,
    Digit9: 33, KeyA: 34, KeyB: 35, KeyC: 36, KeyD: 37, KeyE: 38,
    KeyF: 39, KeyG: 40, KeyH: 41, KeyI: 42, KeyJ: 43, KeyK: 44, KeyL: 45,
    KeyM: 46, KeyN: 47, KeyO: 48, KeyP: 49, KeyQ: 50, KeyR: 51, KeyS: 52,
    KeyT: 53, KeyU: 54, KeyV: 55, KeyW: 56, KeyX: 57, KeyY: 58, KeyZ: 59,
    MetaLeft: 60, MetaRight: 61, ContextMenu: 62, Numpad0: 63, Numpad1: 64,
    Numpad2: 65, Numpad3: 66, Numpad4: 67, Numpad5: 68, Numpad6: 69,
    Numpad7: 70, Numpad8: 71, Numpad9: 72, NumpadMultiply: 73, NumpadAdd: 74,
    NumpadSubtract: 75, NumpadDecimal: 76, NumpadDivide: 77, F1: 78, F2: 79,
    F3: 80, F4: 81, F5: 82, F6: 83, F7: 84, F8: 85, F9: 86, F10: 87, F11: 88,
    F12: 89, NumLock: 90, ScrollLock: 91, Semicolon: 92, Equal: 93, Comma: 94,
    Minus: 95, Period: 96, Slash: 97, Backquote: 98, BracketLeft: 99,
    Backslash: 100, BracketRight: 101, Quote: 102,
};

export enum MouseButton {
    LEFT = 0, MIDDLE = 1, RIGHT = 2,
    BACK = 3, AUX_1 = 3,
    FORWARD = 4, AUX_2 = 4,
    AUX_3 = 5, AUX_4 = 6, AUX_5 = 7, AUX_6 = 8, AUX_7 = 9, AUX_8 = 10, AUX_9 = 11, AUX_10 = 12, AUX_11 = 13, AUX_12 = 14,
    AUX_13 = 15, AUX_14 = 16, AUX_15 = 17, AUX_16 = 18, AUX_17 = 19, AUX_18 = 20, AUX_19 = 21, AUX_20 = 22, AUX_21 = 23,
    AUX_22 = 24, AUX_23 = 25, AUX_24 = 26, AUX_25 = 27, AUX_26 = 28, AUX_27 = 29, AUX_28 = 30, AUX_29 = 31,
};

export interface KeyEvent {
    state: InputState,
    key: Key,
    domEvent: KeyboardEvent,
}

export interface MouseMoveEvent {
    position: vec2,
    delta: vec2,
    domEvent: MouseEvent,
};

export interface MouseWheelEvent {
    delta: vec2,
    domEvent: WheelEvent,
};

export interface MouseButtonEvent {
    state: InputState,
    button: MouseButton,
    domEvent: MouseEvent,
};

export class Input extends EventEmitter {
    keyDown: Array<InputStateType>;
    keyDownTime: Array<InputStateType>;

    buttonDown: Array<InputStateType>;
    buttonDownTime: Array<InputStateType>;

    mousePosition: vec2 = vec2.create();
    inputThreshold: number = DEFAULT_INPUT_THRESHOLD;

    constructor() {
        super();

        this.keyDown = new Array<InputStateType>(Object.keys(KeyMap).length).fill(InputState.UP);
        this.keyDownTime = new Array<number>(Object.keys(KeyMap).length).fill(0);

        this.buttonDown = new Array(32).fill(InputState.UP);
        this.buttonDownTime = new Array(32).fill(0);

        window.addEventListener('keydown', this._onKeyDown.bind(this));
        window.addEventListener('keyup', this._onKeyUp.bind(this));
        window.addEventListener('mousedown', this._onButtonDown.bind(this));
        window.addEventListener('mouseup', this._onButtonUp.bind(this));
        window.addEventListener('mousemove', this._onMouseMove.bind(this));
        window.addEventListener('wheel', this._onWheel.bind(this));
    }

    private _onContextMenu(evt: MouseEvent) {
        evt.preventDefault();
        return false;
    }

    private _onKeyDown(evt: KeyboardEvent) {
        const key = KeyMap[evt.code];

        if (this.keyDown[key] === InputState.UP) {
            this.keyDown[key] = InputState.DOWN;
            this.keyDownTime[key] = Date.now();

            const keyEvent: KeyEvent = {
                state: InputState.DOWN,
                key: KeyMap[evt.code],
                domEvent: evt,
            };

            this.emit('key_down', keyEvent);
        }
    }

    private _onKeyUp(evt: KeyboardEvent) {
        const key = KeyMap[evt.code];

        this.keyDown[key] = InputState.UP;

        if (Date.now() - this.keyDownTime[key] < this.inputThreshold) {
            const keyPressedEvent: KeyEvent = {
                state: InputState.PRESSED,
                key: KeyMap[evt.code],
                domEvent: evt,
            };

            this.emit('key_pressed', keyPressedEvent);
        }

        const keyUpEvent: KeyEvent = {
            state: InputState.UP,
            key: KeyMap[evt.code],
            domEvent: evt,
        };

        this.emit('key_up', keyUpEvent);
    }

    private _onButtonDown(evt: MouseEvent) {
        const button: number = evt.button;

        this.buttonDown[button] = InputState.DOWN;
        this.buttonDownTime[button] = Date.now();

        const mouseButtonEvent: MouseButtonEvent = {
            state: InputState.DOWN,
            button: evt.button,
            domEvent: evt,
        };

        this.emit('button_down', mouseButtonEvent);
    }

    private _onButtonUp(evt: MouseEvent) {
        const button: number = evt.button;

        this.buttonDown[button] = InputState.UP;

        if (Date.now() - this.buttonDownTime[button] < this.inputThreshold) {
            const mouseButtonClickedEvent: MouseButtonEvent = {
                state: InputState.CLICKED,
                button: evt.button,
                domEvent: evt,
            };

            this.emit('button_clicked', mouseButtonClickedEvent);
        }

        const mouseButtonUpEvent: MouseButtonEvent = {
            state: InputState.UP,
            button: evt.button,
            domEvent: evt,
        };

        this.emit('button_up', mouseButtonUpEvent);
    }

    private _onMouseMove(evt: MouseEvent) {
        this.mousePosition[0] = evt.offsetX;
        this.mousePosition[1] = evt.offsetY;

        const mouseMoveEvent: MouseMoveEvent = {
            position: vec2.fromValues(evt.offsetX, evt.offsetY),
            delta: vec2.fromValues(evt.movementX, evt.movementY),
            domEvent: evt,
        };

        this.emit('mouse_move', mouseMoveEvent);
    }

    private _onWheel(evt: WheelEvent) {
        const mouseWheelEvent: MouseWheelEvent = {
            delta: vec2.fromValues(evt.deltaX, evt.deltaY),
            domEvent: evt,
        }
        this.emit('mouse_wheel', mouseWheelEvent);
    }

    disableContextMenu(disable: boolean = true) {
        if (disable === true) {
            window.addEventListener('contextmenu', this._onContextMenu.bind(this));
        } else {
            window.removeEventListener('contextmenu', this._onContextMenu.bind(this));
        }
    }

    isKeyDown(code: Key): boolean {
        return this.keyDown[code] != InputState.UP;
    }

    getKeyDownValue(code: Key): number {
        return this.keyDown[code];
    }

    isButtonDown(button: MouseButton): boolean {
        return this.buttonDown[button] != InputState.UP;
    }
}
