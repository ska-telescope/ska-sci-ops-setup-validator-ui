export const skaMidDefaults = {
    'Band 1': { centralFrequency: 797.5, continuumBandwidth: 720, pstBandwidth: 720, pssBandwidth: 300 },
    'Band 2': { centralFrequency: 1310, continuumBandwidth: 810, pstBandwidth: 810, pssBandwidth: 300 },
    'Band 5a': { centralFrequency: 6550, continuumBandwidth: 3900, pstBandwidth: 2500, pssBandwidth: 300 },
    'Band 5b': { centralFrequency: 11850, continuumBandwidth: 5000, pstBandwidth: 2500, pssBandwidth: 300 }
  };
  
  export const skaMidDefaultBand = 'Band 1';
  
  export const skaLowDefaults = { centralFrequency: 200, continuumBandwidth: 300, pstBandwidth: 300, pssBandwidth: 118.52 };
  
  // Continuum channel widths as floats instead of strings
  export const skaMidContChannelWidth = 13.4;
  export const skaLowContChannelWidth = 5.4;
  
  // Context-specific PSS beam values
  export const getPssBeamsByContext = (context) => {
    if (context === 'SV-AA2' || context === 'SV-AA*') {
      return {
        skaMidPssBeams: 1,
        skaLowPssBeams: 1
      };
    } else if (context === 'Cycle 0') {
      return {
        skaMidPssBeams: 1125,
        skaLowPssBeams: 250
      };
    } else if (context === 'Cycle 1') {
      return {
        skaMidPssBeams: 1125,
        skaLowPssBeams: 250
      };
    } else {
      // Default values if no context is specified
      return {
        skaMidPssBeams: 1125,
        skaLowPssBeams: 250
      };
    }
  };
  
  // Context-specific maximum number of subarrays
  export const getMaxSubarraysByContext = (context) => {
    if (context === 'SV-AA2' || context === 'SV-AA*') {
      return 1;
    } else if (context === 'Cycle 0') {
      return 4;
    } else if (context === 'Cycle 1') {
      return 16;
    } else {
      // Default value if no context is specified
      return 16;
    }
  };
  
  // Add context options for UI dropdown
  export const telescopeContextOptions = [
    { value: 'SV-AA2', label: 'SV-AA2' },
    { value: 'SV-AA*', label: 'SV-AA*' },
    { value: 'Cycle 0', label: 'Cycle 0' },
    { value: 'Cycle 1', label: 'Cycle 1' }
  ];
  
  // Default number of PST beams
  export const skaMidPstBeams = 1;
  export const skaLowPstBeams = 1;
  
  export const skaMidDefaultSubarrayTemplate = 'Mid_full_AAstar';
  export const skaLowDefaultSubarrayTemplate = 'Low_full_AAstar';
  
  export const bandOptions = Object.keys(skaMidDefaults).map(band => ({ value: band, label: band }));
  
  export const skaMidTemplateNames = [
    'Mid_full_AAstar',
    'Mid_13.5m_AAstar',
    'Mid_15m_AAstar',
    'Mid_inner_r125m_AAstar',
    'Mid_inner_r250m_AAstar',
    'Mid_inner_r500m_AAstar',
    'Mid_inner_r1km_AAstar',
    'Mid_inner_r2km_AAstar',
    'Mid_inner_r4km_AAstar',
    'Mid_inner_r8km_AAstar',
    'Mid_inner_r16km_AAstar',
    'Mid_inner_r20km_AAstar',
    'Mid_inner_r32km_AAstar',
    'Mid_outer_r125m_AAstar',
    'Mid_outer_r250m_AAstar',
    'Mid_outer_r500m_AAstar',
    'Mid_outer_r1km_AAstar',
    'Mid_outer_r2km_AAstar',
    'Mid_outer_r4km_AAstar',
    'Mid_outer_r8km_AAstar',
    'Mid_4ant_band1_AAstar',
    'Mid_4ant_band2_AAstar',
    'Mid_4ant_band5a_AAstar'
  ];
  
  export const skaMidTemplateOptions = skaMidTemplateNames.map(name => ({ value: name, label: name }));
  
  export const skaLowTemplateNames = [
    'Low_full_AAstar',
    'Low_inner_r350m_AAstar',
    'Low_inner_r700m_AAstar',
    'Low_inner_r1.5km_AAstar',
    'Low_inner_r3km_AAstar',
    'Low_inner_r6km_AAstar',
    'Low_inner_r12km_AAstar',
    'Low_inner_r24km_AAstar',
    'Low_outer_r350m_AAstar',
    'Low_outer_r700m_AAstar',
    'Low_outer_r1.5km_AAstar',
    'Low_outer_r3km_AAstar',
    'Low_outer_r6km_AAstar',
    'Low_outer_r12km_AAstar',
    'Low_outer_r24km_AAstar',
    'Low_inner_400m_sparse_AAstar',
    'Low_reduced_inner_400m_AAstar',
    'Low_remote_phased_AAstar',
    'Low_remote_single_AAstar',
    'Low_4stat_AAstar',
    'Low_substation_18m_r1km_AAstar'
  ];
  
  export const skaLowTemplateOptions = skaLowTemplateNames.map(name => ({ value: name, label: name }));
  
  export const skaMidZoomNames = [
    '0.21 kHz',
    '0.42 kHz',
    '0.84 kHz',
    '1.68 kHz',
    '3.36 kHz',
    '6.72 kHz'
  ];
  
  export const skaMidZoomOptions = skaMidZoomNames.map(name => ({ value: name, label: name }));
  
  export const skaLowZoomNames = [
    '0.226 kHz',
    '0.452 kHz',
    '0.904 kHz',
    '1.808 kHz'
  ];
  
  export const skaLowZoomOptions = skaLowZoomNames.map(name => ({ value: name, label: name }));