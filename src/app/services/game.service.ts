import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { MockServerService } from '../server/mock-server.service';

@Injectable({ providedIn: 'root' })
export class GameService {
    constructor(private readonly server: MockServerService) {}

    /**
     * Method that inform server about start of the game
     */
    public startGame(gameTime: number): Observable<void> {
        return of(void 0).pipe(tap(() => this.server.startGame(gameTime)));
    }

    /**
     * Method that inform server about a player caught an object
     */
    public updateScore(): Observable<void> {
        console.log('update');
        return of(void 0).pipe(tap(() => this.server.updateScore()));
    }
}
