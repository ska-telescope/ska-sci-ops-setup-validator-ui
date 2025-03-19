import React from 'react';

const ContinuumMode = ({ subarray, handleObservingModeChange, handleContinuumSettingsChange, telescope }) => {
  const stationBeamId = telescope === 'SKA-Low' ? subarray.selectedStationBeam : 1; // Get the selected station beam ID
  const isContinuumEnabled = subarray.modes[stationBeamId]?.continuum || false;

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
        </>
      )}
    </div>
  );
};

export default ContinuumMode;