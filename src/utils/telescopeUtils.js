import { 
    skaMidDefaults, 
    skaLowDefaults, 
    skaMidContChannelWidth, 
    skaLowContChannelWidth, 
    getPssBeamsByContext
  } from './defaultValues';
  
  /**
   * Determines if the current telescope is SKA-Mid
   */
  export const isSkaMid = (selectedMenu) => {
    return selectedMenu === 'SKA-Mid';
  };
  
  /**
   * Check if the context is an SV context
   */
  export const isSvContext = (telescopeContext) => {
    return telescopeContext === 'SV-AA2' || telescopeContext === 'SV-AA*';
  };
  
  /**
   * Check if the context is a cycle context
   */
  export const isCycleContext = (telescopeContext) => {
    return telescopeContext === 'Cycle0' || telescopeContext === 'Cycle 1';
  };
  
  /**
   * Gets the appropriate defaults based on current telescope selection
   */
  export const getDefaultValues = (selectedMenu, band = null) => {
    if (isSkaMid(selectedMenu)) {
      return band ? skaMidDefaults[band] : skaMidDefaults;
    }
    return skaLowDefaults;
  };
  
  /**
   * Creates default settings for a station beam
   */
  export const createDefaultBeamSettings = (selectedMenu, channelWidth, pssBeams, telescopeContext) => {
    const defaults = getDefaultValues(selectedMenu);
    
    return {
      continuum: {
        centralFrequency: isSkaMid(selectedMenu) ? '' : defaults.centralFrequency,
        bandwidth: isSkaMid(selectedMenu) ? '' : defaults.continuumBandwidth,
        channelWidth, // channelWidth is now a float
        enabled: false
      },
      zoom: {
        numberOfZoomChannels: '',
        zoomMode: '',
        enabled: false
      },
      pss: {
        numberOfBeams: pssBeams,
        centralFrequency: isSkaMid(selectedMenu) ? '' : defaults.centralFrequency,
        bandwidth: isSkaMid(selectedMenu) ? '' : defaults.pssBandwidth,
        enabled: false
      },
      pst: {
        timingModeBeams: 0,
        dynamicSpectrumBeams: 0,
        flowthroughModeBeams: 0,
        centralFrequency: isSkaMid(selectedMenu) ? '' : defaults.centralFrequency,
        bandwidth: isSkaMid(selectedMenu) ? '' : defaults.pstBandwidth,
        enabled: false
      },
      modes: { continuum: false, zoom: false, pss: false, pst: false }
    };
  };
  
  /**
   * Get the appropriate channel width based on telescope type
   */
  export const getChannelWidth = (selectedMenu) => {
    return isSkaMid(selectedMenu) ? skaMidContChannelWidth : skaLowContChannelWidth;
  };
  
  /**
   * Get the appropriate PSS beams based on telescope type and context
   */
  export const getPssBeams = (selectedMenu, telescopeContext) => {
    const pssBeamsByContext = getPssBeamsByContext(telescopeContext);
    return isSkaMid(selectedMenu) ? pssBeamsByContext.skaMidPssBeams : pssBeamsByContext.skaLowPssBeams;
  };