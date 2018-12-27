import { Directive, ElementRef, Input, TemplateRef, ViewContainerRef } from "@angular/core";
@Directive({
    selector: '[hide]'
})
export class HideDirective {
    constructor(private el: ElementRef,
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef) { }
    @Input() set hide(value: boolean) {
        let span: HTMLElement = this.el.nativeElement as HTMLElement;
        if (value) {
            span.parentElement.style.display = 'none';
            this.viewContainer.clear();
        } else {
            span.parentElement.style.display = 'block';
            this.viewContainer.createEmbeddedView(this.templateRef);
        }

    }
}