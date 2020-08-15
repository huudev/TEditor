
export interface Article {
    id?: string;
    title: string;
    normalizedTitle: string;
    content: string;
    descriptions?: string;
    key?: string;
    createAt?: Date | number;
    updateAt?: Date | number;
}