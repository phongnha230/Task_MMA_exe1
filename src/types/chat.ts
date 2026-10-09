export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  text: string;
  createdAt: number;
}
