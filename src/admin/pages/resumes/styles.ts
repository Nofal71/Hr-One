import { makeStyles } from '@fluentui/react-components';
import { tokens } from '@fluentui/react-theme';

export const useStyles = makeStyles({
    // Light theme styles
    container: {
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
    },
    header: {
        textAlign: 'center',
        marginBottom: '2.5rem'
    },
    title: {
        color: tokens.colorBrandBackground,
        fontSize: '3rem',
        fontWeight: 800,
        marginBottom: '0.5rem',
        letterSpacing: '-0.02em'
    },
    subtitle: {
        fontSize: '1.1rem',
        color: '#4b5563'
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
    },
    uploadCard: {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderRadius: '1rem',
        padding: '1.5rem',
        border: '1px solid rgba(0,0,0,0.1)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        maxWidth: '500px',
        margin: '0 auto'
    },
    uploadTitle: {
        fontSize: '1.25rem',
        fontWeight: 600,
        marginBottom: '1rem',
        color: '#111827'
    },
    uploadArea: {
        border: '2px dashed #d1d5db',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        textAlign: 'center',
        cursor: 'pointer'
    },
    uploadIcon: {
        color: tokens.colorBrandBackground,
        marginBottom: '0.5rem'
    },
    uploadText: {
        fontWeight: 500,
        color: '#4b5563'
    },
    fileInfo: {
        marginTop: '1rem',
        padding: '0.75rem',
        borderRadius: '0.5rem',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    uploadButton: {
        width: '100%',
        marginTop: '1rem'
    },
    libraryHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
    },
    libraryTitle: {
        fontSize: '1.75rem',
        fontWeight: 700,
        color: tokens.colorBrandBackground
    },
    controls: {
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center'
    },
    pageSizeSelect: {
        padding: '0.5rem',
        borderRadius: '0.5rem',
        border: '1px solid rgba(0,0,0,0.1)',
        backgroundColor: 'rgba(249, 250, 251, 0.7)',
        color: '#1f2937'
    },
    searchContainer: {
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        alignItems: 'center'
    },
    searchInput: {
        maxWidth: '600px',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: '0.75rem',
        backgroundColor: 'rgba(249, 250, 251, 0.7)',
        height: '2.5rem'
    },
    searchIcon: {
        margin: '0 0.75rem',
        color: '#6b7280'
    },
    input: {
        border: 'none',
        outline: 'none',
        background: 'transparent',
        color: '#1f2937',
        fontSize: '0.875rem',
        flex: 1,
        padding: '0.5rem 0'
    },
    dropdown: {
        minWidth: '200px',
        height: '2.5rem',
        borderRadius: '0.75rem',
        border: '1px solid rgba(0,0,0,0.1)',
        backgroundColor: 'rgba(249, 250, 251, 0.7)',
        color: '#1f2937',
        display: 'flex',
        alignItems: 'center',
        padding: '0 0.5rem'
    },
    tagsContainer: {
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
        marginBottom: '10px'
    },
    tag: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.25rem 0.5rem',
        borderRadius: '0.25rem',
        backgroundColor: '#e5e7eb',
        color: '#1f2937',
        fontSize: '0.875rem'
    },
    tagClose: {
        cursor: 'pointer'
    },
    loadingContainer: {
        textAlign: 'center',
        padding: '3rem',
        backgroundColor: 'rgba(249, 250, 251, 0.7)',
        borderRadius: '1rem',
        border: '1px solid rgba(0,0,0,0.1)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
    },
    tableContainer: {
        backgroundColor: 'rgba(249, 250, 251, 0.7)',
        borderRadius: '1rem',
        border: '1px solid rgba(0,0,0,0.1)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        overflow: 'hidden'
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '1rem'
    },
    pageInfo: {
        fontSize: '0.875rem',
        color: '#4b5563'
    },
    emptyContainer: {
        textAlign: 'center',
        padding: '3rem',
        backgroundColor: 'rgba(249, 250, 251, 0.7)',
        borderRadius: '1rem',
        border: '1px solid rgba(0,0,0,0.1)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
    },
    emptyIcon: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1rem'
    },
    emptyTitle: {
        fontSize: '1.25rem',
        fontWeight: 600,
        color: '#1f2937'
    },
    emptyText: {
        fontSize: '0.875rem',
        color: '#6b7280'
    },
    modalOverlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 50,
        animation: 'fadeIn 0.3s ease-out'
    },
    modal: {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderRadius: '1rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        border: '1px solid rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        padding: '1.5rem'
    },
    previewModal: {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '2rem',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        border: '1px solid rgba(255,255,255,0.2)',
        width: '100%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        animation: 'scaleIn 0.3s ease-out'
    },
    modalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
    },
    previewHeader: {
        padding: '1.5rem 2rem',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.5)'
    },
    modalTitle: {
        fontSize: '1.25rem',
        color: '#1e293b',
        fontWeight: 600,
        margin: 0
    },
    filterInput: {
        width: '100%',
        marginBottom: '1rem',
        padding: '0.5rem',
        borderRadius: '0.5rem',
        border: '1px solid rgba(0,0,0,0.1)'
    },
    checkboxContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        marginBottom: '1rem'
    },
    modalActions: {
        display: 'flex',
        gap: '0.75rem',
        marginTop: '1rem'
    },
    clearButton: {
        flex: 1,
        color: '#ef4444',
        border: '1px solid #ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.08)'
    },
    saveButton: {
        flex: 1
    },
    previewText: {
        fontSize: '0.875rem',
        color: '#6b7280',
        margin: '0.5rem 1.5rem',
        textAlign: 'center'
    },
    previewContent: {
        height: 'calc(90vh - 100px)',
        background: '#f8fafc'
    },
    previewIframe: {
        width: '100%',
        height: '100%',
        border: 'none'
    },
    previewActions: {
        display: 'flex',
        gap: '0.5rem'
    },
    downloadButton: {
        padding: '0.75rem',
        borderRadius: '0.75rem',
        background: tokens.colorBrandBackground,
        border: 'none',
        color: '#fff',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ':hover': {
            transform: 'scale(1.05)'
        }
    },
    closeButton: {
        padding: '0.75rem',
        borderRadius: '0.75rem',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        color: '#ef4444',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ':hover': {
            transform: 'scale(1.05)'
        }
    },
    actionContainer: {
        display: 'flex',
        gap: '0.5rem'
    },
    actionButton: {
        padding: '0.5rem',
        borderRadius: '0.5rem',
        backgroundColor: tokens.colorBrandBackground,
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    deleteButton: {
        padding: '0.5rem',
        borderRadius: '0.5rem',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        color: '#ef4444',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ':hover': {
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            transform: 'scale(1.05)'
        }
    },

    // Dark theme styles
    containerDark: {
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
    },
    subtitleDark: {
        fontSize: '1.1rem',
        color: '#d1d5db'
    },
    uploadCardDark: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        borderRadius: '1rem',
        padding: '1.5rem',
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        maxWidth: '500px',
        margin: '0 auto'
    },
    uploadTitleDark: {
        fontSize: '1.25rem',
        fontWeight: 600,
        marginBottom: '1rem',
        color: '#fff'
    },
    uploadAreaDark: {
        border: '2px dashed #4b5563',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        textAlign: 'center',
        cursor: 'pointer'
    },
    uploadTextDark: {
        fontWeight: 500,
        color: '#d1d5db'
    },
    fileInfoDark: {
        marginTop: '1rem',
        padding: '0.75rem',
        borderRadius: '0.5rem',
        backgroundColor: '#1f2937',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    pageSizeSelectDark: {
        padding: '0.5rem',
        borderRadius: '0.5rem',
        border: '1px solid rgba(255,255,255,0.15)',
        backgroundColor: 'rgba(31, 41, 55, 0.7)',
        color: '#e5e7eb'
    },
    searchInputDark: {
        maxWidth: '600px',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '0.75rem',
        backgroundColor: 'rgba(31, 41, 55, 0.7)',
        height: '2.5rem'
    },
    dropdownDark: {
        minWidth: '200px',
        height: '2.5rem',
        borderRadius: '0.75rem',
        border: '1px solid rgba(255,255,255,0.15)',
        backgroundColor: 'rgba(31, 41, 55, 0.7)',
        color: '#e5e7eb',
        display: 'flex',
        alignItems: 'center',
        padding: '0 0.5rem'
    },
    tagDark: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.25rem 0.5rem',
        borderRadius: '0.25rem',
        backgroundColor: '#374151',
        color: '#e5e7eb',
        fontSize: '0.875rem'
    },
    loadingContainerDark: {
        textAlign: 'center',
        padding: '3rem',
        backgroundColor: 'rgba(31, 41, 55, 0.7)',
        borderRadius: '1rem',
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
    },
    tableContainerDark: {
        backgroundColor: 'rgba(31, 41, 55, 0.7)',
        borderRadius: '1rem',
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        overflow: 'hidden'
    },
    pageInfoDark: {
        fontSize: '0.875rem',
        color: '#d1d5db'
    },
    emptyContainerDark: {
        textAlign: 'center',
        padding: '3rem',
        backgroundColor: 'rgba(31, 41, 55, 0.7)',
        borderRadius: '1rem',
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
    },
    emptyTitleDark: {
        fontSize: '1.25rem',
        fontWeight: 600,
        color: '#e5e7eb'
    },
    emptyTextDark: {
        fontSize: '0.875rem',
        color: '#9ca3af'
    },
    modalDark: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        borderRadius: '1rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        border: '1px solid rgba(255,255,255,0.15)',
        width: '100%',
        maxWidth: '400px',
        padding: '1.5rem'
    },
    previewModalDark: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '2rem',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        border: '1px solid rgba(255,255,255,0.1)',
        width: '100%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        animation: 'scaleIn 0.3s ease-out'
    },
    previewHeaderDark: {
        padding: '1.5rem 2rem',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(30, 41, 59, 0.5)'
    },
    modalTitleDark: {
        fontSize: '1.25rem',
        color: '#e2e8f0',
        fontWeight: 600,
        margin: 0
    },
    previewTextDark: {
        fontSize: '0.875rem',
        color: '#9ca3af',
        margin: '0.5rem 1.5rem',
        textAlign: 'center'
    },
    previewContentDark: {
        height: 'calc(90vh - 100px)',
        background: '#0f172a'
    },
    deleteButtonDark: {
        padding: '0.5rem',
        borderRadius: '0.5rem',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        color: '#ef4444',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ':hover': {
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            transform: 'scale(1.05)'
        }
    },
    searchAddTags: {
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        gap:'5px',
        height:'50px'
    }
});