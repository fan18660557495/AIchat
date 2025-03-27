import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
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
  cursor: pointer;
  width: 100%;
  text-align: left;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`;

const Icon = styled.i`
  font-size: 16px;
  color: #165DFF;
`;

const SuggestedQuestions: React.FC = () => {
  return (
    <Container>
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
    </Container>
  );
};

export default SuggestedQuestions; 