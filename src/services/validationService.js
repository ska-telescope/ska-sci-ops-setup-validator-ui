import { isSkaMid } from '../utils/telescopeUtils';

/**
 * Validates Mid telescope configuration
 */
export const validateMidSetup = (subarrays, telescopeContext) => {
  const subarrayConfigurations = {};

  subarrays.forEach(subarray => {
    subarrayConfigurations[subarray.id] = {
      template: subarray.template,
      band: subarray.band,
      modes: subarray.modes,
      continuumSettings: subarray.continuumSettings,
      zoomSettings: subarray.zoomSettings,
      pssSettings: subarray.pssSettings,
      pstSettings: subarray.pstSettings
    };
  });

  const invalidSubarrays = subarrays.filter(subarray => 
    subarray.template === '' || 
    subarray.band === '' || 
    !Object.values(subarray.modes).some(modes => Object.values(modes).some(mode => mode))
  );

  // Wrap subarrayConfigurations into telescopeConfiguration
  const telescopeConfiguration = {
    context: telescopeContext,
    telescopeType: 'SKA-Mid',
    subarrays: subarrayConfigurations
  };

  return { telescopeConfiguration, invalidSubarrays };
};

/**
 * Validates Low telescope configuration
 */
export const validateLowSetup = (subarrays, telescopeContext) => {
  const subarrayConfigurations = {};

  subarrays.forEach(subarray => {
    subarrayConfigurations[subarray.id] = {
      template: subarray.template,
      modes: subarray.modes,
      continuumSettings: subarray.continuumSettings,
      zoomSettings: subarray.zoomSettings,
      pssSettings: subarray.pssSettings,
      pstSettings: subarray.pstSettings
    };
  });

  const invalidSubarrays = subarrays.filter(subarray => 
    subarray.template === '' || 
    !Object.values(subarray.modes).some(modes => 
      Object.values(modes).some(mode => mode)
    )
  );

  // Wrap subarrayConfigurations into telescopeConfiguration
  const telescopeConfiguration = {
    context: telescopeContext,
    telescopeType: 'SKA-Low',
    subarrays: subarrayConfigurations
  };

  return { telescopeConfiguration, invalidSubarrays };
};

/**
 * Validates the current setup based on the selected telescope
 */
export const validateSetup = (subarrays, telescope, telescopeContext) => {
  return isSkaMid(telescope) 
    ? validateMidSetup(subarrays, telescopeContext) 
    : validateLowSetup(subarrays, telescopeContext);
};

/**
 * Submit validation to the backend
 */
export const submitValidation = async (telescopeConfiguration) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(telescopeConfiguration)
    });

    if (response.ok) {
      const result = await response.json();
      return { 
        success: true, 
        result,
        displayMessage: result.message
      };
    } else {
      const errorText = await response.text();
      return { 
        success: false, 
        error: `Backend validation failed: ${errorText}`,
        displayMessage: `Backend validation failed: ${errorText}`
      };
    }
  } catch (error) {
    return { 
      success: false, 
      error: `Error connecting to backend: ${error.message}`,
      displayMessage: `Error connecting to backend: ${error.message}. Please make sure the backend server is running at http://127.0.0.1:8000`
    };
  }
};