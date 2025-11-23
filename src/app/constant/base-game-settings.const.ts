import { GameSettings } from '../models/game.model';

export const BASE_GAME_SETTINGS: GameSettings = {
    fallingSpeed: 6, // px per second
    fallingFrequency: 800, // ms
    playerSpeed: 12, // px per key press
    gameTime: 20 // seconds
};
