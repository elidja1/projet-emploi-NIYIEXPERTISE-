import React from 'react';

interface AppLayoutProps {
    header: React.ReactNode;
    leftPanel: React.ReactNode;
    editor: React.ReactNode;
    rightPanel: React.ReactNode;
    footer: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
    header,
    leftPanel,
    editor,
    rightPanel,
    footer,
}) => {
    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Header */}
            <header className="h-14 border-b border-gray-200 dark:border-gray-800 flex-none z-10 bg-white dark:bg-gray-900">
                {header}
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - User List */}
                <aside className="w-64 border-r border-gray-200 dark:border-gray-800 flex-none bg-gray-50 dark:bg-gray-900 hidden md:flex flex-col">
                    {leftPanel}
                </aside>

                {/* Center - Editor */}
                <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-950 relative">
                    {editor}
                </main>

                {/* Right Panel - Chat/Logs */}
                <aside className="w-80 border-l border-gray-200 dark:border-gray-800 flex-none bg-gray-50 dark:bg-gray-900 hidden lg:flex flex-col">
                    {rightPanel}
                </aside>
            </div>

            {/* Footer */}
            <footer className="h-8 border-t border-gray-200 dark:border-gray-800 flex-none bg-gray-100 dark:bg-gray-900 text-xs flex items-center px-4">
                {footer}
            </footer>
        </div>
    );
};
