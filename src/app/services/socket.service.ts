import { Injectable } from '@angular/core';
import { GameState } from '../store/game.state';
import { GameStateObj } from '../models/game.model';
import { SocketMessageType } from '../models/socket-message.model';
import { MockServerService } from '../server/mock-server.service';

@Injectable({ providedIn: 'root' })
export class SocketService {
    constructor(
        private readonly gameState: GameState,
        private readonly server: MockServerService
    ) {
        /**
         * Imitation sending data from a server by WebSockets
         */
        this.server.serverMessage$.subscribe((message) => {
            switch (message.type) {
                case SocketMessageType.START_GAME:
                    this.gameState.isGameActive$.next(true);
                    break;
                case SocketMessageType.STOP_GAME:
                    this.gameState.isGameActive$.next(false);
                    break;
                case SocketMessageType.UPDATE_SCORE: {
                    this.gameState.gameInfo$.next(message.data as GameStateObj);
                }
            }
        });
    }
}
