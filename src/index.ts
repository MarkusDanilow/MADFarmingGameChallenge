import './styles/styles.css'; 
import Engine from "./engine/Engine";
import { Game } from './Game';

window.onload = async () => {
    const gameEngine = new Engine("gameCanvas");
    await gameEngine.initEngine(); 

    const game = new Game(); 
    gameEngine.setGame(game); 
    
    gameEngine.start();
};