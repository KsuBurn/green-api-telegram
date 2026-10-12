import type { Chat, Message } from '../types';

export type ChatAction =
    | { type: 'chat'; id: string; name: string }
    | { type: 'message'; message: Message; name?: string }
    | { type: 'status'; chatId: string; localId: string; status: Message['status']; id?: string };

export const chatReducer = (chats: Chat[], action: ChatAction): Chat[] => {
    switch (action.type) {
        case 'chat': {
            const chatExists = chats.some((chat) => chat.id === action.id);

            if (chatExists) {
                return chats;
            }

            return [...chats, { id: action.id, name: action.name, messages: [] }];
        }

        case 'status': {
            return chats.map((chat) => {
                if (chat.id !== action.chatId) {
                    return chat;
                }

                const messages = chat.messages.map((message) => {
                    if (message.id !== action.localId) {
                        return message;
                    }

                    return {
                        ...message,
                        status: action.status,
                        id: action.id ?? message.id,
                    };
                });

                return { ...chat, messages };
            });
        }

        case 'message': {
            const { message } = action;
            const currentChat = chats.find((chat) => chat.id === message.chatId);

            if (!currentChat) {
                return [
                    ...chats,
                    {
                        id: message.chatId,
                        name: action.name ?? message.chatId,
                        messages: [message],
                    },
                ];
            }

            const messageExists = currentChat.messages.some((item) => item.id === message.id);

            if (messageExists) {
                return chats;
            }

            return chats.map((chat) => {
                if (chat.id !== message.chatId) {
                    return chat;
                }

                const messages = [...chat.messages, message].sort((first, second) => {
                    return first.timestamp - second.timestamp;
                });

                return { ...chat, messages };
            });
        }
    }
}
