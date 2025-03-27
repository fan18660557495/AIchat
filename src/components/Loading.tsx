import React from 'react';
import styled, { keyframes } from 'styled-components';

const bounce = keyframes`
  0%, 80%, 100% { 
    transform: translateY(0);
  }
  40% { 
    transform: translateY(-10px);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 12px;
  background: #F5F5F5;
  border-radius: 8px;
  width: fit-content;
`;

const Dot = styled.div<{ delay: number }>`
  width: 8px;
  height: 8px;
  background-color: #666;
  border-radius: 50%;
  animation: ${bounce} 1s infinite;
  animation-delay: ${props => props.delay}s;
`;

const Loading: React.FC = () => {
  return (
    <LoadingContainer>
      <Dot delay={0} />
      <Dot delay={0.2} />
      <Dot delay={0.4} />
    </LoadingContainer>
  );
};

export default Loading; 