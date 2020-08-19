import { Settings } from '../model/settings.model';

export class ChangeSettings {
    static type = '[Settings drawer] Change settings';
    constructor(public settings: Settings) { }
}

export class ChangeText {
    static type = '[Editor] Change text';
    constructor(public text: string) { }
}

export class InitContent {
    static type = '[Editor] Init content';
    constructor(public content: string) { }
}

export class ChangeSupportLongSentenceWarning {
    static type = '[Support control] Change support long sentence warning';
    constructor(public flag: boolean) { }
}

export class ChangeSupportLongParagraphWarning {
    static type = '[Support control] Change support long paragraph warning';
    constructor(public flag: boolean) { }
}

export class ChangeIsDirty {
    static type = '[Editor] Change dirty status';
    constructor(public flag: boolean) { }
}