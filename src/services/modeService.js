import { getDefaultValues, isSkaMid, getChannelWidth, getPssBeams, createDefaultBeamSettings } from '../utils/telescopeUtils';
import { getSubarrayById, applySettingsToAllBeams } from './subarrayService';

/**
 * Updates settings for a specific mode (continuum, zoom, pss, pst)
 */
export const updateModeSettings = (subarray, mode, beamId, isEnabling, telescope) => {
  const settings = {};
  const defaults = getDefaultValues(telescope, subarray.band);
  const settingType = `${mode}Settings`;
  
  if (!subarray[settingType] || !subarray[settingType][beamId]) {
    return settings;
  }
  
  const currentSettings = { ...subarray[settingType][beamId] };
  currentSettings.enabled = isEnabling;
  
  // Add default values when enabling modes
  if (isEnabling) {
    switch (mode) {
      case 'continuum':
        currentSettings.centralFrequency = currentSettings.centralFrequency || defaults.centralFrequency;
        currentSettings.bandwidth = currentSettings.bandwidth || defaults.continuumBandwidth;
        break;
      case 'pss':
        currentSettings.centralFrequency = currentSettings.centralFrequency || defaults.centralFrequency;
        currentSettings.bandwidth = currentSettings.bandwidth || defaults.pssBandwidth;
        break;
      case 'pst':
        currentSettings.centralFrequency = currentSettings.centralFrequency || defaults.centralFrequency;
        currentSettings.bandwidth = currentSettings.bandwidth || defaults.pstBandwidth;
        break;
      default:
        // No default values needed for zoom
    }
  }
  
  settings[settingType] = {
    ...subarray[settingType],
    [beamId]: currentSettings
  };
  
  return settings;
};

/**
 * Handles observing mode change
 */
export const handleObservingModeChange = (subarrays, id, mode, telescope) => {
  const subarray = getSubarrayById(subarrays, id);
  const updatedSettings = {};
  
  if (!isSkaMid(telescope)) {
    const stationBeamId = subarray.selectedStationBeam;
    
    // Toggle mode
    const updatedModes = { 
      ...subarray.modes, 
      [stationBeamId]: { 
        ...subarray.modes[stationBeamId], 
        [mode]: !subarray.modes[stationBeamId][mode] 
      } 
    };
    
    updatedSettings.modes = updatedModes;
    
    // Update corresponding settings
    const isEnabling = !subarray.modes[stationBeamId][mode];
    const modeSettings = updateModeSettings(subarray, mode, stationBeamId, isEnabling, telescope);
    
    // Merge settings
    Object.assign(updatedSettings, modeSettings);
    
    // Apply to all beams if needed
    if (subarray.applyToAll) {
      updatedSettings.modes = applySettingsToAllBeams({...subarray, modes: updatedModes}, 'modes', stationBeamId);
      
      // Apply settings to all beams as well
      if (modeSettings[`${mode}Settings`]) {
        updatedSettings[`${mode}Settings`] = applySettingsToAllBeams(
          {...subarray, [`${mode}Settings`]: modeSettings[`${mode}Settings`]}, 
          `${mode}Settings`, 
          stationBeamId
        );
      }
    }
  } else {
    // SKA-Mid logic (simpler as it doesn't have station beams)
    const beamId = 1;
    
    // Toggle mode
    const updatedModes = { 
      ...subarray.modes, 
      [beamId]: { 
        ...subarray.modes[beamId], 
        [mode]: !subarray.modes[beamId][mode] 
      } 
    };
    
    updatedSettings.modes = updatedModes;
    
    // Update corresponding settings
    const isEnabling = !subarray.modes[beamId][mode];
    const modeSettings = updateModeSettings(subarray, mode, beamId, isEnabling, telescope);
    
    // Merge settings
    Object.assign(updatedSettings, modeSettings);
  }
  
  return updatedSettings;
};

/**
 * Handles settings change for beams
 */
export const handleSettingsChange = (subarrays, id, settingType, field, value, telescope) => {
  const subarray = getSubarrayById(subarrays, id);
  let updatedSettings;
  
  if (!isSkaMid(telescope)) {
    const stationBeamId = subarray.selectedStationBeam;
    updatedSettings = { 
      ...subarray[settingType], 
      [stationBeamId]: { 
        ...subarray[settingType][stationBeamId], 
        [field]: value 
      } 
    };
    
    return applySettingsToAllBeams(
      {...subarray, [settingType]: updatedSettings}, 
      settingType, 
      stationBeamId
    );
  } else {
    updatedSettings = { 
      ...subarray[settingType], 
      1: { 
        ...subarray[settingType][1], 
        [field]: value 
      } 
    };
    
    return updatedSettings;
  }
};

/**
 * Creates settings for station beams
 */
export const createBeamSettings = (numBeams, telescope, telescopeContext) => {
  const channelWidth = getChannelWidth(telescope); // This is now a float
  const pssBeams = getPssBeams(telescope, telescopeContext);
  
  const newContinuumSettings = {};
  const newZoomSettings = {};
  const newPssSettings = {};
  const newPstSettings = {};
  const newModes = {};

  // Create settings for each beam
  for (let i = 1; i <= numBeams; i++) {
    const beamSettings = createDefaultBeamSettings(telescope, channelWidth, pssBeams, telescopeContext);
    
    newContinuumSettings[i] = beamSettings.continuum;
    newZoomSettings[i] = beamSettings.zoom;
    newPssSettings[i] = beamSettings.pss;
    newPstSettings[i] = beamSettings.pst;
    newModes[i] = beamSettings.modes;
  }
  
  return {
    continuumSettings: newContinuumSettings,
    zoomSettings: newZoomSettings,
    pssSettings: newPssSettings,
    pstSettings: newPstSettings,
    modes: newModes,
  };
};