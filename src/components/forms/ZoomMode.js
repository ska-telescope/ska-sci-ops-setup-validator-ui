import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { skaMidZoomOptions, skaLowZoomOptions } from '../../utils/defaultValues';
import { defaultTimeAvgFactor, defaultFreqAvgFactor, additionalImageOptions, polarizationOptions, odpTypeOptions, defaultBriggsWeighting, defaultGaussianTaper } from '../../utils/defaultValues';
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';

const ZoomMode = ({ subarray, handleObservingModeChange, handleZoomSettingsChange, telescope, telescopeContext }) => {
  const [specifiedBandwidth, setSpecifiedBandwidth] = useState('');
  const stationBeamId = telescope === 'SKA-Low' ? subarray.selectedStationBeam : 1; // Get the selected station beam ID
  const isZoomEnabled = subarray.modes[stationBeamId]?.zoom || false;

  const zoomOptions = telescope === 'SKA-Mid' ? skaMidZoomOptions : skaLowZoomOptions;

  // State for ODP section
  const [selectedOdpType, setSelectedOdpType] = useState(null);
  const [odpList, setOdpList] = useState([]);
  const [odpLabel, setOdpLabel] = useState(''); // New state for ODP label

  // Add states for additional ODP settings
  const [timeAveraging, setTimeAveraging] = useState(defaultTimeAvgFactor);
  const [frequencyAveraging, setFrequencyAveraging] = useState(defaultFreqAvgFactor);
  const [makeMfsStokesI, setMakeMfsStokesI] = useState(false);
  const [makeChannelImages, setMakeChannelImages] = useState(false);

  // Add states for MFS Stokes I additional settings
  const [robustParameter, setRobustParameter] = useState(defaultBriggsWeighting);
  const [gaussianTaper, setGaussianTaper] = useState(defaultGaussianTaper);
  const [additionalImages, setAdditionalImages] = useState([]);

  // Add states for Channel Images additional settings
  const [channelCount, setChannelCount] = useState(1);
  const [channelPolarizations, setChannelPolarizations] = useState([]);
  const [channelRobustParameter, setChannelRobustParameter] = useState(defaultBriggsWeighting);
  const [channelGaussianTaper, setChannelGaussianTaper] = useState(defaultGaussianTaper);
  const [channelAdditionalImages, setChannelAdditionalImages] = useState([]);

  useEffect(() => {
    const zoomModeValue = parseFloat(subarray.zoomSettings[stationBeamId]?.zoomMode || '');
    const numberOfZoomChannels = parseInt(subarray.zoomSettings[stationBeamId]?.numberOfZoomChannels || '', 10);
    if (!isNaN(zoomModeValue) && !isNaN(numberOfZoomChannels)) {
      setSpecifiedBandwidth(`${(zoomModeValue * numberOfZoomChannels).toFixed(3)} kHz`);
    } else {
      setSpecifiedBandwidth('');
    }
  }, [subarray.zoomSettings[stationBeamId]?.zoomMode, subarray.zoomSettings[stationBeamId]?.numberOfZoomChannels]);

  // Reset additional fields when ODP type changes
  useEffect(() => {
    setTimeAveraging(defaultTimeAvgFactor);
    setFrequencyAveraging(defaultFreqAvgFactor);
    setMakeMfsStokesI(false);
    setMakeChannelImages(false);
    setRobustParameter(defaultBriggsWeighting);
    setGaussianTaper(defaultGaussianTaper);
    setAdditionalImages([]);
    setChannelCount(1);
    setChannelPolarizations([]);
    setChannelRobustParameter(defaultBriggsWeighting);
    setChannelGaussianTaper(defaultGaussianTaper);
    setChannelAdditionalImages([]);

    // Generate default label when ODP type changes
    if (selectedOdpType) {
      generateDefaultLabel(selectedOdpType.value);
    } else {
      setOdpLabel('');
    }
  }, [selectedOdpType]);

  // Generate a default label for the ODP based on type and existing ODPs
  const generateDefaultLabel = (odpType) => {
    if (!odpType) return;
    
    const typeLabel = odpType === 'calibrated_visibilities' ? 'Calibrated visibilities' : 'Image';
    
    // Find the highest number used in existing labels of this type
    let maxNumber = 0;
    odpList.forEach(odp => {
      if (odp.type === odpType && odp.label) {
        // Extract the number from the label if it follows the pattern "Type X"
        const match = odp.label.match(new RegExp(`${typeLabel} (\\d+)`));
        if (match && match[1]) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxNumber) {
            maxNumber = num;
          }
        }
      }
    });
    
    // Set the default label with the next available number
    setOdpLabel(`${typeLabel} ${maxNumber + 1}`);
  };

  // Load ODPs from subarray state when component mounts or subarray changes
  useEffect(() => {
    const storedOdps = subarray.zoomSettings[stationBeamId]?.odpList || [];
    // Transform stored ODPs to UI format with id and label properties
    const formattedOdps = storedOdps.map(odp => {
      // Find matching option to get the label
      const matchingOption = odpTypeOptions.find(option => option.value === odp.type);
      return {
        id: odp.id || Date.now() + Math.random(), // Use existing id or generate new one
        type: odp.type,
        label: odp.label || (matchingOption ? matchingOption.label : odp.type), // Use existing label if available
        settings: odp.settings || {} // Include any saved settings
      };
    });
    setOdpList(formattedOdps);
  }, [subarray.id, stationBeamId, subarray.zoomSettings]);

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
        label: odpLabel || selectedOdpType.label, // Use custom label or fall back to type label
        settings: settings
      };

      const updatedOdpListForUI = [...odpList, newOdpForUI];
      setOdpList(updatedOdpListForUI);

      // Create simplified version of the entire list for the API
      const updatedOdpListForAPI = updatedOdpListForUI.map(odp => ({
        type: odp.type,
        label: odp.label, // Include label in API data
        settings: odp.settings
      }));

      // Store the simplified list in the subarray state for API use
      handleZoomSettingsChange(subarray.id, 'odpList', updatedOdpListForAPI);

      // Reset the dropdown and additional fields after adding
      setSelectedOdpType(null);
      setOdpLabel(''); // Reset label field
      setTimeAveraging(defaultTimeAvgFactor);
      setFrequencyAveraging(defaultFreqAvgFactor);
      setMakeMfsStokesI(false);
      setMakeChannelImages(false);
      setRobustParameter(defaultBriggsWeighting);
      setGaussianTaper(defaultGaussianTaper);
      setAdditionalImages([]);
      setChannelCount(1);
      setChannelPolarizations([]);
      setChannelRobustParameter(defaultBriggsWeighting);
      setChannelGaussianTaper(defaultGaussianTaper);
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
      label: odp.label, // Include label in API data
      settings: odp.settings
    }));

    // Update the subarray state with the simplified ODP list
    handleZoomSettingsChange(subarray.id, 'odpList', updatedOdpListForAPI);
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

  // Format ODP display with settings - simplified to only show the label
  const formatOdpDisplay = (odp) => {
    return odp.label; // Return only the label without settings text
  };

  return (
    <div className="tab-content">
      <div className="form-group">
        <label>
          Enable zoom{telescope === 'SKA-Low' ? ` for station beam ${stationBeamId}` : ''}
        </label>
        <input
          type="checkbox"
          checked={isZoomEnabled}
          onChange={() => handleObservingModeChange(subarray.id, 'zoom')}
          style={{ marginRight: '8px' }}
        />
      </div>
      {subarray.modes[stationBeamId]?.zoom && (
        <>
          <div className="form-group">
            <label>No. of zoom channels{telescope === 'SKA-Low' ? ` for station beam ${stationBeamId}` : ''}:</label>
            <input
              type="number"
              value={subarray.zoomSettings[stationBeamId]?.numberOfZoomChannels || ''}
              onChange={(e) => handleZoomSettingsChange(subarray.id, 'numberOfZoomChannels', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Zoom mode{telescope === 'SKA-Low' ? ` for station beam ${stationBeamId}` : ''}:</label>
            <Select
              value={zoomOptions.find(option => option.value === subarray.zoomSettings[stationBeamId]?.zoomMode)}
              onChange={(option) => handleZoomSettingsChange(subarray.id, 'zoomMode', option.value)}
              options={zoomOptions}
            />
          </div>
          <div className="form-group">
            <label>Specified bandwidth{telescope === 'SKA-Low' ? ` for station beam ${stationBeamId}` : ''}:</label>
            <input
              type="text"
              value={specifiedBandwidth}
              readOnly
              style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
            />
          </div>

          {/* ODP Settings Section - Added from ContinuumMode */}
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
                  <AwesomeButton
                    type="primary"
                    onPress={handleAddOdp}
                    disabled={!selectedOdpType || (selectedOdpType?.value === 'images' && !makeMfsStokesI && !makeChannelImages)}
                    className="small-button"
                  >
                    Add ODP
                  </AwesomeButton>
                </div>
              </div>
            </div>

            {/* Add ODP Label input field */}
            {selectedOdpType && (
              <div className="form-group">
                <label>ODP label:</label>
                <input
                  type="text"
                  value={odpLabel}
                  onChange={(e) => setOdpLabel(e.target.value)}
                  placeholder="Enter a custom label for this ODP"
                />
              </div>
            )}

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

export default ZoomMode;