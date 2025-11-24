import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, interval, map, Subject, switchMap, takeWhile, tap } from 'rxjs';
import { GameState } from '../store/game.state';
import { GameStateObj } from '../models/game.model';
import { SocketMessage, SocketMessageType } from '../models/socket-message.model';

@Injectable({ providedIn: 'root' })
export class SocketService {
    public timeRemaining$ = new BehaviorSubject(0);
    public caughtObjects$ = new BehaviorSubject(0);

    /**
     * Imitation of WebSockets source
     */
    private serverMessage$ = new Subject<SocketMessage>();

    constructor(private readonly gameState: GameState) {
        combineLatest([
            this.caughtObjects$.asObservable(),
            this.timeRemaining$.pipe(
                switchMap((time) => {
                    this.serverMessage$.next({
                        type: SocketMessageType.START_GAME,
                        data: { isGameActive: true }
                    });
                    return interval(1000).pipe(
                        map((value) => time - value),
                        takeWhile((x) => x >= 0),
                        tap((remaining) => {
                            if (remaining === 0) {
                                this.serverMessage$.next({
                                    type: SocketMessageType.STOP_GAME,
                                    data: { isGameActive: false }
                                });
                            }
                        })
                    );
                })
            )
        ]).subscribe(([caughtObjects, timeRemaining]) => {
            this.serverMessage$.next({ type: SocketMessageType.UPDATE_SCORE, data: { caughtObjects, timeRemaining } });
        });

        /**
         * Imitation of WebSockets connection
         */
        this.serverMessage$.subscribe((message) => {
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

    public startGame(gameTime: number): void {
        this.caughtObjects$.next(0);
        this.timeRemaining$.next(gameTime);
    }

    public updateScore(): void {
        this.caughtObjects$.next(this.caughtObjects$.getValue() + 1);
    }
}
