import { Injectable } from '@angular/core';
import { ImmutableContext } from '@ngxs-labs/immer-adapter';
import { State, Action, StateContext, Selector } from '@ngxs/store';

import { Settings } from '../model/settings.model';
import { RANGE_SENTENCE_DEFAULT, MEDIUM_SENTENCE_COLOR_DEFAULT, LONG_SENTENCE_COLOR_DEFAULT, LONG_PARAGRAPH_DEFAULT } from '@shared/app.const';
import { ChangeText, ChangeSettings, InitContent, ChangeSupportLongSentenceWarning, ChangeSupportLongParagraphWarning, ChangeIsDirty } from '../action/editor.action';
import { ToolService } from '@shared/service';

const SETTING_DEFAULT: Settings = {
    range: RANGE_SENTENCE_DEFAULT,
    mediumColor: MEDIUM_SENTENCE_COLOR_DEFAULT,
    longColor: LONG_SENTENCE_COLOR_DEFAULT,
    longParagraph: LONG_PARAGRAPH_DEFAULT
}

export function initSettings(): Settings {
    const settingsString = localStorage.getItem('settings');
    if (!settingsString) {
        return SETTING_DEFAULT;
    }
    const savedSettings: Settings = JSON.parse(settingsString);
    const settings: Settings = {
        ...SETTING_DEFAULT,
        ...ToolService.filterObject(savedSettings)
    }
    return settings;
}

export interface EditorStateModel {
    isDirty: boolean;
    content?: string;
    textContent?: string;
    settings?: Settings;
    support?: {
        longSentenceWarning: boolean,
        longParagraphWarning: boolean
    }
}

@State<EditorStateModel>({
    name: 'safeEditor_editor',
    defaults: {
        isDirty: false,
        settings: initSettings(),
        content: null,
        textContent: '',
        support: {
            longSentenceWarning: true,
            longParagraphWarning: true
        }
    }
})
@Injectable()
export class EditorState {
    @Selector()
    static isDirty(state: EditorStateModel) {
        return state.isDirty;
    }
    @Selector()
    static longSentenceWarning(state: EditorStateModel) {
        return state.support.longSentenceWarning;
    }
    @Selector()
    static longParagraphWarning(state: EditorStateModel) {
        return state.support.longParagraphWarning;
    }
    @Selector()
    static settings(state: EditorStateModel) {
        return state.settings;
    }
    @Selector()
    static text(state: EditorStateModel) {
        return state.textContent;
    }
    @Selector()
    static content(state: EditorStateModel) {
        return state.content;
    }

    @Action(InitContent)
    initContent({ patchState }: StateContext<EditorStateModel>, action: InitContent) {
        if (action.content) {
            patchState({ content: action.content })
        } else {
            patchState({
                content: null,
                textContent: ''
            })
        }
    }

    @Action(ChangeSettings)
    @ImmutableContext()
    changeSettings({ setState }: StateContext<EditorStateModel>, action: ChangeSettings) {
        setState((state: EditorStateModel) => {
            state.settings = action.settings;
            return state
        })
    }

    @Action(ChangeText)
    @ImmutableContext()
    changeText({ setState }: StateContext<EditorStateModel>, action: ChangeText) {
        setState((state: EditorStateModel) => {
            state.textContent = action.text;
            return state
        })
    }

    @Action(ChangeSupportLongSentenceWarning)
    @ImmutableContext()
    changeSupportLongSentenceWarning({ setState }: StateContext<EditorStateModel>, action: ChangeSupportLongSentenceWarning) {
        setState((state: EditorStateModel) => {
            state.support.longSentenceWarning = action.flag;
            return state
        })
    }

    @Action(ChangeSupportLongParagraphWarning)
    @ImmutableContext()
    changeSupportLongParagraphWarning({ setState }: StateContext<EditorStateModel>, action: ChangeSupportLongParagraphWarning) {
        setState((state: EditorStateModel) => {
            state.support.longParagraphWarning = action.flag;
            return state
        })
    }

    @Action(ChangeIsDirty)
    @ImmutableContext()
    changeIsDirty({ setState }: StateContext<EditorStateModel>, action: ChangeIsDirty) {
        setState((state: EditorStateModel) => {
            state.isDirty = action.flag;
            return state
        })
    }
}