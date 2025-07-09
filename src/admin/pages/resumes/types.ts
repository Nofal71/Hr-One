export interface FilterModalProps {
    theme: 'light' | 'dark';
    filterSearch: string;
    setFilterSearch: (value: string) => void;
    filterTags: string[];
    selectedTags: string[];
    setSelectedTags: (tags: any) => void;
    setFilterOpen: (open: boolean) => void;
}

export interface DocPreviewProps {
    theme: 'light' | 'dark';
    CV: any;
    setPreviewOpen: (open: boolean) => void;
}

