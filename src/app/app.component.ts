import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GameComponent } from './features/game/game.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [GameComponent],
    standalone: true
})
export class AppComponent {}
