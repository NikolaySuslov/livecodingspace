import { LitElement } from 'lit';
import { EventEmitter } from '../../internal/decorators';
export default class SlAnimation extends LitElement {
    static styles: import("lit").CSSResult;
    private animation;
    private hasStarted;
    defaultSlot: Promise<HTMLSlotElement>;
    name: string;
    delay: number;
    direction: PlaybackDirection;
    duration: number;
    easing: string;
    endDelay: number;
    fill: FillMode;
    iterations: number;
    iterationStart: number;
    keyframes: Keyframe[];
    playbackRate: number;
    pause: boolean;
    slCancel: EventEmitter<void>;
    slFinish: EventEmitter<void>;
    slStart: EventEmitter<void>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    handleAnimationChange(): void;
    handleAnimationFinish(): void;
    handleAnimationCancel(): void;
    handlePauseChange(): boolean;
    handlePlaybackRateChange(): void;
    handleSlotChange(): void;
    createAnimation(): Promise<boolean>;
    destroyAnimation(): void;
    cancel(): void;
    finish(): void;
    getCurrentTime(): number | null;
    setCurrentTime(time: number): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sl-animation': SlAnimation;
    }
}
