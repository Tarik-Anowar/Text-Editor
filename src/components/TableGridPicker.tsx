import React, { useState } from 'react';
import { X } from 'lucide-react';

interface TableGridPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertTable: (rows: number, cols: number) => void;
}

export const TableGridPicker: React.FC<TableGridPickerProps> = ({
  isOpen,
  onClose,
  onInsertTable,
}) => {
  const [hoveredCell, setHoveredCell] = useState({ row: 0, col: 0 });
  const maxRows = 8;
  const maxCols = 10;

  if (!isOpen) return null;

  const handleCellHover = (row: number, col: number) => {
    setHoveredCell({ row, col });
  };

  const handleCellClick = (row: number, col: number) => {
    onInsertTable(row + 1, col + 1);
    onClose();
  };

  return (
    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-700">Insert Table</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid gap-1 mb-3" style={{ gridTemplateColumns: `repeat(${maxCols}, 1fr)` }}>
        {Array.from({ length: maxRows * maxCols }, (_, index) => {
          const row = Math.floor(index / maxCols);
          const col = index % maxCols;
          const isHighlighted = row <= hoveredCell.row && col <= hoveredCell.col;
          
          return (
            <div
              key={index}
              className={`w-4 h-4 border border-gray-300 cursor-pointer transition-colors ${
                isHighlighted ? 'bg-blue-500' : 'bg-white hover:bg-gray-100'
              }`}
              onMouseEnter={() => handleCellHover(row, col)}
              onClick={() => handleCellClick(row, col)}
            />
          );
        })}
      </div>
      
      <div className="text-xs text-gray-600 text-center">
        {hoveredCell.row + 1} × {hoveredCell.col + 1} Table
      </div>
    </div>
  );
};