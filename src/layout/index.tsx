import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Nav, Stack, IconButton, type IStackTokens, type INavLink } from '@fluentui/react';
import { navStyles, headerStyles, contentStyles, drawerButtonStyles } from './styles';
import type { SidebarItem } from './types';
import { Menu, X } from 'lucide-react';
import { Logout } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const initialItems: SidebarItem[] = [
    // { name: 'Parse & Upload', icon: 'Home', path: '/admin/resume' },
    { name: 'Home', icon: 'Home', path: '/admin' },
    { name: 'Job Posting', icon: 'Home', path: '/admin/job-posting' },
    { name: 'Candidates', icon: 'candidates', path: '/admin/candidates' },
    { name: 'Settings', icon: 'Settings', path: '/admin/settings' },
];

const stackTokens: IStackTokens = { childrenGap: 8 };

const AdminAppLayout: React.FC = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);
    const navigate = useNavigate();
    const {logout} = useAuth()

    const navLinks: INavLink[] = initialItems.map(item => ({
        key: item.path,
        name: item.name,
        iconProps: { iconName: item.icon },
        url: item.path,
        onClick: (ev?: React.MouseEvent<HTMLElement>) => {
            ev?.preventDefault();
            navigate(item.path);
        },
    }));

    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

    return (
        <>
            <Stack horizontal tokens={stackTokens} styles={{ root: { height: '100vh', overflow: 'hidden' } }}>
                <Stack.Item styles={isDrawerOpen ? navStyles : { root: { width: 0, overflow: 'hidden' } }}>
                    <Stack>
                        <Nav
                            groups={[{ links: navLinks }]}
                            styles={{
                                root: { paddingTop: 16 },
                                link: { padding: '8px 16px', fontSize: 15, color: 'black' },
                                chevronIcon: { color: '#0078d4' },
                            }}
                        />
                        <IconButton
                            iconProps={{ iconName: 'Cancel' }}
                            onClick={toggleDrawer}
                            styles={drawerButtonStyles}
                            title="Close navigation"
                            ariaLabel="Close navigation"
                        />
                    </Stack>
                </Stack.Item>
                <Stack.Item grow>
                    <Stack horizontal tokens={stackTokens} styles={headerStyles}>
                        <IconButton
                            onClick={toggleDrawer}
                            styles={{ root: { marginLeft: '8px', borderRadius: '8px', backgroundColor: '#f0f0f0', width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' } }}
                            title={isDrawerOpen ? 'Collapse navigation' : 'Expand navigation'}
                            ariaLabel={isDrawerOpen ? 'Collapse navigation' : 'Expand navigation'}
                        >
                            {isDrawerOpen ? <X size={20} /> : <Menu size={20} />}
                        </IconButton>
                        <Stack.Item grow>
                            <h2 style={{ margin: 0, padding: '0 16px', color: '#333', lineHeight: '48px', fontSize: '24px', fontWeight: '600', fontFamily: 'Arial, sans-serif' }}>
                                TalentOne Portal
                            </h2>
                        </Stack.Item>
                        <IconButton
                            onClick={logout}
                            styles={{ root: { marginLeft: '8px', borderRadius: '8px', backgroundColor: '#f0f0f0', width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' } }}
                        >
                            <Logout />
                        </IconButton>
                    </Stack>
                    <div style={contentStyles}>
                        <Outlet />
                    </div>
                </Stack.Item>
            </Stack>
        </>
    );
};

export default AdminAppLayout;