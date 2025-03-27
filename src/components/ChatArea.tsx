import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import logo from '../assets/logo.png';
import avatar from '../assets/avatar.png';
import { sendMessage } from '../services/deepseek';
import { checkConfig } from '../services/config';

const Icon = styled.i`
  font-size: 16px;
  line-height: 1;
`;

const ChatAreaContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #FFFFFF;
  position: relative;
  overflow: hidden;
  min-width: 375px;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 120px 24px;
  gap: 24px;
  position: relative;

  @media (max-width: 1440px) {
    padding: 0 60px 24px;
  }

  @media (max-width: 768px) {
    padding: 0 16px 24px;
  }
`;

const Header = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #F2F3F5;
  background: #FFFFFF;
  z-index: 10;
`;

const HeaderWrapper = styled.div`
  width: 100%;
  max-width: 1440px;
  padding: 0 120px;
  display: flex;
  justify-content: center;

  @media (max-width: 1440px) {
    padding: 0 60px;
  }

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const HeaderTitle = styled.div`
  padding: 4px 8px;
  font-size: 16px;
  font-weight: 500;
  color: #1D2129;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  text-align: center;
`;

const ChatMessages = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 96px;
  overflow-y: auto;
  overflow-x: hidden;

  /* 自定义滚动条样式 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #E5E6E8;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #C9CDD4;
  }
`;

const MessageContainer = styled.div<{ isUser?: boolean }>`
  display: flex;
  gap: 16px;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  padding-bottom: 32px;
  max-width: 100%;
  width: 100%;
  padding-right: 0;
  padding-left: ${props => props.isUser ? '32px' : '0'};
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
`;

const MessageAvatar = styled.img`
  width: ${props => props.width || '40px'};
  height: ${props => props.height || '40px'};
  border-radius: 50%;
  order: ${props => props.style?.order || 0};
`;

const MessageContent = styled.div<{ isUser?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  max-width: 720px;
  width: 100%;
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.color || '#4E5969'};
  font-size: 12px;
`;

const ThinkBlock = styled.div`
  background: #F2F6FF;
  padding: 12px 16px;
  color: #4E5969;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-line;
  word-wrap: break-word;
  border-radius: 4px;
`;

const ThinkHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
`;

const ThinkTitle = styled.div`
  color: #165DFF;
  font-size: 14px;
  font-weight: 500;
`;

const ThinkContent = styled.div<{ isCollapsed: boolean }>`
  margin-top: ${props => props.isCollapsed ? '0' : '8px'};
  height: ${props => props.isCollapsed ? '0' : 'auto'};
  overflow: hidden;
  transition: all 0.3s ease;
`;

const CollapseIcon = styled(Icon)<{ isCollapsed: boolean }>`
  transform: rotate(${props => props.isCollapsed ? '180deg' : '0deg'});
  transition: transform 0.3s ease;
  color: #165DFF;
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  padding: 12px 16px;
  background: ${props => props.isUser ? '#165DFF' : '#FFFFFF'};
  color: ${props => props.isUser ? '#FFFFFF' : '#1D2129'};
  border-radius: ${props => props.isUser ? '8px 2px 8px 8px' : '2px 8px 8px 8px'};
  width: fit-content;
  max-width: 100%;
  word-wrap: break-word;
  white-space: pre-wrap;
  line-height: 1.6;
  box-shadow: ${props => props.isUser ? 'none' : '0px 4px 12px rgba(29, 33, 41, 0.08)'};

  /* 段落样式 */
  p {
    margin: 0;
    white-space: pre-line;
    & + p {
      margin-top: 12px;
    }
  }

  /* 标题样式 */
  h1, h2, h3, h4, h5, h6 {
    margin: 16px 0 8px 0;
    font-weight: 600;
    &:first-child {
      margin-top: 0;
    }
  }

  /* 列表样式 */
  ul, ol {
    margin: 8px 0;
    padding-left: 20px;
    li {
      margin: 4px 0;
    }
  }

  /* Think 块样式 */
  ${ThinkBlock} {
    margin: 8px 0;
    &:first-child {
      margin-top: 0;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const UserMessageBubble = styled(MessageBubble)`
  position: relative;

  &:hover .bubble-actions {
    opacity: 1;
  }
