import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { defaultTimeAvgFactor, defaultFreqAvgFactor } from '../../utils/defaultValues';

const ContinuumMode = ({ subarray, handleObservingModeChange, handleContinuumSettingsChange, telescope }) => {
  const stationBeamId = telescope === 'SKA-Low' ? subarray.selectedStationBeam : 1; // Get the selected station beam ID
  const isContinuumEnabled = subarray.modes[stationBeamId]?.continuum || false;
  
  // State for the selected ODP type
  const [selectedOdpType, setSelectedOdpType] = useState(null);
  // Initialize ODPs from subarray state instead of empty array
  const [odpList, setOdpList] = useState([]);
  
  // Add states for additional ODP settings - using imported default values as integers
  const [timeAveraging, setTimeAveraging] = useState(defaultTimeAvgFactor);
  const [frequencyAveraging, setFrequencyAveraging] = useState(defaultFreqAvgFactor);
  const [makeMfsStokesI, setMakeMfsStokesI] = useState(false);
  const [makeChannelImages, setMakeChannelImages] = useState(false);
  
  // Add states for MFS Stokes I additional settings
  const [robustParameter, setRobustParameter] = useState(0.0);
  const [gaussianTaper, setGaussianTaper] = useState(0.0);
  const [additionalImages, setAdditionalImages] = useState([]);

  // Add states for Channel Images additional settings
  const [channelCount, setChannelCount] = useState(1);
  const [channelPolarizations, setChannelPolarizations] = useState([]);
  const [channelRobustParameter, setChannelRobustParameter] = useState(0.0);
  const [channelGaussianTaper, setChannelGaussianTaper] = useState(0.0);
  const [channelAdditionalImages, setChannelAdditionalImages] = useState([]);

  // Options for additional images multi-select
  const additionalImageOptions = [
    { value: 'residual', label: 'Residual' },
    { value: 'model', label: 'Model' },
    { value: 'psf', label: 'PSF' }
  ];

  // Options for polarization multi-select
  const polarizationOptions = [
    { value: 'I', label: 'I' },
    { value: 'Q', label: 'Q' },
    { value: 'U', label: 'U' },
    { value: 'V', label: 'V' }
  ];

  // ODP type options for the dropdown
  const odpTypeOptions = [
    { value: 'calibrated_visibilities', label: 'Calibrated visibilities' },
    { value: 'images', label: 'Images' }
  ];
  
  // Reset additional fields when ODP type changes
  useEffect(() => {
    setTimeAveraging(defaultTimeAvgFactor);
    setFrequencyAveraging(defaultFreqAvgFactor);
    setMakeMfsStokesI(false);
    setMakeChannelImages(false);
    setRobustParameter(0.0);
    setGaussianTaper(0.0);
    setAdditionalImages([]);
    setChannelCount(1);
    setChannelPolarizations([]);
    setChannelRobustParameter(0.0);
    setChannelGaussianTaper(0.0);
    setChannelAdditionalImages([]);
  }, [selectedOdpType]);
  
  // Load ODPs from subarray state when component mounts or subarray changes
  useEffect(() => {
    const storedOdps = subarray.continuumSettings[stationBeamId]?.odpList || [];
    // Transform stored ODPs to UI format with id and label properties
    const formattedOdps = storedOdps.map(odp => {
      // Find matching option to get the label
      const matchingOption = odpTypeOptions.find(option => option.value === odp.type);
      return {
        id: odp.id || Date.now() + Math.random(), // Use existing id or generate new one
        type: odp.type,
        label: matchingOption ? matchingOption.label : odp.type, // Get label from options or fallback to type
        settings: odp.settings || {} // Include any saved settings
      };
    });
    setOdpList(formattedOdps);
  }, [subarray.id, stationBeamId, subarray.continuumSettings]);
  
  // Handle adding an ODP to the list
  const handleAddOdp = () => {
    if (selectedOdpType) {
      // Create settings object based on ODP type
      let settings = {};
      
      if (selectedOdpType.value === 'calibrated_visibilities') {
        settings = {
          timeAveraging: parseInt(timeAveraging, 10) || defaultTimeAvgFactor,
          frequencyAveraging: parseInt(frequencyAveraging, 10) || defaultFreqAvgFactor
        };
      } else if (selectedOdpType.value === 'images') {
        settings = {
          makeMfsStokesI: makeMfsStokesI,
          makeChannelImages: makeChannelImages
        };
        
        // Add MFS Stokes I specific settings if it's enabled
        if (makeMfsStokesI) {
          settings.mfsStokesI = {
            robustParameter: parseFloat(robustParameter),
            gaussianTaper: parseFloat(gaussianTaper),
            additionalImages: additionalImages.map(img => img.value)
          };
        }
        
        // Add Channel Images specific settings if it's enabled
        if (makeChannelImages) {
          settings.channelImages = {
            channelCount: parseInt(channelCount, 10) || 1,
            polarizations: channelPolarizations.map(pol => pol.value),
            robustParameter: parseFloat(channelRobustParameter),
            gaussianTaper: parseFloat(channelGaussianTaper),
            additionalImages: channelAdditionalImages.map(img => img.value)
          };
        }
      }
      
      // Create a new ODP with UI-specific fields for the local state
      const newOdpForUI = {
        id: Date.now(), // Use timestamp as unique ID for UI operations
        type: selectedOdpType.value,
        label: selectedOdpType.label,
        settings: settings
      };
      
      const updatedOdpListForUI = [...odpList, newOdpForUI];
      setOdpList(updatedOdpListForUI);
      
      // Create simplified version of the entire list for the API
      const updatedOdpListForAPI = updatedOdpListForUI.map(odp => ({ 
        type: odp.type,
        settings: odp.settings
      }));
      
      // Store the simplified list in the subarray state for API use
      handleContinuumSettingsChange(subarray.id, 'odpList', updatedOdpListForAPI);
      
      // Reset the dropdown and additional fields after adding
      setSelectedOdpType(null);
      setTimeAveraging(defaultTimeAvgFactor);
      setFrequencyAveraging(defaultFreqAvgFactor);
      setMakeMfsStokesI(false);
      setMakeChannelImages(false);
      setRobustParameter(0.0);
      setGaussianTaper(0.0);
      setAdditionalImages([]);
      setChannelCount(1);
      setChannelPolarizations([]);
      setChannelRobustParameter(0.0);
      setChannelGaussianTaper(0.0);
      setChannelAdditionalImages([]);
    }
  };
  
  // Handle removing an ODP from the list
  const handleRemoveOdp = (odpId) => {
    const updatedOdpListForUI = odpList.filter(odp => odp.id !== odpId);
    setOdpList(updatedOdpListForUI);
    
    // Create simplified version for the API
    const updatedOdpListForAPI = updatedOdpListForUI.map(odp => ({ 
      type: odp.type,
      settings: odp.settings
    }));
    
    // Update the subarray state with the simplified ODP list
    handleContinuumSettingsChange(subarray.id, 'odpList', updatedOdpListForAPI);
  };

  // Render different input fields based on selected ODP type
  const renderOdpTypeSettings = () => {
    if (!selectedOdpType) return null;

    switch (selectedOdpType.value) {
      case 'calibrated_visibilities':
        return (
          <>
            <div className="form-group" style={{ gridColumn: '1 / 6' }}>
              <label>Time averaging factor:</label>
              <input 
                type="number" 
                className="no-spinner"
                value={timeAveraging}
                onChange={(e) => setTimeAveraging(parseInt(e.target.value, 10) || defaultTimeAvgFactor)}
                min="1"
                step="1"
              />
            </div>
            
            <div className="form-group" style={{ gridColumn: '1 / 6' }}>
              <label>Frequency averaging factor:</label>
              <input 
                type="number" 
                className="no-spinner"
                value={frequencyAveraging}
                onChange={(e) => setFrequencyAveraging(parseInt(e.target.value, 10) || defaultFreqAvgFactor)}
                min="1"
                step="1"
              />
            </div>
          </>
        );
      case 'images':
        return (
          <>
            <div className="form-group" style={{ gridColumn: '1 / 6', display: 'flex', alignItems: 'center' }}>
              <label style={{ marginRight: '10px' }}>MFS Stokes I image:</label>
              <input 
                type="checkbox"
                checked={makeMfsStokesI}
                onChange={(e) => setMakeMfsStokesI(e.target.checked)}
              />
            </div>

            {/* MFS Stokes I parameters - always visible but conditionally disabled */}
            <div className="form-group" style={{ 
              gridColumn: '1 / 6',
              opacity: makeMfsStokesI ? 1 : 0.6 
            }}>
              <label>Robust parameter:</label>
              <input 
                type="number" 
                className="no-spinner"
                value={robustParameter}
                onChange={(e) => setRobustParameter(e.target.value)}
                step="0.1"
                disabled={!makeMfsStokesI}
              />
            </div>
            
            <div className="form-group" style={{ 
              gridColumn: '1 / 6',
              opacity: makeMfsStokesI ? 1 : 0.6
            }}>
              <label>Gaussian taper (arcsec):</label>
              <input 
                type="number" 
                className="no-spinner"
                value={gaussianTaper}
                onChange={(e) => setGaussianTaper(e.target.value)}
                min="0"
                step="0.1"
                disabled={!makeMfsStokesI}
              />
            </div>
            
            <div className="form-group" style={{ 
              gridColumn: '1 / 6',
              opacity: makeMfsStokesI ? 1 : 0.6
            }}>
              <label>Export additional images:</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 2 }}>
                  <Select 
                    isMulti
                    value={additionalImages}
                    onChange={setAdditionalImages}
                    options={additionalImageOptions}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    isDisabled={!makeMfsStokesI}
                  />
                </div>
                <div style={{ flex: 1 }}></div>
              </div>
            </div>

            <div className="form-group" style={{ gridColumn: '1 / 6', display: 'flex', alignItems: 'center' }}>
              <label style={{ marginRight: '10px' }}>Make channel images:</label>
              <input 
                type="checkbox"
                checked={makeChannelImages}
                onChange={(e) => setMakeChannelImages(e.target.checked)}
              />
            </div>
            
            {/* Channel Images parameters - always visible but conditionally disabled */}
            <div className="form-group" style={{ 
              gridColumn: '1 / 6',
              opacity: makeChannelImages ? 1 : 0.6 
            }}>
              <label>Number of channels to image:</label>
              <input 
                type="number" 
                className="no-spinner"
                value={channelCount}
                onChange={(e) => setChannelCount(parseInt(e.target.value, 10) || 1)}
                min="1"
                step="1"
                disabled={!makeChannelImages}
              />
            </div>
            
            <div className="form-group" style={{ 
              gridColumn: '1 / 6',
              opacity: makeChannelImages ? 1 : 0.6 
            }}>
              <label>Polarization to image:</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 2 }}>
                  <Select 
                    isMulti
                    value={channelPolarizations}
                    onChange={setChannelPolarizations}
                    options={polarizationOptions}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    isDisabled={!makeChannelImages}
                  />
                </div>
                <div style={{ flex: 1 }}></div>
              </div>
            </div>
            
            <div className="form-group" style={{ 
              gridColumn: '1 / 6',
              opacity: makeChannelImages ? 1 : 0.6 
            }}>
              <label>Robust parameter:</label>
              <input 
                type="number" 
                className="no-spinner"
                value={channelRobustParameter}
                onChange={(e) => setChannelRobustParameter(e.target.value)}
                step="0.1"
                disabled={!makeChannelImages}
              />
            </div>
            
            <div className="form-group" style={{ 
              gridColumn: '1 / 6',
              opacity: makeChannelImages ? 1 : 0.6 
            }}>
              <label>Gaussian taper (arcsec):</label>
              <input 
                type="number" 
                className="no-spinner"
                value={channelGaussianTaper}
                onChange={(e) => setChannelGaussianTaper(e.target.value)}
                min="0"
                step="0.1"
                disabled={!makeChannelImages}
              />
            </div>
            
            <div className="form-group" style={{ 
              gridColumn: '1 / 6',
              opacity: makeChannelImages ? 1 : 0.6 
            }}>
              <label>Export additional images:</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 2 }}>
                  <Select 
                    isMulti
                    value={channelAdditionalImages}
                    onChange={setChannelAdditionalImages}
                    options={additionalImageOptions}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    isDisabled={!makeChannelImages}
                  />
                </div>
                <div style={{ flex: 1 }}></div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  // Format ODP display with settings
  const formatOdpDisplay = (odp) => {
    let settingsText = '';
    
    if (odp.type === 'calibrated_visibilities' && odp.settings) {
      if (odp.settings.timeAveraging) {
        settingsText += ` (Time avg factor: ${odp.settings.timeAveraging}`;
        if (odp.settings.frequencyAveraging) {
          settingsText += `, Freq avg factor: ${odp.settings.frequencyAveraging})`;
        } else {
          settingsText += ')';
        }
      } else if (odp.settings.frequencyAveraging) {
        settingsText += ` (Freq avg factor: ${odp.settings.frequencyAveraging})`;
      }
    } else if (odp.type === 'images' && odp.settings) {
      const imageTypes = [];
      if (odp.settings.makeMfsStokesI) {
        imageTypes.push('MFS Stokes I');
        
        // Add MFS Stokes I specific settings if present
        if (odp.settings.mfsStokesI) {
          const mfsSettings = [];
          
          if (odp.settings.mfsStokesI.robustParameter !== undefined) {
            mfsSettings.push(`robust=${odp.settings.mfsStokesI.robustParameter}`);
          }
          
          if (odp.settings.mfsStokesI.gaussianTaper !== undefined) {
            mfsSettings.push(`taper=${odp.settings.mfsStokesI.gaussianTaper}`);
          }
          
          if (odp.settings.mfsStokesI.additionalImages && odp.settings.mfsStokesI.additionalImages.length > 0) {
            mfsSettings.push(`+${odp.settings.mfsStokesI.additionalImages.join(',')}`);
          }
          
          if (mfsSettings.length > 0) {
            imageTypes[0] += ` (${mfsSettings.join(', ')})`;
          }
        }
      }
      
      if (odp.settings.makeChannelImages) {
        let channelText = 'Channel images';
        
        // Add Channel Images specific settings if present
        if (odp.settings.channelImages) {
          const channelSettings = [];
          
          if (odp.settings.channelImages.channelCount !== undefined) {
            channelText = `${odp.settings.channelImages.channelCount} Channel images`;
          }
          
          if (odp.settings.channelImages.polarizations && odp.settings.channelImages.polarizations.length > 0) {
            channelSettings.push(`${odp.settings.channelImages.polarizations.join(',')}`);
          }
          
          if (odp.settings.channelImages.robustParameter !== undefined) {
            channelSettings.push(`robust=${odp.settings.channelImages.robustParameter}`);
          }
          
          if (odp.settings.channelImages.gaussianTaper !== undefined) {
            channelSettings.push(`taper=${odp.settings.channelImages.gaussianTaper}`);
          }
          
          if (odp.settings.channelImages.additionalImages && odp.settings.channelImages.additionalImages.length > 0) {
            channelSettings.push(`+${odp.settings.channelImages.additionalImages.join(',')}`);
          }
          
          if (channelSettings.length > 0) {
            channelText += ` (${channelSettings.join(', ')})`;
          }
        }
        
        imageTypes.push(channelText);
      }
      
      if (imageTypes.length > 0) {
        settingsText = ` (${imageTypes.join(', ')})`;
      }
    }
    
    return `${odp.label}${settingsText}`;
  };

  return (
    <div className="tab-content">
      <div className="form-group">
        <label>
          Enable continuum{telescope === 'SKA-Low' ? ` for station beam ${stationBeamId}` : ''}
        </label>
        <input
            type="checkbox"
            checked={isContinuumEnabled}
            onChange={() => handleObservingModeChange(subarray.id, 'continuum')}
            style={{ marginRight: '8px' }}
          />
      </div>
      {subarray.modes[stationBeamId]?.continuum && (
        <>
          <div className="form-group">
            <label>Central frequency (MHz){telescope === 'SKA-Low' ? ` for station beam ${stationBeamId}` : ''}:</label>
            <input 
              type="number" 
              className="no-spinner"
              value={subarray.continuumSettings[stationBeamId]?.centralFrequency || ''} 
              onChange={(e) => handleContinuumSettingsChange(subarray.id, 'centralFrequency', parseFloat(e.target.value) || '')}
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label>Bandwidth (MHz){telescope === 'SKA-Low' ? ` for station beam ${stationBeamId}` : ''}:</label>
            <input 
              type="number" 
              className="no-spinner"
              value={subarray.continuumSettings[stationBeamId]?.bandwidth || ''} 
              onChange={(e) => handleContinuumSettingsChange(subarray.id, 'bandwidth', parseFloat(e.target.value) || '')}
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label>Channel width (kHz){telescope === 'SKA-Low' ? ` for station beam ${stationBeamId}` : ''}:</label>
            <input 
              type="number" 
              className="no-spinner"
              value={subarray.continuumSettings[stationBeamId]?.channelWidth !== undefined ? subarray.continuumSettings[stationBeamId].channelWidth : ''} 
              onChange={(e) => handleContinuumSettingsChange(subarray.id, 'channelWidth', parseFloat(e.target.value) || '')}
              step="0.01"
              disabled
            />
          </div>
          <h4 className="left-aligned">
            Observatory Data Products (ODP) settings{telescope === 'SKA-Low' ? ` for station beam ${stationBeamId}` : ''}
          </h4>
          
          <div className="tab-content">
            <div className="form-group">
              <label>ODP Type:</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 2 }}>
                  <Select 
                    value={selectedOdpType}
                    onChange={setSelectedOdpType}
                    options={odpTypeOptions}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={handleAddOdp}
                    disabled={!selectedOdpType}
                    style={{ 
                      padding: '8px 16px', 
                      backgroundColor: '#1976d2', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px',
                      cursor: 'pointer',
                      width: '100%'
                    }}
                  >
                    Add ODP
                  </button>
                </div>
              </div>
            </div>
            
            <div className="odp-settings">
              {/* Conditional ODP type-specific settings */}
              {renderOdpTypeSettings()}
            </div>
          </div>
          
          {/* ODP List Display */}
          <div className="odp-list-container" style={{ marginTop: '10px' }}>
            <h5 className="left-aligned">Specified ODPs</h5>
            {odpList.length === 0 ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>
                No ODP specified. Use the form above to add ODPs.
              </p>
            ) : (
              <ul style={{ 
                listStyle: 'none', 
                padding: '0',
                margin: '0'
              }}>
                {odpList.map((odp) => (
                  <li key={odp.id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px',
                    margin: '4px 0',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px'
                  }}>
                    <span>{formatOdpDisplay(odp)}</span>
                    <button
                      onClick={() => handleRemoveOdp(odp.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ff5252',
                        cursor: 'pointer',
                        fontSize: '16px'
                      }}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ContinuumMode;