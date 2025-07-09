import React, { useState, useEffect } from 'react';
import { FileText, Search, Eye, Trash2, X, Filter } from 'lucide-react';
import { Input, Button, Spinner, Dropdown, Option } from '@fluentui/react-components';
import { DetailsList, DetailsListLayoutMode, IColumn, SelectionMode, Selection, CheckboxVisibility } from '@fluentui/react';
import { getCV, getItems, parseCVs, updateListItem } from '../../../utils';
import FilterModal from './filter-modal';
import DocPreview from './doc-preview';
import { useStyles } from './styles';
import { useSites } from '../../../context/SitesContext';

const CVUploadInterface: React.FC<{ theme: 'light' | 'dark' }> = ({ theme }) => {
    const styles = useStyles();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSearch, setFilterSearch] = useState('');
    const [selectedTags, setSelectedTags] = useState<any[]>([]);
    const [filterStatus, setFilterStatus] = useState<'All' | 'Parsed' | 'Un-Parsed'>('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(500);
    const [loading, setLoading] = useState(false);
    const [CV, setCV] = useState<any>();
    const { getSiteIds } = useSites();
    const [cvs, setCVs] = useState<any[]>([]);
    const [skipToken, setSkipToken] = useState<string | null>(null);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [filterTags, setFilterTags] = useState<string[]>([]);
    const [parsing, setParsing] = useState<boolean>(false);
    const [selectedParsing, setSelectedParsing] = useState<boolean>(false);
    const [selectedCVs, setSelectedCVs] = useState<any[]>([]);
    const [positions, setPositions] = useState<any[]>([]);

    const selection = React.useMemo(() => {
        return new Selection({
            onSelectionChanged: () => {
                const selectedItems = selection.getSelection();
                setSelectedCVs(selectedItems);
            },
        });
    }, []);;

    const loadCVs = async (_: number = 1, token: string | null = null) => {
        setLoading(true);
        try {
            const IDs = await getSiteIds('HRRecruitment', ['CV Library']);
            const Tags = await getSiteIds('HRRecruitment', ['Tags']);
            const response = await getCV(IDs.siteId, IDs.lists[0].id, pageSize, token);
            const res = await getItems(Tags.siteId, Tags.lists[0].id);
            await loadPositions();
            setFilterTags(res?.fields);
            const flattenedItems = response?.items.map((item: any) => ({
                id: item.id,
                candidateName: item.fields?.CandidateName || 'not-defined',
                status: item?.fields?.Tags ? 'Parsed' : 'Un-Parsed',
                downloadUrl: item.driveItem?.['@microsoft.graph.downloadUrl'],
                positionApplied: item.fields?.position_applied || 'Not Applied Yet',
                ...item
            }));
            setCVs(flattenedItems);
            setSkipToken(response?.nextSkipToken ?? null);
            setHasNextPage(!!response?.nextSkipToken);
        } catch (error) {
            console.error('Error loading CVs:', error);
        } finally {
            setLoading(false);
        }
    };

    const parseAllCVs = async () => {
        try {
            setParsing(true);
            const IDs = await getSiteIds('HRRecruitment', ['CV Library']);
            await Promise.all(
                filteredCVs.map(async (e) => {
                    await parseCVs(e.downloadUrl, IDs.siteId, IDs.lists[0].id, e.id);
                })
            );
            await loadCVs();
        } catch (error) {
            setParsing(false);
        } finally {
            setParsing(false);

        }
    };

    const parseSelectedCVs = async () => {
        setSelectedParsing(true);
        const IDs = await getSiteIds('HRRecruitment', ['CV Library']);
        await Promise.all(
            selectedCVs.map(async (e) => {
                await parseCVs(e.downloadUrl, IDs.siteId, IDs.lists[0].id, e.id);
            })
        );
        await loadCVs();
        setSelectedParsing(false);
    };

    const loadPositions = async () => {
        try {
            const IDs = await getSiteIds('HRRecruitment', ['Job_Postings']);
            const response = await getItems(IDs.siteId, IDs.lists[0].id);
            setPositions(response?.fields);
        } catch (error) {
            console.error(error);
        }
    };

    const columns: IColumn[] = [
        { key: 'candidateName', name: 'Name', fieldName: 'candidateName', minWidth: 200, flexGrow: 1 },
        { key: 'Position Applied', name: 'Position Applied', fieldName: 'positionApplied', minWidth: 200, flexGrow: 1 },
        { key: 'status', name: 'Status', fieldName: 'status', minWidth: 100 },
        {
            key: 'actions',
            name: 'Actions',
            minWidth: 100,
            onRender: (data: any) => (
                <div className={styles.actionContainer}>
                    <div className={styles.actionButton} onClick={() => { setPreviewOpen(true); setCV(data); }}>
                        <Eye size={16} />
                    </div>
                    <button className={theme === 'dark' ? styles.deleteButtonDark : styles.deleteButton} title="Delete CV">
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
    ];

    const filteredCVs = cvs.filter(cv =>
        (filterStatus === 'All' || cv.status === filterStatus) &&
        (cv.candidateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cv.email?.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedTags.length === 0 ||
            selectedTags.some(tag => {
                let tags;
                if (cv.fields) {
                    tags = cv.fields?.Tags ? JSON.parse(cv.fields?.Tags) : null;
                }
                return tags?.some((t: any) => t.toLowerCase().includes(tag.toLowerCase()));
            }))
    );


    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
        setSkipToken(null);
        loadCVs(1, null);
    };

    const assignPosition = async (position: string) => {
        setLoading(true)
        try {
            const IDs = await getSiteIds('HRRecruitment', ['CV Library']);
            await Promise.all(
                selectedCVs.map(async (cv) => {
                    await updateListItem(IDs.siteId, IDs.lists[0].id, cv.id, {
                        fields: { position_applied: position }
                    });
                })
            );
            await loadCVs()
        } catch (error) {
            console.error(error);
        }
        setLoading(false)
    };

    useEffect(() => {
        loadCVs(currentPage, skipToken);
    }, [currentPage, pageSize]);

    return (
        <div className={theme === 'dark' ? styles.containerDark : styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>CV Management Portal</h2>
                <p className={theme === 'dark' ? styles.subtitleDark : styles.subtitle}>
                    Streamline your professional document management
                </p>
            </div>
            <div className={styles.content}>
                <div>
                    <div className={styles.libraryHeader}>
                        <h2 className={styles.libraryTitle}>Your CV Library</h2>
                        <div className={styles.controls}>
                            {['All', 'Parsed', 'Un-Parsed'].map((status) => (
                                <Button
                                    key={status}
                                    appearance={filterStatus === status ? 'primary' : 'subtle'}
                                    onClick={() => setFilterStatus(status as 'All' | 'Parsed' | 'Un-Parsed')}
                                >
                                    {status}
                                </Button>
                            ))}
                            <Button appearance="subtle" onClick={() => setFilterOpen(true)}>
                                <Filter size={18} />
                            </Button>
                            {filterStatus === 'Un-Parsed' && (
                                <Button onClick={parseAllCVs} appearance="primary" disabled={parsing}>
                                    {parsing ? <Spinner size="tiny" label="Parsing..." /> : 'Parse All CVs'}
                                </Button>
                            )}
                            {selectedCVs?.length > 0 || selectedParsing && (
                                <Button onClick={parseSelectedCVs} appearance="primary" disabled={selectedParsing}>
                                    {selectedParsing ? <Spinner size="tiny" label="Parsing..." /> : 'Parse Selected CVs'}
                                </Button>
                            )}
                            <select
                                value={pageSize}
                                onChange={handlePageSizeChange}
                                className={theme === 'dark' ? styles.pageSizeSelectDark : styles.pageSizeSelect}
                            >
                                <option value={5}>5 per page</option>
                                <option value={10}>10 per page</option>
                                <option value={20}>20 per page</option>
                                <option value={50}>50 per page</option>
                                <option value={100}>100 per page</option>
                                <option value={300}>300 per page</option>
                                <option value={500}>500 per page</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.searchContainer}>
                        <div className={theme === 'dark' ? styles.searchInputDark : styles.searchInput}>
                            <Search size={18} className={styles.searchIcon} />
                            <Input
                                type="text"
                                placeholder="Search CVs by name or email..."
                                value={searchQuery}
                                onChange={(e: any) => setSearchQuery(e.target.value)}
                                className={styles.input}
                            />
                        </div>
                        {selectedCVs.length > 0 && (
                            <Dropdown
                                placeholder="Assign Position"
                                onOptionSelect={(_, data) => {
                                    if (data.optionValue) assignPosition(data.optionValue);
                                }}
                                className={theme === 'dark' ? styles.dropdownDark : styles.dropdown}
                            >
                                {positions?.map((position) => (
                                    <Option key={position.fields.id} value={position.fields.Position}>
                                        {position.fields.Position}
                                    </Option>
                                ))}
                            </Dropdown>
                        )}
                    </div>
                    <div className={styles.tagsContainer}>
                        {selectedTags.map(tag => (
                            <div key={tag} className={theme === 'dark' ? styles.tagDark : styles.tag}>
                                <span>{tag}</span>
                                <X size={16} className={styles.tagClose} onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))} />
                            </div>
                        ))}
                    </div>

                    {loading ? (
                        <div className={theme === 'dark' ? styles.loadingContainerDark : styles.loadingContainer}>
                            <Spinner size="large" label="Loading CVs..." />
                        </div>
                    ) : filteredCVs.length > 0 ? (
                        <div className={theme === 'dark' ? styles.tableContainerDark : styles.tableContainer}>
                            <DetailsList
                                items={filteredCVs}
                                columns={columns}
                                setKey="set"
                                selection={selection}
                                selectionMode={SelectionMode.multiple}
                                layoutMode={DetailsListLayoutMode.fixedColumns}
                                checkboxVisibility={CheckboxVisibility.always}
                            />
                            <div className={styles.pagination}>
                                <Button
                                    appearance="subtle"
                                    disabled={currentPage === 1}
                                    onClick={() => {
                                        setCurrentPage(currentPage - 1);
                                        loadCVs(currentPage - 1);
                                    }}
                                >
                                    Previous
                                </Button>
                                <span className={theme === 'dark' ? styles.pageInfoDark : styles.pageInfo}>
                                    Page {currentPage}
                                </span>
                                <Button
                                    appearance="subtle"
                                    disabled={!hasNextPage}
                                    onClick={() => {
                                        setCurrentPage(currentPage + 1);
                                        loadCVs(currentPage + 1, skipToken);
                                    }}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className={theme === 'dark' ? styles.emptyContainerDark : styles.emptyContainer}>
                            <div className={styles.emptyIcon}>
                                <FileText size={32} />
                            </div>
                            <h3 className={theme === 'dark' ? styles.emptyTitleDark : styles.emptyTitle}>
                                No CVs uploaded yet
                            </h3>
                            <p className={theme === 'dark' ? styles.emptyTextDark : styles.emptyText}>
                                Upload your first CV to get started!
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {filterOpen && (
                <FilterModal
                    theme={theme}
                    filterSearch={filterSearch}
                    setFilterSearch={setFilterSearch}
                    filterTags={filterTags}
                    selectedTags={selectedTags}
                    setSelectedTags={setSelectedTags}
                    setFilterOpen={setFilterOpen}
                />
            )}

            {previewOpen && (
                <DocPreview
                    theme={theme}
                    CV={CV}
                    setPreviewOpen={setPreviewOpen}
                />
            )}
        </div>
    );
};

export default CVUploadInterface;