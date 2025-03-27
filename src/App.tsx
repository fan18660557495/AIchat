import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(90deg, #F1F6FB 0%, #E5EEFA 100%);
`;

function App() {
  const [conversationTitle, setConversationTitle] = useState('AI 助手对话');

  return (
    <AppContainer>
      <Sidebar conversationTitle={conversationTitle} />
      <ChatArea conversationTitle={conversationTitle} setConversationTitle={setConversationTitle} />
    </AppContainer>
  );
}

export default App;
