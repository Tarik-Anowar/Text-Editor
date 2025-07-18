import React from 'react';
import { ChevronDown } from 'lucide-react';

interface FontFamilyPickerProps {
  currentFont: string;
  onFontChange: (font: string) => void;
}

const FONT_FAMILIES = [
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Helvetica', value: 'Helvetica, sans-serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Courier New', value: 'Courier New, monospace' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
  { name: 'Impact', value: 'Impact, sans-serif' },
  { name: 'Comic Sans MS', value: 'Comic Sans MS, cursive' },
  { name: 'Palatino', value: 'Palatino, serif' },
];

export const FontFamilyPicker: React.FC<FontFamilyPickerProps> = ({
  currentFont,
  onFontChange,
}) => {
  const getCurrentFontName = () => {
    const font = FONT_FAMILIES.find(f => f.value === currentFont);
    return font ? font.name : 'Arial';
  };

  return (
    <div className="relative">
      <select
        value={currentFont}
        onChange={(e) => onFontChange(e.target.value)}
        className="appearance-none px-3 py-2 pr-8 border border-gray-200 rounded-lg bg-white text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-32"
        style={{ fontFamily: currentFont }}
      >
        {FONT_FAMILIES.map((font) => (
          <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
            {font.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
};