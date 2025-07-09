import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box, Typography, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Tooltip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import styled from 'styled-components';
import { getItems, deleteListItem, updateListItem } from '../../../utils';
import JobPostingModal from './job-posting-modal';
import { generateResumeEvaluationPrompt } from '../../../utils/prompts';
import { useRecruitment } from '../../../context/RecruitmentContext';
import { JobPostingItem } from '../candidates/types';


const StyledContainer = styled(Box)`
  padding: 24px;
  background-color: #fafafa;
  min-height: 100vh;
`;

const StyledTableContainer = styled(TableContainer)`
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  background-color: #fff;
`;

const StyledTableCell = styled(TableCell)`
  font-weight: 600;
  color: #1a1a1a;
`;

const JobPosting: React.FC = () => {
  const { getRecruitmentIds } = useRecruitment()
  const [jobPostings, setJobPostings] = useState<JobPostingItem[]>([]);
  const [filteredPostings, setFilteredPostings] = useState<JobPostingItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [siteId, setSiteId] = useState<number | null | string>(null);
  const [listId, setListId] = useState<number | null | string>(null);
  const [selectedJob, setSelectedJob] = useState<JobPostingItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<number | null | string>(null);
  const [jobToDelete, setJobToDelete] = useState<number | null | string>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debounce = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async (load: boolean = true) => {
    load && setIsLoading(true);
    try {
      const siteData = await getRecruitmentIds();
      if (siteData) {
        setSiteId(siteData.siteId);
        const list = siteData.lists.find((l: any) => l.name.toLowerCase() === 'JobPosting'.toLowerCase());
        setListId(list?.id || null);

        if (siteData.siteId && list?.id) {
          const items = await getItems(siteData.siteId, list.id);
          const sortedItems = items?.fields.sort((a: any, b: any) =>
            new Date(b.fields.Created).getTime() - new Date(a.fields.Created).getTime()
          );
          const flattenedItems = sortedItems?.map((item: { id: number; fields: JobPostingItem }) => ({
            id: item.id,
            job_title: item.fields.job_title || 'No Title',
            job_description: item.fields.job_description || 'N/A',
            job_status: item.fields.job_status || 'Active',
            Created: item.fields.Created || new Date().toISOString(),
          })) || [];
          setJobPostings(flattenedItems || []);
          setFilteredPostings(flattenedItems || []);
        }
      }
    } catch (error) {
      console.error('Error fetching job postings:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getRecruitmentIds]);


    const handleChangeValue = async (item: string, value: string , id:number | string) => {
      debounce.current && clearTimeout(debounce.current);
      try {
  
        debounce.current = setTimeout(async () => {
          const CV_Library = await getRecruitmentIds();
          if (!CV_Library) return
          const siteId = CV_Library.siteId;
          const jobPostingList = CV_Library.lists.find(e => e.name === 'JobPosting');
          if (!jobPostingList) {
            throw new Error("JobPosting list not found in CV_Library.lists");
          }
          await updateListItem(siteId, jobPostingList.id, id, {
            fields: {
              [item]: value
            },
          });
          await fetchData(false);
        }, 500);
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    let filtered = jobPostings;
    if (statusFilter !== 'All') {
      filtered = filtered.filter((item) => item.job_status === statusFilter);
    }
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.job_title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredPostings(filtered);
  }, [statusFilter, searchQuery, jobPostings]);

  const handleAddJobPosting = () => {
    setIsModalOpen(true);
  };

  const handleDeleteJobPosting = async () => {
    if (!siteId || !listId || !jobToDelete) return;
    setIsUpdating(true);
    try {
      await deleteListItem(siteId, listId, jobToDelete as any);
      await fetchData(false);
    } catch (error) {
      console.error('Error deleting job posting:', error);
    } finally {
      setIsDeleteDialogOpen(false);
      setJobToDelete(null);
      setIsUpdating(false);
    }
  };

  const handleStatusToggle = async (item: JobPostingItem) => {
    if (!siteId || !listId) return;
    setIsUpdatingStatus(item.id);
    try {
      await updateListItem(siteId, listId, item.id, {
        fields: {
          job_status: item.job_status === 'Active' ? 'Inactive' : 'Active',
        },
      });
      await fetchData(false);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  return (
    <StyledContainer>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
            Job Postings
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={handleAddJobPosting}
            disabled={isLoading || isUpdating}
            sx={{
              bgcolor: 'transparent',
              borderColor: '#1976d2',
              color: '#1976d2',
              '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.04)', borderColor: '#115293' },
            }}
          >
            Add Job Posting
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Search by Job Title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ width: 300 }}
          />
          <FormControl size="small" sx={{ width: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          {isLoading && <CircularProgress size={24} />}
        </Box>

        {filteredPostings.length > 0 && !isLoading ? (
          <StyledTableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="job postings table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Job Title</StyledTableCell>
                  <StyledTableCell>Description</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPostings.map((item) => (
                  <TableRow key={item.id} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                    <TableCell>
                      <Typography
                        sx={{ cursor: 'pointer', color: '#1976d2', fontWeight: 500 }}
                        onClick={() => {
                          setSelectedJob(item);
                          setIsDialogOpen(true);
                        }}
                      >
                        {item.job_title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: '#4a4a4a' }}>
                        {item.job_description?.substring(0, 100) + (item.job_description?.length > 100 ? '...' : '')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={`Click to toggle to ${item.job_status === 'Active' ? 'Inactive' : 'Active'}`}>
                        <Chip
                          label={isUpdatingStatus === item.id ? <CircularProgress size={20} /> : item.job_status}
                          sx={{
                            fontWeight: 600,
                            color: '#fff',
                            bgcolor: item.job_status === 'Active' ? '#2e7d32' : '#d32f2f',
                            '&:hover': {
                              bgcolor: item.job_status === 'Active' ? '#1b5e20' : '#b71c1c',
                            },
                            cursor: 'pointer',
                          }}
                          onClick={() => handleStatusToggle(item)}
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        color="error"
                        onClick={() => {
                          setJobToDelete(item.id);
                          setIsDeleteDialogOpen(true);
                        }}
                        disabled={isUpdating}
                        sx={{ minWidth: 'auto', p: 1 }}
                      >
                        <Delete />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        ) : !isLoading ? (
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            No job postings available.
          </Typography>
        ) : null}

        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          sx={{
            '& .MuiDialog-paper': {
              width: '700px',
              maxWidth: '95vw',
              borderRadius: 3,
              p: 2,
              bgcolor: '#f5f5f5',
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 700,
              fontSize: '1.75rem',
              color: '#1a237e',
              pb: 2,
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            {selectedJob?.job_title || 'No Title Available'}
          </DialogTitle>

          <DialogContent sx={{ pt: 3, pb: 3 }}>
            <Typography
              variant="h6"
              sx={{ color: '#212121', fontWeight: 600, mb: 1.5 }}
            >
              Job Description
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              defaultValue={selectedJob?.job_description || 'N/A'}
              onChange={(e) => handleChangeValue('job_description', e.target.value, selectedJob?.id || '')}
              variant="outlined"
              sx={{
                mb: 3,
                '& .MuiInputBase-root': {
                  fontSize: '1rem',
                  bgcolor: '#fff',
                  borderRadius: 2,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e0e0e0',
                },
              }}
            />

            <Typography
              variant="h6"
              sx={{ color: '#212121', fontWeight: 600, mb: 1.5 }}
            >
              Screening Prompt
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: '#212121', fontWeight: 300, mb: 1.5 }}
            >
              {generateResumeEvaluationPrompt(selectedJob?.job_title || 'N/A', selectedJob?.job_description || 'N/A')}
            </Typography>
          </DialogContent>

          <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
            <Button
              onClick={() => setIsDialogOpen(false)}
              variant="contained"
              sx={{
                fontSize: '1rem',
                textTransform: 'none',
                bgcolor: '#1976d2',
                '&:hover': { bgcolor: '#1565c0' },
                px: 3,
                py: 1,
                borderRadius: 2,
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>


        <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
          <DialogTitle sx={{ fontWeight: 600 }}>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this job posting?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDeleteDialogOpen(false)} disabled={isUpdating} sx={{ color: '#1976d2' }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteJobPosting}
              disabled={isUpdating}
            >
              {isUpdating ? <CircularProgress size={20} /> : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>

        <JobPostingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          siteId={siteId}
          listId={listId}
          onSave={fetchData}
        />
      </Box>
    </StyledContainer>
  );
};

export default JobPosting;