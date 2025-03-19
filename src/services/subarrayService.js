import { 
    createDefaultBeamSettings, 
    isSkaMid,
    getDefaultValues,
    getChannelWidth,
    getPssBeams
  } from '../utils/telescopeUtils';
  import {
    skaMidDefaultSubarrayTemplate,
    skaLowDefaultSubarrayTemplate,
    skaMidDefaultBand
  } from '../utils/defaultValues';
  
  /**
   * Creates a new subarray with default settings
   */
  export const createNewSubarray = (id, telescope, telescopeContext) => {
    const channelWidth = getChannelWidth(telescope);
    const pssBeams = getPssBeams(telescope, telescopeContext);
    const beamSettings = createDefaultBeamSettings(telescope, channelWidth, pssBeams, telescopeContext);
    
    // Create base subarray object
    const subarray = {
      id,
      name: `Subarray ${id}`,
      template: isSkaMid(telescope) ? skaMidDefaultSubarrayTemplate : skaLowDefaultSubarrayTemplate,
      band: isSkaMid(telescope) ? skaMidDefaultBand : '',
      modes: { 1: beamSettings.modes },
      continuumSettings: { 1: beamSettings.continuum },
      zoomSettings: { 1: beamSettings.zoom },
      pssSettings: { 1: beamSettings.pss },
      pstSettings: { 1: beamSettings.pst }
    };
    
    // Set station beam properties for SKA-Low (doesn't apply to SKA-Mid)
    subarray.stationBeams = 1;
    subarray.selectedStationBeam = 1;
    
    return subarray;
  };
  
  /**
   * Get a subarray by its id from an array of subarrays
   */
  export const getSubarrayById = (subarrays, id) => {
    return subarrays.find(subarray => subarray.id === id);
  };
  
  /**
   * Apply settings to all beams from the current beam
   */
  export const applySettingsToAllBeams = (subarray, settingType, currentBeamId) => {
    if (!subarray.applyToAll) return subarray[settingType];
    
    const updatedSettings = { ...subarray[settingType] };
    const currentBeamSettings = updatedSettings[currentBeamId];
    
    for (let i = 1; i <= subarray.stationBeams; i++) {
      updatedSettings[i] = { ...currentBeamSettings };
    }
    
    return updatedSettings;
  };