import React, { useCallback, useRef } from 'react';
import { useEditor } from '../../context/EditorContext';
import { cn } from '../../utils/cn';

// Memoized Line Component to prevent re-renders of all lines
const EditorLine = React.memo(({
    content,
    lineNumber,
    isActive
}: {
    content: string;
    lineNumber: number;
    isActive: boolean
}) => {
    return (
        <div className={cn(
            "flex",
            isActive && "bg-blue-50 dark:bg-blue-900/20"
        )}>
            <div className="w-12 flex-none text-right pr-3 text-gray-400 select-none text-sm font-mono opacity-50">
                {lineNumber}
            </div>
            <div
                className="flex-1 whitespace-pre font-mono text-sm text-gray-800 dark:text-gray-200 min-h-[1.5em]"
                style={{ fontFamily: '"Courier New", Courier, monospace' }}
            >
                {content || ' '}
            </div>
        </div>
    );
});

export const CodeEditor: React.FC = () => {
    const { state, dispatch } = useEditor();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Track cursor position to prevent jumping during remote updates
    const cursorRef = useRef<{ start: number; end: number } | null>(null);
    const prevContentRef = useRef<string>(state.content.join('\n'));

    // Update cursor ref when user interacts
    const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
        const target = e.currentTarget;
        cursorRef.current = {
            start: target.selectionStart,
            end: target.selectionEnd
        };
    };

    // Smart Cursor Preservation
    React.useLayoutEffect(() => {
        const textarea = textareaRef.current;
        if (textarea && cursorRef.current && document.activeElement === textarea) {
            const currentContent = state.content.join('\n');
            const prevContent = prevContentRef.current;

            if (currentContent !== prevContent) {
                const { start, end } = cursorRef.current;
                let newStart = start;
                let newEnd = end;

                // Auto-sync reference for next time
                prevContentRef.current = currentContent;

                // Simple diff strategy: finding first difference
                let diffIndex = 0;
                while (diffIndex < prevContent.length && diffIndex < currentContent.length && prevContent[diffIndex] === currentContent[diffIndex]) {
                    diffIndex++;
                }

                // If change happened before our cursor (remote user typing)
                if (diffIndex < start) {
                    const lengthDiff = currentContent.length - prevContent.length;
                    newStart += lengthDiff;
                    newEnd += lengthDiff;

                    textarea.setSelectionRange(newStart, newEnd);
                    // Update ref to new position
                    cursorRef.current = { start: newStart, end: newEnd };
                } else {
                    // Change happened after, just restore
                    textarea.setSelectionRange(start, end);
                }
            }
        } else {
            // Sync ref even if not active
            prevContentRef.current = state.content.join('\n');
        }
    }, [state.content]);

    // Handle local typing
    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        prevContentRef.current = value; // Update ref immediately
        const newContent = value.split('\n');

        // Update cursor ref immediately
        cursorRef.current = {
            start: e.target.selectionStart,
            end: e.target.selectionEnd
        };

        dispatch({ type: 'SET_CONTENT', payload: newContent });

        // Simulate updating my cursor
        // Calculate X/Y for the visualization
        const lines = value.substring(0, e.target.selectionStart).split('\n');
        const y = lines.length - 1;
        const x = lines[lines.length - 1].length;

        dispatch({
            type: 'UPDATE_USER',
            payload: {
                id: 'me',
                isTyping: true,
                x,
                y
            }
        });

        // Reset typing status after delay
        setTimeout(() => {
            dispatch({
                type: 'UPDATE_USER',
                payload: { id: 'me', isTyping: false }
            });
        }, 500);

    }, [dispatch]);

    const rawContent = state.content.join('\n');

    return (
        <div className="relative flex-1 h-full overflow-hidden flex flex-col">
            {/* Latency Indicator Overlay (as per spec requirements for "Zone Centrale d'Édition") */}
            <div className="absolute top-2 right-4 z-20 pointer-events-none">
                <div className={cn(
                    "px-2 py-1 rounded text-xs font-mono font-medium opacity-70",
                    state.latency < 200 ? "text-green-500 bg-green-100/50" :
                        state.latency < 500 ? "text-yellow-500 bg-yellow-100/50" :
                            "text-red-500 bg-red-100/50"
                )}>
                    {state.latency}ms
                </div>
            </div>

            <div className="relative flex-1 overflow-auto bg-white dark:bg-gray-950">
                {/* Rendered Lines (Visual Layer) */}
                <div className="absolute inset-0 p-4 pointer-events-none z-0">
                    {state.content.map((line, i) => (
                        <EditorLine
                            key={i}
                            content={line}
                            lineNumber={i + 1}
                            isActive={false} // Could track active line logic here
                        />
                    ))}
                </div>

                {/* Remote Cursors Layer */}
                <div className="absolute inset-0 p-4 pointer-events-none z-10 overflow-hidden">
                    {state.users.filter(u => u.id !== 'me').map(user => (
                        <div
                            key={user.id}
                            className="absolute flex flex-col items-start"
                            style={{
                                top: `${(user.y * 1.5) + 0.2}em`, // Approx line height calculation
                                left: `calc(4rem + ${user.x}ch)`, // Exact char width + padding (1rem padding + 3rem line number width)
                            }}
                        >
                            <div
                                className="h-5 w-0.5"
                                style={{ backgroundColor: user.color }}
                            />
                            <div
                                className="px-1.5 py-0.5 text-[10px] text-white rounded rounded-tl-none whitespace-nowrap opacity-70"
                                style={{ backgroundColor: user.color }}
                            >
                                {user.name}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Layer (TextArea) */}
                <textarea
                    ref={textareaRef}
                    value={rawContent}
                    onChange={handleChange}
                    onSelect={handleSelect}
                    onKeyUp={handleSelect}
                    onClick={handleSelect}
                    spellCheck={false}
                    className="absolute inset-0 w-full h-full p-4 pl-16 bg-transparent text-transparent caret-blue-500 font-mono text-sm resize-none focus:outline-none z-20 leading-[1.5em]"
                    style={{
                        color: 'transparent',
                        caretColor: 'var(--cursor-color, #3b82f6)',
                        fontFamily: '"Courier New", Courier, monospace' // Strict monospace for alignment
                    }}
                />
            </div>
        </div>
    );
};
