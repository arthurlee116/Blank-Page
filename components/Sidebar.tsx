
import React from 'react';
import { SunIcon, MoonIcon, FullscreenIcon, TextFileIcon, DocxFileIcon, EyeIcon, SpellcheckIcon, XIcon, KeyboardIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon, TrashIcon, SaveIcon } from './icons';
import { getPlainText } from '../utils/export';

interface Document {
    id: string;
    content: string;
    lastModified: number;
}

interface SidebarProps {
    isOpen: boolean;
    isCollapsed: boolean;
    toggleCollapse: () => void;
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    toggleFullScreen: () => void;
    showWordCount: boolean;
    toggleWordCount: () => void;
    spellCheck: boolean;
    toggleSpellCheck: () => void;
    autoSave: boolean;
    toggleAutoSave: () => void;
    exportTxt: () => void;
    exportDocx: () => void;
    onClose: () => void;
    documents: Document[];
    activeDocumentId: string;
    createDocument: () => void;
    switchDocument: (id: string) => void;
    deleteDocument: (id: string) => void;
}

const getDocumentTitle = (content: string) => {
    const plainText = getPlainText(content);
    const firstLine = plainText.split('\n')[0].trim();
    return firstLine.substring(0, 35) || 'Untitled';
};

const SidebarButton: React.FC<{ onClick: () => void; icon: React.ReactNode; label: string; rightContent?: React.ReactNode; isCollapsed: boolean; }> = ({ onClick, icon, label, rightContent, isCollapsed }) => (
    <button title={label} onClick={onClick} className={`w-full flex items-center text-left py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 ${isCollapsed ? 'px-3 justify-center' : 'px-4 justify-between'}`}>
        <div className="flex items-center gap-4">
            {icon}
            {!isCollapsed && <span>{label}</span>}
        </div>
        {!isCollapsed && rightContent}
    </button>
);

const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void; }> = ({ checked, onChange }) => (
    <div onClick={onChange} className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-400 dark:bg-gray-600'}`}>
        <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${checked ? 'translate-x-5' : ''}`}/>
    </div>
);


export const Sidebar: React.FC<SidebarProps> = ({
    isOpen, isCollapsed, toggleCollapse, isDarkMode, toggleDarkMode, toggleFullScreen,
    showWordCount, toggleWordCount, spellCheck, toggleSpellCheck, autoSave, toggleAutoSave,
    exportTxt, exportDocx, onClose, documents, activeDocumentId, createDocument, switchDocument, deleteDocument
}) => {
    return (
        <>
            <div className={`fixed inset-0 bg-black/50 z-30 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}></div>
            <aside className={`fixed top-0 left-0 z-40 w-72 h-full bg-light-surface dark:bg-dark-surface border-r border-gray-200 dark:border-gray-700 transform transition-all duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 ${isCollapsed ? 'md:w-20' : ''}`}>
                <div className={`flex items-center p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 ${isCollapsed ? 'md:justify-center' : 'justify-between'}`}>
                    <h2 className={`text-lg font-bold ${isCollapsed ? 'md:hidden' : ''}`}>Settings</h2>
                    <button onClick={toggleCollapse} className="hidden p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 md:block" aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
                        {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </button>
                    <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 md:hidden">
                        <XIcon />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <nav className="p-4 space-y-2">
                        <SidebarButton isCollapsed={isCollapsed} onClick={toggleDarkMode} icon={isDarkMode ? <SunIcon /> : <MoonIcon />} label={isDarkMode ? 'Light Mode' : 'Dark Mode'} rightContent={
                            <div className="flex items-center gap-2 text-xs text-light-subtle dark:text-dark-subtle">
                                <KeyboardIcon /> M
                            </div>
                        } />
                        <SidebarButton isCollapsed={isCollapsed} onClick={toggleFullScreen} icon={<FullscreenIcon />} label="Full Screen" />
                        
                        {isCollapsed ? (
                            <div className="my-2 border-t border-gray-200 dark:border-gray-700 mx-2"></div>
                        ) : (
                            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                                <h3 className="px-4 py-2 text-xs font-semibold text-light-subtle dark:text-dark-subtle uppercase tracking-wider">Editor</h3>
                            </div>
                        )}

                        <SidebarButton isCollapsed={isCollapsed} onClick={toggleWordCount} icon={<EyeIcon />} label="Word Counter" rightContent={<ToggleSwitch checked={showWordCount} onChange={toggleWordCount} />} />
                        <SidebarButton isCollapsed={isCollapsed} onClick={toggleSpellCheck} icon={<SpellcheckIcon />} label="Spellcheck" rightContent={<ToggleSwitch checked={spellCheck} onChange={toggleSpellCheck} />} />
                        <SidebarButton isCollapsed={isCollapsed} onClick={toggleAutoSave} icon={<SaveIcon />} label="Auto-save" rightContent={<ToggleSwitch checked={autoSave} onChange={toggleAutoSave} />} />

                        <div className={`pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 ${isCollapsed ? 'mx-2' : ''}`}>
                            {!isCollapsed && (
                                <div className="flex justify-between items-center px-4 mb-2">
                                    <h3 className="text-xs font-semibold text-light-subtle dark:text-dark-subtle uppercase tracking-wider">History</h3>
                                    <button onClick={createDocument} title="New Document" className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"><PlusIcon /></button>
                                </div>
                            )}
                        </div>
                        <div className={`space-y-1 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
                             {documents.map(doc => (
                                <div key={doc.id} title={!isCollapsed ? '' : getDocumentTitle(doc.content)} className={`group relative flex items-center justify-between rounded-lg cursor-pointer transition-colors ${doc.id === activeDocumentId ? 'bg-blue-100 dark:bg-blue-800' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`} onClick={() => switchDocument(doc.id)}>
                                    <div className={`flex-1 truncate py-2 ${isCollapsed ? 'px-3' : 'px-4'}`}>
                                        <p className={`font-medium text-sm truncate ${isCollapsed ? 'hidden' : ''}`}>{getDocumentTitle(doc.content)}</p>
                                        {!isCollapsed && <p className="text-xs text-light-subtle dark:text-dark-subtle">{new Date(doc.lastModified).toLocaleDateString()}</p>}
                                    </div>
                                    {!isCollapsed && (
                                        <button onClick={(e) => { e.stopPropagation(); deleteDocument(doc.id); }} className="p-2 opacity-0 group-hover:opacity-100 text-light-subtle dark:text-dark-subtle hover:text-red-500 dark:hover:text-red-400 absolute right-2" aria-label="Delete document">
                                            <TrashIcon />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </nav>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <nav className="p-4 space-y-2">
                         {isCollapsed ? (
                            <div className="my-2 border-t border-gray-200 dark:border-gray-700 mx-2"></div>
                        ) : (
                            <div>
                                <h3 className="px-4 py-2 text-xs font-semibold text-light-subtle dark:text-dark-subtle uppercase tracking-wider">Export</h3>
                            </div>
                        )}
                        <SidebarButton isCollapsed={isCollapsed} onClick={exportTxt} icon={<TextFileIcon />} label="Download as .txt" />
                        <SidebarButton isCollapsed={isCollapsed} onClick={exportDocx} icon={<DocxFileIcon />} label="Download as .docx" />
                    </nav>
                </div>
            </aside>
        </>
    );
};
