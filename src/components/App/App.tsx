import React, { useState, useEffect } from 'react';
import { CssBaseline, Paper } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { storageObject } from '@ska-telescope/ska-gui-local-storage';
import theme from '../../services/theme/theme';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import AppBody from './AppBody';
import { useTranslation } from 'react-i18next';
import { createNewSubarray, getSubarrayById, applySettingsToAllBeams } from '../../services/subarrayService';

function App() {
  const { t } = useTranslation(['sv']);
  const { help, helpToggle, themeMode, toggleTheme } = storageObject.useStore();

  const skao = t('toolTip.button.skao', { ns: 'sv' });
  const mode = t('toolTip.button.mode', { ns: 'sv' });
  const headerTip = t('toolTip.button.docs', { ns: 'sv' });
  const headerURL = t('toolTip.button.docsURL', { ns: 'sv' });
  const docs = { tooltip: headerTip, url: headerURL };
  const toolTip = { skao, mode };

  // State management
  const [subarrays, setSubarrays] = useState([]);
  const [selectedSubarray, setSelectedSubarray] = useState(null);
  const [error, setError] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [telescopeContext, setTelescopeContext] = useState('Cycle 0');
  const [telescope, setTelescope] = useState('SKA-Mid');

  // ===== Initialization =====
  useEffect(() => {
    const isSkaLow = telescope === 'SKA-Low';

    setTelescope(isSkaLow ? 'SKA-Low' : 'SKA-Mid');
    
    setSubarrays([createNewSubarray(1, isSkaLow ? 'SKA-Low' : 'SKA-Mid', 'Cycle 0')]);
  }, []);

  return (
    <ThemeProvider theme={theme(themeMode?.mode)}>
      <CssBaseline enableColorScheme />
      <Paper sx={{ height: '100vh' }}>  
        <Header
          telescopeContext={telescopeContext}
          setTelescopeContext={setTelescopeContext}
          telescope={telescope}
          setTelescope={setTelescope}
        />
        <AppBody 
          subarrays={subarrays}
          setSubarrays={setSubarrays}
          selectedSubarray={selectedSubarray}
          setSelectedSubarray={setSelectedSubarray}
          error={error}
          setError={setError}
          validationMessage={validationMessage}
          setValidationMessage={setValidationMessage}
          telescopeContext={telescopeContext}
          setTelescopeContext={setTelescopeContext}
          telescope={telescope}
          setTelescope={setTelescope}
        />
        <Footer />
      </Paper>
    </ThemeProvider>
  );
}

export default App;
