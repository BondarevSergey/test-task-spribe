import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, map, Observable, startWith } from 'rxjs';
import { ControlsOf, GameSettings } from '../../../models/game.model';
import { FormFieldErrorsComponent } from '../../../common/form-field-errors/form-field-errors.component';
import { FormFieldComponent } from '../../../common/form-field/form-field.component';
import { FieldInputDirective } from '../../../common/form-field/directives/field-input.directive';

@Component({
    selector: 'app-game-settings',
    standalone: true,
    templateUrl: './game-settings.component.html',
    styleUrl: './game-settings.component.scss',
    imports: [ReactiveFormsModule, AsyncPipe, FormFieldErrorsComponent, FormFieldComponent, FieldInputDirective],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameSettingsComponent {
    @Output() settingsChange = new EventEmitter<GameSettings>();

    public form = new FormGroup<ControlsOf<GameSettings>>({
        fallingSpeed: new FormControl(2, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
        fallingFrequency: new FormControl(800, {
            nonNullable: true,
            validators: [Validators.required, Validators.min(1)]
        }),
        playerSpeed: new FormControl(15, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
        gameTime: new FormControl(30, { nonNullable: true, validators: [Validators.required, Validators.min(1)] })
    });

    public formChangeSteam$!: Observable<void>;

    constructor() {
        this.formChangeSteam$ = this.form.valueChanges.pipe(
            debounceTime(300),
            map((value) => {
                if (this.form.valid) {
                    this.settingsChange.emit(value as GameSettings);
                }
                return void 0;
            }),
            startWith(void 0)
        );
    }
}
