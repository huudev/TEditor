import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { ImmutableContext } from '@ngxs-labs/immer-adapter';
import produce from 'immer';

import { ShowTitleModal, CloseTitleModal, ShowSetingsDrawer, CloseSetingsDrawer, UpdateContent, InitArticle, ChangeKeyword, SaveArticle, ChangeTitle } from '../action/home.action';
import { InitContent } from '../action/editor.action';
import { Injectable } from '@angular/core';
import { Article } from '@shared/model';
import { ArticleService, TextService } from '@shared/service';
import { ARTICLE_TITLE_DEFAULT } from '@shared/app.const';
import { EditorState } from './editor.state';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

export interface HomeStateModel {
    setingsDrawerVisible?: boolean;
    titleModalVisible?: boolean;
    isCreateModel?: boolean;
    articleSaving?: boolean;
    model?: {
        originalArticle?: Article;
        article?: Article;
    }
}

@State<HomeStateModel>({
    name: 'safeEditor',
    defaults: {
        isCreateModel: true,
        titleModalVisible: false,
        setingsDrawerVisible: false,
        articleSaving: false,
        model: {
            originalArticle: null,
            article: {} as any
        }
    }
})
@Injectable()
export class HomeState {
    constructor(
        private store: Store,
        private router: Router,
        private message: NzMessageService,
        private articleService: ArticleService,
        private textService: TextService) { }
    // ngxsOnChanges(change: NgxsSimpleChange<any>): void {
    //     console.log(change);

    // }
    @Selector()
    static setingsDrawerVisible(state: HomeStateModel) {
        return state.setingsDrawerVisible;
    }
    @Selector()
    static titleModalVisible(state: HomeStateModel) {
        return state.titleModalVisible;
    }

    @Selector()
    static articleSaving(state: HomeStateModel) {
        return state.articleSaving;
    }

    @Selector()
    static originalAricle(state: HomeStateModel) {
        return state.model.originalArticle;
    }
    @Selector()
    static aricle(state: HomeStateModel) {
        return state.model.article;
    }
    @Selector()
    static originalTitle(state: HomeStateModel) {
        return state.model.originalArticle?.title;
    }
    @Selector()
    static title(state: HomeStateModel) {
        return state.model.article.title;
    }
    @Selector()
    static keyword(state: HomeStateModel) {
        return state.model.article.keyword;
    }

    @Action(ShowTitleModal)
    @ImmutableContext()
    showTitleModal({ setState }: StateContext<HomeStateModel>) {
        setState((state: HomeStateModel) => {
            state.titleModalVisible = true;
            return state
        })
    }

    @Action(CloseTitleModal)
    @ImmutableContext()
    closeTitleModal({ setState }: StateContext<HomeStateModel>) {
        setState((state: HomeStateModel) => {
            state.titleModalVisible = false;
            return state
        })
    }

    @Action(ShowSetingsDrawer)
    @ImmutableContext()
    showSetingsDrawer({ setState }: StateContext<HomeStateModel>) {
        setState((state: HomeStateModel) => {
            state.setingsDrawerVisible = true;
            return state
        })
    }

    @Action(CloseSetingsDrawer)
    @ImmutableContext()
    closeSetingsDrawer({ setState }: StateContext<HomeStateModel>) {
        setState((state: HomeStateModel) => {
            state.setingsDrawerVisible = false;
            return state
        })
    }

    @Action(InitArticle)
    @ImmutableContext()
    initArticle({ setState, dispatch, getState, patchState }: StateContext<HomeStateModel>, action: InitArticle) {
        // let state: HomeStateModel = getState();
        // let newState
        // if (action.isCreateModel) {
        //     newState = {
        //         ...state,
        //         isCreateModel: true,
        //         model: {
        //             originalArticle: null,
        //             article: { title: ARTICLE_TITLE_DEFAULT } as any
        //         }
        //     }
        // } else {
        //     newState = {
        //         ...state,
        //         isCreateModel: false,
        //         model: {
        //             originalArticle: action.article,
        //             article: JSON.parse(JSON.stringify(action.article))
        //         }
        //     }
        // }
        // setState(newState)
        setState((state: HomeStateModel) => {
            if (action.isCreateModel) {
                state.isCreateModel = true
                state.model.originalArticle = null
                state.model.article = { title: ARTICLE_TITLE_DEFAULT } as any

            } else {
                state.isCreateModel = false
                state.model.originalArticle = action.article
                state.model.article = JSON.parse(JSON.stringify(action.article))
            }
            return state;
        })
        this.store.dispatch(new InitContent(getState().model.article.content));
    }

    @Action(UpdateContent)
    @ImmutableContext()
    updateContent({ setState }: StateContext<HomeStateModel>, action: UpdateContent) {
        setState((state: HomeStateModel) => {
            state.model.article.content = action.content;
            return state
        })
    }


    @Action(ChangeTitle)
    @ImmutableContext()
    changeTitle({ setState }: StateContext<HomeStateModel>, action: ChangeTitle) {
        setState((state: HomeStateModel) => {
            state.model.article.title = action.title;
            return state;
        })
    }

    @Action(ChangeKeyword)
    @ImmutableContext()
    changeKeyword({ setState }: StateContext<HomeStateModel>, action: ChangeKeyword) {
        setState((state: HomeStateModel) => {
            state.model.article.keyword = action.keyword;
            return state;
        })
    }

    @Action(SaveArticle)
    @ImmutableContext()
    async saveArticle({ setState, getState }: StateContext<HomeStateModel>) {
        setState((state: HomeStateModel) => {
            state.articleSaving = true;
            const article = state.model.article;
            const text = this.store.selectSnapshot(EditorState.text);
            article.normalizedTitle = this.textService.normalizeString(article.title);
            article.descriptions = text.substr(0, Math.min(text.length, 100));
            return state;
        })
        const state: HomeStateModel = getState()
        try {
            if (state.isCreateModel) {
                const { key } = await this.articleService.save(state.model.article)
                this.router.navigate(['/safe-editor', key], { replaceUrl: true })
            } else {
                await this.articleService.update(state.model.article)
                setState((state: HomeStateModel) => {
                    state.model.originalArticle = JSON.parse(JSON.stringify(state.model.article));
                    return state;
                })
            }
            this.message.success('Lưu thành công');
            setState((state: HomeStateModel) => {
                state.titleModalVisible = false;
                return state;
            })
        } catch (e) {
            this.message.error('Lưu thất bại');
        } finally {
            setState((state: HomeStateModel) => {
                state.articleSaving = false;
                return state;
            })
        }
    }

    // @Action(CreateArticle)
    // @ImmutableContext()
    // createArticle({ setState }: StateContext<HomeStateModel>, action: CreateArticle) {
    //     return this.articleService.save(action.article).then(({ key }) => {
    //         
    //         
    //     })
    // }

    // @Action(UpdateArticle)
    // @ImmutableContext()
    // updateArticle() {

    // }
}