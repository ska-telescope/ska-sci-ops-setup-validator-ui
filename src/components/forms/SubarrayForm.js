import React from 'react';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Select from 'react-select';
import { bandOptions, skaMidTemplateOptions, skaLowTemplateOptions } from '../../utils/defaultValues';
import ContinuumMode from './ContinuumMode';
import ZoomMode from './ZoomMode';
import PssMode from './PssMode';
import PstMode from './PstMode';

const SubarrayForm = ({ 
  subarray, 
  handleSubarrayTemplateChange, 
  handleBandChange, 
  handleObservingModeChange, 
  handleContinuumSettingsChange, 
  handlePssSettingsChange, 
  handlePstSettingsChange, 
  handleZoomSettingsChange, 
  telescope, 
  handleStationBeamsChange, 
  handleSelectedStationBeamChange, 
  handleApplyToAllStationBeamsChange,
  telescopeContext 
}) => {
  const isSkaMid = telescope === 'SKA-Mid';
  const templateOptions = isSkaMid ? skaMidTemplateOptions : skaLowTemplateOptions;
  
  return (
    <div className="subarray-form-container">
      <h3 className="left-aligned">Subarray setup</h3>
      <form className="form-grid">
        {/* Band selection - only shown for SKA-Mid */}
        {isSkaMid && (
          <div className="form-group">
            <label>Observing band:</label>
            <Select 
              value={bandOptions.find(option => option.value === subarray.band) || bandOptions[0]} 
              onChange={(option) => handleBandChange(subarray.id, option.value)}
              options={bandOptions}
            />
          </div>
        )}

        {/* Template selection - shown for both */}
        <div className="form-group">
          <label>Subarray template:</label>
          <Select 
            value={templateOptions.find(option => option.value === subarray.template) || templateOptions[0]} 
            onChange={(option) => handleSubarrayTemplateChange(subarray.id, option.value)}
            options={templateOptions}
          />
        </div>

        {/* Station beam controls - only shown for SKA-Low */}
        {!isSkaMid && (
          <>
            <div className="form-group">
              <label>No. of station beams:</label>
              <input 
                type="number" 
                value={subarray.stationBeams} 
                min="1" 
                max="48" 
                onChange={(e) => handleStationBeamsChange(subarray.id, e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Pick a station beam to edit:</label>
              <Select 
                value={{ value: subarray.selectedStationBeam, label: `station beam ${subarray.selectedStationBeam}` }} 
                onChange={(option) => handleSelectedStationBeamChange(subarray.id, option.value)}
                options={Array.from({ length: subarray.stationBeams }, (_, i) => ({ 
                  value: i + 1, 
                  label: `station beam ${i + 1}` 
                }))}
              />
            </div>
          </>
        )}
      </form>

      <h3 className="left-aligned">
        {!isSkaMid ? 
          `Observing mode for station beam ${subarray.selectedStationBeam}` : 
          'Observing mode'}
      </h3>

      <div className="context-info" style={{ margin: '10px 0', fontSize: '0.9em', color: '#666', textAlign: 'left' }}>
        Use the tabs below to configure the observing mode for the selected subarray{!isSkaMid ? ' and station beam' : ''}.
      </div>

      {/* Apply to all station beams option - only shown for SKA-Low */}
      {!isSkaMid && (
        <div className="form-grid">
          <div className="form-group">
            <label>Apply this to all station beams:</label>
            <input 
              type="checkbox"
              checked={subarray.applyToAll || false}
              onChange={(e) => handleApplyToAllStationBeamsChange(subarray.id, e.target.checked)}
            />
          </div>
        </div>
      )}

      <Tabs>
        <TabList>
          <Tab>Continuum</Tab>
          <Tab>Zoom</Tab>
          <Tab>PSS</Tab>
          <Tab>PST</Tab>
        </TabList>

        <TabPanel>
          <ContinuumMode 
            subarray={subarray} 
            handleObservingModeChange={handleObservingModeChange} 
            handleContinuumSettingsChange={handleContinuumSettingsChange} 
            telescope={telescope}
            telescopeContext={telescopeContext}
          />
        </TabPanel>
        <TabPanel>
          <ZoomMode 
            subarray={subarray} 
            handleObservingModeChange={handleObservingModeChange} 
            handleZoomSettingsChange={handleZoomSettingsChange} 
            telescope={telescope}
            telescopeContext={telescopeContext}
          />
        </TabPanel>
        <TabPanel>
          <PssMode 
            subarray={subarray} 
            handleObservingModeChange={handleObservingModeChange} 
            handlePssSettingsChange={handlePssSettingsChange} 
            telescope={telescope}
            telescopeContext={telescopeContext}
          />
        </TabPanel>
        <TabPanel>
          <PstMode 
            subarray={subarray} 
            handleObservingModeChange={handleObservingModeChange} 
            handlePstSettingsChange={handlePstSettingsChange} 
            telescope={telescope}
            telescopeContext={telescopeContext}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default SubarrayForm;