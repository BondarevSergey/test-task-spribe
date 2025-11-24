import { Injectable } from '@angular/core';
import { delay, Observable, of, tap } from 'rxjs';
import { SocketService } from './socket.service';

@Injectable({ providedIn: 'root' })
export class GameService {
    constructor(private readonly socketService: SocketService) {}

    public startGame(gameTime: number): Observable<void> {
        return of(void 0).pipe(
            delay(500),
            tap(() => this.socketService.startGame(gameTime))
        );
    }

    public updateScore(): Observable<void> {
        return of(void 0).pipe(
            delay(500),
            tap(() => this.socketService.updateScore())
        );
    }
}
