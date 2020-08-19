import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
    // don't use 'ng' prefix since it's reserved for Angular
    selector: '[appVar]',
    // exportAs: 'appVar' 
})
export class VarDirective<T = unknown> {
    // https://angular.io/guide/structural-directives#typing-the-directives-context
    static ngTemplateContextGuard<T>(dir: VarDirective<T>, ctx: any): ctx is Context<T> {
        return true;
    }

    private context?: Context<T>;

    constructor(
        private vcRef: ViewContainerRef,
        private templateRef: TemplateRef<Context<T>>
    ) {}

    @Input()
    set appVar(value: T) {
        if (this.context) {
            this.context.appVar = value;
        } else {
            this.context = { appVar: value };
            this.vcRef.createEmbeddedView(this.templateRef, this.context);
        }
    }
}

interface Context<T> {
    appVar: T;
}

// import { Directive, Input, ViewContainerRef, TemplateRef } from '@angular/core';

// @Directive({
//     selector: '[huu]',
    
// })
// export class VarDirective {
//   @Input()
//   set ngVar(context: any) {
//     this.context.$implicit = this.context.ngVar = context;
//     this.updateView();
//   }

//   context: any = {};

//   constructor(private vcRef: ViewContainerRef, private templateRef: TemplateRef<any>) {}

//   updateView() {
//     this.vcRef.clear();
//     this.vcRef.createEmbeddedView(this.templateRef, this.context);
//   }
// }