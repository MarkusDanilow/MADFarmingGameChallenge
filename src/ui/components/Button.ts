import { InputHandler } from "../../engine/InputHandler";
import { IRenderable, IUpdatable } from "../../IBasicInterfaces";

class Button implements IRenderable, IUpdatable {
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private label: string;
    private isHovered: boolean;

    private onClickEvent: (() => void) | undefined;

    constructor(x: number, y: number, width: number, height: number, label: string) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.label = label;
        this.isHovered = false;
    }

    update(deltaTime: number): void {
        const mousePos = InputHandler.getMousePosition();
        this.isHovered = mousePos.x >= this.x && mousePos.x <= this.x + this.width &&
            mousePos.y >= this.y && mousePos.y <= this.y + this.height;
        if (this.isHovered && InputHandler.isMouseButtonClicked(InputHandler.MOUSE_BUTTON_LEFT)) {
            this.onClickEvent?.();
        }
    }

    render(context: CanvasRenderingContext2D): void {
        context.fillStyle = this.isHovered ? 'lightgray' : 'gray';
        context.fillRect(this.x, this.y, this.width, this.height);

        context.fillStyle = 'black';
        context.font = '32px Consolas';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(this.label, this.x + this.width / 2, this.y + this.height / 2);
    }

    onClick(callback: () => void) {
        this.onClickEvent = callback;
    }

}

export default Button;