import { animate, group, query as q, style, transition, trigger, AnimationReferenceMetadata, animation, keyframes } from '@angular/animations'

const query = (style, animate, optional = { optional: true }) =>
    q(style, animate, optional)

const fade = [
    query(':enter, :leave', style({ position: 'absolute', width: '100%' })),
    query(':enter', [style({ opacity: 0 })]),
    group([
        query(':leave', [animate('0.6s ease-out', style({ opacity: 0 }))]),
        query(':enter', [
            style({ opacity: 0 }),
            animate('0.6s ease-out', style({ opacity: 1 })),
        ]),
    ]),
]

export const slide: AnimationReferenceMetadata = animation([
    query(':enter, :leave', style({ position: 'absolute', width: '100%', transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', })
        , { optional: true }),
    group([
        query(':enter', [
            style({ opacity: '0' }),
            animate('{{enterTiming}}s {{enterDelay}}s ease-out', keyframes([
                style({ opacity: '0.5', transform: 'translateZ(-500px) translateX({{enterX}}200%)', offset: 0 }),
                style({ opacity: '0.5', transform: 'translateZ(-500px)', offset: 0.75 }),
                style({ opacity: '1', transform: 'translateZ(0) translateX(0)', offset: 1 }),
            ]))
        ], { optional: true }),
        query(':leave', [
            animate('{{leaveTiming}}s {{leaveDelay}}s ease-out', keyframes([
                style({ opacity: '1', offset: 0 }),
                style({ opacity: '0.5', transform: 'translateZ(-500px)', offset: 0.25 }),
                style({ opacity: '0.5', transform: 'translateZ(-500px) translateX({{leaveX}}200%)', offset: 0.75 }),
                style({ opacity: '0', transform: 'translateZ(-500px) translateX({{leaveX}}200%)', offset: 1 }),
            ]))
        ], { optional: true }),
    ])
], { params: { enterTiming: '1', leaveTiming: '1', enterDelay: '0', leaveDelay: '0', enterX: '+', leaveX: '-' } });

const fadeInWithDirection = [
    query(':enter, :leave', style({ position: 'absolute', width: '100%' })),
    group([
        query(':enter', [
            style({
                transform: 'translateX({{positive}}15%)',
                opacity: 0,
            }),
            animate(
                '0.3s ease-out',
                style({ transform: 'translateX(0%)', opacity: 1 }),
            ),
        ]),
        query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.3s ease-out', style({ opacity: 0 })),
        ]),
    ], { params: { positive: '-' } }),
]

export const routerTransition = trigger('routerTransition', [
    transition('void => init', fade),
    transition("* => s2", slide),
    transition("* => s1", slide),
    transition('* <=> section', fade),
])