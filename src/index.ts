import './styles/styles.css'; 
import Engine from "./engine/Engine";
import { Game } from './Game';

window.onload = () => {
    const gameEngine = new Engine("gameCanvas");
    const game = new Game(); 
    gameEngine.setGame(game); 

    gameEngine.start();
};