import { GameStateObj, GameStatus } from './game.model';

export enum SocketMessageType {
    'START_GAME' = 'START_GAME',
    'UPDATE_SCORE' = 'UPDATE_SCORE',
    'STOP_GAME' = 'STOP_GAME'
}

export interface SocketMessage {
    type: SocketMessageType;
    data: GameStateObj | GameStatus;
}
