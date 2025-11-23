import { Directive, ElementRef, HostListener, InjectionToken, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export const FIELD_INPUT = new InjectionToken<FieldInputDirective>('FieldInputDirective');

@Directive({
    selector: '[appFieldInput]',
    standalone: true,
    providers: [{ provide: FIELD_INPUT, useExisting: FieldInputDirective }]
})
export class FieldInputDirective {
    @Input() isNumeric = false;

    readonly isFocused$ = new BehaviorSubject(false);

    constructor(private readonly elRef: ElementRef) {}

    public get isFocused(): boolean {
        return this.isFocused$.getValue();
    }

    public setId(id: string): void {
        this.elRef.nativeElement.id = id;
    }

    @HostListener('focus', ['$event']) onFocus(): void {
        this.isFocused$.next(true);
    }

    @HostListener('blur', ['$event']) onblur(): void {
        this.isFocused$.next(false);
    }
}
