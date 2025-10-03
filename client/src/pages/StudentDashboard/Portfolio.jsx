import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Chip, Stack, IconButton, Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../../contexts/AuthContext';

const initialFields = {
  placementEmail: '',
  Portfolio: '',
  Resume: '',
  LinkedIn: '',
  GitHub: '',
  HackerRank: '',
  LeetCode: '',
  HackerEarth: '',
  Skillrack: '',
  GeeksforGeeks: '',
  domains: [],
  projects: [],
};

const Portfolio = () => {
  const { user } = useAuth();
  const [fields, setFields] = useState(initialFields);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [domainInput, setDomainInput] = useState('');
  const [projectInput, setProjectInput] = useState('');
  const [projectDescInput, setProjectDescInput] = useState('');

  // Fetch student profile
  useEffect(() => {
    if (!user?._id) return;
    setLoading(true);
    fetch(`/api/students/${user._id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.portfolio) {
          setFields({
            placementEmail: data.portfolio.placementEmail || '',
            Portfolio: data.portfolio.Portfolio || '',
            Resume: data.portfolio.Resume || '',
            LinkedIn: data.portfolio.LinkedIn || '',
            GitHub: data.portfolio.GitHub || '',
            HackerRank: data.portfolio.HackerRank || '',
            LeetCode: data.portfolio.LeetCode || '',
            HackerEarth: data.portfolio.HackerEarth || '',
            Skillrack: data.portfolio.Skillrack || '',
            GeeksforGeeks: data.portfolio.GeeksforGeeks || '',
            domains: data.portfolio.domains || [],
            projects: Array.isArray(data.portfolio.projects)
              ? data.portfolio.projects.map(p => typeof p === 'string' ? { link: p, description: '' } : p)
              : [],
          });
        } else {
          setFields(initialFields);
        }
        setLoading(false);
      });
  }, [user]);

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleAddDomain = () => {
    if (domainInput && !fields.domains.includes(domainInput)) {
      setFields({ ...fields, domains: [...fields.domains, domainInput] });
      setDomainInput('');
    }
  };
  const handleDeleteDomain = (domain) => {
    setFields({ ...fields, domains: fields.domains.filter(d => d !== domain) });
  };

  const handleAddProject = () => {
    if (projectInput && !fields.projects.some(p => p.link === projectInput)) {
      setFields({
        ...fields,
        projects: [...fields.projects, { link: projectInput, description: projectDescInput }],
      });
      setProjectInput('');
      setProjectDescInput('');
    }
  };
  const handleDeleteProject = (link) => {
    setFields({ ...fields, projects: fields.projects.filter(p => p.link !== link) });
  };

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setMessage('');
  };

  const handleUpdate = async () => {
    setLoading(true);
    setMessage('');
    const payload = {
      placementEmail: fields.placementEmail,
      Portfolio: fields.Portfolio,
      Resume: fields.Resume,
      LinkedIn: fields.LinkedIn,
      GitHub: fields.GitHub,
      HackerRank: fields.HackerRank,
      LeetCode: fields.LeetCode,
      HackerEarth: fields.HackerEarth,
      Skillrack: fields.Skillrack,
      GeeksforGeeks: fields.GeeksforGeeks,
      domains: fields.domains,
      projects: Array.isArray(fields.projects)
        ? fields.projects.map(p => ({ link: p.link, description: p.description || '' }))
        : [],
    };
    try {
      const res = await fetch(`/api/students/${user._id}/portfolio`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Portfolio updated successfully!');
        setEditMode(false);
        // Refetch portfolio to show latest data
        fetch(`/api/students/${user._id}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.portfolio) {
              setFields({
                placementEmail: data.portfolio.placementEmail || '',
                Portfolio: data.portfolio.Portfolio || '',
                Resume: data.portfolio.Resume || '',
                LinkedIn: data.portfolio.LinkedIn || '',
                GitHub: data.portfolio.GitHub || '',
                HackerRank: data.portfolio.HackerRank || '',
                LeetCode: data.portfolio.LeetCode || '',
                HackerEarth: data.portfolio.HackerEarth || '',
                Skillrack: data.portfolio.Skillrack || '',
                GeeksforGeeks: data.portfolio.GeeksforGeeks || '',
                domains: data.portfolio.domains || [],
                projects: Array.isArray(data.portfolio.projects)
                  ? data.portfolio.projects.map(p => typeof p === 'string' ? { link: p, description: '' } : p)
                  : [],
              });
            }
          });
      } else {
        setMessage('Update failed.');
      }
    } catch (err) {
      setMessage('Server error.');
    }
    setLoading(false);
  };

  return (
    <Box maxWidth={700} mx="auto" mt={4}>
      <Typography variant="h5" fontWeight={700} mb={2}>Portfolio & Profile</Typography>
      {loading && <Typography>Loading...</Typography>}
      {message && <Typography color={message.includes('success') ? 'green' : 'red'}>{message}</Typography>}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField label="Placement Email ID" name="placementEmail" value={fields.placementEmail} onChange={handleChange} fullWidth disabled={!editMode} sx={{ mb: 2 }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Portfolio Link" name="Portfolio" value={fields.Portfolio} onChange={handleChange} fullWidth disabled={!editMode} sx={{ mb: 2 }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Resume Link" name="Resume" value={fields.Resume} onChange={handleChange} fullWidth disabled={!editMode} sx={{ mb: 2 }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="LinkedIn" name="LinkedIn" value={fields.LinkedIn} onChange={handleChange} fullWidth disabled={!editMode} sx={{ mb: 2 }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="GitHub" name="GitHub" value={fields.GitHub} onChange={handleChange} fullWidth disabled={!editMode} sx={{ mb: 2 }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="LeetCode" name="LeetCode" value={fields.LeetCode} onChange={handleChange} fullWidth disabled={!editMode} sx={{ mb: 2 }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="HackerRank" name="HackerRank" value={fields.HackerRank} onChange={handleChange} fullWidth disabled={!editMode} sx={{ mb: 2 }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="HackerEarth" name="HackerEarth" value={fields.HackerEarth} onChange={handleChange} fullWidth disabled={!editMode} sx={{ mb: 2 }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Skillrack" name="Skillrack" value={fields.Skillrack} onChange={handleChange} fullWidth disabled={!editMode} sx={{ mb: 2 }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="GeeksforGeeks" name="GeeksforGeeks" value={fields.GeeksforGeeks} onChange={handleChange} fullWidth disabled={!editMode} sx={{ mb: 2 }} />
        </Grid>
        {/* Interested Domains */}
        <Grid item xs={12}>
          <Typography fontWeight={600} mb={1}>Interested Domains</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {fields.domains.map((domain, idx) => (
              <Chip key={idx} label={domain} onDelete={editMode ? () => handleDeleteDomain(domain) : undefined} />
            ))}
            {editMode && (
              <>
                <TextField size="small" value={domainInput} onChange={e => setDomainInput(e.target.value)} placeholder="Add domain" sx={{ width: 120 }} />
                <IconButton onClick={handleAddDomain} color="black" sx={{ backgroundColor: 'white' }}><AddIcon /></IconButton>
              </>
            )}
          </Stack>
        </Grid>
        {/* Projects */}
        <Grid item xs={12}>
          <Typography fontWeight={600} mb={1}>Projects</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {fields.projects.map((project, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chip
                  label={<span><a href={project.link} target="_blank" rel="noopener noreferrer" style={{ color: '#5B2A86', textDecoration: 'underline' }}>{project.link}</a>{project.description ? ` — ${project.description}` : ''}</span>}
                  onDelete={editMode ? () => handleDeleteProject(project.link) : undefined}
                  sx={{ mr: 1, mb: 1, background: '#ede9fe', color: '#5B2A86', fontWeight: 500 }}
                />
              </Box>
            ))}
            {editMode && (
              <>
                <TextField size="small" value={projectInput} onChange={e => setProjectInput(e.target.value)} placeholder="Add project link" sx={{ width: 180, mr: 1 }} />
                <TextField
                  size="small"
                  value={projectDescInput}
                  onChange={e => setProjectDescInput(e.target.value)}
                  placeholder="Description"
                  sx={{
                    width: 180,
                    mr: 1,
                    background: '#f3e8ff',
                    borderRadius: 2,
                    border: '1px solid #d1b3ff',
                    '& .MuiInputBase-root': {
                      p: 1,
                      minHeight: 48,
                      maxHeight: 80,
                      overflowY: 'auto',
                    },
                  }}
                  multiline
                  minRows={2}
                  maxRows={4}
                  inputProps={{ style: { resize: 'vertical', overflowY: 'auto' } }}
                />
                <IconButton onClick={handleAddProject} color="black" sx={{ backgroundColor: 'white' }}><AddIcon /></IconButton>
              </>
            )}
          </Stack>
        </Grid>
      </Grid>
      <Box mt={3}>
        {!editMode ? (
          <Button variant="contained" startIcon={<EditIcon />} onClick={handleEdit}>Edit</Button>
        ) : (
          <>
            <Button variant="contained" color="success" startIcon={<SaveIcon />} onClick={handleUpdate} disabled={loading} sx={{ mr: 2 }}>Update</Button>
            <Button variant="outlined" color="secondary" onClick={handleCancel}>Cancel</Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Portfolio; 