"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface EnterChatContextType {
  // Options > Game tab's "Enter Chat" checkbox — repurposed from the
  // reference client (which uses it to gate chat-vs-hotkey input) to
  // control every global Alt+<key> shortcut's modifier instead, since this
  // app has no chat to gate. Unchecked (default): shortcuts keep working
  // exactly as they always have, Alt held down (e.g. Alt+N for Up Next).
  // Checked: the same shortcuts drop the Alt requirement, so a bare <key>
  // press triggers them — see useAppShortcut, the one place that actually
  // reads this.
  enterChat: boolean;
  setEnterChat: (enabled: boolean) => void;
}

const EnterChatContext = createContext<EnterChatContextType | undefined>(
  undefined,
);

export function EnterChatProvider({ children }: { children: ReactNode }) {
  const [enterChat, setEnterChat] = useState(false);

  return (
    <EnterChatContext.Provider value={{ enterChat, setEnterChat }}>
      {children}
    </EnterChatContext.Provider>
  );
}

export function useEnterChat(): EnterChatContextType {
  const context = useContext(EnterChatContext);
  if (context === undefined) {
    throw new Error("useEnterChat must be used within an EnterChatProvider");
  }
  return context;
}