`;

const BubbleActions = styled.div`
  position: absolute;
  right: 0;
  bottom: -32px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 1;
  padding: 4px;
  background: #FFFFFF;
  border-radius: 4px;

  &:hover {
    opacity: 1;
  }
`;

const MessageActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 4px;
`;

const ActionButton = styled.button`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background: transparent;
  border-radius: 4px;
  color: #4E5969;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  i {
    font-size: 16px;
  }
`;

const SuggestedQuestions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
  width: 239px;
`;

const QuestionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 8px;
  border: 1px solid #F2F3F5;
  border-radius: 8px;
  background: transparent;
  color: #1D2129;
  cursor: pointer;
  width: 100%;
  text-align: left;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`;

const InputArea = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  margin-top: auto;
  flex-shrink: 0;
`;

const Input = styled.textarea`
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: #1D2129;
  background: transparent;
  resize: none;
  height: 40px;
  min-height: 40px;
  max-height: 40px;
  line-height: 20px;
  padding: 0;
  overflow-y: auto;

  &::placeholder {
    color: #86909C;
  }

  /* 自定义滚动条样式 */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #E5E6E8;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #C9CDD4;
  }
`;

const InputContainer = styled.div<{ isFocused: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border: 1px solid ${props => props.isFocused ? '#165DFF' : '#F2F3F5'};
  border-radius: 8px;
  background: #FFFFFF;
  transition: all 0.3s ease;

  &:hover {
    border-color: #165DFF;
  }
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 100%;
`;

const QuickActionButton = styled.button<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 8px;
  border: 1px solid #F2F3F5;
  border-radius: 4px;
  background: ${props => props.isActive ? '#F7F8FA' : 'transparent'};
  color: #4E5969;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: #F7F8FA;
  }
`;

const SendButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props => props.style?.opacity === 0.5 ? '#94BFFF' : '#165DFF'};
  border: 1px solid ${props => props.style?.opacity === 0.5 ? '#6AA1FF' : '#165DFF'};
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.style?.opacity === 0.5 ? '#94BFFF' : '#0E42D2'};
    border-color: ${props => props.style?.opacity === 0.5 ? '#6AA1FF' : '#0E42D2'};
  }

  &:active {
    background: ${props => props.style?.opacity === 0.5 ? '#94BFFF' : '#0E42D2'};
    border-color: ${props => props.style?.opacity === 0.5 ? '#6AA1FF' : '#0E42D2'};
  }

  i {
    font-size: 16px;
  }
`;

const LoadingDots = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;

  span {
    width: 4px;
    height: 4px;
    background-color: #165DFF;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out;

    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
    &:nth-child(3) { animation-delay: 0s; }
  }

  @keyframes bounce {
    0%, 80%, 100% { 
      transform: scale(0);
      opacity: 0.3;
    }
    40% { 
      transform: scale(1);
      opacity: 1;
    }
  }
