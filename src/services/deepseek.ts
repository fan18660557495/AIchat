import { checkConfig } from "./config";

const formatMarkdown = (content: string): string => {
  // 添加段落间距
  let formatted = content.replace(/\n\n/g, "\n\n\n");

  // 确保列表项之间有适当的间距
  formatted = formatted.replace(/(\n-|\n\d+\.)/g, "\n\n$1");

  // 确保标题前后有适当的间距
  formatted = formatted.replace(/(\n#{1,6}\s)/g, "\n\n$1");

  // 确保代码块前后有适当的间距
  formatted = formatted.replace(/(\n```)/g, "\n\n$1");

  // 移除多余的空行
  formatted = formatted.replace(/\n{4,}/g, "\n\n\n");

  return formatted;
};

export const testConnection = async () => {
  // Mock successful connection test
  return true;
};

export const sendMessage = async (message: string) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock response based on message content
    let mockResponse = '';
    
    if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('你好')) {
      mockResponse = '你好！很高兴见到你。我是AI助手，有什么我可以帮你的吗？';
    } else if (message.toLowerCase().includes('help') || message.toLowerCase().includes('帮助')) {
      mockResponse = '我可以帮你：\n\n1. 回答问题\n2. 提供建议\n3. 协助编程\n4. 分析数据\n\n请告诉我你需要什么帮助？';
    } else if (message.toLowerCase().includes('code') || message.toLowerCase().includes('代码')) {
      mockResponse = '我可以帮你编写和调试代码。请告诉我你想要实现什么功能，我会为你提供相应的代码示例。';
    } else {
      mockResponse = `我收到了你的消息："${message}"\n\n这是一个模拟的回复。在实际应用中，这里会是对你的问题的具体回答。`;
    }

    const formattedContent = formatMarkdown(mockResponse);
    return formattedContent;
  } catch (error) {
    console.error("Error in mock response:", error);
    throw error;
  }
};

export const sendMessageRemoteDeepSeek = async (message: string) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock response based on message content
    let mockResponse = '';
    
    if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('你好')) {
      mockResponse = '你好！很高兴见到你。我是AI助手，有什么我可以帮你的吗？';
    } else if (message.toLowerCase().includes('help') || message.toLowerCase().includes('帮助')) {
      mockResponse = '我可以帮你：\n\n1. 回答问题\n2. 提供建议\n3. 协助编程\n4. 分析数据\n\n请告诉我你需要什么帮助？';
    } else if (message.toLowerCase().includes('code') || message.toLowerCase().includes('代码')) {
      mockResponse = '我可以帮你编写和调试代码。请告诉我你想要实现什么功能，我会为你提供相应的代码示例。';
    } else {
      mockResponse = `我收到了你的消息："${message}"\n\n这是一个模拟的回复。在实际应用中，这里会是对你的问题的具体回答。`;
    }

    const formattedContent = formatMarkdown(mockResponse);
    return formattedContent;
  } catch (error) {
    console.error("Error in mock response:", error);
    throw error;
  }
};
