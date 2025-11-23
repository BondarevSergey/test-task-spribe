import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
    selector: 'app-form-field-errors',
    templateUrl: './form-field-errors.component.html',
    styleUrls: ['./form-field-errors.component.scss'],
    standalone: true
})
export class FormFieldErrorsComponent {
    @Input({ required: true }) public control!: AbstractControl | null;
    @Input() public patternErrorKey!: string;

    public get errorMessages(): string[] {
        return this.control?.errors
            ? Object.keys(this.control?.errors).reduce((acc: string[], error: string) => {
                  switch (error) {
                      case 'required':
                          acc.push('Field is required');
                          break;
                      case 'email':
                          acc.push();
                          break;
                      case 'min':
                          acc.push(`Min value is` + ` ${this.control?.errors?.['min']?.min}`);
                          break;

                      case 'pattern':
                          if (this.patternErrorKey) {
                              acc.push(this.patternErrorKey);
                          }
                          break;
                  }

                  return acc;
              }, [])
            : [];
    }
}
