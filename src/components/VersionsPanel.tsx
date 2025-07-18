import React, { useState } from 'react';
import { GitBranch, X, Plus, Clock, Download } from 'lucide-react';
import { EditorVersion } from '../types/editor';

interface VersionsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  versions: EditorVersion[];
  currentVersion: string;
  onSaveVersion: (name: string, content: string) => void;
  onLoadVersion: (versionId: string) => void;
  currentContent: string;
}

export const VersionsPanel: React.FC<VersionsPanelProps> = ({
  isOpen,
  onClose,
  versions,
  currentVersion,
  onSaveVersion,
  onLoadVersion,
  currentContent,
}) => {
  const [newVersionName, setNewVersionName] = useState('');

  if (!isOpen) return null;

  const handleSaveVersion = () => {
    if (newVersionName.trim()) {
      onSaveVersion(newVersionName, currentContent);
      setNewVersionName('');
    }
  };

  return (
    <div className="absolute top-16 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 w-80 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <GitBranch className="w-5 h-5" />
          Versions
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Save New Version */}
      <div className="mb-4">
        <input
          type="text"
          value={newVersionName}
          onChange={(e) => setNewVersionName(e.target.value)}
          placeholder="Version name..."
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={handleSaveVersion}
          disabled={!newVersionName.trim()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Save Current Version
        </button>
      </div>

      {/* Versions List */}
      <div className="space-y-2">
        {versions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No saved versions</p>
        ) : (
          versions.map((version) => (
            <div
              key={version.id}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                version.id === currentVersion
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
              onClick={() => onLoadVersion(version.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-800">{version.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Clock className="w-3 h-3" />
                    {version.timestamp.toLocaleDateString()} {version.timestamp.toLocaleTimeString()}
                  </div>
                  {version.author && (
                    <p className="text-xs text-gray-500 mt-1">by {version.author}</p>
                  )}
                </div>
                {version.id === currentVersion && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Current
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};