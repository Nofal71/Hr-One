import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { createListItem, deleteListItem, getItems, updateListItem } from '../../../../utils';
import { useRecruitment } from '../../../../context/RecruitmentContext';

interface Stage {
  id: number;
  name: string;
}

const CandidateStages: React.FC = () => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [newStage, setNewStage] = useState('');
  const [progress, setProgress] = useState(true);
  const [removingStage, setRemovingStage] = useState<number | null>(null);
  const [addingStage, setAddingStage] = useState(false);
  const [editingStage, setEditingStage] = useState(false);
  const [editStageId, setEditStageId] = useState<number | null>(null);
  const [editStageName, setEditStageName] = useState('');
  const { getRecruitmentIds } = useRecruitment()

  const handleAddStage = async () => {
    if (!newStage.trim()) return;
    setAddingStage(true);
    try {
      const Site = await getRecruitmentIds();
      const siteId = Site?.siteId || '';
      if (!Site) return
      const stagesId = Site.lists.find((list) => list.name === 'candidate_stages')?.id || '';
      await createListItem(siteId, stagesId, {
        fields: { Title: newStage.trim() },
      });
      setNewStage('');
      await getStages(false);
    } catch (error) {
      console.error('Error adding stage:', error);
    } finally {
      setAddingStage(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setRemovingStage(id);
      const Site = await getRecruitmentIds();
      const siteId = Site?.siteId || '';
      if (!Site) return
      const stagesId = Site.lists.find((list) => list.name === 'candidate_stages')?.id || '';
      await deleteListItem(siteId, stagesId, id);
      await getStages(false);
    } catch (error) {
      console.error(error);
    } finally {
      setRemovingStage(null);
    }
  };

  const handleEdit = (id: number) => {
    const stage = stages.find((stage) => stage.id === id);
    if (stage) {
      setEditStageId(id);
      setEditStageName(stage.name);
    }
  };

  const handleSaveEdit = async () => {
    if (editStageId && editStageName.trim()) {
      try {
        setEditingStage(true);
        const Site = await getRecruitmentIds();
        const siteId = Site?.siteId || '';
        if (!Site) return
        const stagesId = Site.lists.find((list) => list.name === 'candidate_stages')?.id || '';
        await updateListItem(siteId, stagesId, editStageId, {
          fields: { Title: editStageName.trim() },
        });
      } catch (error) {
        console.error(error);
      } finally {
        setEditingStage(false);
        setEditStageId(null);
        setEditStageName('');
        await getStages(false);
      }
    }
  };

  const handleCloseDialog = () => {
    setEditStageId(null);
    setEditStageName('');
  };

  const getStages = async (load: boolean = true) => {
    try {
      if (load) setProgress(true);
      const Site = await getRecruitmentIds();
      const siteId = Site?.siteId || '';
      if (!Site) return
      const stagesId = Site.lists.find((list) => list.name === 'candidate_stages')?.id || '';
      const response = await getItems(siteId, stagesId);
      const flattenedItems = response?.fields.map((item: any) => ({
        id: item.id,
        name: item.fields?.Title || 'not-defined',
        ...item,
      }));
      setStages(flattenedItems);
    } catch (error) {
      console.error(error);
    } finally {
      setProgress(false);
    }
  };

  useEffect(() => {
    getStages();
  }, []);

  if (progress) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh' }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
        Candidate Stages
      </Typography>
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-end', maxWidth: 600 }}>
        <TextField
          label="Add New Candidate Stage"
          value={newStage}
          onChange={(e) => setNewStage(e.target.value)}
          size="small"
          sx={{
            flex: 1,
            '& .MuiInputBase-root': { borderRadius: 1 },
            '& .MuiInputLabel-root': { color: '#555' },
          }}
        />
        <Button
          variant="contained"
          onClick={handleAddStage}
          disabled={addingStage || !newStage.trim()}
          sx={{ borderRadius: 1, px: 2, py: 0.5, minWidth: 100 }}
        >
          {addingStage ? 'Adding...' : 'Add Stage'}
        </Button>
      </Box>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 500, mb: 1.5 }}>
          Stages ({stages.length})
        </Typography>
        <TableContainer sx={{ bgcolor: '#fff', borderRadius: 1, boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
          <Table sx={{ minWidth: 400 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600, py: 1.5, color: '#333' }}>Stage</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, py: 1.5, color: '#333' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stages.map((stage) => (
                <TableRow key={stage.id} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                  <TableCell sx={{ py: 1 }}>{stage.name}</TableCell>
                  <TableCell align="right" sx={{ py: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Button
                        variant="text"
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleEdit(stage.id)}
                        sx={{ color: '#1976d2', minWidth: 0 }}
                      />
                      {removingStage === stage.id ? (
                        <CircularProgress size={20} />
                      ) : (
                        <Button
                          variant="text"
                          size="small"
                          startIcon={<Delete />}
                          onClick={() => handleDelete(stage.id)}
                          sx={{ color: '#d32f2f', minWidth: 0 }}
                        />
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Dialog open={editStageId !== null} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Candidate Stage</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Stage Name"
            value={editStageName}
            onChange={(e) => setEditStageName(e.target.value)}
            fullWidth
            size="small"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="outlined" size="small">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} variant="contained" disabled={editingStage} size="small">
            {editingStage ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CandidateStages;