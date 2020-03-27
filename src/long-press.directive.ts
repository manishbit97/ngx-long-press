import { Directive, EventEmitter, HostBinding,HostListener, Input, Output } from '@angular/core';

// import { Observable } from 'rxjs/Observable';
// import { Subject } from 'rxjs/Subject';

// import 'rxjs/add/observable/interval';
// import 'rxjs/add/operator/takeUntil';
// import 'rxjs/add/operator/filter';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/switch';
// import 'rxjs/add/operator/combineLatest';
// import 'rxjs/add/operator/repeat';

@Directive({
    selector: '[long-press]'
})
export class LongPressDirective {
//     @Input() public longPress: number = 500;
//     @Output() public onRelease: EventEmitter<any> = new EventEmitter();

//     public mouseups$ = new Subject();
//     public mousedowns$ = new Subject();
//     public destroys$ = new Subject();

//     public ngOnInit(): void {
//         const interval$ = this.interval$()
//             .takeUntil(this.mouseups$)
//             .combineLatest(this.mouseups$);

//         this.mousedowns$
//             .asObservable()
//             .map(() => interval$)
//             .switch()
//             .repeat()
//             .map(items => items[1])
//             .takeUntil(this.destroys$)
//             .subscribe((event: any) => {
//                 this.onRelease.emit(event);
//             });
//     }

//     public ngOnDestroy(): void {
//         this.destroys$.next();
//         this.destroys$.unsubscribe();
//     }

//     public interval$(): Observable<number> {
//         return Observable
//             .interval()
//             .map(i => i * 10)
//             .filter(i => i > this.longPress);
//     }

    
//     @HostListener('touchend', ['$event'])
//     @HostListener('mouseup', ['$event'])
//     public onMouseUp(event:any): void {
//         this.mouseups$.next(event);
//     }
    
//     @HostListener('touchstart', ['$event'])
//     @HostListener('mousedown', ['$event']) 
//     public onMouseDown(event:any): void {
//         this.mousedowns$.next(event);
//     }
// }
  private timeoutId: number = null;
  private intervalId: number = null;

  private isLongPressing: boolean;
  private isPressing: boolean;

  @Output() onLongPress = new EventEmitter();
  @Output() onLongPressing = new EventEmitter();

  @Input() timeout: number = 300;

  @HostBinding('class.press')
  get press() {
    return this.isPressing;
  }

  @HostBinding('class.long-press')
  get longPress() {
    return this.isLongPressing;
  }

  @HostListener('touchstart', ['$event'])
  public onMouseDown(event) {
    this.isPressing = true;
    this.isLongPressing = false;

    this.timeoutId = (<any> window).setTimeout(() => {
      this.isLongPressing = true;
      this.onLongPress.emit(event);

      this.intervalId = (<any> window).setInterval(() => {
        this.onLongPressing.emit(event);
      }, 30);
    }, this.timeout);
  }



  @HostListener('touchend', ['$event'])
  public onMouseLeave() {
    this.endPress();
  }

  private endPress() {
    if (this.timeoutId !== null)
      clearTimeout(this.timeoutId);

    if (this.intervalId !== null)
      clearInterval(this.intervalId);

    this.isLongPressing = false;
    this.isPressing = false;
  }



  @HostListener('mousedown', ['$event'])
  public onMouseDownActual(event) {
    this.isPressing = true;
    this.isLongPressing = false;

    this.timeoutId = (<any> window).setTimeout(() => {
      this.isLongPressing = true;
      this.onLongPress.emit(event);

      this.intervalId = (<any> window).setInterval(() => {
        this.onLongPressing.emit(event);
      }, 30);
    }, this.timeout);
  }

  @HostListener('mouseup', ['$event'])
  public onMouseLeaveActual() {
    this.endPress();
  }
}

