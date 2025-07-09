import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box, Typography, Button, TextField, Tabs, Tab, CircularProgress, Chip, FormControl, InputLabel, Select, MenuItem, IconButton, LinearProgress, Tooltip
} from '@mui/material';
import { AddCircleOutline, FilterList, Check, ExpandMore, ExpandLess, PhoneOutlined, EmailOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { CvLibraryItem, JobPostingItem } from './types';
import CreateContactModal, { ContactFormData } from './create-candidate';
import { getCandidates, getItems, parseCVs, uploadCVWithMetadata, screenCv } from '../../../utils';
import { FilterModal } from './tabs/filter-modal';
import ScreeningDetails from './screening-details';
import { useRecruitment } from '../../../context/RecruitmentContext';
import InViewComponent from '../../../components/in-view';

const StyledContainer = styled(Box)`
  padding: 24px;
  margin: 0 auto;
  border-radius: 8px;
`;

const StyledCandidateCard = styled(Box)`
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  transition: box-shadow 0.2s;
  position: relative;
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const Candidates: React.FC = () => {
  const [candidates, setCandidates] = useState<CvLibraryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState<any | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<{ item: string; field: string; isClient?: boolean }[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [skipToken, setSkipToken] = useState<string | null>(null);
  const [clientPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [inViewLoading, setInViewLoading] = useState(false);
  const [selectedScreenPosition, setSelectedScreenPosition] = useState<string>('');
  const [jobs, setJobs] = useState<JobPostingItem[]>([]);
  const [screeningFilter, setScreeningFilter] = useState<'all' | 'screened' | 'unscreened'>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<CvLibraryItem | null>(null);
  const [isScreeningModalOpen, setIsScreeningModalOpen] = useState(false);
  const [expandedTags, setExpandedTags] = useState<{ [key: string]: boolean }>({});
  const [inLineProgress, setInlineProgress] = useState<{ tags?: null | number | string, inView?: boolean, load?: boolean, screening?: number | null }>({ inView: false, tags: null, load: true, screening: null });
  const pageSize = 500;
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const { getRecruitmentIds } = useRecruitment()

  const handleScreenCVs = async (selectedCV: CvLibraryItem) => {
    if (!selectedCV) return;
    try {
      setInlineProgress({ screening: selectedCV.id as any });
      const CV_Library = await getRecruitmentIds();
      if (!CV_Library) return
      const position = jobs?.find((data) => data.job_title.toLowerCase() === selectedScreenPosition.toLowerCase());
      let status: { status: boolean } | null = null;
      if (position?.job_title && position?.job_description) {
        const CvLibraryListId = CV_Library.lists.find(e => e.name === 'CvLibrary')?.id ?? '';
        status = await screenCv(selectedCV.downloadUrl, CV_Library?.siteId, CvLibraryListId, selectedCV?.id as any, position.job_title, position.job_description, selectedCV.screen_results, selectedCV.screen_status);
      }
      if (status?.status) await loadCandidates(false)
    } catch (error) {
      console.error('Error screening CVs:', error);
    } finally {
      setInlineProgress({ screening: null });
    }
  };

  const loadCandidates = async (load: boolean = true, token: string | null = null, append: boolean = false) => {
    try {
      load && setLoading(true);
      const IDs = await getRecruitmentIds();
      if (!IDs) return
      const response = await getCandidates(
        IDs?.siteId,
        IDs?.lists.find(e => e.name === 'CvLibrary')?.id ?? '',
        pageSize,
        token,
        filters
      );
      const jobs = await getItems(IDs?.siteId, IDs?.lists.find(e => e.name === 'JobPosting')?.id ?? '');
      const flattenedItems: CvLibraryItem[] = response?.items?.map((item: any) => ({
        id: item.id,
        first_name: item.fields.first_name,
        last_name: item.fields.last_name,
        email: item.fields.email,
        phone_number: item.fields.phone_number,
        job_title: item.fields.job_title,
        candidate_stages: item.fields.candidate_stages ? JSON.parse(item.fields.candidate_stages) : [],
        current_salary: item.fields.current_salary,
        expected_salary: item.fields.expected_salary,
        years_of_experience: item.fields.years_of_experience,
        communication_skill: item.fields.communication_skill ? JSON.parse(item.fields.communication_skill) : [],
        city: item.fields.city,
        source: item.fields.source,
        notes: item.fields.notes ? JSON.parse(item.fields.notes) : [],
        tags: item.fields.tags ? JSON.parse(item.fields.tags) : [],
        screen_results: item.fields.screen_results ? JSON.parse(item.fields.screen_results) : [],
        screen_status: item.fields.screen_status ? JSON.parse(item.fields.screen_status) : [],
        downloadUrl: item.driveItem?.['@microsoft.graph.downloadUrl'],
        webUrl: item.driveItem?.webUrl,
        Created: item?.fields.Created || ''
      })) || [];

      const flatJobs = jobs?.fields?.map((item: { id: number | string, fields: JobPostingItem }) => ({
        id: item.id,
        job_title: item.fields?.job_title || 'not-defined',
        job_status: item.fields?.job_status,
        job_description: item.fields?.job_description || 'JD',
      })) || [];

      const sortedItems = flattenedItems.sort((a, b) => {
        const dateA = new Date(a.Created).getTime();
        const dateB = new Date(b.Created).getTime();
        return dateB - dateA;
      });

      setCandidates((prev) => (append ? [...prev, ...sortedItems] : sortedItems));
      setJobs(flatJobs);
      setSkipToken(response?.nextSkipToken || null);
      setHasNextPage(!!response?.nextSkipToken);
    } catch (error) {
      console.error('Error loading candidates:', error);
    } finally {
      setLoading(false);
      setInViewLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, [filters]);

  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(null), 1000);
    }
  }, [copied]);

  useEffect(() => {
    setPage(1);
  }, [clientPageSize, filters, tabValue]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);


  const filteredCandidates = useMemo(() => {
    let filtered = candidates || [];

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(e =>
      (e.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.email?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (tabValue === 1 && selectedScreenPosition) {
      filtered = filtered.filter(candidate => {
        if (screeningFilter === 'screened') {
          return candidate.screen_status.includes(selectedScreenPosition);
        } else if (screeningFilter === 'unscreened') {
          return !candidate.screen_status.includes(selectedScreenPosition);
        }
        return true;
      }).sort((a, b) => {
        if (screeningFilter === 'screened') {
          const aScore = a.screen_results.find((p: any) => p.position === selectedScreenPosition)?.screenedData?.['Total Score']?.find((s: string) => s.includes('Weighted Average Total Score'))?.split(': ')[1] || 0;
          const bScore = b.screen_results.find((p: any) => p.position === selectedScreenPosition)?.screenedData?.['Total Score']?.find((s: string) => s.includes('Weighted Average Total Score'))?.split(': ')[1] || 0;
          return parseFloat(bScore) - parseFloat(aScore);
        }
        return 0;
      });
    }

    return filtered;
  }, [candidates, searchTerm, tabValue, selectedScreenPosition, screeningFilter]);

  const paginatedCandidates = useMemo(() => {
    const startIndex = (page - 1) * clientPageSize;
    const endIndex = startIndex + clientPageSize;
    return filteredCandidates?.slice(startIndex, endIndex) || [];
  }, [page, clientPageSize, filteredCandidates]);

  const totalPages = Math.ceil((filteredCandidates?.length || 0) / clientPageSize);
  const isLastClientPage = page >= totalPages;
  const showPagination = (filteredCandidates?.length || 0) > clientPageSize;

  const handleClearFilters = () => {
    setFilters([]);
    setScreeningFilter('all');
  };

  const handleDeleteFilter = (index: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== index));
  };

  const handleScreeningModalOpen = (candidate: CvLibraryItem) => {
    setSelectedCandidate(candidate);
    setIsScreeningModalOpen(true);
  };

  const handleScreeningModalClose = () => {
    setSelectedCandidate(null);
    setIsScreeningModalOpen(false);
  };

  const toggleTags = (candidateId: string) => {
    setExpandedTags((prev) => ({
      ...prev,
      [candidateId]: !prev[candidateId],
    }));
  };

  const handleInView = () => {
    if (hasNextPage && !inViewLoading && isLastClientPage) {
      setInViewLoading(true);
      loadCandidates(true, skipToken, true);
    }
  };

  const [createContactOpen, setCreateContactOpen] = useState(false)

  const handleCreateContact = async (contactData: ContactFormData) => {
    const CV_Library = await getRecruitmentIds();
    if (!CV_Library) return;
    await uploadCVWithMetadata(
      CV_Library.siteId,
      CV_Library.lists.find(e => e.name === 'CvLibrary')?.id || '',
      contactData.cv!,
      {
        firstname: contactData.firstname,
        lastname: contactData.lastname,
        email: contactData.email,
        phone: contactData.phone || "",
        job_Title: contactData.jobtitle || "",
        campaign: contactData.campaign || "",
        currentsalary: contactData.currentsalary || "",
        expectedsalary: contactData.expectedsalary || "",
        yearofexperience: contactData.yearsofexperience || '',
        city: contactData.city || "",
        Communication_Skills: contactData.Communication_Skills ? JSON.stringify([contactData.Communication_Skills]) : null
      }
    );
    loadCandidates()
  }


  return (
    <StyledContainer sx={{ fontSize: '16px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#212121' }}>
          Candidate Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setIsFilterModalOpen(true)}
            sx={{ textTransform: 'none', backgroundColor: 'white' }}
          >
            Filter
          </Button>
          <Button
            variant="contained"
            startIcon={<AddCircleOutline />}
            onClick={() => setCreateContactOpen(true)}
          >
            Add Candidate
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 2 }}>
        <TextField
          label="Search by Name, Email ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ background: 'white', flex: 1, maxWidth: '400px' }}
        />
        {tabValue === 1 && (
          <Box sx={{ display: 'flex', gap: 2, ml: 2 }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="job-filter-label">Select Job</InputLabel>
              <Select
                labelId="job-filter-label"
                value={selectedScreenPosition}
                onChange={(e) => setSelectedScreenPosition(e.target.value)}
                label="Select Job"
              >
                <MenuItem value="">
                  <em>Select Job</em>
                </MenuItem>
                {jobs?.map(job => (
                  <MenuItem key={job.job_title} value={job.job_title}>{job.job_title}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedScreenPosition && (
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="screening-filter-label">Screening Status</InputLabel>
                <Select
                  labelId="screening-filter-label"
                  value={screeningFilter}
                  onChange={(e) => setScreeningFilter(e.target.value as 'all' | 'screened' | 'unscreened')}
                  label="Screening Status"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="screened">Screened</MenuItem>
                  <MenuItem value="unscreened">Unscreened</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
        )}
      </Box>

      {filters.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', my: 2 }}>
          {filters.map((filter, index) => (
            <Chip
              key={index}
              label={`${filter.field === 'Job_Title' ? 'Job' : filter.field === 'Candidate_Stage' ? 'Stage' : 'Tag'}: ${filter.item}`}
              onDelete={() => handleDeleteFilter(index)}
              size="small"
              sx={{ bgcolor: '#eff6ff', color: '#1e40af', fontWeight: 500 }}
            />
          ))}
          <Button
            variant="text"
            onClick={handleClearFilters}
            sx={{ textTransform: 'none', color: '#1976d2', fontWeight: 600 }}
          >
            Clear Filters
          </Button>
        </Box>
      )}
      <Tabs
        value={tabValue}
        onChange={(_, newValue) => setTabValue(newValue)}
        sx={{ mb: 2, borderBottom: '1px solid #e0e0e0' }}
      >
        <Tab label="General" sx={{ textTransform: 'none', fontWeight: 600 }} />
        <Tab label="Initial Screening" sx={{ textTransform: 'none', fontWeight: 600 }} />
      </Tabs>
      {isScreeningModalOpen && selectedCandidate && (
        <ScreeningDetails
          candidate={selectedCandidate}
          position={selectedScreenPosition}
          onClose={handleScreeningModalClose}
        />
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress />
          </Box>
        ) : tabValue === 1 && !selectedScreenPosition ? (
          <Typography variant="h6" sx={{ textAlign: 'center', my: 4, color: '#616161' }}>
            Please select a job to view candidates
          </Typography>
        ) : paginatedCandidates?.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: 'center', my: 4, color: '#616161' }}>
            No candidates found
          </Typography>
        ) : (
          paginatedCandidates?.map((candidate) => (
            <StyledCandidateCard key={candidate.id}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: '#212121' }}
                  >
                    {[candidate.first_name, candidate.last_name]
                      .filter(Boolean)
                      .map(name =>
                        name
                          .split(' ')
                          .map(
                            word =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase()
                          )
                          .join(' ')
                      )
                      .join(' ')
                    }
                  </Typography>
                  {
                    tabValue === 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'flex-end' }}>
                        <Tooltip title={copied !== candidate.phone_number ? (candidate.phone_number || 'Not Provided') : 'Copied'}>
                          <IconButton
                            onClick={() => {
                              if (candidate.phone_number) {
                                navigator.clipboard.writeText(candidate.phone_number);
                                setCopied(candidate.phone_number);
                              }
                            }}
                            disabled={!candidate.phone_number}
                            sx={{ p: 0.5 }}
                          >
                            {copied === candidate.phone_number ? <Check /> : <PhoneOutlined />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={copied !== candidate.email ? (candidate.email || 'Not Provided') : 'Copied'}>
                          <IconButton
                            onClick={() => {
                              if (candidate.email) {
                                navigator.clipboard.writeText(candidate.email);
                                setCopied(candidate.email);
                              }
                            }}
                            disabled={!candidate.email}
                            sx={{ p: 0.5 }}
                          >
                            {copied === candidate.email ? <Check /> : <EmailOutlined />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )
                  }
                  {tabValue === 1 && selectedScreenPosition && (
                    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                      {candidate.screen_results.find((p: any) => p.position === selectedScreenPosition) ? (
                        <Chip
                          label={`Score: ${candidate.screen_results.find((p: any) => p.position === selectedScreenPosition)?.screen_results?.['Total Score']?.find((s: string) => s.includes('Weighted Average Total Score'))?.split(': ')[1] || 'N/A'}`}
                          sx={{ bgcolor: '#2e7d32', color: '#fff', fontWeight: 600 }}
                        />
                      ) : (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleScreenCVs(candidate)}
                          sx={{ fontSize: 12, padding: '4px 8px', textTransform: 'none' }}
                          disabled={inLineProgress.screening === candidate.id}
                        >
                          {inLineProgress.screening !== candidate.id ? `Screen for ${selectedScreenPosition}` : 'Screening...'}
                        </Button>
                      )}
                    </Box>
                  )}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" sx={{ color: '#424242' }}>
                    <strong>Job Applied:</strong> {candidate.job_title}
                  </Typography>
                  {tabValue === 1 && selectedScreenPosition && candidate.screen_status.includes(selectedScreenPosition) && (
                    <Typography
                      variant="subtitle2"
                      sx={{ color: '#1976d2', fontWeight: 200, textTransform: 'none', px: 0, width: 'fit-content', cursor: 'pointer', ":hover": { textDecoration: 'underline' } }}
                      onClick={() => handleScreeningModalOpen(candidate)}
                    >
                      View Screening
                    </Typography>
                  )}
                  {candidate.tags && candidate.tags.length > 0 ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                      {candidate.tags.slice(0, expandedTags[candidate.id] ? candidate.tags.length : 7).map((e) => (
                        <Chip
                          key={e}
                          label={e}
                          size="small"
                          sx={{
                            bgcolor: '#eff6ff',
                            color: '#1e40af',
                            fontWeight: 500,
                            fontSize: 12,
                            borderRadius: '16px',
                          }}
                        />
                      ))}
                      {candidate.tags.length > 7 && (
                        <IconButton
                          size="small"
                          onClick={() => toggleTags(candidate.id as any)}
                          sx={{ color: '#1e40af', p: 0.5 }}
                        >
                          {expandedTags[candidate.id] ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      )}
                    </Box>
                  ) : inLineProgress.tags !== candidate.id ? (
                    <Typography
                      variant="subtitle2"
                      sx={{ color: '#1976d2', fontWeight: 200, textTransform: 'none', px: 0, width: 'fit-content', cursor: 'pointer', ":hover": { textDecoration: 'underline' } }}
                      onClick={async () => {
                        try {
                          if (!candidate.downloadUrl) return;
                          setInlineProgress({ tags: candidate.id });
                          const IDs = await getRecruitmentIds();
                          if (!IDs) return;
                          const status = await parseCVs(
                            candidate?.downloadUrl,
                            IDs.siteId,
                            IDs.lists.find(e => e.name === 'CvLibrary')?.id || '',
                            candidate.id
                          );
                          if (status) loadCandidates(false);
                          setInlineProgress(prev => ({ ...prev, load: false }));
                        } catch (error) {
                          console.error(error);
                        } finally {
                          setInlineProgress({ tags: null });
                        }
                      }}
                    >
                      Generate Tags
                    </Typography>
                  ) : (
                    <LinearProgress sx={{ width: '25%' }} />
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-start' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ height: '30px', fontSize: '11px' }}
                    disabled={!candidate.downloadUrl}
                    onClick={() => candidate?.webUrl && window.open(candidate.webUrl, '_blank')}
                  >
                    Preview CV
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ height: '30px', fontSize: '11px' }}
                    disabled={!candidate.downloadUrl}
                    onClick={() => candidate?.downloadUrl && window.open(candidate.downloadUrl, '_blank')}
                  >
                    Download CV
                  </Button>
                  <Link to={`/admin/user/${candidate.id}`}>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ height: '30px', fontSize: '11px' }}
                    >
                      View
                    </Button>
                  </Link>
                </Box>
              </Box>
            </StyledCandidateCard>
          ))
        )}
      </Box>
      {(!showPagination && hasNextPage && !inViewLoading) && (
        <InViewComponent onInView={handleInView} />
      )}
      {inViewLoading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 3, justifyContent: 'center' }}>
          <LinearProgress sx={{ width: '200px' }} />
          <Typography variant="body2" sx={{ color: '#424242' }}>
            Waiting, more CVs loading...
          </Typography>
        </Box>
      )}
      {showPagination && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, my: 3 }}>
          <Button
            disabled={page === 1 || loading}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Previous
          </Button>
          <Typography sx={{ color: '#424242' }}>
            Page {page} of {totalPages}
          </Typography>
          <Button
            disabled={(page === totalPages && !hasNextPage) || loading}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </Box>
      )}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={(e) => {
          const { jobTitle, stageName, tags } = e;
          const filters: { field: string; item: string; isClient?: boolean }[] = [];

          if (jobTitle) {
            filters.push({
              field: 'job_title',
              item: jobTitle,
              isClient: false,
            });
          }
          if (stageName) {
            filters.push({
              field: 'candidate_stages',
              item: stageName,
              isClient: true,
            });
          }
          if (tags && tags.length > 0) {
            tags.forEach((tag) => {
              filters.push({
                field: 'tags',
                item: tag,
                isClient: true,
              });
            });
          }

          setFilters(filters);
        }}
      />
      {/* {
        createContactOpen && ( */}
      <CreateContactModal
        isOpen={createContactOpen}
        onClose={() => setCreateContactOpen(false)}
        onSubmit={handleCreateContact}
        theme={'light'}
      />
      {/* 
        )
      } */}

    </StyledContainer>
  );
};

export default Candidates;