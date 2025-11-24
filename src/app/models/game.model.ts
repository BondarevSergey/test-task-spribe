import { FormControl } from '@angular/forms';

export type ControlsOf<T> = {
    [K in keyof T]: FormControl<T[K]>;
};

export interface GameSettings {
    fallingSpeed: number;
    fallingFrequency: number;
    playerSpeed: number;
    gameTime: number;
}

export interface Ball {
    x: number;
    y: number;
}

export interface GameStateObj {
    timeRemaining: number;
    caughtObjects: number;
}

export interface GameStatus {
    isGameActive: boolean;
}
