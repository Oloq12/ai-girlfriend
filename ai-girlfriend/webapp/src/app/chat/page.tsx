'use client';

import { ChatUI } from '@/components/ChatUI';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md h-screen bg-white shadow-xl">
        <ChatUI
          characterId="kuudere"
          characterName="Алиса"
          characterEmoji="👩‍🎓"
          onBack={() => window.history.back()}
        />
      </div>
    </div>
  );
}
