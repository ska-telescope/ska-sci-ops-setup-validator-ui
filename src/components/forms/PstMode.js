import React from 'react';
import { skaMidPstBeams, skaLowPstBeams } from '../../utils/defaultValues';

const PstMode = ({ subarray, handleObservingModeChange, handlePstSettingsChange, telescope, telescopeContext }) => {
  const stationBeamId = telescope === 'SKA-Low' ? subarray.selectedStationBeam : 1; // Get the selected station beam ID
  const isPstEnabled = subarray.modes[stationBeamId]?.pst || false;
  
  // Get the appropriate default PST beams based on telescope type
  const defaultPstBeams = telescope === 'SKA-Mid' ? skaMidPstBeams : skaLowPstBeams;
  
  return (
    <div className="tab-content">
      <div className="form-group">
        <label>
          Enable PST{telescope === 'SKA-Low' ? `for station beam ${stationBeamId}` : ''}
        </label>
        <input
          type="checkbox"
          checked={isPstEnabled}
          onChange={() => handleObservingModeChange(subarray.id, 'pst')}
          style={{ marginRight: '8px' }}
        />
      </div>
      {subarray.modes[stationBeamId]?.pst && (
        <>
          <div className="form-group">
            <label>No. of PST timing beams{telescope === 'SKA-Low' ? `for station beam ${stationBeamId}` : ''}:</label>
            <input 
              type="number" 
              value={subarray.pstSettings[stationBeamId]?.timingModeBeams || defaultPstBeams} 
              onChange={(e) => handlePstSettingsChange(subarray.id, 'timingModeBeams', parseInt(e.target.value) || 0)}
              disabled={!subarray.modes[stationBeamId]?.pst}
            />
          </div>
          <div className="form-group">
            <label>No. of PST dynamic spectrum beams{telescope === 'SKA-Low' ? `for station beam ${stationBeamId}` : ''}:</label>
            <input 
              type="number" 
              value={subarray.pstSettings[stationBeamId]?.dynamicSpectrumBeams || defaultPstBeams} 
              onChange={(e) => handlePstSettingsChange(subarray.id, 'dynamicSpectrumBeams', parseInt(e.target.value) || 0)}
              disabled={!subarray.modes[stationBeamId]?.pst}
            />
          </div>
          <div className="form-group">
            <label>No. of PST flowthrough beams{telescope === 'SKA-Low' ? `for station beam ${stationBeamId}` : ''}:</label>
            <input 
              type="number" 
              value={subarray.pstSettings[stationBeamId]?.flowthroughModeBeams || defaultPstBeams} 
              onChange={(e) => handlePstSettingsChange(subarray.id, 'flowthroughModeBeams', parseInt(e.target.value) || 0)}
              disabled={!subarray.modes[stationBeamId]?.pst}
            />
          </div>
          <div className="form-group">
            <label>Central frequency (MHz){telescope === 'SKA-Low' ? `for station beam ${stationBeamId}` : ''}:</label>
            <input 
              type="number" 
              value={subarray.pstSettings[stationBeamId]?.centralFrequency || ''} 
              onChange={(e) => handlePstSettingsChange(subarray.id, 'centralFrequency', parseFloat(e.target.value) || '')}
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label>Bandwidth (MHz){telescope === 'SKA-Low' ? `for station beam ${stationBeamId}` : ''}:</label>
            <input 
              type="number" 
              value={subarray.pstSettings[stationBeamId]?.bandwidth || ''} 
              onChange={(e) => handlePstSettingsChange(subarray.id, 'bandwidth', parseFloat(e.target.value) || '')}
              step="0.01"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PstMode;