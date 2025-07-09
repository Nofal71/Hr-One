import React, { useState } from 'react';
import { Button, Input, Checkbox } from '@fluentui/react-components';
import { useStyles } from './styles';
import { Plus, X } from 'lucide-react';
import { FilterModalProps } from './types';
import CreateTags from '../../../users/pages/tags/create';

const FilterModal: React.FC<FilterModalProps> = ({
    theme,
    filterSearch,
    setFilterSearch,
    filterTags,
    selectedTags,
    setSelectedTags,
    setFilterOpen
}) => {
    const styles = useStyles();
    const [isCreateTagsOpen, setIsCreateTagsOpen] = useState(false);

    const handleApplyFilters = () => {
        setFilterOpen(false);
    };

    return (
        <>
            <div className={styles.modalOverlay}>
                <div className={theme === 'dark' ? styles.modalDark : styles.modal}>
                    <div className={styles.modalHeader}>
                        <h3 className={theme === 'dark' ? styles.modalTitleDark : styles.modalTitle}>Filter CVs</h3>
                        <Button appearance="subtle" size='small' onClick={() => setFilterOpen(false)}>
                            <X size={20} />
                        </Button>
                    </div>
                    <div className={styles.searchAddTags} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <Input
                            type="text"
                            placeholder="Search tags..."
                            value={filterSearch}
                            onChange={(e: any) => setFilterSearch(e.target.value)}
                            className={styles.filterInput}
                            style={{ flex: 1 }}
                        />
                        <Button
                            appearance="subtle"
                            onClick={() => setIsCreateTagsOpen(true)}
                            style={{
                                padding: '8px 16px',
                                marginBottom:'15px',
                                minWidth: 'auto',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                border: theme === 'dark' ? '1px solid #555' : '1px solid #ccc',
                                borderRadius: '4px'
                            }}
                        >
                            <Plus size={16} />
                        </Button>
                    </div>
                    <div className={styles.checkboxContainer}>
                        {filterTags
                            ?.filter((tagData: any) =>
                                tagData.fields?.Tag?.toLowerCase().includes(filterSearch.toLowerCase())
                            )
                            .slice(0, 5)
                            .map((tagData: any, _: number) => {
                                const tag = tagData.fields?.Tag;
                                return (
                                    <Checkbox
                                        key={tag}
                                        label={tag}
                                        checked={selectedTags.includes(tag)}
                                        onChange={(_, checkboxData) => {
                                            setSelectedTags((prev: any) =>
                                                checkboxData.checked
                                                    ? [...prev, tag]
                                                    : prev.filter((t: any) => t !== tag)
                                            );
                                        }}
                                    />
                                );
                            })}
                    </div>
                    <div className={styles.modalActions}>
                        <Button
                            appearance="subtle"
                            onClick={() => {
                                setSelectedTags([]);
                                setFilterOpen(false);
                            }}
                            className={styles.clearButton}
                        >
                            Clear Filters
                        </Button>
                        <Button
                            appearance="primary"
                            onClick={handleApplyFilters}
                            className={styles.saveButton}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </div>
            {isCreateTagsOpen && (
                <CreateTags
                    theme={theme}
                    setIsCreateTagsOpen={setIsCreateTagsOpen}
                />                    

            )}
        </>
    );
};

export default FilterModal;