`;

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
  userName?: string;
}

const getCurrentTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

// 更新文本格式化组件
const FormattedText: React.FC<{ content: string }> = ({ content }) => {
  const [collapsedStates, setCollapsedStates] = useState<{ [key: string]: boolean }>({});

  const toggleCollapse = (key: string) => {
    setCollapsedStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const processThinkTags = (text: string) => {
    const parts = [];
    let lastIndex = 0;
    const regex = /<think>([\s\S]*?)<\/think>/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // 添加 think 标签之前的文本（如果有的话）
      const beforeText = text.slice(lastIndex, match.index).trim();
      if (beforeText) {
        parts.push(<p key={`text-${match.index}`}>{beforeText}</p>);
      }
      
      const thinkKey = `think-${match.index}`;
      const isCollapsed = collapsedStates[thinkKey] || false;

      // 添加带样式的 think 内容
      parts.push(
        <ThinkBlock key={thinkKey}>
          <ThinkHeader onClick={() => toggleCollapse(thinkKey)}>
            <ThinkTitle>深度思考</ThinkTitle>
            <CollapseIcon 
              className="ri-arrow-up-s-line" 
              isCollapsed={isCollapsed}
            />
          </ThinkHeader>
          <ThinkContent isCollapsed={isCollapsed}>
            {match[1].trim()}
          </ThinkContent>
        </ThinkBlock>
      );
      lastIndex = match.index + match[0].length;
    }
    // 添加剩余的文本（如果有的话）
    const remainingText = text.slice(lastIndex).trim();
    if (remainingText) {
      parts.push(<p key={`text-end`}>{remainingText}</p>);
    }
    return parts;
  };

  // 检查是否包含 think 标签
  if (content.includes('<think')) {
    return <>{processThinkTags(content)}</>;
  }

  // 将文本按段落分割并过滤掉空白段落
  const paragraphs = content.split('\n').filter(p => p.trim()).map(p => p.trim());

  const renderHeading = (text: string, level: number) => {
    switch (level) {
      case 1: return <h1>{text}</h1>;
      case 2: return <h2>{text}</h2>;
      case 3: return <h3>{text}</h3>;
      case 4: return <h4>{text}</h4>;
      case 5: return <h5>{text}</h5>;
      default: return <h6>{text}</h6>;
    }
  };

  return (
    <>
      {paragraphs.map((paragraph, index) => {
        // 检查是否是列表项
        if (paragraph.startsWith('- ') || /^\d+\.\s/.test(paragraph)) {
          const items = paragraph.split('\n').filter(item => item.trim());
          return (
            <ul key={index}>
              {items.map((item, i) => (
                <li key={i}>{item.replace(/^-\s|^\d+\.\s/, '')}</li>
              ))}
            </ul>
          );
        }
        // 检查是否是标题
        else if (paragraph.startsWith('#')) {
          const match = paragraph.match(/^(#+)\s(.+)/);
          if (match) {
            const level = Math.min(match[1].length, 6);
            const text = match[2];
            return renderHeading(text, level);
          }
        }
        // 普通段落
        return <p key={index}>{paragraph}</p>;
      })}
    </>
  );
};

interface ChatAreaProps {
  conversationTitle: string;
  setConversationTitle: React.Dispatch<React.SetStateAction<string>>;
}

const ChatArea: React.FC<ChatAreaProps> = ({ conversationTitle, setConversationTitle }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '你好！我是 AI 助手，有什么我可以帮你的吗？',
      isUser: false,
      timestamp: getCurrentTime()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [activeQuickAction, setActiveQuickAction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const isConfigured = checkConfig();
    if (!isConfigured) {
      console.error('DeepSeek API key is not configured. Please check your .env file.');
    }
  }, []);

  // Remove the auto-resize effect
  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = '40px';
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() && !isLoading) {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: inputValue.trim(),
        isUser: true,
        timestamp: getCurrentTime(),
        userName: '范米花儿'
      };

      if (messages.length === 1) {
        setConversationTitle(inputValue.trim());
      }

      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      setIsLoading(true);

      try {
        console.log('Sending message:', inputValue.trim());
        const aiResponse = await sendMessage(inputValue.trim());
        console.log('Received AI response:', aiResponse);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiResponse || '抱歉，我现在无法回答。',
          isUser: false,
          timestamp: getCurrentTime()
        };
        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        console.error('Detailed error:', error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `错误信息: ${error instanceof Error ? error.message : '未知错误'}`,
          isUser: false,
          timestamp: getCurrentTime()
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action: string) => {
    setActiveQuickAction(activeQuickAction === action ? null : action);
  };

  return (
    <ChatAreaContainer>
      <ContentWrapper>
        <Header>
          <HeaderWrapper>
            <HeaderTitle>{conversationTitle}</HeaderTitle>
          </HeaderWrapper>
        </Header>

        <ChatMessages>
          {messages.map(message => (
            <MessageContainer key={message.id} isUser={message.isUser}>
              {message.isUser ? (
                <>
                  <MessageContent isUser>
                    <MessageHeader>
                      <span>{message.timestamp}</span>
                      <span>{message.userName}</span>
                    </MessageHeader>
                    <UserMessageBubble isUser>
                      <FormattedText content={message.content} />
                      <BubbleActions className="bubble-actions">
                        <ActionButton>
                          <Icon className="ri-edit-line" />
                        </ActionButton>
                        <ActionButton>
                          <Icon className="ri-file-copy-line" />
                        </ActionButton>
                        <ActionButton>
                          <Icon className="ri-share-line" />
                        </ActionButton>
                        <ActionButton>
                          <Icon className="ri-more-line" />
                        </ActionButton>
                      </BubbleActions>
                    </UserMessageBubble>
                  </MessageContent>
                  <MessageAvatar src={avatar} alt="User avatar" style={{ order: 2 }} />
                </>
              ) : (
                <>
                  <MessageAvatar src={logo} alt="AI avatar" width="24px" height="24px" />
                  <MessageContent>
                    <MessageHeader>
                      <span>AI Agent</span>
                      <span style={{ color: '#86909C' }}>{message.timestamp}</span>
                    </MessageHeader>
                    <MessageBubble isUser={false}>
                      <FormattedText content={message.content} />
                      <MessageActions>
                        <ActionGroup>
                          <ActionButton>
                            <Icon className="ri-volume-up-line" />
                          </ActionButton>
                          <ActionButton>
                            <Icon className="ri-file-copy-line" />
                          </ActionButton>
                          <ActionButton>
                            <Icon className="ri-refresh-line" />
                          </ActionButton>
                          <ActionButton>
                            <Icon className="ri-share-line" />
                          </ActionButton>
                          <ActionButton>
                            <Icon className="ri-more-line" />
                          </ActionButton>
                        </ActionGroup>
                        <ActionGroup>
                          <ActionButton>
                            <Icon className="ri-thumb-up-line" />
                          </ActionButton>
                          <ActionButton>
                            <Icon className="ri-thumb-down-line" />
                          </ActionButton>
                        </ActionGroup>
                      </MessageActions>
                    </MessageBubble>
                    {message.id === messages[messages.length - 1].id && !message.isUser && (
                      <SuggestedQuestions>
                        <QuestionButton>
                          <span>🔍 这里是与答案关联的智能推荐</span>
                          <Icon className="ri-arrow-right-s-line" />
                        </QuestionButton>
                        <QuestionButton>
                          <span>🔍 这里是与答案关联的智能推荐</span>
                          <Icon className="ri-arrow-right-s-line" />
                        </QuestionButton>
                        <QuestionButton>
                          <span>🔍 这里是与答案关联的智能推荐</span>
                          <Icon className="ri-arrow-right-s-line" />
                        </QuestionButton>
                      </SuggestedQuestions>
                    )}
                  </MessageContent>
                </>
              )}
            </MessageContainer>
          ))}
          {isLoading && (
            <MessageContainer isUser={false}>
              <MessageAvatar src={logo} alt="AI avatar" width="24px" height="24px" />
              <MessageContent>
                <MessageHeader>
                  <span>AI Agent</span>
                  <span style={{ color: '#86909C' }}>{getCurrentTime()}</span>
                </MessageHeader>
                <MessageBubble isUser={false}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    正在思考中
                    <LoadingDots>
                      <span></span>
                      <span></span>
                      <span></span>
                    </LoadingDots>
                  </div>
                </MessageBubble>
              </MessageContent>
            </MessageContainer>
          )}
          <div ref={messagesEndRef} />
        </ChatMessages>

        <InputArea>
          <div style={{ display: 'flex', gap: '8px', padding: '0 12px', marginBottom: '8px' }}>
            <QuickActionButton
              isActive={activeQuickAction === 'function1'}
              onClick={() => handleQuickAction('function1')}
            >
              <Icon className="ri-code-line" />
              快捷功能
            </QuickActionButton>
            <QuickActionButton
              isActive={activeQuickAction === 'function2'}
              onClick={() => handleQuickAction('function2')}
            >
              <Icon className="ri-code-line" />
              快捷功能
            </QuickActionButton>
          </div>
          <InputContainer isFocused={isFocused}>
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyPress={handleKeyPress}
              placeholder="给AI Agent发消息"
              disabled={isLoading}
              rows={1}
            />
            <ActionBar>
              <ActionButtons>
                <ActionButton>
                  <Icon className="ri-link" />
                </ActionButton>
                <ActionButton>
                  <Icon className="ri-mic-line" />
                </ActionButton>
                <ActionButton>
                  <Icon className="ri-image-line" />
                </ActionButton>
              </ActionButtons>
              <SendButton
                onClick={handleSendMessage}
                style={{ opacity: inputValue.trim() && !isLoading ? 1 : 0.5 }}
                disabled={isLoading}
              >
                <Icon className="ri-send-plane-fill" />
              </SendButton>
            </ActionBar>
          </InputContainer>
        </InputArea>
      </ContentWrapper>
    </ChatAreaContainer>
  );
};

export default ChatArea;