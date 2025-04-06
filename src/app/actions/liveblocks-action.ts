'use server';

import { Liveblocks } from '@liveblocks/node';
import { revalidatePath } from 'next/cache';
import * as Y from 'yjs';

// Initialize Liveblocks with secret key
const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY || '',
});

/**
 * Generate content using Liveblocks as the message transport
 * This uses server-side processing and client-side broadcasting
 */
export async function generateContentWithLiveblocks(
  prompt: string, 
  documentData: any,
  roomId: string
) {
  try {
    console.log(`Generating content for room: ${roomId}, prompt: ${prompt.substring(0, 30)}...`);
    
    // Process the content (in a real implementation, this would connect to an AI model)
    const result = processPromptLocally(prompt, documentData);
    
    // Use the server-side Liveblocks API to create a temporary user
    const botUser = `ai-bot-${Date.now()}`;
    const session = liveblocks.prepareSession(botUser, {
      userInfo: { name: "AI Bot", avatar: "🤖", email: "ai-bot@collabnote.com" }
    });
    
    // Grant access to the specific room
    session.allow(roomId, session.FULL_ACCESS);
    
    try {
      // The event will be handled by the room's event listeners
      return { success: true };
    } catch (error) {
      console.error('Error generating content with Liveblocks:', error);
      return "Sorry, I couldn't generate content. Please try again.";
    }
  } catch (error) {
    console.error('Error generating content with Liveblocks:', error);
    return "Sorry, I couldn't generate content. Please try again.";
  }
}

/**
 * Chat with document using Liveblocks
 */
export async function chatToDocumentWithLiveblocks(
  documentData: any, 
  question: string,
  roomId: string
) {
  try {
    console.log(`Answering question for room: ${roomId}, question: ${question.substring(0, 30)}...`);
    
    // Process the question (in a real implementation, this would connect to an AI model)
    const result = answerQuestionLocally(question, documentData);
    
    // Use the server-side Liveblocks API to create a temporary user
    const botUser = `ai-bot-${Date.now()}`;
    const session = liveblocks.prepareSession(botUser, {
      userInfo: { name: "AI Bot", avatar: "🤖", email: "ai-bot@collabnote.com" }
    });
    
    // Grant access to the specific room
    session.allow(roomId, session.FULL_ACCESS);
    
    try {
      // The event will be handled by the room's event listeners
      return { success: true };
    } catch (error) {
      console.error('Error chatting with document using Liveblocks:', error);
      return "Sorry, I couldn't process your question. Please try again.";
    }
  } catch (error) {
    console.error('Error chatting with document using Liveblocks:', error);
    return "Sorry, I couldn't process your question. Please try again.";
  }
}

/**
 * Process a prompt locally without external AI service
 * This is a placeholder for an actual AI integration
 */
function processPromptLocally(prompt: string, documentData: any): string {
  // Get document length
  const docLength = typeof documentData === 'string' 
    ? documentData.length 
    : JSON.stringify(documentData).length;
  
  return `Content generated for prompt: "${prompt}"\n\n` +
    `This content was generated using Liveblocks as the message transport. ` +
    `In a production environment, you would integrate with an AI provider to generate high-quality responses.\n\n` +
    `Your document has approximately ${docLength} characters.\n\n` +
    `Here's a sample response based on your prompt:\n\n` +
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam, ` +
    `nunc nisi aliquam nunc, vitae aliquam nunc nisi eget nunc. Nullam auctor, nisl eget ultricies aliquam, ` +
    `nunc nisi aliquam nunc, vitae aliquam nunc nisi eget nunc.`;
}

/**
 * Answer a question locally without external AI service
 * This is a placeholder for an actual AI integration
 */
function answerQuestionLocally(question: string, documentData: any): string {
  // Get document length
  const docLength = typeof documentData === 'string' 
    ? documentData.length 
    : JSON.stringify(documentData).length;
  
  return `Answer to: "${question}"\n\n` +
    `This answer was generated using Liveblocks as the message transport. ` +
    `In a production environment, you would integrate with an AI provider to generate high-quality responses.\n\n` +
    `Your document has approximately ${docLength} characters.\n\n` +
    `Here's a sample answer to your question:\n\n` +
    `The answer depends on the specific context, but generally speaking, the document discusses various aspects ` +
    `related to your question. It mentions several key points that could help address what you're asking about.`;
} 