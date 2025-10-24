
import React, { useRef, useEffect } from 'react';
import { BoldIcon, ItalicIcon, UnderlineIcon, AlignLeftIcon, AlignCenterIcon, AlignRightIcon } from './icons';

interface EditorProps {
    content: string;
    setContent: (content: string) => void;
    spellCheck: boolean;
}

const FormattingButton: React.FC<{ onClick: () => void; children: React.ReactNode; 'aria-label': string }> = ({ onClick, children, 'aria-label': ariaLabel }) => (
    <button
        onMouseDown={e => e.preventDefault()} // Prevent editor from losing focus
        onClick={onClick}
        className="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        aria-label={ariaLabel}
    >
        {children}
    </button>
);


export const Editor: React.FC<EditorProps> = ({ content, setContent, spellCheck }) => {
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const editor = editorRef.current;
        if (editor && editor.innerHTML !== content) {
            editor.innerHTML = content;
        }
    }, [content]);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        setContent(e.currentTarget.innerHTML);
    };
    
    const applyFormat = (command: string) => {
        document.execCommand(command, false);
        if(editorRef.current) {
            setContent(editorRef.current.innerHTML);
            editorRef.current.focus();
        }
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-light-bg dark:bg-dark-bg">
            <div className="w-full max-w-4xl mx-auto p-2 sticky top-[60px] bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-sm z-10">
                <div className="flex items-center gap-1 p-1 rounded-md bg-gray-200 dark:bg-gray-700 w-fit mx-auto">
                    <FormattingButton onClick={() => applyFormat('bold')} aria-label="Bold"><BoldIcon /></FormattingButton>
                    <FormattingButton onClick={() => applyFormat('italic')} aria-label="Italic"><ItalicIcon /></FormattingButton>
                    <FormattingButton onClick={() => applyFormat('underline')} aria-label="Underline"><UnderlineIcon /></FormattingButton>
                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-500 mx-1"></div>
                    <FormattingButton onClick={() => applyFormat('justifyLeft')} aria-label="Align Left"><AlignLeftIcon /></FormattingButton>
                    <FormattingButton onClick={() => applyFormat('justifyCenter')} aria-label="Align Center"><AlignCenterIcon /></FormattingButton>
                    <FormattingButton onClick={() => applyFormat('justifyRight')} aria-label="Align Right"><AlignRightIcon /></FormattingButton>
                </div>
            </div>
            <div
                ref={editorRef}
                onInput={handleInput}
                contentEditable={true}
                spellCheck={spellCheck}
                className="prose prose-lg dark:prose-invert max-w-4xl mx-auto w-full flex-1 p-8 focus:outline-none placeholder-text"
                data-placeholder="Start writing..."
            />
            <style>{`
                .placeholder-text:empty:before {
                    content: attr(data-placeholder);
                    color: #a0a0a0;
                    dark: #6a6a6a;
                    cursor: text;
                }
            `}</style>
        </div>
    );
};
