import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import logo from '../assets/logo.png';
import avatar from '../assets/avatar.png';
import Tooltip from './Tooltip';

const Icon = styled.i`
  font-size: 16px;
  line-height: 1;
`;

const SidebarContainer = styled.div<{ isCollapsed: boolean }>`
  width: ${props => props.isCollapsed ? '56px' : '240px'};
  background: #F1F6FB;
  padding: 12px ${props => props.isCollapsed ? '8px' : '16px'};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 94px;
  transition: all 0.3s ease;
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Logo = styled.div<{ isCollapsed: boolean }>`
  display: flex;
  flex-direction: ${props => props.isCollapsed ? 'column' : 'row'};
  align-items: ${props => props.isCollapsed ? 'center' : 'flex-start'};
  gap: ${props => props.isCollapsed ? '12px' : '0'};
  width: 100%;
`;

const LogoWrapper = styled.div<{ isCollapsed: boolean }>`
  display: flex;
  width: 100%;
  justify-content: ${props => props.isCollapsed ? 'center' : 'space-between'};
  align-items: center;
  gap: 8px;
`;

const LogoImage = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;

const LogoText = styled.span<{ isCollapsed: boolean }>`
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  font-size: 20px;
  color: #1D2129;
  display: ${props => props.isCollapsed ? 'none' : 'block'};
`;

const CollapseButton = styled.button<{ isCollapsed: boolean }>`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background: transparent;
  color: #4E5969;
  cursor: pointer;
  padding: 0;
  border-radius: 4px;
  transform: rotate(${props => props.isCollapsed ? '180deg' : '0deg'});
  transition: all 0.3s ease;

  &:hover {
    background: #FFFFFF;
    color: #1D2129;
    box-shadow: 0px 1px 3px rgba(29, 33, 41, 0.1);
  }

  i {
    font-size: 16px;
  }
`;

const NewChatButton = styled.button<{ isCollapsed: boolean }>`
  width: 100%;
  padding: 9px ${props => props.isCollapsed ? '0' : '16px'};
  background: #165DFF;
  border: 1px solid #0E42D2;
  border-radius: 4px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: ${props => props.isCollapsed ? 'center' : 'center'};
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  box-shadow: inset 0px 2px 1px rgba(255, 255, 255, 0.2), inset 0px -2px 1px rgba(3, 32, 112, 0.2);
  
  &:hover {
    background: #0E42D2;
  }

  span {
    display: ${props => props.isCollapsed ? 'none' : 'block'};
  }
`;

const NavItemWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
`;

