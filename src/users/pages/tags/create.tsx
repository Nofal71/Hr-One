import React, { useState } from 'react';
import { Button, Input } from '@fluentui/react-components';
import { X } from 'lucide-react';
import { createListItem } from '../../../utils';
import { useSites } from '../../../context/SitesContext';

interface CreateTagsProps {
    theme: string;
    setIsCreateTagsOpen: (open: boolean) => void;
}

const CreateTags: React.FC<CreateTagsProps> = ({ theme, setIsCreateTagsOpen }) => {

    const { getSiteIds } = useSites()
    const [text, setText] = useState<string>('')

    const handleAddTag = async () => {
        if (text === '') return
        try {
            const IDs = await getSiteIds('HRRecruitment', ['Tags']);
            await createListItem(IDs.siteId, IDs.lists[0].id, {
                fields: {
                    Tag: text
                }
            })
            setIsCreateTagsOpen(false)
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1001,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '5vh'
        }}>
            <div style={{
                background: theme === 'dark' ? '#333' : '#fff',
                borderRadius: '8px',
                maxWidth: '500px',
                width: '100%',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    borderBottom: theme === 'dark' ? '1px solid #444' : '1px solid #e0e0e0'
                }}>
                    <h3 style={{
                        margin: 0,
                        color: theme === 'dark' ? '#fff' : '#000',
                        fontSize: '18px'
                    }}>
                        Add New Tag
                    </h3>
                    <Button
                        appearance="subtle"
                        onClick={() => setIsCreateTagsOpen(false)}
                        style={{ minWidth: 'auto', padding: '4px' }}
                    >
                        <X size={20} />
                    </Button>
                </div>
                <div style={{ padding: '20px' }}>
                    <Input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter new tag..."
                        style={{
                            width: '100%',
                            marginBottom: '20px',
                            padding: '8px',
                            borderRadius: '4px',
                            border: theme === 'dark' ? '1px solid #555' : '1px solid #ccc'
                        }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <Button
                            appearance="subtle"
                            onClick={() => setIsCreateTagsOpen(false)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '4px',
                                color: theme === 'dark' ? '#fff' : '#000',
                                background: 'transparent',
                                border: theme === 'dark' ? '1px solid #555' : '1px solid #ccc'
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddTag}
                            appearance="primary"
                            style={{
                                padding: '8px 16px',
                                borderRadius: '4px',
                                color: '#fff',
                                border: 'none'
                            }}
                        >
                            {/* Add Tag */}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateTags;