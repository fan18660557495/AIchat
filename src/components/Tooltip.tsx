import React from 'react';
import styled from 'styled-components';

const TooltipContainer = styled.div`
  position: relative;
  display: inline-flex;
  width: 100%;
`;

const TooltipContent = styled.div<{ show: boolean }>`
  position: absolute;
  left: calc(100% + 4px);
  top: 50%;
  transform: translateY(-50%);
  background: #1D2129;
  color: white;
  padding: 4px 8px;
  border-radius: 2px;
  font-size: 12px;
  white-space: nowrap;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: all 0.2s ease;
  z-index: 1000;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    left: -4px;
    top: 50%;
    transform: translateY(-50%);
    border-style: solid;
    border-width: 4px 4px 4px 0;
    border-color: transparent #1D2129 transparent transparent;
  }
`;

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  show: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, show }) => {
  return (
    <TooltipContainer>
      {children}
      <TooltipContent show={show}>
        {content}
      </TooltipContent>
    </TooltipContainer>
  );
};

export default Tooltip; 