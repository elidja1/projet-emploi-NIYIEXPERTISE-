import React from 'react';
import { useEditor } from '../../context/EditorContext';
import { Undo, Redo, Wifi, WifiOff, RefreshCw, Moon, Sun } from 'lucide-react';

export const Header: React.FC = () => {
    const { state, dispatch } = useEditor();

    return (
        <div className="flex items-center justify-between px-4 h-full">
            {/* Left: Branding & Title */}
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                        TE
                    </div>
                    <span className="font-semibold text-lg hidden sm:block dark:text-gray-100">TeamEdit</span>
                </div>
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2" />
                <div className="group relative">
                    <input
                        type="text"
                        defaultValue={state.docName}
                        className="bg-transparent text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    />
                </div>
            </div>

            {/* Center: Status Indicator */}
            <div className="flex items-center space-x-2 text-sm">
                {state.isConnected ? (
                    state.isSyncing ? (
                        <>
                            <RefreshCw className="w-4 h-4 text-yellow-500 animate-spin" />
                            <span className="text-yellow-600 dark:text-yellow-400">Synchronisation...</span>
                        </>
                    ) : (
                        <>
                            <Wifi className="w-4 h-4 text-green-500" />
                            <span className="text-green-600 dark:text-green-400">Connecté</span>
                        </>
                    )
                ) : (
                    <>
                        <WifiOff className="w-4 h-4 text-red-500" />
                        <span className="text-red-600 dark:text-red-400">Déconnecté</span>
                    </>
                )}
            </div>

            {/* Right: History Controls & User Avatar (Me) */}
            <div className="flex items-center space-x-3">
                <button
                    onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
                    className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                    title="Toggle Theme"
                >
                    {state.theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>

                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-md p-1">
                    <button className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50 transition-colors" title="Undo">
                        <Undo className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50 transition-colors" title="Redo">
                        <Redo className="w-4 h-4" />
                    </button>
                </div>

                <div className="h-8 w-8 rounded-full bg-blue-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-medium cursor-pointer" title="You">
                    ME
                </div>
            </div>
        </div>
    );
};
