// Define Liveblocks types for your application
// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data

import { LiveObject, LiveMap } from "@liveblocks/client";

type AIRequestData = {
  requestId: string;
  result: string;
  timestamp: string;
};

type AIRequest = {
  type: 'generate' | 'chat' | 'summarize' | 'translate';
  prompt?: string;
  question?: string;
  targetLang?: string;
  status: 'pending' | 'completed' | 'error';
  timestamp: string;
  completedAt?: string;
  result: string | null;
};

declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: {
      // Example, real-time cursor coordinates
      cursor: { x: number; y: number } | null;
    };

    // The Storage tree for the room, for useMutation, useStorage, etc.
    Storage: {
      // AI requests storage
      aiRequests: LiveMap<string, LiveObject<AIRequest>>;
    };

    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id: string;
      info: {
        name: string;
        avatar: string;
        email: string;
      };
    };

    // Custom events, for useBroadcastEvent, useEventListener
    RoomEvent: 
      | { type: "AI_GENERATE_COMPLETED"; data: AIRequestData; }
      | { type: "AI_CHAT_COMPLETED"; data: AIRequestData; }
      | { type: "AI_SUMMARIZE_COMPLETED"; data: AIRequestData; }
      | { type: "AI_TRANSLATE_COMPLETED"; data: AIRequestData; };

    // Custom metadata set on threads, for useThreads, useCreateThread, etc.
    ThreadMetadata: {
      // Example, attaching coordinates to a thread
      // x: number;
      // y: number;
    };

    // Custom room info set with resolveRoomsInfo, for useRoomInfo
    RoomInfo: {
      // Example, rooms with a title and url
      // title: string;
      // url: string;
    };
  }
}

export {};
