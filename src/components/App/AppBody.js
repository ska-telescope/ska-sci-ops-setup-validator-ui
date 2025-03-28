import './AppBody.css';
import './FormStyles.css';
import React from 'react';
import useTheme from '@mui/material/styles/useTheme';
import { useTranslation } from 'react-i18next';
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel } from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';
import { getMaxSubarraysByContext, telescopeContextOptions } from '../../utils/defaultValues';
import SubarrayForm from '../forms/SubarrayForm';

// Import services and utilities
import { getDefaultValues, getPssBeams } from '../../utils/telescopeUtils';
import { createNewSubarray, getSubarrayById, applySettingsToAllBeams } from '../../services/subarrayService';
import { handleObservingModeChange, handleSettingsChange, createBeamSettings } from '../../services/modeService';
import { validateSetup, submitValidation } from '../../services/validationService';

const AppBody = ({
  subarrays,
  setSubarrays,
  selectedSubarray,
  setSelectedSubarray,
  error,
  setError,
  validationMessage,
  setValidationMessage,
  telescopeContext,
  setTelescopeContext,
  telescope,
  setTelescope,
}) => {
  const { t } = useTranslation('sv');
  const theme = useTheme();
  
  // Get the context-specific maximum number of subarrays
  const maxSubarrays = getMaxSubarraysByContext(telescopeContext);
    
  // === Subarray management functions ===
  const addSubarray = () => {
    if (subarrays.length >= maxSubarrays) {
      setError(`Cannot add more than ${maxSubarrays} subarrays in ${telescopeContext} context.`);
      return;
    }
    
    const newId = subarrays.length + 1;
    setSubarrays([...subarrays, createNewSubarray(newId, telescope, telescopeContext)]);
    setError('');
  };
  
  const copySubarray = (id) => {
    if (subarrays.length >= maxSubarrays) {
      setError(`Cannot add more than ${maxSubarrays} subarrays in ${telescopeContext} context.`);
      return;
    }
  
    const subarrayToCopy = getSubarrayById(subarrays, id);
    const newId = subarrays.length + 1;
  
    setSubarrays([...subarrays, { 
      ...subarrayToCopy, 
      id: newId,
      name: `Subarray ${newId}` 
    }]);
    setError('');
  };
  
  const removeSubarray = (id) => {
    const updatedSubarrays = subarrays
      .filter(subarray => subarray.id !== id)
      .map((subarray, index) => ({ 
        ...subarray, 
        id: index + 1, 
        name: `Subarray ${index + 1}` 
      }));
    
    setSubarrays(updatedSubarrays);
    
    if (selectedSubarray === id) {
      setSelectedSubarray(null);
    }
  };

  // ===== Subarray state updates =====
  const updateSubarray = (id, updatedFields) => {
    setSubarrays(subarrays.map(subarray => 
      subarray.id === id ? { ...subarray, ...updatedFields } : subarray
    ));
  };

  // ===== Subarray Field Updates =====
  
  const onSubarrayTemplateChange = (id, template) => {
    updateSubarray(id, { template });
  };

  const onBandChange = (id, band) => {
    const settings = getDefaultValues(telescope, band);
    const subarray = getSubarrayById(subarrays, id);

    updateSubarray(id, {
      band,
      continuumSettings: { 
        ...subarray.continuumSettings, 
        1: { 
          ...subarray.continuumSettings[1], 
          centralFrequency: settings.centralFrequency, 
          bandwidth: settings.continuumBandwidth 
        } 
      },
      pssSettings: { 
        ...subarray.pssSettings, 
        1: { 
          ...subarray.pssSettings[1], 
          centralFrequency: settings.centralFrequency, 
          bandwidth: settings.pssBandwidth 
        } 
      },
      pstSettings: { 
        ...subarray.pstSettings, 
        1: { 
          ...subarray.pstSettings[1], 
          centralFrequency: settings.centralFrequency, 
          bandwidth: settings.pstBandwidth, 
          timingModeBeams: 0, 
          dynamicSpectrumBeams: 0, 
          flowthroughModeBeams: 0 
        } 
      }
    });
  };

  // ===== Mode Handling =====

  const onObservingModeChange = (id, mode) => {
    const updatedSettings = handleObservingModeChange(subarrays, id, mode, telescope);
    updateSubarray(id, updatedSettings);
  };

  // ===== Settings Change Handlers =====
  
  const onContinuumSettingsChange = (id, field, value) => {
    const updatedSettings = handleSettingsChange(subarrays, id, 'continuumSettings', field, value, telescope);
    updateSubarray(id, { continuumSettings: updatedSettings });
  };

  const onZoomSettingsChange = (id, field, value) => {
    const updatedSettings = handleSettingsChange(subarrays, id, 'zoomSettings', field, value, telescope);
    updateSubarray(id, { zoomSettings: updatedSettings });
  };

  const onPssSettingsChange = (id, field, value) => {
    const updatedSettings = handleSettingsChange(subarrays, id, 'pssSettings', field, value, telescope);
    updateSubarray(id, { pssSettings: updatedSettings });
  };

  const onPstSettingsChange = (id, field, value) => {
    const updatedSettings = handleSettingsChange(subarrays, id, 'pstSettings', field, value, telescope);
    updateSubarray(id, { pstSettings: updatedSettings });
  };

  // ===== Station Beam Handling =====

  const onStationBeamsChange = (id, value) => {
    const numBeams = parseInt(value);
    const beamSettings = createBeamSettings(numBeams, telescope);

    updateSubarray(id, { 
      stationBeams: numBeams, 
      selectedStationBeam: 1,
      ...beamSettings
    });
  };

  const onSelectedStationBeamChange = (id, value) => {
    updateSubarray(id, { selectedStationBeam: value });
  };

  const onApplyToAllStationBeamsChange = (id, applyToAll) => {
    const subarray = getSubarrayById(subarrays, id);
    const stationBeamId = subarray.selectedStationBeam;
    
    if (applyToAll) {
      // Create copies of the current beam settings for all beams
      const newModes = applySettingsToAllBeams(subarray, 'modes', stationBeamId);
      const newContinuumSettings = applySettingsToAllBeams(subarray, 'continuumSettings', stationBeamId);
      const newZoomSettings = applySettingsToAllBeams(subarray, 'zoomSettings', stationBeamId);
      const newPssSettings = applySettingsToAllBeams(subarray, 'pssSettings', stationBeamId);
      const newPstSettings = applySettingsToAllBeams(subarray, 'pstSettings', stationBeamId);
      
      updateSubarray(id, {
        modes: newModes,
        continuumSettings: newContinuumSettings,
        zoomSettings: newZoomSettings,
        pssSettings: newPssSettings,
        pstSettings: newPstSettings,
        applyToAll: true
      });
    } else {
      updateSubarray(id, { applyToAll: false });
    }
  };

  // ===== Validation =====

  const onValidateSetup = async () => {
    const { telescopeConfiguration, invalidSubarrays } = validateSetup(subarrays, telescope, telescopeContext);

    if (invalidSubarrays.length > 0) {
      const invalidSubarrayNames = invalidSubarrays.map(subarray => subarray.name).join(', ');
      setError(`The following subarrays have invalid input: ${invalidSubarrayNames}`);
      setValidationMessage('');
    } else {
      setError('');
      // Initial configuration display
      console.log(JSON.stringify(telescopeConfiguration, null, 2));

      const { success, error, result, displayMessage } = await submitValidation(telescopeConfiguration);
      
      if (success) {
        // Update validation message with formatted result content
        setValidationMessage(displayMessage);
        alert('Setup validated successfully!');
        console.log('Backend response:', result);
      } else {
        setError(error);
        // Still show displayMessage in the validation area for debugging
        setValidationMessage(displayMessage);
      }
    }
  };

  // ===== Telescope Context Handling =====
  
  const handleContextChange = (newContext) => {
    setTelescopeContext(newContext);
    
    // When context changes, we need to update PSS beam values for all subarrays
    // based on the new context
    const updatedSubarrays = subarrays.map(subarray => {
      const pssBeams = getPssBeams(telescope, newContext);
      
      // Update PSS beam values for all station beams in this subarray
      const updatedPssSettings = { ...subarray.pssSettings };
      Object.keys(updatedPssSettings).forEach(beamId => {
        // Only update if we're in SV context which forces a fixed value
        if (newContext === 'SV-AA2' || newContext === 'SV-AA*') {
          updatedPssSettings[beamId] = {
            ...updatedPssSettings[beamId],
            numberOfBeams: pssBeams
          };
        }
      });
      
      return {
        ...subarray,
        pssSettings: updatedPssSettings
      };
    });
    
    // Check if we need to adjust the number of subarrays based on the new context
    const newMaxSubarrays = getMaxSubarraysByContext(newContext);
    let finalSubarrays = updatedSubarrays;
    
    if (updatedSubarrays.length > newMaxSubarrays) {
      // If we have more subarrays than allowed in the new context, keep only the first newMaxSubarrays
      finalSubarrays = updatedSubarrays.slice(0, newMaxSubarrays);
      setError(`Context ${newContext} allows a maximum of ${newMaxSubarrays} subarrays. Extra subarrays have been removed.`);
    }
    
    setSubarrays(finalSubarrays);
  };

  return (
    <div className="App-content">
      {(telescope === 'SKA-Mid' || telescope === 'SKA-Low') && (
        <>
          <div className="context-info" style={{ margin: '10px 0', fontSize: '0.9em', color: '#666', textAlign: 'left' }}>
            Welcome to the SKA setup validation tool. This tool allows you to determine whether your observational setup can be executed on the SKA Low and Mid telescopes during the various construction and operational phases.
          </div>
          <div className="context-info" style={{ margin: '10px 0', fontSize: '0.9em', color: '#666', textAlign: 'left' }}>
            Use the "Add New Subarray" button to create multiple subarrays. Configure each subarrays using the subarray accordions that are shown below. Once you are done, click the "Validate setup" button to check if your setup is valid.
          </div>

          <div className="button-group">
            <AwesomeButton 
              type="primary" 
              onPress={addSubarray}
              disabled={subarrays.length >= maxSubarrays}
            >
              Add New Subarray
            </AwesomeButton> 
            <AwesomeButton type="primary" onPress={onValidateSetup}>
              Validate setup
            </AwesomeButton>
          </div>
          <div className="context-info" style={{ margin: '10px 0', fontSize: '0.9em', color: '#666' }}>
            {telescopeContext} context allows a maximum of {maxSubarrays} commensal subarray{maxSubarrays !== 1 ? 's' : ''}.
          </div>
          {error && <div className="error-container"><p className="error">{error}</p></div>}
          <Accordion allowMultipleExpanded allowZeroExpanded className="accordion__item">
            {subarrays.map(subarray => (
              <AccordionItem key={subarray.id}>
                <AccordionItemHeading>
                  <AccordionItemButton 
                    className={`accordion__button ${selectedSubarray === subarray.id ? 'selected' : ''}`}
                    onClick={() => setSelectedSubarray(subarray.id)}
                  >
                    {subarray.name}
                    <div className="accordion-button-group">
                      <AwesomeButton 
                        type="secondary"
                        onPress={(e) => {
                          e.stopPropagation();
                          copySubarray(subarray.id);
                        }}
                        disabled={subarrays.length >= maxSubarrays}
                        className="copy-button"
                      >
                        Copy
                      </AwesomeButton>
                      <AwesomeButton 
                        type="secondary"
                        onPress={(e) => {
                          e.stopPropagation();
                          removeSubarray(subarray.id);
                        }}
                        disabled={subarrays.length === 1}
                        className="remove-button"
                      >
                        Remove
                      </AwesomeButton>
                    </div>
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  <SubarrayForm 
                    subarray={subarray}
                    handleSubarrayTemplateChange={onSubarrayTemplateChange}
                    handleBandChange={onBandChange}
                    handleObservingModeChange={onObservingModeChange}
                    handleContinuumSettingsChange={onContinuumSettingsChange}
                    handleZoomSettingsChange={onZoomSettingsChange}
                    handlePssSettingsChange={onPssSettingsChange}
                    handlePstSettingsChange={onPstSettingsChange}
                    telescope={telescope}
                    handleStationBeamsChange={onStationBeamsChange}
                    handleSelectedStationBeamChange={onSelectedStationBeamChange}
                    handleApplyToAllStationBeamsChange={onApplyToAllStationBeamsChange}
                    telescopeContext={telescopeContext}
                  />
                </AccordionItemPanel>
              </AccordionItem>
            ))}
          </Accordion>
          {/* Validation message is currently set to invisible. Remove display to see its contents. */}
          {validationMessage && (
            <pre className="validation-message" style={{ textAlign: 'left' }}>
              {validationMessage}
            </pre>
          )}
        </>
      )}
    </div>
  );
};

export default AppBody;