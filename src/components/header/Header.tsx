import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Tooltip, Typography } from '@mui/material';

import useTheme from '@mui/material/styles/useTheme';
import { Box, Grid, Stack } from '@mui/system';
// Import components individually to avoid module federation issues
import { Logo } from '@ska-telescope/ska-gui-components';
import ButtonToggle from '../buttons/buttonToggle/ButtonToggle';

const LOGO_HEIGHT = 50;
const HEADER_BTN_HEIGHT = 40; // Keep this consistent with the dropdown height
const ICON_HEIGHT = 32;
const SKAO_URL = 'https://www.skao.int/';

interface HeaderProps {
  telescopeContext: string;
  setTelescopeContext: React.Dispatch<React.SetStateAction<string>>;
  telescope: string;
  setTelescope: React.Dispatch<React.SetStateAction<string>>;
}

const Header: React.FC<HeaderProps> = ({
  telescopeContext,
  setTelescopeContext,
  telescope,
  setTelescope,
}) => {
  const { t } = useTranslation('sv');
  const theme = useTheme();

  function openLink(link: string) {
    window.open(link, '_blank');
  }

  const handleContextChange = (event: SelectChangeEvent) => {
    if (event && event.target) {
      setTelescopeContext(event.target.value);
    }
  };

  const telescopeOptions = [
    { id: 'SKA-Low', label: 'Low', value: 'SKA-Low' },
    { id: 'SKA-Mid', label: 'Mid', value: 'SKA-Mid' }
  ];

  const handleTelescopeChange = (event: React.MouseEvent<HTMLElement>, newTelescope: string) => {
    if (newTelescope !== null) {
      setTelescope(newTelescope);
    }
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: theme.palette.primary.main,
          height: '80px',
          width: '100%'
        }}
      >
        <Grid m={0} container alignItems="center" direction="row" justifyContent="space-between" sx={{ height: '100%' }}>
          {/* Left column - merged rows for logo and title */}
          <Grid item xs={6}>
            <Stack 
              direction="row" 
              alignItems="center" 
              spacing={1}
            >
              <IconButton
                id={'skaWebsite'}
                aria-label="skaWebsite"
                disableRipple
                sx={{ 
                  padding: 0, 
                  m: 0,
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': { 
                    backgroundColor: 'transparent' 
                  }
                }}
                color="inherit"
                onClick={() => openLink(SKAO_URL)}
              >
                <Logo height={LOGO_HEIGHT} />
              </IconButton>
              <Typography 
                color="secondary" 
                data-testid="headerTitleId" 
                variant="h4"
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  lineHeight: 1.2 // Adjust line height to help with centering
                }}
              >
                {t('sv.title')}
              </Typography>
            </Stack>
          </Grid>
          
          {/* Right column - ButtonToggle and dropdown on same line */}
          <Grid item xs={6}>
            <Stack 
              direction="row" 
              spacing={2} 
              justifyContent="flex-end" 
              alignItems="center"  // This ensures vertical centering
              sx={{ paddingRight: 3 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ButtonToggle
                  current={telescope}
                  options={telescopeOptions}
                  height={HEADER_BTN_HEIGHT}
                  setValue={handleTelescopeChange}
                  testId="telescopeSelectorId"
                  value={telescope}
                />
              </Box>
              <FormControl 
                variant="outlined" 
                size="small" 
                sx={{ 
                  minWidth: 120, 
                  backgroundColor: theme.palette.background.paper,
                  '& .MuiInputBase-root': {
                    height: `${HEADER_BTN_HEIGHT}px`
                  }
                }}
              >
                <InputLabel id="context-select-label">Context</InputLabel>
                <Select
                  labelId="context-select-label"
                  id="context-select"
                  value={telescopeContext || 'Cycle 0'}
                  onChange={handleContextChange}
                  label="Context"
                  data-testid="contextSelectorId"
                >
                  <MenuItem value="SV-AA2">SV-AA2</MenuItem>
                  <MenuItem value="SV-AA*">SV-AA*</MenuItem>
                  <MenuItem value="Cycle 0">Cycle 0</MenuItem>
                  <MenuItem value="Cycle 1">Cycle 1</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          backgroundColor: theme.palette.secondary.main,
          height: '7px',
          width: '100%'
        }}
      ></Box>
    </>
  );
};

export default Header;
