import { AxiosRequest } from '../hooks/useAxios';

export interface ChatbotRequest {
  user_message: string;
}

export interface Chatbot {
  user_message: string;
  bot_message: string;
}

export const postChatbot = (
  data: ChatbotRequest,
): AxiosRequest<ChatbotRequest> => ({
  url: '/api/chatbot/',
  method: 'post',
  data,
});
