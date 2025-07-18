import { useState, useCallback } from 'react';
import { EditorState, EditorVersion, EditorComment } from '../types/editor';
import { v4 as uuidv4 } from 'uuid';

export const useEditorState = (initialContent: string = '') => {
  const [editorState, setEditorState] = useState<EditorState>(() => ({
    content: initialContent,
    versions: [],
    comments: [],
    currentVersion: '',
  }));

  const saveVersion = useCallback((name: string, content: string) => {
    const newVersion: EditorVersion = {
      id: uuidv4(),
      name,
      content,
      timestamp: new Date(),
      author: 'Current User',
    };

    setEditorState(prev => ({
      ...prev,
      versions: [...prev.versions, newVersion],
      currentVersion: newVersion.id,
    }));
  }, []);

  const loadVersion = useCallback((versionId: string) => {
    const version = editorState.versions.find(v => v.id === versionId);
    if (version) {
      setEditorState(prev => ({
        ...prev,
        content: version.content,
        currentVersion: versionId,
      }));
      return version.content;
    }
    return null;
  }, [editorState.versions]);

  const addComment = useCallback((comment: Omit<EditorComment, 'id' | 'timestamp'>) => {
    const newComment: EditorComment = {
      ...comment,
      id: uuidv4(),
      timestamp: new Date(),
    };

    setEditorState(prev => ({
      ...prev,
      comments: [...prev.comments, newComment],
    }));
  }, []);

  const updateComment = useCallback((commentId: string, updates: Partial<EditorComment>) => {
    setEditorState(prev => ({
      ...prev,
      comments: prev.comments.map(comment =>
        comment.id === commentId ? { ...comment, ...updates } : comment
      ),
    }));
  }, []);

  const deleteComment = useCallback((commentId: string) => {
    setEditorState(prev => ({
      ...prev,
      comments: prev.comments.filter(comment => comment.id !== commentId),
    }));
  }, []);

  return {
    editorState,
    saveVersion,
    loadVersion,
    addComment,
    updateComment,
    deleteComment,
    setContent: (content: string) => setEditorState(prev => ({ ...prev, content })),
  };
};