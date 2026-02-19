import React from 'react';
import { useEditor } from '../../context/EditorContext';

export const Footer: React.FC = () => {
    const { state } = useEditor();

    return (
        <div className="flex items-center justify-between w-full h-full text-xs text-gray-500 dark:text-gray-400 font-mono">
            <div className="flex items-center space-x-4">
                <span>Taille du document: {new Blob([state.content.join('\n')]).size} octets</span>
                <span>Lignes: {state.content.length}</span>
            </div>

            <div className="flex items-center space-x-4">
                <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                    Mode Sync: Temps réel (Simulé)
                </span>
                <span>Latence: {state.latency}ms</span>
            </div>
        </div>
    );
};
