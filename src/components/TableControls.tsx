import React from 'react';
import { Editor } from '@tiptap/react';
import { Plus, Minus, Columns, Rows } from 'lucide-react';

interface TableControlsProps {
  editor: Editor;
  isVisible: boolean;
}

export const TableControls: React.FC<TableControlsProps> = ({ editor, isVisible }) => {
  if (!isVisible || !editor.isActive('table')) return null;

  return (
    <div className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 flex gap-1">
      <button
        onClick={() => editor.chain().focus().addColumnBefore().run()}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Add column before"
      >
        <Plus className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Add column after"
      >
        <Plus className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().deleteColumn().run()}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Delete column"
      >
        <Minus className="w-4 h-4" />
      </button>
      <div className="w-px bg-gray-300 mx-1" />
      <button
        onClick={() => editor.chain().focus().addRowBefore().run()}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Add row before"
      >
        <Rows className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().addRowAfter().run()}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Add row after"
      >
        <Rows className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().deleteRow().run()}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Delete row"
      >
        <Minus className="w-4 h-4" />
      </button>
    </div>
  );
};