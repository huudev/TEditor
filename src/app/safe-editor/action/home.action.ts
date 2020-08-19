import { Article } from '@shared/model';

export class ShowTitleModal {
    static type = '[Safe-editor] Show title modal'
}

export class CloseTitleModal {
    static type = '[Safe-editor] Close title modal'
}

export class ShowSetingsDrawer {
    static type = '[Safe-editor] Show settings drawer'
}

export class CloseSetingsDrawer {
    static type = '[Safe-editor] Close settings drawer'
}

export class InitArticle {
    static type = '[Safe-editor] Init article'
    constructor(public isCreateModel, public article?: Article) { }
}

export class ChangeKeyword {
    static type = '[Text info] Change keyword'
    constructor(public keyword: string) { }
}

export class ChangeTitle {
    static type = '[Title modal] Change title';
    constructor(public title: string) { }
}

export class UpdateContent {
    static type = '[Safe-editor] Update content';
    constructor(public content: string) { }
}

export class PreSaveArticle {
    static type = '[Title modal] Presave artilce';
    constructor() { }
}

export class SaveArticle {
    static type = '[Safe-editor] Save article';
}

export class CreateArticle {
    static type = '[Aricle] Create'
    constructor(public article: Article) { }
}

export class UpdateArticle {
    static type = '[Aricle] Update'
    constructor(public article: Article) { }
}