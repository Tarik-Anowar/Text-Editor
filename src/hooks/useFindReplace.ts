import { useState, useCallback } from 'react';
import { FindReplaceState } from '../types/editor';
import { Editor } from '@tiptap/react';

export const useFindReplace = (editor: Editor | null) => {
  const [findReplaceState, setFindReplaceState] = useState<FindReplaceState>({
    searchTerm: '',
    replaceTerm: '',
    caseSensitive: false,
    wholeWord: false,
    currentMatch: 0,
    totalMatches: 0,
  });

  const findMatches = useCallback((searchTerm: string) => {
    if (!editor || !searchTerm) return [];

    const content = editor.getText();
    const flags = findReplaceState.caseSensitive ? 'g' : 'gi';
    const pattern = findReplaceState.wholeWord ? `\\b${searchTerm}\\b` : searchTerm;
    const regex = new RegExp(pattern, flags);
    
    return Array.from(content.matchAll(regex));
  }, [editor, findReplaceState.caseSensitive, findReplaceState.wholeWord]);

  const find = useCallback((searchTerm: string) => {
    const matches = findMatches(searchTerm);
    setFindReplaceState(prev => ({
      ...prev,
      searchTerm,
      totalMatches: matches.length,
      currentMatch: matches.length > 0 ? 1 : 0,
    }));
  }, [findMatches]);

  const findNext = useCallback(() => {
    if (findReplaceState.totalMatches === 0) return;
    
    const nextMatch = findReplaceState.currentMatch >= findReplaceState.totalMatches 
      ? 1 
      : findReplaceState.currentMatch + 1;
    
    setFindReplaceState(prev => ({
      ...prev,
      currentMatch: nextMatch,
    }));
  }, [findReplaceState.currentMatch, findReplaceState.totalMatches]);

  const findPrevious = useCallback(() => {
    if (findReplaceState.totalMatches === 0) return;
    
    const prevMatch = findReplaceState.currentMatch <= 1 
      ? findReplaceState.totalMatches 
      : findReplaceState.currentMatch - 1;
    
    setFindReplaceState(prev => ({
      ...prev,
      currentMatch: prevMatch,
    }));
  }, [findReplaceState.currentMatch, findReplaceState.totalMatches]);

  const replace = useCallback((searchTerm: string, replaceTerm: string) => {
    if (!editor) return;
    
    const content = editor.getHTML();
    const flags = findReplaceState.caseSensitive ? 'g' : 'gi';
    const pattern = findReplaceState.wholeWord ? `\\b${searchTerm}\\b` : searchTerm;
    const regex = new RegExp(pattern, flags);
    
    const newContent = content.replace(regex, replaceTerm);
    editor.commands.setContent(newContent);
    
    setFindReplaceState(prev => ({
      ...prev,
      searchTerm: '',
      replaceTerm: '',
      currentMatch: 0,
      totalMatches: 0,
    }));
  }, [editor, findReplaceState.caseSensitive, findReplaceState.wholeWord]);

  return {
    findReplaceState,
    setFindReplaceState,
    find,
    findNext,
    findPrevious,
    replace,
  };
};