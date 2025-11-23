import { Component, OnDestroy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import {
    BehaviorSubject,
    combineLatest,
    distinctUntilChanged,
    filter,
    interval,
    map,
    Observable,
    startWith,
    Subject,
    switchMap,
    takeUntil,
    takeWhile,
    tap
} from 'rxjs';
import { GameSettingsComponent } from './game-settings/game-settings.component';
import { Ball, GameSettings } from '../../models/game.model';

@Component({
    selector: 'app-game',
    standalone: true,
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
    imports: [ReactiveFormsModule, GameSettingsComponent, AsyncPipe]
})
export class GameComponent implements OnDestroy {
    // ---
    // Visual params of game
    // ---
    protected characterX = 160;
    protected readonly characterWidth = 80;
    protected readonly gameWidth = 400;
    protected readonly gameHeight = 400;

    /// ----
    /// Game params
    /// ----
    private balls$ = new BehaviorSubject<Ball[]>([]);
    private score$ = new BehaviorSubject(0);

    private settingsMap: Record<keyof GameSettings, BehaviorSubject<number>> = {
        gameTime: new BehaviorSubject<number>(0),
        fallingSpeed: new BehaviorSubject<number>(0),
        fallingFrequency: new BehaviorSubject<number>(0),
        playerSpeed: new BehaviorSubject<number>(0)
    };

    private startTrigger$ = new BehaviorSubject<boolean>(false);
    private stopTrigger$ = new Subject<void>();

    public gameEvents$!: Observable<{
        balls: Ball[];
        score: number;
        seconds: number;
    }>;

    constructor() {
        /**
         * Timer$ - countdown timer
         * it starts when a player sets gameTime and restarts when it updated
         **/
        const timer$ = this.startTrigger$.pipe(
            filter(Boolean),
            switchMap(() =>
                this.settingsMap.gameTime.pipe(
                    takeUntil(this.stopTrigger$),
                    switchMap((time) =>
                        interval(1000).pipe(
                            map((value) => time - value), // віднімаємо пройдені секунди
                            takeWhile((x) => x >= 0),
                            tap((remaining) => {
                                if (remaining === 0) {
                                    this.stopGame();
                                }
                            })
                        )
                    )
                )
            )
        );

        /**
         * It is a stream that stops related streams when game over
         **/
        const spawn$ = this.startTrigger$.pipe(
            filter(Boolean),
            switchMap(() =>
                this.settingsMap.fallingFrequency.pipe(
                    takeUntil(this.stopTrigger$),
                    filter((freq) => freq > 0),
                    distinctUntilChanged(),
                    switchMap((freq) =>
                        interval(freq).pipe(
                            tap(() => this.createBall()),
                            takeUntil(this.stopTrigger$)
                        )
                    )
                )
            ),
            startWith(void 0)
        );

        /**
         * That stream exists until time timer$ is not over
         * and creates a new ball every fallingFrequency (ms)
         **/
        const fall$ = this.startTrigger$.pipe(
            filter(Boolean),
            switchMap(() =>
                this.settingsMap.fallingSpeed.pipe(
                    takeUntil(this.stopTrigger$),
                    filter((speed) => speed > 0),
                    distinctUntilChanged(),
                    switchMap((speed) =>
                        interval(16).pipe(
                            tap(() => this.checkBalls(speed)),
                            takeUntil(this.stopTrigger$) // миттєво відключаємо
                        )
                    )
                )
            ),
            startWith(void 0)
        );

        /**
         * Combined stream that is used on UI
         **/
        this.gameEvents$ = combineLatest([
            this.balls$.asObservable(),
            this.score$.asObservable(),
            timer$.pipe(startWith(0)),
            spawn$,
            fall$
        ]).pipe(
            map(([balls, score, seconds]) => ({
                balls,
                score,
                seconds
            }))
        );
    }

    ngOnDestroy(): void {
        this.stopGame();
        this.stopTrigger$.complete();
    }

    /**
     * Update settings of the game
     **/
    protected setSettings(settings: GameSettings) {
        const { gameTime, ...rest } = settings;
        for (const key in rest) {
            this.settingsMap[key as keyof GameSettings].next(settings[key as keyof GameSettings]);
        }

        if (gameTime !== this.settingsMap.gameTime.getValue()) {
            this.stopGame();
            this.settingsMap.gameTime.next(gameTime);
            this.startTrigger$.next(true);
        }
    }

    /**
     * Player controls
     * move user character by pressing arrow keys
     **/
    public moveLeft(): void {
        this.characterX = Math.max(0, this.characterX - this.settingsMap.playerSpeed.getValue());
    }

    public moveRight(): void {
        this.characterX = Math.min(
            this.gameWidth - this.characterWidth,
            this.characterX + this.settingsMap.playerSpeed.getValue()
        );
    }

    /**
     * Method for stopping the game
     */
    private stopGame() {
        this.stopTrigger$.next();
        this.balls$.next([]);
    }

    /**
     * Creation ball and put then to array
     **/
    private createBall(): void {
        const x = Math.random() * (this.gameWidth - 20);
        this.balls$.next([...this.balls$.getValue(), { x, y: 0 }]);
    }

    /**
     * Change position of ball and remove it if it hit the character
     * @param speed - speed of falling ball
     **/
    private checkBalls(speed: number): void {
        const balls = this.balls$.getValue();

        balls.forEach((ball, index) => {
            ball.y += speed;

            if (ball.y >= 350) {
                if (ball.x > this.characterX - 10 && ball.x < this.characterX + this.characterWidth) {
                    // this.score++;
                }
                balls.splice(index, 1);
            }
        });

        this.balls$.next(balls);
    }
}
