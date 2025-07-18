import React from 'react';
import { WordEditor } from './components/WordEditor';

function App() {
  const handleContentChange = (content: string) => {
    console.log('Content changed:', content);
  };

  return (
    <div className="min-h-screen">
      <WordEditor
        initialContent="<h1>Welcome to the Word Editor</h1><p>Start typing to create your document...</p>"
        onContentChange={handleContentChange}
        settings={{
          pageFormat: 'portrait-a4',
          showComments: true,
          showVersions: true,
          autoSave: true,
        }}
      />
    </div>
  );
}

export default App;