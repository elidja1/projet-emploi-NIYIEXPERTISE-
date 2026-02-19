import { useEffect, useRef } from 'react';
import { useEditor } from '../context/EditorContext';
import type { User } from '../types';

// Random User Names
const NAMES = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Heidi'];
const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e'];

export const useSimulatedNetwork = () => {
    const { state, dispatch } = useEditor();
    const stateRef = useRef(state);

    // Bot internal state to track what they are typing
    const botStates = useRef<Record<string, {
        mode: 'typing' | 'deleting' | 'idle';
        phrase: string;
        progress: number;
    }>>({});

    const SNIPPETS = [
        " soudain, une idée brillante surgit.",
        " le code devint limpide comme de l'eau de roche.",
        " et la compilation réussit du premier coup !",
        " cependant, le serveur répondait encore.",
        " c'était le début d'une nouvelle ère.",
        " tous les tests passèrent au vert.",
        " la solution était sous leurs yeux depuis le début.",
    ];

    // Keep ref synced for intervals
    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    // Simulate network latency fluctuations
    useEffect(() => {
        const interval = setInterval(() => {
            // Random latency between 100ms and 1500ms
            const newLatency = Math.floor(Math.random() * 1400) + 100;
            dispatch({ type: 'SET_LATENCY', payload: newLatency });

            // 1% packet loss simulation (simulated by a "glitch" log)
            if (Math.random() < 0.01) {
                dispatch({
                    type: 'ADD_LOG',
                    payload: {
                        id: Date.now().toString(),
                        text: 'Paquet réseau perdu. Tentative de reconnexion...',
                        timestamp: new Date().toISOString(),
                        type: 'warning'
                    }
                });
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [dispatch]);

    // Simulate Remote Users (3+ users)
    useEffect(() => {
        // Initial users
        const initialRemoteUsers: User[] = Array.from({ length: 3 }).map((_, i) => ({
            id: `user-${i}`,
            name: NAMES[i % NAMES.length],
            color: COLORS[i % COLORS.length],
            isTyping: false,
            x: 0,
            y: i + 2, // Start on different lines
            operationCount: Math.floor(Math.random() * 100),
        }));

        // Initialize bot states
        initialRemoteUsers.forEach(u => {
            botStates.current[u.id] = {
                mode: 'idle',
                phrase: SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)],
                progress: 0
            };
        });

        dispatch({ type: 'UPDATE_REMOTE_USERS', payload: initialRemoteUsers });

        const moveInterval = setInterval(() => {
            const currentState = stateRef.current;
            const currentUsers = currentState.users.filter(u => u.id !== 'me');
            let newContent = [...currentState.content];
            let contentChanged = false;

            const updatedUsers = currentUsers.map(user => {
                let bot = botStates.current[user.id];

                // Initialize if missing
                if (!bot) {
                    bot = { mode: 'idle', phrase: SNIPPETS[0], progress: 0 };
                    botStates.current[user.id] = bot;
                }

                // Randomly change mode if idle
                if (bot.mode === 'idle' && Math.random() > 0.8) {
                    bot.mode = Math.random() > 0.3 ? 'typing' : 'deleting';
                    if (bot.mode === 'typing') {
                        bot.phrase = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)];
                        bot.progress = 0;
                    }
                }

                let newUser = { ...user };

                // Ensure line exists
                if (newUser.y >= newContent.length) {
                    while (newContent.length <= newUser.y) newContent.push("");
                    contentChanged = true;
                }

                const line = newContent[newUser.y] || "";

                if (bot.mode === 'typing') {
                    // Type next character
                    if (bot.progress < bot.phrase.length) {
                        const char = bot.phrase[bot.progress];
                        // Append to end of line to be less intrusive
                        const newLine = line + char;
                        newContent[newUser.y] = newLine;
                        newUser.x = newLine.length; // Move cursor to end of line
                        newUser.isTyping = true;
                        newUser.operationCount++;
                        bot.progress++;
                        contentChanged = true;
                    } else {
                        // Done typing
                        bot.mode = 'idle';
                        newUser.isTyping = false;
                    }
                } else if (bot.mode === 'deleting') {
                    // Backspace - only if line is not empty
                    if (line.length > 5) { // Don't delete everything
                        const newLine = line.slice(0, -1);
                        newContent[newUser.y] = newLine;
                        newUser.x = newLine.length;
                        newUser.isTyping = true;
                        newUser.operationCount++;
                        contentChanged = true;
                    } else {
                        // Stop deleting
                        bot.mode = 'idle';
                        newUser.isTyping = false;
                    }
                } else {
                    // Idle behavior: random simple moves
                    if (Math.random() > 0.7) {
                        newUser.x = Math.max(0, newUser.x + (Math.random() > 0.5 ? 1 : -1));
                    }
                    newUser.isTyping = false;
                }

                return newUser;
            });

            if (contentChanged) {
                dispatch({
                    type: 'UPDATE_SIMULATION',
                    payload: {
                        content: newContent,
                        users: updatedUsers
                    }
                });
            } else {
                dispatch({ type: 'UPDATE_REMOTE_USERS', payload: updatedUsers });
            }

        }, 400); // Slower interval for realistic typing

        return () => clearInterval(moveInterval);
    }, []); // Run once on mount

    // Chat Auto-Response Simulation
    const isRespondingRef = useRef(false);
    useEffect(() => {
        const lastMsg = state.chat[state.chat.length - 1];
        if (lastMsg && lastMsg.userId === 'me' && !isRespondingRef.current) {
            // Trigger response sequence for any message for demo purposes, or specific keywords
            if (true) { // Respond to everything
                isRespondingRef.current = true;

                const responses = [
                    { id: 'user-0', text: "Salut ! 👋" },
                    { id: 'user-1', text: "Bonjour tout le monde !" },
                    { id: 'user-2', text: "Hello ! Prêt pour le code." }
                ];

                let delay = 1000;

                responses.forEach((resp, index) => {
                    // Start Typing
                    setTimeout(() => {
                        dispatch({ type: 'UPDATE_USER', payload: { id: resp.id, isTyping: true } });
                    }, delay);

                    delay += 1500; // Type for 1.5s

                    // Send Message
                    setTimeout(() => {
                        dispatch({
                            type: 'ADD_MESSAGE',
                            payload: {
                                id: Date.now() + index.toString(),
                                userId: resp.id,
                                text: resp.text,
                                timestamp: new Date().toISOString()
                            }
                        });
                        dispatch({ type: 'UPDATE_USER', payload: { id: resp.id, isTyping: false } });

                        // Reset lock after last message
                        if (index === responses.length - 1) {
                            isRespondingRef.current = false;
                        }
                    }, delay);

                    delay += 1000; // Wait before next user starts
                });
            }
        }
    }, [state.chat, dispatch]);
};
