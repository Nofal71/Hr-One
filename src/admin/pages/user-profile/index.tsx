import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Button, Chip, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl,
  styled, IconButton,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
} from '@mui/material';
import { ArrowBack, NoteAdd, Delete } from '@mui/icons-material';
import axiosInstance from '../../../axiosInstance';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getItems, updateListItem } from '../../../utils';
import { useRecruitment } from '../../../context/RecruitmentContext';
import { CvLibraryItem, Job, Note, Stage } from '../candidates/types';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WorkIcon from '@mui/icons-material/Work';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface UserProfileProps {
  onBack?: () => void;
}

const StyledCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const StyledChip = styled(Chip)`
  border-radius: 12px;
  font-weight: 500;
`;

const StyledSelect = styled(Select)`
  .MuiSelect-select {
    padding: 8px 32px 8px 12px;
    border-radius: 8px;
  }
`;

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link'],
    ['clean'],
  ],
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet',
  'link',
];

const UserProfile: React.FC<UserProfileProps> = ({ onBack }) => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<CvLibraryItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [noteModalOpen, setNoteModalOpen] = useState<boolean>(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false);
  const [deleteNoteIndex, setDeleteNoteIndex] = useState<number | null>(null);
  const [noteModalMode, setNoteModalMode] = useState<'create' | 'edit'>('create');
  const [currentNoteText, setCurrentNoteText] = useState<string>('');
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number | null>(null);
  const [isSavingNote, setIsSavingNote] = useState<boolean>(false);
  const [isDeletingNote, setIsDeletingNote] = useState<boolean>(false);
  const [isLoadingStage, setIsLoadingStage] = useState<boolean>(false);
  const [isLoadingSkills, setIsLoadingSkills] = useState<boolean>(false);
  const [isLoadingCampaign, setIsLoadingCampaign] = useState<boolean>(false);
  const [skills, setSkills] = useState<any[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const quillRef = useRef<ReactQuill | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const { getRecruitmentIds } = useRecruitment()
  const [activeTab, setActiveTab] = useState(0);
  const debounce = useRef<NodeJS.Timeout | null>(null);

  const loadData = async (load: boolean = true) => {
    try {
      load && setLoading(true);
      setError(null);
      const CV_Library = await getRecruitmentIds();
      if (!CV_Library) return
      const siteId = CV_Library.siteId;
      const cvLibraryList = CV_Library.lists.find(e => e.name === 'CvLibrary');
      if (!cvLibraryList) {
        throw new Error("CvLibrary list not found in CV_Library.lists");
      }
      const listId = cvLibraryList.id;
      const response = await axiosInstance.get(`/sites/${siteId}/lists/${listId}/items/${id}`, {
        params: { expand: 'fields,driveItem' },
      });
      const flattenedItems: CvLibraryItem = {
        id: response?.data?.id,
        first_name: response?.data?.fields?.first_name,
        last_name: response?.data?.fields?.last_name,
        email: response?.data?.fields?.email,
        phone_number: response?.data?.fields?.phone_number,
        job_title: response?.data?.fields?.job_title,
        candidate_stages: response?.data?.fields?.candidate_stages ? JSON.parse(response.data.fields.candidate_stages as any) : [],
        current_salary: response?.data?.fields?.current_salary,
        expected_salary: response?.data?.fields?.expected_salary,
        years_of_experience: response?.data?.fields?.years_of_experience,
        communication_skill: response?.data?.fields?.communication_skill ? JSON.parse(response.data.fields.communication_skill as any) : [],
        city: response?.data?.fields?.city,
        source: response?.data?.fields?.source,
        notes: response?.data?.fields?.notes0 ? JSON.parse(response.data.fields.notes0 as any) : [],
        tags: response?.data?.fields?.tags ? JSON.parse(response.data.fields.tags as any) : [],
        screen_results: response?.data?.fields?.screen_results ? JSON.parse(response.data.fields.screen_results as any) : [],
        screen_status: response?.data?.fields?.screen_status ? JSON.parse(response.data.fields.screen_status as any) : [],
        downloadUrl: response?.data?.driveItem?.['@microsoft.graph.downloadUrl'],
        webUrl: response?.data?.driveItem?.webUrl,
        Created: response?.data?.fields?.Created || ''
      };
      setData(flattenedItems);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to load user profile. Please try again later.');
    } finally {
      setLoading(false);
    }
  };


  const loadRecuitmentData = async () => {
    try {
      const Site = await getRecruitmentIds();
      const siteId = Site?.siteId || '';
      if (!Site) return
      const stagesId = Site.lists.find((list) => list.name === 'candidate_stages')?.id || '';
      const skillIds = Site.lists.find((list) => list.name === 'communication_skills')?.id || '';
      const jobsId = Site.lists.find((list) => list.name === 'JobPosting')?.id || '';
      const stages = await getItems(siteId, stagesId);
      const skills = await getItems(siteId, skillIds);
      const jobs = await getItems(siteId, jobsId);
      const flatStages = stages?.fields.map((item: any) => ({
        id: item.id,
        Title: item.fields?.Title || 'not-defined',
        ...item
      }));
      const flatSkills = skills?.fields.map((item: any) => ({
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
      setSkills(flatSkills || []);
    } catch (error) {

    }
  }

  const handleChangeValue = async (item: string, value: string) => {
    if (!id) return;
    debounce.current && clearTimeout(debounce.current);
    try {

      debounce.current = setTimeout(async () => {
        const CV_Library = await getRecruitmentIds();
        if (!CV_Library) return
        const siteId = CV_Library.siteId;
        const cvLibraryList = CV_Library.lists.find(e => e.name === 'CvLibrary');
        if (!cvLibraryList) {
          throw new Error("CvLibrary list not found in CV_Library.lists");
        }
        await updateListItem(siteId, cvLibraryList.id, id, {
          fields: {
            [item]: value
          },
        });
        await loadData(false);
      }, 500);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again later.');
    }
  };

  useEffect(() => {
    if (id) {
      loadData();
      loadRecuitmentData()
    }
  }, [id]);

  useEffect(() => {
    try {
      const parsedNotes = data?.notes
      if (
        Array.isArray(parsedNotes) &&
        parsedNotes.every(note => note.text && note?.createdAt && note?.updatedAt)
      ) {
        setNotes(parsedNotes);
      } else {
        setNotes([]);
      }
    } catch (e) {
      setNotes([]);
    }
  }, [data]);

  const getFirstLine = (html: string): string => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.split('\n')[0].trim() || 'No content';
  };

  const openEditNote = (index: number, text: string) => {
    setNoteModalMode('edit');
    setCurrentNoteIndex(index);
    setCurrentNoteText(text);
    setNoteModalOpen(true);
    setTimeout(() => {
      quillRef.current?.focus();
    }, 0);
  };

  const openCreateNote = () => {
    const lastNote = notes[notes.length - 1];
    setNoteModalMode('create');
    setCurrentNoteIndex(null);
    setCurrentNoteText(lastNote?.text || '');
    setNoteModalOpen(true);
    setTimeout(() => {
      quillRef.current?.focus();
    }, 0);
  };

  const handleSaveNote = async () => {
    if (!id || isSavingNote) return;
    setIsSavingNote(true);
    try {
      const CV_Library = await getRecruitmentIds();
      if (!CV_Library) return
      const siteId = CV_Library.siteId;
      const cvLibraryList = CV_Library.lists.find(e => e.name === 'CvLibrary');
      if (!cvLibraryList) {
        throw new Error("CvLibrary list not found in CV_Library.lists");
      }
      let saveNotes: Note[];
      if (noteModalMode === 'edit' && currentNoteIndex !== null) {
        const currentNote = notes.find((_, i) => i === currentNoteIndex);
        saveNotes = [
          ...notes.filter((_, i) => i !== currentNoteIndex),
          { text: currentNoteText, updatedAt: new Date().toISOString(), createdAt: currentNote?.createdAt || new Date().toISOString() },
        ];
      } else {
        saveNotes = [
          ...notes,
          { text: currentNoteText, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ];
      }
      await updateListItem(siteId, cvLibraryList.id, id, {
        fields: { notes0: JSON.stringify(saveNotes) },
      });
      setNoteModalOpen(false);
      setCurrentNoteText('');
      setCurrentNoteIndex(null);
      await loadData(false);
    } catch (error) {
      setError('Failed to save note. Please try again.');
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleDeleteNote = async () => {
    if (!id || deleteNoteIndex === null || isDeletingNote) return;
    setIsDeletingNote(true);
    try {
      const CV_Library = await getRecruitmentIds();
      if (!CV_Library) return
      const siteId = CV_Library.siteId;
      const cvLibraryList = CV_Library.lists.find(e => e.name === 'CvLibrary');
      if (!cvLibraryList) {
        throw new Error("CvLibrary list not found in CV_Library.lists");
      }
      const saveNotes = notes.filter((_, i) => i !== deleteNoteIndex);
      await updateListItem(siteId, cvLibraryList.id, id, {
        fields: { notes0: JSON.stringify(saveNotes) },
      });
      setDeleteNoteIndex(null);
      await loadData(false);
    } catch (error) {
      setError('Failed to delete note. Please try again.');
    } finally {
      setIsDeletingNote(false);
      setDeleteConfirmation(false);
    }
  };


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">{error || 'No data available.'}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => loadData()}
          sx={{ mt: 2, borderRadius: 8, textTransform: 'none', px: 4 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (!id) return null;

  return (
    <Box sx={{ p: 1, mx: 'auto' }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBack />}
        onClick={onBack || (() => window.history.back())}
        sx={{ mb: 2, textTransform: 'none' }}
      >
        Back to Candidates
      </Button>

      <Card sx={{ width: '100%', padding: 2 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold">
            {data.first_name} {data.last_name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
            {data.job_title || 'Job Title Not Provided'}
          </Typography>

          {/* Personal Info Section */}
          <Box
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              padding: 3,
              marginTop: 2,
            }}
          >
            <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
              Personal Info
            </Typography>

            <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={3} mb={3}>
              <Box flex={1}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  First Name
                </Typography>
                <TextField
                  fullWidth
                  defaultValue={data.first_name}
                  onChange={(e) => handleChangeValue('first_name', e.target.value)}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box flex={1}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Last Name
                </Typography>
                <TextField
                  fullWidth
                  defaultValue={data.last_name}
                  onChange={(e) => handleChangeValue('last_name', e.target.value)}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Email
              </Typography>
              <TextField
                fullWidth
                defaultValue={data.email || ''}
                variant="outlined"
                onChange={(e) => handleChangeValue('email', e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                City
              </Typography>
              <TextField
                fullWidth
                defaultValue={data.city || ''}
                variant="outlined"
                onChange={(e) => handleChangeValue('city', e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationCityIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>

          {/* Compensation & Experience Section */}
          <Box
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              padding: 3,
              marginTop: 4,
            }}
          >
            <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
              Compensation & Experience
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Current Salary
              </Typography>
              <TextField
                fullWidth
                defaultValue={data.current_salary || ''}
                onChange={(e) => handleChangeValue('current_salary', e.target.value)}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MonetizationOnIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Expected Salary
              </Typography>
              <TextField
                fullWidth
                defaultValue={data.expected_salary || ''}
                onChange={(e) => handleChangeValue('expected_salary', e.target.value)}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TrendingUpIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Experience
              </Typography>
              <TextField
                fullWidth
                defaultValue={data.years_of_experience || ''}
                onChange={(e) => handleChangeValue('years_of_experience', e.target.value)}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WorkIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>

          {/* CV Management Section */}
          <Box
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              padding: 3,
              marginTop: 4,
            }}
          >
            <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
              CV Management
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Manage candidate's curriculum vitae and related documents
            </Typography>

            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                component="a"
                target="_blank"
                href={data.webUrl || '#'}
              >
                Preview CV
              </Button>

              <Button
                variant="contained"
                onClick={() => data?.downloadUrl && window.open(data.downloadUrl, '_blank')}
              >
                Download CV
              </Button>
            </Box>
          </Box>

          {/* Recruitment Details Section */}
          <Accordion sx={{ mt: 4 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle2" fontWeight="medium">
                Recruitment Details
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Candidate Stage */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'medium' }}>
                    Candidate Stage
                  </Typography>
                  <FormControl fullWidth>
                    <StyledSelect
                      multiple
                      value={data.candidate_stages || []}
                      onChange={async (e) => {
                        setIsLoadingStage(true);
                        try {
                          const CV_Library = await getRecruitmentIds();
                          if (!CV_Library) return;
                          const siteId = CV_Library.siteId;
                          const cvLibraryList = CV_Library.lists.find(e => e.name === 'CvLibrary');
                          if (!cvLibraryList) throw new Error("CvLibrary list not found in CV_Library.lists");
                          await updateListItem(siteId, cvLibraryList.id, id, {
                            fields: { candidate_stages: JSON.stringify(e.target.value) },
                          });
                          await loadData(false);
                        } catch (error) {
                          setError('Failed to update candidate stage.');
                        } finally {
                          setIsLoadingStage(false);
                        }
                      }}
                      disabled={isLoadingStage}
                      renderValue={(value: unknown) => {
                        const selected = value as string[];
                        return (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected?.map((val) => (
                              <StyledChip key={val} label={val} color="primary" />
                            ))}
                          </Box>
                        );
                      }}
                    >
                      {stages.map(stage => (
                        <MenuItem key={stage.id} value={stage.Title}>{stage.Title}</MenuItem>
                      ))}
                    </StyledSelect>
                    {isLoadingStage && <CircularProgress size={20} sx={{ mt: 1 }} />}
                  </FormControl>
                </Box>

                {/* Communication Skills */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'medium' }}>
                    Communication Skills
                  </Typography>
                  <FormControl fullWidth>
                    <StyledSelect
                      multiple
                      value={data.communication_skill || []}
                      onChange={async (e) => {
                        setIsLoadingSkills(true);
                        try {
                          const CV_Library = await getRecruitmentIds();
                          if (!CV_Library) return;
                          const siteId = CV_Library.siteId;
                          const cvLibraryList = CV_Library.lists.find(e => e.name === 'CvLibrary');
                          if (!cvLibraryList) throw new Error("CvLibrary list not found in CV_Library.lists");
                          await updateListItem(siteId, cvLibraryList.id, id, {
                            fields: { communication_skill: JSON.stringify(e.target.value) },
                          });
                          await loadData(false);
                        } catch (error) {
                          setError('Failed to update communication skills.');
                        } finally {
                          setIsLoadingSkills(false);
                        }
                      }}
                      disabled={isLoadingSkills}
                      renderValue={(value: unknown) => {
                        const selected = value as string[];
                        return (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <StyledChip key={value} label={value} color="primary" />
                            ))}
                          </Box>
                        );
                      }}
                    >
                      {skills.map(skill => (
                        <MenuItem key={skill.id} value={skill.Title}>{skill.Title}</MenuItem>
                      ))}
                    </StyledSelect>
                    {isLoadingSkills && <CircularProgress size={20} sx={{ mt: 1 }} />}
                  </FormControl>
                </Box>

                {/* Job Title */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'medium' }}>
                    Job Title
                  </Typography>
                  <FormControl fullWidth>
                    <StyledSelect
                      value={data.job_title || ''}
                      onChange={async (e) => {
                        setIsLoadingCampaign(true);
                        try {
                          const CV_Library = await getRecruitmentIds();
                          if (!CV_Library) return;
                          const siteId = CV_Library.siteId;
                          const cvLibraryList = CV_Library.lists.find(e => e.name === 'CvLibrary');
                          if (!cvLibraryList) throw new Error("CvLibrary list not found in CV_Library.lists");
                          await updateListItem(siteId, cvLibraryList.id, id, {
                            fields: { job_title: e.target.value },
                          });
                          await loadData(false);
                        } catch (error) {
                          setError('Failed to update campaign.');
                        } finally {
                          setIsLoadingCampaign(false);
                        }
                      }}
                      disabled={isLoadingCampaign}
                      renderValue={(selected: unknown) => {
                        const value = typeof selected === 'string' ? selected : '';
                        return (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            <StyledChip label={value} color="primary" />
                          </Box>
                        );
                      }}
                    >
                      {jobs.map(camp => (
                        <MenuItem key={camp.id} value={camp.Title}>{camp.Title}</MenuItem>
                      ))}
                    </StyledSelect>
                    {isLoadingCampaign && <CircularProgress size={20} sx={{ mt: 1 }} />}
                  </FormControl>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ mt: 4 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle2" fontWeight="medium">
                Interview Records
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ mb: 2 }}
              >
                <Tab label="Notes" />
                <Tab label="Feedback" />
              </Tabs>

              {/* Notes Tab */}
              {activeTab === 0 && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<NoteAdd />}
                      onClick={openCreateNote}
                      disabled={isSavingNote}
                      sx={{ borderRadius: 8, textTransform: 'none' }}
                    >
                      Create Notes
                    </Button>
                  </Box>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                    Notes
                  </Typography>
                  {notes.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {notes.map((note, index) => (
                        <StyledCard key={`note-${index}`} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{ flex: 1, cursor: 'pointer' }}
                            onClick={(e) => {
                              if ((e.target as HTMLElement).closest('.note-delete-btn')) return;
                              openEditNote(index, note.text);
                            }}
                          >
                            <Typography>{getFirstLine(note.text)}</Typography>
                          </Box>
                          <IconButton
                            className="note-delete-btn"
                            color="error"
                            onClick={() => {
                              setDeleteNoteIndex(index);
                              setDeleteConfirmation(true);
                            }}
                            disabled={isDeletingNote}
                            sx={{ borderRadius: 8 }}
                          >
                            <Delete />
                          </IconButton>
                        </StyledCard>
                      ))}
                    </Box>
                  ) : (
                    <Typography color="text.secondary">No notes available.</Typography>
                  )}
                </>
              )}

              {/* Feedback Tab */}
              {activeTab === 1 && (
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                    Feedback
                  </Typography>
                  <Typography color="text.secondary">No feedback available.</Typography>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>



        </CardContent>
      </Card>


      <Dialog open={noteModalOpen} onClose={() => setNoteModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ borderRadius: '8px 8px 0 0' }}>
          {noteModalMode === 'create' ? 'Add Note' : 'Edit Note'} for {data?.first_name || data?.email}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ bgcolor: '#fffef2', p: 2, borderRadius: 8, border: '1px solid #e0e0e0', height: 300 }}>
            <ReactQuill
              ref={quillRef}
              value={currentNoteText}
              onChange={setCurrentNoteText}
              modules={quillModules}
              formats={quillFormats}
              placeholder={noteModalMode === 'create' ? 'Add your note here...' : 'Edit your note here...'}
              style={{ height: '100%' }}
            />
          </Box>
          {noteModalMode === 'edit' && currentNoteIndex !== null && (
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Created: {new Date(notes[currentNoteIndex].createdAt).toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Updated: {new Date(notes[currentNoteIndex].updatedAt).toLocaleString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setNoteModalOpen(false)}
            disabled={isSavingNote}
            sx={{ borderRadius: 8, textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveNote}
            disabled={!currentNoteText.trim() || isSavingNote}
            sx={{ borderRadius: 8, textTransform: 'none' }}
          >
            {isSavingNote ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteConfirmation} onClose={() => setDeleteConfirmation(false)}>
        <DialogTitle sx={{ borderRadius: '8px 8px 0 0' }}>
          Confirm Note Deletion
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography>Are you sure you want to delete this note? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteConfirmation(false)}
            disabled={isDeletingNote}
            sx={{ borderRadius: 8, textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteNote}
            disabled={isDeletingNote}
            sx={{ borderRadius: 8, textTransform: 'none' }}
          >
            {isDeletingNote ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default UserProfile;