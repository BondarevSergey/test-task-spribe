import { Injectable } from '@angular/core';
import { delay, Observable, of, tap } from 'rxjs';
import { SocketService } from './socket.service';

@Injectable({ providedIn: 'root' })
export class GameService {
    constructor(private readonly socketService: SocketService) {}

    /**
     * Method that inform server about start of the game
     */
    public startGame(gameTime: number): Observable<void> {
        return of(void 0).pipe(
            delay(500),
            tap(() => this.socketService.startGame(gameTime))
        );
    }

    /**
     * Method that inform server about a player caught an object
     */
    public updateScore(): Observable<void> {
        return of(void 0).pipe(
            delay(500),
            tap(() => this.socketService.updateScore())
        );
    }
}
