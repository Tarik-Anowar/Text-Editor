import React from 'react';
import { useState } from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold, Italic, Underline, Strikethrough, Code, Highlighter,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, CheckSquare, Quote, Minus,
  Link, Image, Table, Undo, Redo, Type, Palette,
  Search, Download, Upload, MessageSquare, GitBranch,
  Subscript, Superscript, RemoveFormatting, ChevronDown
} from 'lucide-react';
import { TableGridPicker } from './TableGridPicker';
import { ColorPicker } from './ColorPicker';
import { FontFamilyPicker } from './FontFamilyPicker';

interface EditorToolbarProps {
  editor: Editor | null;
  onFindReplace: () => void;
  onExportPDF: () => void;
  onImportWord: () => void;
  onToggleComments: () => void;
  onToggleVersions: () => void;
  onInsertTable: (rows: number, cols: number) => void;
  onInsertImage: () => void;
  onInsertLink: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  onFindReplace,
  onExportPDF,
  onImportWord,
  onToggleComments,
  onToggleVersions,
  onInsertTable,
  onInsertImage,
  onInsertLink,
}) => {
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBackgroundColorPicker, setShowBackgroundColorPicker] = useState(false);

  if (!editor) return null;

  const ToolbarButton: React.FC<{
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }> = ({ onClick, isActive, disabled, children, title }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        p-2 rounded-lg border transition-all duration-200 hover:scale-105
        ${isActive 
          ? 'bg-blue-500 text-white border-blue-500 shadow-md' 
          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {children}
    </button>
  );

  const ToolbarSelect: React.FC<{
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
    title: string;
  }> = ({ value, onChange, options, title }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      title={title}
      className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      {/* File Operations */}
      <div className="flex gap-1 border-r border-gray-200 pr-3 mr-1">
        <ToolbarButton onClick={onImportWord} title="Import Word Document">
          <Upload className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={onExportPDF} title="Export as PDF">
          <Download className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* History */}
      <div className="flex gap-1 border-r border-gray-200 pr-3 mr-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Text Formatting */}
      <div className="flex gap-1 border-r border-gray-200 pr-3 mr-1">
        <FontFamilyPicker
          currentFont={editor.getAttributes('textStyle').fontFamily || 'Arial, sans-serif'}
          onFontChange={(font) => editor.chain().focus().setFontFamily(font).run()}
        />
        <ToolbarSelect
          value={editor.isActive('heading', { level: 1 }) ? 'h1' : 
                editor.isActive('heading', { level: 2 }) ? 'h2' :
                editor.isActive('heading', { level: 3 }) ? 'h3' :
                editor.isActive('heading', { level: 4 }) ? 'h4' :
                editor.isActive('heading', { level: 5 }) ? 'h5' :
                editor.isActive('heading', { level: 6 }) ? 'h6' : 'paragraph'}
          onChange={(value) => {
            if (value === 'paragraph') {
              editor.chain().focus().setParagraph().run();
            } else {
              const level = parseInt(value.replace('h', ''));
              editor.chain().focus().toggleHeading({ level }).run();
            }
          }}
          options={[
            { value: 'paragraph', label: 'Paragraph' },
            { value: 'h1', label: 'Heading 1' },
            { value: 'h2', label: 'Heading 2' },
            { value: 'h3', label: 'Heading 3' },
            { value: 'h4', label: 'Heading 4' },
            { value: 'h5', label: 'Heading 5' },
            { value: 'h6', label: 'Heading 6' },
          ]}
          title="Text Style"
        />
        <ToolbarSelect
          value="16"
          onChange={(value) => {
            editor.chain().focus().setFontSize(value + 'px').run();
          }}
          options={[
            { value: '12', label: '12px' },
            { value: '14', label: '14px' },
            { value: '16', label: '16px' },
            { value: '18', label: '18px' },
            { value: '20', label: '20px' },
            { value: '24', label: '24px' },
            { value: '28', label: '28px' },
            { value: '32', label: '32px' },
          ]}
          title="Font Size"
        />
        <div className="relative">
          <ToolbarButton
            onClick={() => setShowTextColorPicker(!showTextColorPicker)}
            title="Text Color"
          >
            <div className="flex flex-col items-center">
              <Type className="w-4 h-4" />
              <div 
                className="w-4 h-1 mt-0.5" 
                style={{ backgroundColor: editor.getAttributes('textStyle').color || '#000000' }}
              />
            </div>
          </ToolbarButton>
          <ColorPicker
            isOpen={showTextColorPicker}
            onClose={() => setShowTextColorPicker(false)}
            onColorSelect={(color) => {
              editor.chain().focus().setColor(color).run();
              setShowTextColorPicker(false);
            }}
            title="Text Color"
            currentColor={editor.getAttributes('textStyle').color}
          />
        </div>
        <div className="relative">
          <ToolbarButton
            onClick={() => setShowBackgroundColorPicker(!showBackgroundColorPicker)}
            title="Background Color"
          >
            <div className="flex flex-col items-center">
              <Palette className="w-4 h-4" />
              <div 
                className="w-4 h-1 mt-0.5" 
                style={{ backgroundColor: editor.getAttributes('highlight').color || '#ffff00' }}
              />
            </div>
          </ToolbarButton>
          <ColorPicker
            isOpen={showBackgroundColorPicker}
            onClose={() => setShowBackgroundColorPicker(false)}
            onColorSelect={(color) => {
              editor.chain().focus().toggleHighlight({ color }).run();
              setShowBackgroundColorPicker(false);
            }}
            title="Background Color"
            currentColor={editor.getAttributes('highlight').color}
          />
        </div>
      </div>

      {/* Style Buttons */}
      <div className="flex gap-1 border-r border-gray-200 pr-3 mr-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive('highlight')}
          title="Highlight"
        >
          <Highlighter className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Alignment */}
      <div className="flex gap-1 border-r border-gray-200 pr-3 mr-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          isActive={editor.isActive({ textAlign: 'justify' })}
          title="Justify"
        >
          <AlignJustify className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Lists */}
      <div className="flex gap-1 border-r border-gray-200 pr-3 mr-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          isActive={editor.isActive('taskList')}
          title="Task List"
        >
          <CheckSquare className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Insert Elements */}
      <div className="flex gap-1 border-r border-gray-200 pr-3 mr-1">
        <ToolbarButton onClick={onInsertLink} title="Insert Link">
          <Link className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={onInsertImage} title="Insert Image">
          <Image className="w-4 h-4" />
        </ToolbarButton>
        <div className="relative">
          <ToolbarButton 
            onClick={() => setShowTablePicker(!showTablePicker)} 
            title="Insert Table"
          >
            <Table className="w-4 h-4" />
          </ToolbarButton>
          <TableGridPicker
            isOpen={showTablePicker}
            onClose={() => setShowTablePicker(false)}
            onInsertTable={(rows, cols) => {
              onInsertTable(rows, cols);
              setShowTablePicker(false);
            }}
          />
        </div>
      </div>

      {/* Tools */}
      <div className="flex gap-1 border-r border-gray-200 pr-3 mr-1">
        <ToolbarButton onClick={onFindReplace} title="Find & Replace">
          <Search className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={onToggleComments} title="Toggle Comments">
          <MessageSquare className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={onToggleVersions} title="Version History">
          <GitBranch className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Additional Formatting */}
      <div className="flex gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          isActive={editor.isActive('subscript')}
          title="Subscript"
        >
          <Subscript className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          isActive={editor.isActive('superscript')}
          title="Superscript"
        >
          <Superscript className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          title="Clear Formatting"
        >
          <RemoveFormatting className="w-4 h-4" />
        </ToolbarButton>
      </div>
    </div>
  );
};