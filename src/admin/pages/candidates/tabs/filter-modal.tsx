import React, { useEffect, useState } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import '../styles.css';
import { getItems } from '../../../../utils';
import { Job, Stage, Tag } from '../types';
import { useRecruitment } from '../../../../context/RecruitmentContext';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: { jobTitle: string | null; stageName: string | null; tags: string[] }) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApply }) => {
  const [jobTitle, setJobTitle] = useState<string | null>(null);
  const [stageName, setStageName] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [progress, setProgress] = useState<boolean>(false);
  const { getRecruitmentIds } = useRecruitment()

  const loadFilters = async () => {
    try {
      setProgress(true);
      const Site = await getRecruitmentIds();
      const siteId = Site?.siteId || '';
      if(!Site) return
      const stagesId = Site.lists.find((list) => list.name === 'candidate_stages')?.id || '';
      const tagsId = Site.lists.find((list) => list.name === 'Tags')?.id || '';
      const jobsId = Site.lists.find((list) => list.name === 'JobPosting')?.id || '';
      const stages = await getItems(siteId, stagesId);
      const tags = await getItems(siteId, tagsId);
      const jobs = await getItems(siteId, jobsId);
      const flatStages = stages?.fields.map((item: any) => ({
        id: item.id,
        Title: item.fields?.Title || 'not-defined',
        ...item
      }));
      const flatTags = tags?.fields.map((item: any) => ({
        id: item.id,
        Title: item.fields?.Title || 'not-defined',
        ...item
      }));
      const flatJobs = jobs?.fields.map((item: any) => ({
        id: item.id,
        Title: item.fields?.job_title || 'not-defined',
        Status: item.fields?.job_status,
        ...item
      }));
      setStages(flatStages);
      setJobs(flatJobs.filter((e: any) => e.Status?.toLowerCase() !== 'Inactive'));
      setTags(flatTags || []);
    } catch (error) {
      console.error(error);
    } finally {
      setProgress(false);
    }
  };

  useEffect(() => {
    loadFilters();
  }, []);

  const handleApply = () => {
    onApply({  jobTitle, stageName, tags: selectedTags });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Filter Candidates</DialogTitle>
      <DialogContent>
        {progress ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <Box className="filter-form">
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel id="job-filter-label">Job Applied</InputLabel>
              <Select
                labelId="job-filter-label"
                value={jobTitle || ''}
                onChange={(e) => setJobTitle(e.target.value ? e.target.value : null)}
                label="Job Applied"
              >
                <MenuItem value="">All</MenuItem>
                {jobs.map(job => (
                  <MenuItem key={job?.id} value={job.Title}>{job.Title}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel id="stage-filter-label">Stage</InputLabel>
              <Select
                labelId="stage-filter-label"
                value={stageName || ''}
                onChange={(e) => setStageName(e.target.value ? e.target.value : null)}
                label="Stage"
              >
                <MenuItem value="">All</MenuItem>
                {stages.map(stage => (
                  <MenuItem key={stage.id} value={stage.Title}>{stage.Title}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel id="tag-filter-label">Tags</InputLabel>
                <Select
                labelId="tag-filter-label"
                multiple
                value={selectedTags}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedTags(Array.isArray(value) ? value : []);
                }}
                renderValue={(selected) => (
                  <Box className="tag-filter">
                  {(selected as string[]).map(title => (
                    <span key={title} className="tag-chip">{title}</span>
                  ))}
                  </Box>
                )}
                label="Tags"
                >
                {tags.map(tag => (
                  <MenuItem key={tag.id} value={tag.Title}>{tag.Title}</MenuItem>
                ))}
                </Select>
            </FormControl>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleApply} variant="contained" color="primary" disabled={progress}>Apply</Button>
        <Button onClick={onClose} variant="outlined" disabled={progress}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};