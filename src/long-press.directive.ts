import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switch';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/repeat';

@Directive({
    selector: '[longPress]'
})
export class LongPressDirective {
    @Input() public longPress: number = 500;
    @Output() public onRelease: EventEmitter<any> = new EventEmitter();

    public mouseups$ = new Subject();
    public mousedowns$ = new Subject();
    public destroys$ = new Subject();

    public ngOnInit(): void {
        const interval$ = this.interval$()
            .takeUntil(this.mouseups$)
            .combineLatest(this.mouseups$);

        this.mousedowns$
            .asObservable()
            .map(() => interval$)
            .switch()
            .repeat()
            .map(items => items[1])
            .takeUntil(this.destroys$)
            .subscribe((event: any) => {
                this.onRelease.emit(event);
            });
    }

    public ngOnDestroy(): void {
        this.destroys$.next();
        this.destroys$.unsubscribe();
    }

    public interval$(): Observable<number> {
        return Observable
            .interval()
            .map(i => i * 10)
            .filter(i => i > this.longPress);
    }

    
    @HostListener('touchend', ['$event'])
    @HostListener('mouseup', ['$event'])
    public onMouseUp(event:any): void {
        this.mouseups$.next(event);
    }
    
    @HostListener('touchstart', ['$event'])
    @HostListener('mousedown', ['$event']) 
    public onMouseDown(event:any): void {
        this.mousedowns$.next(event);
    }
}
