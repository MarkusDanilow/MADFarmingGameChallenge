import Vector2 from "../util/Vector2";

type KeyState = {
    [key: string]: boolean; 
};

export class InputHandler {

    static readonly KEY_A = 'A';
    static readonly KEY_B = 'B';
    static readonly KEY_C = 'C';
    static readonly KEY_D = 'D';
    static readonly KEY_E = 'E';
    static readonly KEY_F = 'F';
    static readonly KEY_G = 'G';
    static readonly KEY_H = 'H';
    static readonly KEY_I = 'I';
    static readonly KEY_J = 'J';
    static readonly KEY_K = 'K';
    static readonly KEY_L = 'L';
    static readonly KEY_M = 'M';
    static readonly KEY_N = 'N';
    static readonly KEY_O = 'O';
    static readonly KEY_P = 'P';
    static readonly KEY_Q = 'Q';
    static readonly KEY_R = 'R';
    static readonly KEY_S = 'S';
    static readonly KEY_T = 'T';
    static readonly KEY_U = 'U';
    static readonly KEY_V = 'V';
    static readonly KEY_W = 'W';
    static readonly KEY_X = 'X';
    static readonly KEY_Y = 'Y';
    static readonly KEY_Z = 'Z';
    static readonly KEY_ESCAPE = 'Escape';
    static readonly KEY_ENTER = 'Enter';
    static readonly KEY_SPACE = ' ';
    static readonly KEY_SHIFT = 'Shift';
    static readonly KEY_CTRL = 'Control';
    static readonly KEY_ALT = 'Alt';
    static readonly KEY_ARROW_UP = 'ArrowUp';
    static readonly KEY_ARROW_DOWN = 'ArrowDown';
    static readonly KEY_ARROW_LEFT = 'ArrowLeft';
    static readonly KEY_ARROW_RIGHT = 'ArrowRight';
    static readonly KEY_F1 = 'F1';
    static readonly KEY_F2 = 'F2';
    static readonly KEY_F3 = 'F3';
    static readonly KEY_F4 = 'F4';
    static readonly KEY_F5 = 'F5';
    static readonly KEY_F6 = 'F6';
    static readonly KEY_F7 = 'F7';
    static readonly KEY_F8 = 'F8';
    static readonly KEY_F9 = 'F9';
    static readonly KEY_F10 = 'F10';
    static readonly KEY_F11 = 'F11';
    static readonly KEY_F12 = 'F12';
    
    static readonly MOUSE_BUTTON_LEFT = 0;
    static readonly MOUSE_BUTTON_MIDDLE = 1;
    static readonly MOUSE_BUTTON_RIGHT = 2;

    private static keys: KeyState = {};
    private static mouseButtons: KeyState = {};
    private static mousePosition: Vector2 = new Vector2(0, 0);
    private static previousKeys: Set<string> = new Set();
    private static currentKeys: Set<string> = new Set();
    private static pressedKeys: Set<string> = new Set();
    private static clickedMouseButtons: Set<number> = new Set();

    static initialize() {
        window.addEventListener('keydown', (event) => this.keyDown(event));
        window.addEventListener('keyup', (event) => this.keyUp(event));

        window.addEventListener('mousedown', (event) => this.mouseDown(event));
        window.addEventListener('mouseup', (event) => this.mouseUp(event));
        window.addEventListener('mousemove', (event) => this.mouseMove(event));
    }

    private static keyDown(event: KeyboardEvent) {
        event.preventDefault(); 
        this.keys[event.key.toUpperCase()] = true;
        this.currentKeys.add(event.key.toUpperCase());
    }

    private static keyUp(event: KeyboardEvent) {
        event.preventDefault(); 
        const key = event.key.toUpperCase();
        this.keys[key] = false;
        this.currentKeys.delete(key);
        this.pressedKeys.add(key);
    }

    private static mouseDown(event: MouseEvent) {
        this.mouseButtons[event.button] = true;
    }

    private static mouseUp(event: MouseEvent) {
        this.mouseButtons[event.button] = false;
        this.clickedMouseButtons.add(event.button);
    }

    private static mouseMove(event: MouseEvent) {
        this.mousePosition.x = event.clientX; 
        this.mousePosition.y = event.clientY; 
    }

    static update() {
        this.previousKeys = new Set(this.currentKeys);
        this.pressedKeys.clear();
        this.clickedMouseButtons.clear();
    }

    static isKeyPressed(key: string): boolean {
        return this.pressedKeys.has(key.toUpperCase());
    }

    static isKeyDown(key: string): boolean {
        return !!this.keys[key.toUpperCase()]; 
    }

    static isMouseButtonDown(button: number): boolean {
        return !!this.mouseButtons[button]; 
    }

    static isMouseButtonClicked(button: number): boolean {
        return this.clickedMouseButtons.has(button);
    }

    static getMousePosition(): Vector2{
        return this.mousePosition; 
    }
}
