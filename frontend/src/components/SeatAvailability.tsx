import React from 'react';
import { SectionAvailability } from '../types';

interface SeatAvailabilityProps {
  sections: SectionAvailability[];
  selectedSection: string;
  selectedRow: string;
  onSectionChange: (sectionId: string) => void;
  onRowChange: (rowId: string) => void;
}

const SeatAvailability: React.FC<SeatAvailabilityProps> = ({
  sections,
  selectedSection,
  selectedRow,
  onSectionChange,
  onRowChange
}) => {
  const selectedSectionData = sections.find(s => s.sectionId === selectedSection);

  return (
    <div className="seat-availability">
      <h5 className="mb-3">Select Section & Row</h5>
      
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="section-select" className="form-label fw-bold">Section</label>
            <select
              id="section-select"
              className="form-select"
              value={selectedSection}
              onChange={(e) => onSectionChange(e.target.value)}
            >
              <option value="">Select a section</option>
              {sections.map(section => (
                <option key={section.sectionId} value={section.sectionId}>
                  {section.name} - ${section.price}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="row-select" className="form-label fw-bold">Row</label>
            <select
              id="row-select"
              className="form-select"
              value={selectedRow}
              onChange={(e) => onRowChange(e.target.value)}
              disabled={!selectedSection}
            >
              <option value="">Select a row</option>
              {selectedSectionData?.rows.map(row => (
                <option 
                  key={row.rowId} 
                  value={row.rowId}
                  disabled={row.availableSeats === 0}
                >
                  Row {row.name} - {row.availableSeats} available
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {selectedSectionData && (
        <div className="mt-4">
          <h6>Section Details: {selectedSectionData.name}</h6>
          <div className="row">
            {selectedSectionData.rows.map(row => (
              <div key={row.rowId} className="col-md-4 mb-3">
                <div className={`card ${row.availableSeats === 0 ? 'bg-light' : 'bg-white'}`}>
                  <div className="card-body p-3">
                    <h6 className="card-title mb-2">Row {row.name}</h6>
                    <div className="d-flex justify-content-between">
                      <span className="text-success">Available: {row.availableSeats}</span>
                      <span className="text-danger">Booked: {row.bookedSeats}</span>
                    </div>
                    <div className="progress mt-2" style={{ height: '4px' }}>
                      <div 
                        className="progress-bar bg-danger" 
                        role="progressbar" 
                        style={{ width: `${(row.bookedSeats / row.totalSeats) * 100}%` }}
                        aria-valuenow={row.bookedSeats}
                        aria-valuemin={0}
                        aria-valuemax={row.totalSeats}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatAvailability;