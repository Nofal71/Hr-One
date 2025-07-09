import React from 'react';
import { Button } from '@fluentui/react-components';
import { Download, X } from 'lucide-react';
import { useStyles } from './styles';
import { DocPreviewProps } from './types';

const DocPreview: React.FC<DocPreviewProps> = ({ theme, CV, setPreviewOpen }) => {
    const styles = useStyles();

    return (
        <div className={styles.modalOverlay}>
            <div className={theme === 'dark' ? styles.previewModalDark : styles.previewModal}>
                <div className={theme === 'dark' ? styles.previewHeaderDark : styles.previewHeader}>
                    <h3 className={theme === 'dark' ? styles.modalTitleDark : styles.modalTitle}>
                        {CV?.candidateName || 'CV Preview'}
                    </h3>
                    <div className={styles.previewActions}>
                        <button
                            onClick={() => CV?.downloadUrl && window.open(CV.downloadUrl, '_blank')}
                            className={styles.downloadButton}
                            title="Download"
                            disabled={!CV?.downloadUrl}
                        >
                            <Download size={20} />
                        </button>
                        <Button
                            appearance="subtle"
                            onClick={() => setPreviewOpen(false)}
                            className={styles.closeButton}
                            title="Close"
                        >
                            <X size={20} />
                        </Button>
                    </div>
                </div>
                {CV?.downloadUrl ? (
                    <div className={theme === 'dark' ? styles.previewContentDark : styles.previewContent}>
                        <iframe
                            src={CV.downloadUrl}
                            title="CV Preview"
                            className={styles.previewIframe}
                        />
                    </div>
                ) : (
                    <p className={theme === 'dark' ? styles.previewTextDark : styles.previewText}>
                        No preview available. Please download the CV to view it.
                    </p>
                )}
            </div>
        </div>
    );
};

export default DocPreview;