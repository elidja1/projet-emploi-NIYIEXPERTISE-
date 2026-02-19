import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { EditorState, User, ChatMessage, LogEntry } from '../types';

// Initial Mock State
const initialState: EditorState = {
    docName: 'new-project.tsx',
    content: [
        'Il était une fois, dans un monde numérique connecté...',
        'Trois développeurs cherchaient à construire l\'outil parfait.',
        'Ils travaillaient jour et nuit, ligne après ligne.',
        'Mais un bug mystérieux persistait dans la matrice.',
        ''
    ],
    users: [
        { id: 'me', name: 'You', color: '#3b82f6', isTyping: false, x: 0, y: 0, operationCount: 0 },
    ],
    chat: [],
    logs: [],
    isConnected: true,
    isSyncing: false,
    lastSynced: new Date().toISOString(),
    latency: 45,
    theme: 'light',
};

// Actions
type Action =
    | { type: 'SET_CONTENT'; payload: string[] }
    | { type: 'UPDATE_USER'; payload: Partial<User> & { id: string } }
    | { type: 'ADD_MESSAGE'; payload: ChatMessage }
    | { type: 'ADD_LOG'; payload: LogEntry }
    | { type: 'SET_CONNECTION'; payload: boolean }
    | { type: 'SET_SYNCING'; payload: boolean }
    | { type: 'SET_LATENCY'; payload: number }
    | { type: 'UPDATE_REMOTE_USERS'; payload: User[] }
    | { type: 'UPDATE_REMOTE_USERS'; payload: User[] }
    | { type: 'UPDATE_SIMULATION'; payload: { users: User[], content: string[] } }
    | { type: 'TOGGLE_THEME' };

// Reducer
function editorReducer(state: EditorState, action: Action): EditorState {
    switch (action.type) {
        case 'SET_CONTENT':
            return { ...state, content: action.payload };
        case 'UPDATE_USER':
            return {
                ...state,
                users: state.users.map((u) =>
                    u.id === action.payload.id ? { ...u, ...action.payload } : u
                ),
            };
        case 'ADD_MESSAGE':
            return { ...state, chat: [...state.chat, action.payload] };
        case 'ADD_LOG':
            return { ...state, logs: [action.payload, ...state.logs] };
        case 'SET_CONNECTION':
            return { ...state, isConnected: action.payload };
        case 'SET_SYNCING':
            return { ...state, isSyncing: action.payload };
        case 'SET_LATENCY':
            return { ...state, latency: action.payload };
        case 'UPDATE_REMOTE_USERS':
            // Merge remote users, keeping 'me' intact if it's there, or handle separately
            // For this simulation, we'll replace all except 'me'
            const me = state.users.find(u => u.id === 'me');
            if (!me) return { ...state, users: action.payload };

            return {
                ...state,
                users: [me, ...action.payload.filter(u => u.id !== 'me')]
            };
        case 'UPDATE_SIMULATION':
            const meSim = state.users.find(u => u.id === 'me');
            const mergedUsers = meSim
                ? [meSim, ...action.payload.users.filter(u => u.id !== 'me')]
                : action.payload.users;

            return {
                ...state,
                content: action.payload.content,
                users: mergedUsers
            };
        case 'TOGGLE_THEME':
            return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
        default:
            return state;
    }
}

// Context
const EditorContext = createContext<{
    state: EditorState;
    dispatch: React.Dispatch<Action>;
} | null>(null);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(editorReducer, initialState);

    // Initial log
    useEffect(() => {
        dispatch({
            type: 'ADD_LOG',
            payload: {
                id: 'init',
                text: 'Système initialisé. Connecté au serveur collaboratif.',
                timestamp: new Date().toISOString(),
                type: 'info'
            }
        });
    }, []);

    // Theme Effect
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(state.theme);
    }, [state.theme]);

    return (
        <EditorContext.Provider value={{ state, dispatch }}>
            {children}
        </EditorContext.Provider>
    );
};

export const useEditor = () => {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error('useEditor must be used within an EditorProvider');
    }
    return context;
};
