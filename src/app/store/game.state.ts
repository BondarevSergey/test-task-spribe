import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameStateObj } from '../models/game.model';

@Injectable({ providedIn: 'root' })
export class GameState {
    public isGameActive$ = new BehaviorSubject(false);
    public gameInfo$ = new BehaviorSubject<GameStateObj>({
        timeRemaining: 0,
        caughtObjects: 0
    });
}
