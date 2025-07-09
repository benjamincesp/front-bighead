export interface CustomLink {
    label: string;
    href: string;
    targetBlank?: boolean;
    big?: boolean;
}

export interface WidgetFooterMenu {
    id: string;
    title: string;
    menus: CustomLink[];
}