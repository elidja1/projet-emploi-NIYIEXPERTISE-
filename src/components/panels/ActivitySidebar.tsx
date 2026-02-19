import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { MessageSquare, ScrollText, Send } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../utils/cn';

export const ActivitySidebar: React.FC = () => {
    const { state, dispatch } = useEditor();
    const [activeTab, setActiveTab] = useState<'chat' | 'logs'>('chat');
    const [msgInput, setMsgInput] = useState('');

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!msgInput.trim()) return;

        const newMessage = {
            id: Date.now().toString(),
            userId: 'me',
            text: msgInput,
            timestamp: new Date().toISOString(),
        };

        dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
        setMsgInput('');
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-800">
                <button
                    onClick={() => setActiveTab('chat')}
                    className={cn(
                        "flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors",
                        activeTab === 'chat'
                            ? "text-blue-600 border-b-2 border-blue-600 bg-white dark:bg-gray-800 dark:text-blue-400"
                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    )}
                >
                    <MessageSquare className="w-4 h-4" />
                    Chat
                </button>
                <button
                    onClick={() => setActiveTab('logs')}
                    className={cn(
                        "flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors",
                        activeTab === 'logs'
                            ? "text-blue-600 border-b-2 border-blue-600 bg-white dark:bg-gray-800 dark:text-blue-400"
                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    )}
                >
                    <ScrollText className="w-4 h-4" />
                    Activité
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {activeTab === 'chat' ? (
                    <>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {state.chat.length === 0 ? (
                                <div className="text-center text-gray-400 text-sm mt-10">Aucun message.</div>
                            ) : (
                                state.chat.map((msg) => (
                                    <div key={msg.id} className={cn("flex flex-col", msg.userId === 'me' ? "items-end" : "items-start")}>
                                        <div className={cn(
                                            "px-3 py-2 rounded-lg text-sm max-w-[85%]",
                                            msg.userId === 'me'
                                                ? "bg-blue-500 text-white rounded-br-none"
                                                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
                                        )}>
                                            {msg.text}
                                        </div>
                                        <span className="text-[10px] text-gray-400 mt-1">
                                            {msg.userId === 'me' ? 'Moi' : state.users.find(u => u.id === msg.userId)?.name || 'Inconnu'} • {format(new Date(msg.timestamp), 'HH:mm')}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>

                        <form onSubmit={handleSend} className="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={msgInput}
                                    onChange={(e) => setMsgInput(e.target.value)}
                                    placeholder="Écrire un message..."
                                    className="w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={!msgInput.trim()}
                                    className="absolute right-1 top-1 p-1 text-blue-500 hover:text-blue-600 disabled:opacity-50"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 overflow-y-auto p-0">
                        {state.logs.map((log) => (
                            <div key={log.id} className="p-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <div className="flex items-start gap-2">
                                    <div className={cn(
                                        "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
                                        log.type === 'error' ? "bg-red-500" :
                                            log.type === 'warning' ? "bg-yellow-500" :
                                                log.type === 'success' ? "bg-green-500" : "bg-blue-500"
                                    )} />
                                    <div>
                                        <p className="text-xs text-gray-800 dark:text-gray-200 font-medium">{log.text}</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5 font-mono">
                                            [{format(new Date(log.timestamp), 'HH:mm:ss')}]
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {state.logs.length === 0 && (
                            <div className="text-center text-gray-400 text-sm mt-10">Aucun journal d'activité.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
