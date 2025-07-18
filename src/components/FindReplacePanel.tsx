import React, { useState } from 'react';
import { Search, Replace, X, ChevronUp, ChevronDown } from 'lucide-react';
import { FindReplaceState } from '../types/editor';

interface FindReplacePanelProps {
  isOpen: boolean;
  onClose: () => void;
  findReplaceState: FindReplaceState;
  setFindReplaceState: (state: FindReplaceState) => void;
  onFind: (searchTerm: string) => void;
  onFindNext: () => void;
  onFindPrevious: () => void;
  onReplace: (searchTerm: string, replaceTerm: string) => void;
}

export const FindReplacePanel: React.FC<FindReplacePanelProps> = ({
  isOpen,
  onClose,
  findReplaceState,
  setFindReplaceState,
  onFind,
  onFindNext,
  onFindPrevious,
  onReplace,
}) => {
  const [showReplace, setShowReplace] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 min-w-80">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Find & Replace</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        {/* Find Input */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={findReplaceState.searchTerm}
            onChange={(e) => setFindReplaceState({
              ...findReplaceState,
              searchTerm: e.target.value
            })}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onFind(findReplaceState.searchTerm);
              }
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Replace Input */}
        {showReplace && (
          <div className="relative">
            <Replace className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Replace with..."
              value={findReplaceState.replaceTerm}
              onChange={(e) => setFindReplaceState({
                ...findReplaceState,
                replaceTerm: e.target.value
              })}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {findReplaceState.totalMatches > 0
              ? `${findReplaceState.currentMatch} of ${findReplaceState.totalMatches}`
              : 'No matches'
            }
          </span>
          <div className="flex gap-1">
            <button
              onClick={onFindPrevious}
              disabled={findReplaceState.totalMatches === 0}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={onFindNext}
              disabled={findReplaceState.totalMatches === 0}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={findReplaceState.caseSensitive}
              onChange={(e) => setFindReplaceState({
                ...findReplaceState,
                caseSensitive: e.target.checked
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Case sensitive
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={findReplaceState.wholeWord}
              onChange={(e) => setFindReplaceState({
                ...findReplaceState,
                wholeWord: e.target.checked
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Whole word
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onFind(findReplaceState.searchTerm)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Find
          </button>
          <button
            onClick={() => setShowReplace(!showReplace)}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {showReplace ? 'Hide Replace' : 'Replace'}
          </button>
          {showReplace && (
            <button
              onClick={() => onReplace(findReplaceState.searchTerm, findReplaceState.replaceTerm)}
              disabled={!findReplaceState.searchTerm}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Replace All
            </button>
          )}
        </div>
      </div>
    </div>
  );
};