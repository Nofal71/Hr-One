import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import CandidateStages from './tabs/candidate-stages';
import CustomTags from './tabs/tag';
import CommunicationSkills from './tabs/communication-skills';

interface SettingsProps {
  theme: 'light' | 'dark';
}

const Settings: React.FC<SettingsProps> = ({ theme }) => {
  const [selectedTab, setSelectedTab] = useState('filter');

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: theme === 'dark' ? '#121212' : '#f5f5f5',
        minHeight: '100vh',
        color: theme === 'dark' ? '#fff' : '#000',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 1,
          color: theme === 'dark' ? '#fff' : '#1976d2',
        }}
      >
        Platform Settings
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          mb: 4,
          color: theme === 'dark' ? '#b0b0b0' : '#555',
        }}
      >
        Configure your CV Screening Platform settings and preferences
      </Typography>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        sx={{
          mb: 4,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
            color: theme === 'dark' ? '#b0b0b0' : '#555',
            '&.Mui-selected': {
              color: theme === 'dark' ? '#fff' : '#1976d2',
            },
          },
          '& .MuiTabs-indicator': {
            backgroundColor: theme === 'dark' ? '#fff' : '#1976d2',
          },
        }}
      >
        <Tab label="Resume Filter Settings" value="filter" />
        <Tab label="Candidate Stages" value="stages" />
        <Tab label="Communication Skills" value="skill" />
      </Tabs>
      <Box
        sx={{
          p: 3,
          bgcolor: theme === 'dark' ? '#1e1e1e' : '#fff',
          borderRadius: 2,
          boxShadow: theme === 'dark' ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        {selectedTab === 'filter' && <CustomTags />}
        {selectedTab === 'stages' && <CandidateStages />}
        {selectedTab === 'skill' && <CommunicationSkills />}
      </Box>
    </Box>
  );
};

export default Settings;