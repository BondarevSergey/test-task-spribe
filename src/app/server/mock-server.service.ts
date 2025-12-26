import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, interval, map, Subject, switchMap, takeWhile, tap } from 'rxjs';
import { SocketMessage, SocketMessageType } from '../models/socket-message.model';

@Injectable({
    providedIn: 'root'
})
export class MockServerService {
    public timeRemaining$ = new BehaviorSubject(0);
    public caughtObjects$ = new BehaviorSubject(0);

    /**
     * Imitation of WebSockets source
     */
    public serverMessage$ = new Subject<SocketMessage>();

    constructor() {
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
    }

    public startGame(gameTime: number): void {
        this.caughtObjects$.next(0);
        this.timeRemaining$.next(gameTime);
    }

    public updateScore(): void {
        this.caughtObjects$.next(this.caughtObjects$.getValue() + 1);
    }
}
