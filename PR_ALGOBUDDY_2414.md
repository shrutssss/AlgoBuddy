## PR Description: #2414 — Chatbot Context Overflow Leading to Token Bloat

### Problem
The chatbot `messages` state grows unboundedly — every turn appends one user message + one assistant response without any pruning. This causes:
1. **Token bloat**: The full conversation history is sent to the Gemini API on every request, consuming more tokens per call
2. **Memory pressure**: The React state array grows indefinitely on the client
3. **Degraded responses**: The model receives excessively long context windows that dilute recent turns

### Changes
- **`src/app/components/ui/Chatbot.jsx`**:
  - Added `MAX_HISTORY = 30` constant defining the sliding window size
  - Added `pruneMessages()` helper that keeps the welcome message and the last N-1 conversational turns
  - Applied `pruneMessages` inside the `setMessages` updater so the stored messages array never exceeds 30 items
  - Applied `pruneMessages` when building the API `history` payload, so only the last ~30 messages are sent over the wire

### Verification
- Open the chatbot, send 35+ messages — the UI should show no more than 30 messages in the scrollable list
- Network tab should show the request payload capped at ~30 messages
- Server-side `messages.slice(-20)` still applies as a safety net
