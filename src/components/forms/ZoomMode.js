import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { skaMidZoomOptions, skaLowZoomOptions } from '../../utils/defaultValues';

const ZoomMode = ({ subarray, handleObservingModeChange, handleZoomSettingsChange, telescope, telescopeContext }) => {
  const [specifiedBandwidth, setSpecifiedBandwidth] = useState('');
  const stationBeamId = telescope === 'SKA-Low' ? subarray.selectedStationBeam : 1; // Get the selected station beam ID
  const isDisabled = telescopeContext === 'SV-AA2'; // Only disable for SV-AA2, allow for other contexts including Cycle 1
  const isZoomEnabled = subarray.modes[stationBeamId]?.zoom || false;

  const zoomOptions = telescope === 'SKA-Mid' ? skaMidZoomOptions : skaLowZoomOptions;

  useEffect(() => {
    const zoomModeValue = parseFloat(subarray.zoomSettings[stationBeamId]?.zoomMode || '');
    const numberOfZoomChannels = parseInt(subarray.zoomSettings[stationBeamId]?.numberOfZoomChannels || '', 10);
    if (!isNaN(zoomModeValue) && !isNaN(numberOfZoomChannels)) {
      setSpecifiedBandwidth(`${(zoomModeValue * numberOfZoomChannels).toFixed(3)} kHz`);
    } else {
      setSpecifiedBandwidth('');
    }
  }, [subarray.zoomSettings[stationBeamId]?.zoomMode, subarray.zoomSettings[stationBeamId]?.numberOfZoomChannels]);

  return (
    <div className="tab-content">
      <div className="form-group">
        <label>
          Enable zoom{telescope === 'SKA-Low' ? ` for station beam ${stationBeamId}` : ''}
        </label>
        <input
          type="checkbox"
          checked={isZoomEnabled}
          onChange={() => !isDisabled && handleObservingModeChange(subarray.id, 'zoom')}
          disabled={isDisabled}
          style={{ marginRight: '8px' }}
        />
        {isDisabled && (
          <div className="zoom-disabled-message" style={{ color: 'red', marginTop: '10px' }}>
            Zoom mode is not available in this context
          </div>
        )}
      </div>
      {!isDisabled && subarray.modes[stationBeamId]?.zoom && (
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
        </>
      )}
    </div>
  );
};

export default ZoomMode;