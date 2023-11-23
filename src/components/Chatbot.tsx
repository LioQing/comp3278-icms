import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import React from 'react';
import SendIcon from '@mui/icons-material/Send';
import Panel from './Panel';
import { Chatbot as ChatbotApi, postChatbot } from '../models/Chatbot';
import useAxios from '../hooks/useAxios';

const transition = 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)';

export interface ChatbotProps {
  opened: boolean;
  onClose: () => void;
}

function Chatbot({ opened, onClose }: ChatbotProps) {
  const theme = useTheme();
  const [input, setInput] = React.useState<string>('');
  const [conversation, setConversation] = React.useState<
    [string, string | null][]
  >([]);

  const chatbotClient = useAxios<ChatbotApi>();

  React.useEffect(() => {
    if (!chatbotClient.response) return;

    if (chatbotClient.response.status === 200) {
      setConversation([
        ...conversation.slice(0, conversation.length - 1),
        [
          chatbotClient.response.data.user_message,
          chatbotClient.response.data.bot_message,
        ],
      ]);
    }
  }, [chatbotClient.response]);

  React.useEffect(() => {
    if (!chatbotClient.error) return;

    if (chatbotClient.error.response?.status === 400) {
      setConversation([
        ...conversation.slice(0, conversation.length - 1),
        [input, chatbotClient.error.message],
      ]);
    }
  });

  const handleSend = () => {
    if (input === '') return;
    setConversation([...conversation, [input, null]]);
    setInput('');
    chatbotClient.sendRequest(postChatbot({ user_message: input }));
  };

  const keyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <Panel
      title="Chatbot"
      trailing={
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      }
      sx={{
        height: '500px',
        opacity: opened ? 1 : 0,
        transition,
      }}
    >
      <Box display="flex" flexDirection="column" gap={2} height="100%">
        <Box
          display="flex"
          flexDirection="column"
          gap={1}
          flexGrow={1}
          overflow="auto"
          p={2}
        >
          {conversation.map(([userMessage, botMessage], index) => (
            <Box
              // eslint-disable-next-line react/no-array-index-key
              key={index.toString()}
              display="flex"
              flexDirection="column"
              gap={1}
              alignItems={userMessage === '' ? 'flex-start' : 'flex-end'}
            >
              <Box
                width="100%"
                display="flex"
                flexDirection="row"
                justifyContent="flex-end"
              >
                <Panel
                  sx={{
                    maxWidth: '90%',
                    p: 1,
                    pt: 1,
                    bgcolor: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText,
                  }}
                >
                  {userMessage}
                </Panel>
              </Box>
              {botMessage && (
                <Box
                  width="100%"
                  display="flex"
                  flexDirection="row"
                  justifyContent="flex-start"
                >
                  <Panel
                    sx={{
                      maxWidth: '90%',
                      p: 1,
                      pt: 1,
                    }}
                  >
                    {botMessage}
                  </Panel>
                </Box>
              )}
            </Box>
          ))}
        </Box>
        <TextField
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          sx={{ width: '100%', mb: 4 }}
          onKeyDown={keyPress}
          disabled={chatbotClient.loading}
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleSend} disabled={chatbotClient.loading}>
                <SendIcon />
              </IconButton>
            ),
          }}
          placeholder='Search course by name, code, or year. Example: "Algoritma"'
        />
      </Box>
    </Panel>
  );
}

export default Chatbot;
