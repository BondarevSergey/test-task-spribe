import { ChangeDetectionStrategy, Component } from '@angular/core';
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
    of,
    startWith,
    Subject,
    switchMap,
    tap
} from 'rxjs';
import { GameState } from '../../store/game.state';
import { GameService } from '../../services/game.service';
import { GameSettingsComponent } from './game-settings/game-settings.component';
import { Ball, GameSettings } from '../../models/game.model';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
    imports: [ReactiveFormsModule, GameSettingsComponent, AsyncPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class GameComponent {
    public gameEvents$!: Observable<{
        balls: Ball[];
        timeRemaining: number;
        caughtObjects: number;
    }>;

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
    private settingsMap: Record<keyof GameSettings, BehaviorSubject<number>> = {
        gameTime: new BehaviorSubject(0),
        fallingSpeed: new BehaviorSubject(0),
        fallingFrequency: new BehaviorSubject(0),
        playerSpeed: new BehaviorSubject(0)
    };

    private balls$ = new BehaviorSubject<Ball[]>([]);

    private timeRemainingAction$ = new Subject<number>();
    private caughtObjectsAction$ = new Subject();

    constructor(
        private readonly gameService: GameService,
        private readonly state: GameState
    ) {
        /**
         * Stream that triggers game start on server
         */
        const startGameOnServer$ = this.timeRemainingAction$.pipe(
            switchMap((val) => this.gameService.startGame(val)),
            startWith(void 0)
        );

        /**
         * Stream that increment score on server
         */
        const updateScoreOnServer$ = this.caughtObjectsAction$.pipe(
            switchMap(() => this.gameService.updateScore()),
            startWith(void 0)
        );

        /**
         * This stream is responsible for creation the ball
         * and related to changes fallingFrequency (how often new a ball appears)
         * That stream exists until the game status is true
         **/
        const spawn$ = this.state.isGameActive$.pipe(
            switchMap((isActive) =>
                isActive
                    ? this.settingsMap.fallingFrequency.pipe(
                          filter((freq) => freq > 0),
                          distinctUntilChanged(),
                          switchMap((freq) => interval(freq).pipe(tap(() => this.createBall())))
                      )
                    : of(void 0).pipe(tap(() => this.balls$.next([])))
            )
        );

        /**
         * This stream is responsible for moving the ball
         * and related to changes fallingSpeed (how fast the balls fall)
         * That stream exists until the game status is true
         **/
        const fall$ = this.state.isGameActive$.pipe(
            switchMap((isActive) =>
                isActive
                    ? this.settingsMap.fallingSpeed.pipe(
                          filter((speed) => speed > 0),
                          distinctUntilChanged(),
                          switchMap((speed) => interval(16).pipe(tap(() => this.checkBalls(speed))))
                      )
                    : of(void 0)
            )
        );

        /**
         * Combined stream that is used on UI
         **/
        this.gameEvents$ = combineLatest([
            this.balls$.asObservable(),
            this.state.gameInfo$,
            spawn$,
            fall$,
            startGameOnServer$,
            updateScoreOnServer$
        ]).pipe(
            map(([balls, results]) => ({
                balls,
                ...results
            }))
        );
    }

    /**
     * Update settings of the game
     **/
    public setSettings(settings: GameSettings) {
        const { gameTime, ...rest } = settings;

        Object.entries(rest).forEach(([key, value]) => {
            this.settingsMap[key as keyof GameSettings].next(value);
        });

        if (gameTime !== this.settingsMap.gameTime.getValue()) {
            this.balls$.next([]);
            this.timeRemainingAction$.next(gameTime);
            this.settingsMap.gameTime.next(gameTime);
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
        const remains: Ball[] = [];

        balls.forEach((ball, index) => {
            ball.y += speed;

            if (ball.y >= 350) {
                if (ball.x > this.characterX - 10 && ball.x < this.characterX + this.characterWidth) {
                    this.caughtObjectsAction$.next(void 0);
                }
            } else {
                remains.push(ball);
            }
        });

        this.balls$.next(remains);
    }
}
