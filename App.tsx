
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { WordCounter } from './components/WordCounter';
import { MenuIcon, XIcon } from './components/icons';
import { useLocalStorage } from './hooks/useLocalStorage';
import { exportAsTxt, exportAsDocx } from './utils/export';

interface Document {
    id: string;
    content: string;
    lastModified: number;
}

const App: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useLocalStorage('blankpage-sidebar-collapsed', false);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
    const [isDarkMode, setIsDarkMode] = useLocalStorage('blankpage-darkmode', false);
    const [showWordCount, setShowWordCount] = useLocalStorage('blankpage-wordcount', true);
    const [spellCheck, setSpellCheck] = useLocalStorage('blankpage-spellcheck', true);
    const [autoSave, setAutoSave] = useLocalStorage('blankpage-autosave', true);

    const isInitialMount = useRef(true);

    useEffect(() => {
        const savedDocs = localStorage.getItem('blankpage-documents');
        const savedId = localStorage.getItem('blankpage-active-document-id');

        const initialDocs: Document[] = savedDocs ? JSON.parse(savedDocs) : [{ id: Date.now().toString(), content: '', lastModified: Date.now() }];
        setDocuments(initialDocs);

        const initialId = savedId ? JSON.parse(savedId) : (initialDocs[0]?.id || null);
        setActiveDocumentId(initialId);
    }, []);
    
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (autoSave && documents.length > 0) {
            const handler = setTimeout(() => {
                 localStorage.setItem('blankpage-documents', JSON.stringify(documents));
            }, 500);
            return () => clearTimeout(handler);
        }
    }, [documents, autoSave]);

    useEffect(() => {
        if (activeDocumentId) {
            localStorage.setItem('blankpage-active-document-id', JSON.stringify(activeDocumentId));
        }
    }, [activeDocumentId]);


    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.metaKey || event.ctrlKey) {
            if (event.key.toLowerCase() === 'm') {
                event.preventDefault();
                setIsDarkMode(prev => !prev);
            }
        }
    }, [setIsDarkMode]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);
    
    const activeDocument = useMemo(() => {
        return documents.find(doc => doc.id === activeDocumentId) || documents[0];
    }, [documents, activeDocumentId]);

    const content = activeDocument?.content || '';

    const updateContent = (newContent: string) => {
        setDocuments(docs => docs.map(doc => 
            doc.id === activeDocumentId 
                ? { ...doc, content: newContent, lastModified: Date.now() }
                : doc
        ));
    };

    const createDocument = () => {
        const newDoc: Document = { id: Date.now().toString(), content: '', lastModified: Date.now() };
        setDocuments(docs => [newDoc, ...docs]);
        setActiveDocumentId(newDoc.id);
    };

    const switchDocument = (id: string) => {
        setActiveDocumentId(id);
    };

    const deleteDocument = (id: string) => {
        const newDocuments = documents.filter(doc => doc.id !== id);
        
        if (newDocuments.length === 0) {
            const newDoc: Document = { id: Date.now().toString(), content: '', lastModified: Date.now() };
            setDocuments([newDoc]);
            setActiveDocumentId(newDoc.id);
        } else {
            setDocuments(newDocuments);
            if (activeDocumentId === id) {
                setActiveDocumentId(newDocuments[0].id);
            }
        }
    };

    const wordCount = useMemo(() => {
      const el = document.createElement('div');
      el.innerHTML = content;
      const text = el.textContent || "";
      return text.trim().split(/\s+/).filter(Boolean).length;
    }, [content]);

    return (
        <div className={`flex h-screen font-sans text-light-text dark:text-dark-text transition-colors duration-300`}>
            <Sidebar
                isOpen={isSidebarOpen}
                isCollapsed={isSidebarCollapsed}
                toggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
                isDarkMode={isDarkMode}
                toggleDarkMode={() => setIsDarkMode(prev => !prev)}
                toggleFullScreen={toggleFullScreen}
                showWordCount={showWordCount}
                toggleWordCount={() => setShowWordCount(prev => !prev)}
                spellCheck={spellCheck}
                toggleSpellCheck={() => setSpellCheck(prev => !prev)}
                autoSave={autoSave}
                toggleAutoSave={() => setAutoSave(prev => !prev)}
                exportTxt={() => exportAsTxt(content)}
                exportDocx={() => exportAsDocx(content)}
                onClose={() => setIsSidebarOpen(false)}
                documents={documents}
                activeDocumentId={activeDocumentId || ''}
                createDocument={createDocument}
                switchDocument={switchDocument}
                deleteDocument={deleteDocument}
            />
            <div className="flex flex-col flex-1 h-full relative">
                <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between p-3 bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Toggle Menu"
                    >
                        {isSidebarOpen ? <XIcon /> : <MenuIcon />}
                    </button>
                    <h1 className="text-lg font-semibold text-light-text dark:text-dark-text">Blank Page</h1>
                    <div className="w-10"></div>
                </header>
                <main className="flex-1 flex flex-col pt-16">
                    <Editor content={content} setContent={updateContent} spellCheck={spellCheck} />
                </main>
                {showWordCount && <WordCounter count={wordCount} />}
            </div>
        </div>
    );
};

export default App;
