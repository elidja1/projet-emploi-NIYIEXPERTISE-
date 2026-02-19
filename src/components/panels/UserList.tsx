import React from 'react';
import { useEditor } from '../../context/EditorContext';
import { Users, Pencil } from 'lucide-react';
import { cn } from '../../utils/cn';

export const UserList: React.FC = () => {
    const { state } = useEditor();

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Utilisateurs Actifs
                </h3>
                <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full font-medium">
                    {state.users.length}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {state.users.map((user) => (
                    <div key={user.id} className="flex items-center space-x-3 group">
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium shadow-sm ring-2 ring-white dark:ring-gray-900"
                            style={{ backgroundColor: user.color }}
                        >
                            {user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <p className={cn(
                                    "text-sm font-medium truncate",
                                    user.id === 'me' ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"
                                )}>
                                    {user.name} {user.id === 'me' && '(Moi)'}
                                </p>
                                {user.isTyping && (
                                    <Pencil className="w-3 h-3 text-blue-500 animate-bounce" />
                                )}
                            </div>
                            <p className="text-xs text-gray-500 truncate">
                                {user.isTyping ? 'Écrit...' : `Ligne ${user.y + 1}, Col ${user.x + 1}`}
                                <span className="ml-2 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] text-gray-400">
                                    {user.operationCount || 0} ops
                                </span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                <div className="text-xs text-gray-500 text-center">
                    <p>Utilisateurs simulés.</p>
                    <p>Ils bougent et écrivent automatiquement.</p>
                </div>
            </div>
        </div>
    );
};
