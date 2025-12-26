import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GameComponent } from './features/game/game.component';
import { SocketService } from './services/socket.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [GameComponent],
    standalone: true
})
export class AppComponent {
    readonly #socketService = inject(SocketService);
}
