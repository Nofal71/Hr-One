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

interface CommunicationSkill {
  id: number;
  name: string;
}

const CommunicationSkills: React.FC = () => {
  const [communicationSkills, setCommunicationSkills] = useState<CommunicationSkill[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [progress, setProgress] = useState(true);
  const [removingSkill, setRemovingSkill] = useState<number | null>(null);
  const [addingSkill, setAddingSkill] = useState(false);
  const [editingSkill, setEditingSkill] = useState(false);
  const [editSkillId, setEditSkillId] = useState<number | null>(null);
  const [editSkillName, setEditSkillName] = useState('');
  const { getRecruitmentIds } = useRecruitment()


  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    setAddingSkill(true);
    try {
      const Site = await getRecruitmentIds();
      if (!Site) return
      const siteId = Site?.siteId || '';
      const skillsId = Site.lists.find((list) => list.name === 'communication_skills')?.id || '';
      await createListItem(siteId, skillsId, {
        fields: { Title: newSkill.trim() },
      });
      setNewSkill('');
      await getSkills(false);
    } catch (error) {
      console.error('Error adding communication skill:', error);
    } finally {
      setAddingSkill(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setRemovingSkill(id);
      const Site = await getRecruitmentIds();
      if (!Site) return;
      const siteId = Site?.siteId || '';
      const skillsId = Site.lists.find((list) => list.name === 'communication_skills')?.id || '';
      await deleteListItem(siteId, skillsId, id);
      await getSkills(false);
    } catch (error) {
      console.error(error);
    } finally {
      setRemovingSkill(null);
    }
  };

  const handleEdit = (id: number) => {
    const skill = communicationSkills.find((skill) => skill.id === id);
    if (skill) {
      setEditSkillId(id);
      setEditSkillName(skill.name);
    }
  };

  const handleSaveEdit = async () => {
    if (editSkillId && editSkillName.trim()) {
      try {
        setEditingSkill(true);
        const Site = await getRecruitmentIds();
        if (!Site) return;
        const siteId = Site?.siteId || '';
        const skillsId = Site.lists.find((list) => list.name === 'communication_skills')?.id || '';
        await updateListItem(siteId, skillsId, editSkillId, {
          fields: { Title: editSkillName.trim() },
        });
      } catch (error) {
        console.error(error);
      } finally {
        setEditingSkill(false);
        setEditSkillId(null);
        setEditSkillName('');
        await getSkills(false);
      }
    }
  };

  const handleCloseDialog = () => {
    setEditSkillId(null);
    setEditSkillName('');
  };

  const getSkills = async (load: boolean = true) => {
    try {
      if (load) setProgress(true);
      const Site = await getRecruitmentIds();
      if (!Site) return;
      const siteId = Site?.siteId || '';
      const skillsId = Site.lists.find((list) => list.name === 'communication_skills')?.id || '';
      const response = await getItems(siteId, skillsId);
      const flattenedItems = response?.fields.map((item: any) => ({
        id: item.id,
        name: item.fields?.Title || 'not-defined',
        ...item,
      }));
      setCommunicationSkills(flattenedItems);
    } catch (error) {
      console.error(error);
    } finally {
      setProgress(false);
    }
  };

  useEffect(() => {
    getSkills();
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
        Communication Skills
      </Typography>
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-end', maxWidth: 600 }}>
        <TextField
          label="Add New Communication Skill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          size="small"
          sx={{
            flex: 1,
            '& .MuiInputBase-root': { borderRadius: 1 },
            '& .MuiInputLabel-root': { color: '#555' },
          }}
        />
        <Button
          variant="contained"
          onClick={handleAddSkill}
          disabled={addingSkill || !newSkill.trim()}
          sx={{ borderRadius: 1, px: 2, py: 0.5, minWidth: 100 }}
        >
          {addingSkill ? 'Adding...' : 'Add Skill'}
        </Button>
      </Box>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 500, mb: 1.5 }}>
          Skills ({communicationSkills.length})
        </Typography>
        <TableContainer sx={{ bgcolor: '#fff', borderRadius: 1, boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
          <Table sx={{ minWidth: 400 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600, py: 1.5, color: '#333' }}>Skill</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, py: 1.5, color: '#333' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {communicationSkills.map((skill) => (
                <TableRow key={skill.id} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                  <TableCell sx={{ py: 1 }}>{skill.name}</TableCell>
                  <TableCell align="right" sx={{ py: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Button
                        variant="text"
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleEdit(skill.id)}
                        sx={{ color: '#1976d2', minWidth: 0 }}
                      />
                      {removingSkill === skill.id ? (
                        <CircularProgress size={20} />
                      ) : (
                        <Button
                          variant="text"
                          size="small"
                          startIcon={<Delete />}
                          onClick={() => handleDelete(skill.id)}
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
      <Dialog open={editSkillId !== null} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Communication Skill</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Skill Name"
            value={editSkillName}
            onChange={(e) => setEditSkillName(e.target.value)}
            fullWidth
            size="small"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="outlined" size="small">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} variant="contained" disabled={editingSkill} size="small">
            {editingSkill ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommunicationSkills;