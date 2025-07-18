import React, { useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import FontFamily from '@tiptap/extension-font-family';
import { Dropcursor } from '@tiptap/extension-dropcursor';
import { Gapcursor } from '@tiptap/extension-gapcursor';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { ListItem } from '@tiptap/extension-list-item';
import { Highlight } from '@tiptap/extension-highlight';
import { Underline } from '@tiptap/extension-underline';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';

import { EditorToolbar } from './EditorToolbar';
import { FindReplacePanel } from './FindReplacePanel';
import { CommentsPanel } from './CommentsPanel';
import { VersionsPanel } from './VersionsPanel';
import { useEditorState } from '../hooks/useEditorState';
import { useFindReplace } from '../hooks/useFindReplace';
import { exportToPDF, exportToHTML } from '../utils/exportUtils';
import { importFromWord, handleImageUpload } from '../utils/importUtils';
import { EditorSettings, PageFormat } from '../types/editor';

interface WordEditorProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
  settings?: Partial<EditorSettings>;
}

export const WordEditor: React.FC<WordEditorProps> = ({
  initialContent = '',
  onContentChange,
  settings = {},
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [pageFormat, setPageFormat] = useState<PageFormat>(settings.pageFormat || 'portrait-a4');
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {
    editorState,
    saveVersion,
    loadVersion,
    addComment,
    updateComment,
    deleteComment,
    setContent,
  } = useEditorState(initialContent);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      ListItem,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Dropcursor,
      Gapcursor,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          style: 'border-collapse: collapse; border: 2px solid #374151;',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          style: 'border: 2px solid #374151; padding: 8px 12px; background-color: #f9fafb;',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          style: 'border: 2px solid #374151; padding: 8px 12px;',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg shadow-sm',
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
      Subscript,
      Superscript,
      TextStyle,
      Color,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none',
      },
      handleDrop: (view, event, slice, moved) => {
        // Handle image drops
        if (event.dataTransfer?.files?.length) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            handleImageUpload(file).then((dataUrl) => {
              const { schema } = view.state;
              const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
              if (coordinates) {
                // Resize image to fit page width if needed
                const img = new Image();
                img.onload = () => {
                  const maxWidth = pageFormat === 'landscape-a4' ? 800 : 600;
                  const maxHeight = pageFormat === 'portrait-a4' ? 800 : 500;
                  
                  let { width, height } = img;
                  if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                  }
                  if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                  }
                  
                  const node = schema.nodes.image.create({ 
                    src: dataUrl,
                    width: Math.round(width),
                    height: Math.round(height)
                  });
                  const transaction = view.state.tr.insert(coordinates.pos, node);
                  view.dispatch(transaction);
                };
                img.src = dataUrl;
              } else {
                // Fallback if coordinates not available
                const maxWidth = pageFormat === 'landscape-a4' ? 800 : 600;
                const node = schema.nodes.image.create({ 
                  src: dataUrl,
                  style: `max-width: ${maxWidth}px; height: auto;`
                });
                const pos = view.state.selection.from;
                const transaction = view.state.tr.insert(pos, node);
                view.dispatch(transaction);
              }
            });
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event, slice) => {
        // Handle image paste
        const items = Array.from(event.clipboardData?.items || []);
        const imageItem = items.find(item => item.type.startsWith('image/'));
        
        if (imageItem) {
          event.preventDefault();
          const file = imageItem.getAsFile();
          if (file) {
            handleImageUpload(file).then((dataUrl) => {
              // Resize pasted image to fit page
              const img = new Image();
              img.onload = () => {
                const maxWidth = pageFormat === 'landscape-a4' ? 800 : 600;
                const maxHeight = pageFormat === 'portrait-a4' ? 800 : 500;
                
                let { width, height } = img;
                if (width > maxWidth) {
                  height = (height * maxWidth) / width;
                  width = maxWidth;
                }
                if (height > maxHeight) {
                  width = (width * maxHeight) / height;
                  height = maxHeight;
                }
                
                editor?.commands.setImage({ 
                  src: dataUrl,
                  width: Math.round(width),
                  height: Math.round(height)
                });
              };
              img.src = dataUrl;
            });
          }
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      setContent(content);
      onContentChange?.(content);
      
      // Calculate pagination if not in continuous mode
      if (pageFormat !== 'continuous') {
        setTimeout(() => calculatePagination(), 100);
      }
    },
  });

  const { findReplaceState, setFindReplaceState, find, findNext, findPrevious, replace } = useFindReplace(editor);

  const handleExportPDF = async () => {
    if (editorRef.current) {
      try {
        await exportToPDF(editorRef.current);
      } catch (error) {
        console.error('Failed to export PDF:', error);
        alert('Failed to export PDF. Please try again.');
      }
    }
  };

  const handleImportWord = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editor) {
      try {
        const content = await importFromWord(file);
        editor.commands.setContent(content);
      } catch (error) {
        console.error('Failed to import document:', error);
        alert('Failed to import document. Please try again.');
      }
    }
    event.target.value = '';
  };

  const handleInsertImage = () => {
    imageInputRef.current?.click();
  };

  const handleImageImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editor) {
      try {
        const dataUrl = await handleImageUpload(file);
        
        // Resize imported image to fit page
        const img = new Image();
        img.onload = () => {
          const maxWidth = pageFormat === 'landscape-a4' ? 800 : 600;
          const maxHeight = pageFormat === 'portrait-a4' ? 800 : 500;
          
          let { width, height } = img;
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
          
          editor.commands.setImage({ 
            src: dataUrl,
            width: Math.round(width),
            height: Math.round(height)
          });
        };
        img.src = dataUrl;
      } catch (error) {
        console.error('Failed to upload image:', error);
        alert('Failed to upload image. Please try again.');
      }
    }
    event.target.value = '';
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        resolve(result);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  const calculatePagination = () => {
    if (!editorRef.current || pageFormat === 'continuous') return;
    
    const pageHeight = pageFormat === 'portrait-a4' ? 1123 : 794; // A4 dimensions in pixels at 96 DPI
    const content = editorRef.current.querySelector('.ProseMirror');
    if (!content) return;
    
    const contentHeight = content.scrollHeight;
    const pages = Math.ceil(contentHeight / pageHeight);
    setTotalPages(Math.max(1, pages));
  };

  const handleInsertTable = (rows: number, cols: number) => {
    editor?.commands.insertTable({ rows, cols, withHeaderRow: true });
  };

  const handleInsertLink = () => {
    const url = prompt('Enter URL:');
    if (url && editor) {
      editor.commands.setLink({ href: url });
    }
  };

  const handleLoadVersion = (versionId: string) => {
    const content = loadVersion(versionId);
    if (content && editor) {
      editor.commands.setContent(content);
    }
  };

  const getPageClasses = () => {
    switch (pageFormat) {
      case 'portrait-a4':
        return 'max-w-4xl mx-auto bg-white shadow-xl min-h-[297mm] p-12 relative';
      case 'landscape-a4':
        return 'max-w-6xl mx-auto bg-white shadow-xl min-h-[210mm] p-12 relative';
      case 'continuous':
        return 'max-w-4xl mx-auto bg-white shadow-lg p-8';
      default:
        return 'max-w-4xl mx-auto bg-white shadow-xl min-h-[297mm] p-12 relative';
    }
  };

  const renderPaginatedContent = () => {
    if (pageFormat === 'continuous') {
      return (
        <div ref={editorRef} className={getPageClasses()}>
          <EditorContent editor={editor} />
        </div>
      );
    }

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <div key={i} className={`${getPageClasses()} mb-8 page-${i}`}>
          {i === 1 && <EditorContent editor={editor} />}
          {i > 1 && (
            <div className="absolute top-4 right-4 text-xs text-gray-400">
              Page {i}
            </div>
          )}
        </div>
      );
    }
    
    if (pages.length === 0) {
      pages.push(
        <div key={1} className={getPageClasses()} ref={editorRef}>
          <EditorContent editor={editor} />
        </div>
      );
    } else {
      // Set ref to first page
      pages[0] = (
        <div key={1} className={`${getPageClasses()} mb-8 page-1`} ref={editorRef}>
          <EditorContent editor={editor} />
        </div>
      );
    }

    return <>{pages}</>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx,.doc"
        onChange={handleFileImport}
        className="hidden"
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageImport}
        className="hidden"
      />

      <EditorToolbar
        editor={editor}
        onFindReplace={() => setShowFindReplace(true)}
        onExportPDF={handleExportPDF}
        onImportWord={handleImportWord}
        onToggleComments={() => setShowComments(true)}
        onToggleVersions={() => setShowVersions(true)}
        onInsertTable={handleInsertTable}
        onInsertImage={handleInsertImage}
        onInsertLink={handleInsertLink}
      />

      <div className="relative">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6 bg-white rounded-lg shadow-sm p-4">
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Page Format:</span>
                <select
                  value={pageFormat}
                  onChange={(e) => {
                    setPageFormat(e.target.value as PageFormat);
                    setTimeout(() => calculatePagination(), 100);
                  }}
                  className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="portrait-a4">📄 Portrait A4</option>
                  <option value="landscape-a4">📄 Landscape A4</option>
                  <option value="continuous">📜 Continuous</option>
                </select>
              </div>
            </div>
            
            {pageFormat !== 'continuous' && totalPages > 1 && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage <= 1}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {renderPaginatedContent()}
        </div>

        <FindReplacePanel
          isOpen={showFindReplace}
          onClose={() => setShowFindReplace(false)}
          findReplaceState={findReplaceState}
          setFindReplaceState={setFindReplaceState}
          onFind={find}
          onFindNext={findNext}
          onFindPrevious={findPrevious}
          onReplace={replace}
        />

        <CommentsPanel
          isOpen={showComments}
          onClose={() => setShowComments(false)}
          comments={editorState.comments}
          onAddComment={addComment}
          onUpdateComment={updateComment}
          onDeleteComment={deleteComment}
        />

        <VersionsPanel
          isOpen={showVersions}
          onClose={() => setShowVersions(false)}
          versions={editorState.versions}
          currentVersion={editorState.currentVersion}
          onSaveVersion={saveVersion}
          onLoadVersion={handleLoadVersion}
          currentContent={editorState.content}
        />
      </div>
    </div>
  );
};