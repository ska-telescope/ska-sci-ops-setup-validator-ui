import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const ContinuumMode = ({ subarray, handleObservingModeChange, handleContinuumSettingsChange, telescope }) => {
  const stationBeamId = telescope === 'SKA-Low' ? subarray.selectedStationBeam : 1; // Get the selected station beam ID
  const isContinuumEnabled = subarray.modes[stationBeamId]?.continuum || false;
  
  // State for the selected ODP type
  const [selectedOdpType, setSelectedOdpType] = useState(null);
  // Initialize ODPs from subarray state instead of empty array
  const [odpList, setOdpList] = useState([]);

  // ODP type options for the dropdown
  const odpTypeOptions = [
    { value: 'calibrated_visibilities', label: 'Calibrated visibilities' },
    { value: 'images', label: 'Images' }
  ];
  
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
        label: matchingOption ? matchingOption.label : odp.type // Get label from options or fallback to type
      };
    });
    setOdpList(formattedOdps);
  }, [subarray.id, stationBeamId, subarray.continuumSettings]);
  
  // Handle adding an ODP to the list
  const handleAddOdp = () => {
    if (selectedOdpType) {
      // Create a new ODP with UI-specific fields for the local state
      const newOdpForUI = {
        id: Date.now(), // Use timestamp as unique ID for UI operations
        type: selectedOdpType.value,
        label: selectedOdpType.label
      };
      
      const updatedOdpListForUI = [...odpList, newOdpForUI];
      setOdpList(updatedOdpListForUI);
      
      // Create simplified version of the entire list for the API
      const updatedOdpListForAPI = updatedOdpListForUI.map(odp => ({ type: odp.type }));
      
      // Store the simplified list in the subarray state for API use
      handleContinuumSettingsChange(subarray.id, 'odpList', updatedOdpListForAPI);
      
      // Reset the dropdown after adding
      setSelectedOdpType(null);
    }
  };
  
  // Handle removing an ODP from the list
  const handleRemoveOdp = (odpId) => {
    const updatedOdpListForUI = odpList.filter(odp => odp.id !== odpId);
    setOdpList(updatedOdpListForUI);
    
    // Create simplified version for the API
    const updatedOdpListForAPI = updatedOdpListForUI.map(odp => ({ type: odp.type }));
    
    // Update the subarray state with the simplified ODP list
    handleContinuumSettingsChange(subarray.id, 'odpList', updatedOdpListForAPI);
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
          <div className="odp-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(5, 1fr)', 
            gap: '10px', 
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <div style={{ gridColumn: '1' }}>
              <label>ODP Type:</label>
            </div>
            <div style={{ gridColumn: '2 / 4' }}>
              <Select 
                value={selectedOdpType}
                onChange={setSelectedOdpType}
                options={odpTypeOptions}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
            <div style={{ gridColumn: '4 / 6' }}>
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
                    <span>{odp.label}</span>
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