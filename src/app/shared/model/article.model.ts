
export interface Article {
    id?: string;
    title: string;
    normalizedTitle: string;
    content: string;
    descriptions?: string;
    keyword?: string;
    createAt?: Date | number;
    updateAt?: Date | number;
}