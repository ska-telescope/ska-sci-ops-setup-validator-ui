import React from 'react';
import { getPssBeamsByContext } from '../../utils/defaultValues';

const PssMode = ({ subarray, handleObservingModeChange, handlePssSettingsChange, telescope, telescopeContext }) => {
  const stationBeamId = telescope === 'SKA-Low' ? subarray.selectedStationBeam : 1; // Get the selected station beam ID
  const isPssEnabled = subarray.modes[stationBeamId]?.pss || false;
  const isSvContext = telescopeContext === 'SV-AA2' || telescopeContext === 'SV-AA*';
  
  // Get context-specific PSS beam value
  const pssBeamsValue = isSvContext ? 
    (telescope === 'SKA-Mid' ? 
      getPssBeamsByContext(telescopeContext).skaMidPssBeams : 
      getPssBeamsByContext(telescopeContext).skaLowPssBeams) : 
    subarray.pssSettings[stationBeamId]?.numberOfBeams || '';
  
  return (
    <div className="tab-content">
      <div className="form-group">
        <label>
          Enable PSS{telescope === 'SKA-Low' ? ` for station beam ${stationBeamId}` : ''}
        </label>
        <input
          type="checkbox"
          checked={isPssEnabled}
          onChange={() => handleObservingModeChange(subarray.id, 'pss')}
          style={{ marginRight: '8px' }}
        />
      </div>
      {subarray.modes[stationBeamId]?.pss && (
        <>
          <div className="form-group">
            <label>No. of PSS beams{telescope === 'SKA-Low' ? ` for station beam ${stationBeamId}` : ''}:</label>
            {isSvContext ? (
              <input 
                type="number" 
                value={pssBeamsValue} 
                disabled={true}
                style={{ backgroundColor: '#e9ecef' }}
              />
            ) : (
              <input 
                type="number" 
                value={pssBeamsValue} 
                onChange={(e) => handlePssSettingsChange(subarray.id, 'numberOfBeams', parseInt(e.target.value) || '')}
                disabled={!subarray.modes[stationBeamId]?.pss}
              />
            )}
          </div>
          <div className="form-group">
            <label>Central frequency (MHz){telescope === 'SKA-Low' ? ` for station beam ${stationBeamId}` : ''}:</label>
            <input 
              type="number" 
              value={subarray.pssSettings[stationBeamId]?.centralFrequency || ''} 
              onChange={(e) => handlePssSettingsChange(subarray.id, 'centralFrequency', parseFloat(e.target.value) || '')} 
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label>Bandwidth (MHz){telescope === 'SKA-Low' ? ` for station beam ${stationBeamId}` : ''}:</label>
            <input 
              type="number" 
              value={subarray.pssSettings[stationBeamId]?.bandwidth || ''} 
              onChange={(e) => handlePssSettingsChange(subarray.id, 'bandwidth', parseFloat(e.target.value) || '')} 
              step="0.01"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PssMode;