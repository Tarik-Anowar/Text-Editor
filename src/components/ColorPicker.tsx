import React, { useState } from 'react';
import { Palette, X } from 'lucide-react';

interface ColorPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onColorSelect: (color: string) => void;
  title: string;
  currentColor?: string;
}

const PRESET_COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
  '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
  '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc',
  '#dd7e6b', '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#9fc5e8', '#b4a7d6', '#d5a6bd',
  '#cc4125', '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6d9eeb', '#6fa8dc', '#8e7cc3', '#c27ba0',
  '#a61c00', '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3c78d8', '#3d85c6', '#674ea7', '#a64d79',
  '#85200c', '#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#1155cc', '#0b5394', '#351c75', '#741b47',
  '#5b0f00', '#660000', '#783f04', '#7f6000', '#274e13', '#0c343d', '#1c4587', '#073763', '#20124d', '#4c1130'
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  isOpen,
  onClose,
  onColorSelect,
  title,
  currentColor,
}) => {
  const [customColor, setCustomColor] = useState('#000000');

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 w-64">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Current Color */}
      {currentColor && (
        <div className="mb-3">
          <div className="text-xs text-gray-600 mb-1">Current</div>
          <div
            className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
            style={{ backgroundColor: currentColor }}
            onClick={() => onColorSelect(currentColor)}
          />
        </div>
      )}

      {/* Preset Colors */}
      <div className="mb-3">
        <div className="text-xs text-gray-600 mb-2">Theme Colors</div>
        <div className="grid grid-cols-10 gap-1">
          {PRESET_COLORS.map((color, index) => (
            <div
              key={index}
              className="w-6 h-6 border border-gray-300 rounded cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              onClick={() => onColorSelect(color)}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Custom Color */}
      <div>
        <div className="text-xs text-gray-600 mb-2">Custom Color</div>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
          />
          <input
            type="text"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="#000000"
          />
          <button
            onClick={() => onColorSelect(customColor)}
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};