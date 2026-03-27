export type ConnectionStatus =
  | "connecting"    
  | "waiting"       
  | "calling"      
  | "connected"     
  | "disconnected"; 

export const STATUS_CONFIG: Record<ConnectionStatus, { label: string; color: string }> = {
    connecting:   { label: "Connecting…",              color: "var(--warning)" },
  waiting:      { label: "Waiting for peer…",        color: "var(--accent2)" },
  calling:      { label: "Establishing connection…", color: "var(--warning)" },
  connected:    { label: "Connected",                color: "var(--accent)"  },
  disconnected: { label: "Peer disconnected",        color: "var(--danger)"  },
}