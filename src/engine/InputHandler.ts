import Vector2 from "../util/Vector2";

type KeyState = {
    [key: string]: boolean; // Speichert den Status jeder Taste
};

export class InputHandler {
    private static keys: KeyState = {};
    private static mouseButtons: KeyState = {};
    private static mousePosition: Vector2 = new Vector2(0, 0);

    // Statische Initialisierung des Event-Handlers
    static initialize() {
        // Event-Listener für die Tastatur
        window.addEventListener('keydown', (event) => this.keyDown(event));
        window.addEventListener('keyup', (event) => this.keyUp(event));

        // Event-Listener für die Maus
        window.addEventListener('mousedown', (event) => this.mouseDown(event));
        window.addEventListener('mouseup', (event) => this.mouseUp(event));
        window.addEventListener('mousemove', (event) => this.mouseMove(event));
    }

    // Tastendruck Ereignis
    private static keyDown(event: KeyboardEvent) {
        this.keys[event.key.toUpperCase()] = true; // Setze den Status der Taste auf gedrückt
    }

    // Tastenerlass Ereignis
    private static keyUp(event: KeyboardEvent) {
        this.keys[event.key.toUpperCase()] = false; // Setze den Status der Taste auf nicht gedrückt
    }

    // Mausklick Ereignis
    private static mouseDown(event: MouseEvent) {
        this.mouseButtons[event.button] = true; // Setze den Status der Maustaste auf gedrückt
    }

    // Maus loslassen Ereignis
    private static mouseUp(event: MouseEvent) {
        this.mouseButtons[event.button] = false; // Setze den Status der Maustaste auf nicht gedrückt
    }

    // Mausbewegung Ereignis
    private static mouseMove(event: MouseEvent) {
        this.mousePosition.x = event.clientX; // Aktualisiere die X-Position der Maus
        this.mousePosition.y = event.clientY; // Aktualisiere die Y-Position der Maus
    }

    // Überprüfen, ob eine Taste gedrückt ist
    static isKeyDown(key: string): boolean {
        return !!this.keys[key.toUpperCase()]; // Rückgabe des Status der Taste
    }

    // Überprüfen, ob eine Maustaste gedrückt ist
    static isMouseButtonDown(button: number): boolean {
        return !!this.mouseButtons[button]; // Rückgabe des Status der Maustaste
    }

    // Gibt die aktuelle Mausposition zurück
    static getMousePosition(): Vector2{
        return this.mousePosition; // Rückgabe der aktuellen Mausposition
    }
}