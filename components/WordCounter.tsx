
import React from 'react';

interface WordCounterProps {
    count: number;
}

export const WordCounter: React.FC<WordCounterProps> = ({ count }) => {
    return (
        <div className="fixed bottom-4 right-4 bg-light-surface dark:bg-dark-surface px-3 py-1.5 rounded-full shadow-lg text-sm font-medium text-light-subtle dark:text-dark-subtle select-none">
            {count} {count === 1 ? 'word' : 'words'}
        </div>
    );
};