const NavItem = styled.div<{ active?: boolean; isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  padding: 9px ${props => props.isCollapsed ? '0' : '12px'};
  justify-content: ${props => props.isCollapsed ? 'center' : 'flex-start'};
  gap: 8px;
  border-radius: 4px;
  cursor: pointer;
  color: ${props => props.active ? '#1D2129' : '#4E5969'};
  background: ${props => props.active ? '#FFFFFF' : 'transparent'};
  box-shadow: ${props => props.active ? '0px 1px 3px rgba(29, 33, 41, 0.1)' : 'none'};
  width: 100%;

  &:hover {
    background: #FFFFFF;
    color: #1D2129;
  }

  span {
    display: ${props => props.isCollapsed ? 'none' : 'block'};
  }
`;

const Divider = styled.div<{ isCollapsed: boolean }>`
  height: 1px;
  background: #E5E6EB;
  margin: 16px ${props => props.isCollapsed ? '4px' : '0'};
`;

const RecentChats = styled.div<{ isCollapsed: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RecentChatsHeader = styled.div<{ isCollapsed: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  
  ${props => props.isCollapsed && `
    justify-content: center;
    
    span {
      display: none;
    }
  `}
`;

const ViewMore = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  color: #86909C;
  font-size: 12px;
  cursor: pointer;
  position: relative;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`;

const ChatItem = styled.div<{ active?: boolean; isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px ${props => props.isCollapsed ? '0' : '12px'};
  justify-content: ${props => props.isCollapsed ? 'center' : 'flex-start'};
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  background: #FFFFFF;
  box-shadow: ${props => props.active ? '0px 1px 3px rgba(29, 33, 41, 0.1)' : 'none'};
  width: 100%;
  overflow: hidden;

  &:hover {
    background: #FFFFFF;
  }

  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 48px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%);
    pointer-events: none;
    display: ${props => props.isCollapsed ? 'none' : 'block'};
    border-radius: 0 4px 4px 0;
  }

  .more-icon {
    position: absolute;
    right: 12px;
    color: #4E5969;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.2s ease;
    display: ${props => props.isCollapsed ? 'none' : 'block'};
    width: 24px;
    height: 24px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: rgba(0, 0, 0, 0.04);
    }
  }

  &:hover .more-icon {
    opacity: 1;
  }
`;

const ChatDot = styled.div`
  width: 6px;
  height: 6px;
  background: #BEDAFF;
  border-radius: 50%;
  flex-shrink: 0;
`;

const ChatText = styled.span<{ isCollapsed: boolean }>`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  display: ${props => props.isCollapsed ? 'none' : 'block'};
`;

const UserProfile = styled.div<{ isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px ${props => props.isCollapsed ? '0' : '12px'};
  justify-content: ${props => props.isCollapsed ? 'center' : 'flex-start'};
  gap: 8px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  span {
    display: ${props => props.isCollapsed ? 'none' : 'block'};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Avatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
`;

const Dropdown = styled.div<{ show: boolean }>`
  position: fixed;
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 4px;
  min-width: 160px;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transform-origin: top right;
  transform: ${props => props.show ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(-10px)'};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1100;
`;

const DropdownItem = styled.div<{ danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  color: ${props => props.danger ? '#F53F3F' : '#1D2129'};
  cursor: pointer;
  font-size: 14px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.danger ? 'rgba(245, 63, 63, 0.06)' : '#F2F3F5'};
    color: ${props => props.danger ? '#F53F3F' : '#1D2129'};
  }

  i {
    font-size: 16px;
    color: ${props => props.danger ? '#F53F3F' : '#4E5969'};
  }
`;

interface SidebarProps {
  conversationTitle: string;
}

const Sidebar: React.FC<SidebarProps> = ({ conversationTitle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [dropdownTrigger, setDropdownTrigger] = useState<'more' | 'chat' | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1200) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown && 
          !(event.target as Element).closest('.more-menu') && 
          !(event.target as Element).closest('.more-icon')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showDropdown]);

  const handleMoreClick = (e: React.MouseEvent, trigger: 'more' | 'chat') => {
    e.stopPropagation();
    if (trigger === 'chat') {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.right - 160,
      });
      setDropdownTrigger(trigger);
      setShowDropdown(!showDropdown);
    }
  };

  const navItems = [
    { icon: "ri-search-line", text: "AI搜索" },
    { icon: "ri-code-line", text: "AI编程" },
    { icon: "ri-bar-chart-line", text: "AI图表" },
    { icon: "ri-book-2-line", text: "知识库" },
    { icon: "ri-apps-line", text: "智能体" }
  ];

  return (
    <SidebarContainer isCollapsed={isCollapsed}>
      <TopSection>
        <Logo isCollapsed={isCollapsed}>
          <LogoWrapper isCollapsed={isCollapsed}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LogoImage src={logo} alt="Logo" />
              <LogoText isCollapsed={isCollapsed}>AI Agent</LogoText>
            </div>
            {!isCollapsed && (
              <CollapseButton 
                isCollapsed={isCollapsed}
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <Icon className="ri-expand-left-line" />
              </CollapseButton>
            )}
          </LogoWrapper>
          {isCollapsed && (
            <CollapseButton 
              isCollapsed={isCollapsed}
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <Icon className="ri-expand-left-line" />
            </CollapseButton>
          )}
        </Logo>

        <Tooltip content="创建新对话" show={isCollapsed && hoveredItem === 'newChat'}>
          <NewChatButton 
            isCollapsed={isCollapsed}
            onMouseEnter={() => setHoveredItem('newChat')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Icon className="ri-add-line" />
            <span>创建新对话</span>
          </NewChatButton>
        </Tooltip>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map((item) => (
            <NavItemWrapper key={item.text}>
              <Tooltip content={item.text} show={isCollapsed && hoveredItem === item.text}>
                <NavItem 
                  isCollapsed={isCollapsed}
                  onMouseEnter={() => setHoveredItem(item.text)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Icon className={item.icon} />
                  <span>{item.text}</span>
                </NavItem>
              </Tooltip>
            </NavItemWrapper>
          ))}
        </div>

        <Divider isCollapsed={isCollapsed} />

        <RecentChats isCollapsed={isCollapsed}>
          <RecentChatsHeader isCollapsed={isCollapsed}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon className="ri-chat-ai-line" />
              {!isCollapsed && <span>最近对话</span>}
            </div>
            {!isCollapsed && (
              <ViewMore 
                className="more-menu" 
                onClick={(e) => handleMoreClick(e, 'more')}
              >
                <span>更多</span>
                <Icon 
                  className="ri-arrow-right-s-line" 
                  style={{ 
                    transition: 'transform 0.2s ease', 
                    transform: showDropdown && dropdownTrigger === 'more' ? 'rotate(90deg)' : 'rotate(0)' 
                  }} 
                />
              </ViewMore>
            )}
          </RecentChatsHeader>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <Tooltip content={conversationTitle} show={isCollapsed && hoveredItem === 'recentChat'}>
              <ChatItem 
                active 
                isCollapsed={isCollapsed}
                onMouseEnter={() => setHoveredItem('recentChat')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <ChatDot />
                <ChatText isCollapsed={isCollapsed}>{conversationTitle}</ChatText>
                {!isCollapsed && (
                  <Icon 
                    className="ri-more-line more-icon" 
                    onClick={(e) => handleMoreClick(e, 'chat')}
                  />
                )}
              </ChatItem>
            </Tooltip>
          </div>
        </RecentChats>
      </TopSection>

      <Tooltip content="范米花儿" show={isCollapsed && hoveredItem === 'userProfile'}>
        <UserProfile 
          isCollapsed={isCollapsed}
          onMouseEnter={() => setHoveredItem('userProfile')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <Avatar src={avatar} alt="User avatar" />
          <span>范米花儿</span>
        </UserProfile>
      </Tooltip>

      {showDropdown && (
        <Dropdown 
          show={showDropdown} 
          style={{ 
            position: 'fixed',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownItem>
            <Icon className="ri-share-line" />
            分享
          </DropdownItem>
          <DropdownItem>
            <Icon className="ri-edit-line" />
            重命名
          </DropdownItem>
          <DropdownItem>
            <Icon className="ri-star-line" />
            收藏
          </DropdownItem>
          <DropdownItem danger>
            <Icon className="ri-delete-bin-line" />
            删除
          </DropdownItem>
        </Dropdown>
      )}
    </SidebarContainer>
  );
};

export default Sidebar;