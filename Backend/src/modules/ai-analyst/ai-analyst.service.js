import { ChatSession } from '../../models/ChatSession.model.js';
import { Article } from '../../models/Article.model.js';
import { AppError } from '../../utils/apiError.js';
import { sendMessageSchema } from './ai-analyst.validation.js';

/**
 * Get or create a chat session for a user + article pair
 */
export const getChatSession = async (articleId, userId) => {
  const article = await Article.findById(articleId).lean();
  if (!article) throw new AppError(404, 'Article not found');

  let session = await ChatSession.findOne({ user: userId, article: articleId }).lean();
  if (!session) {
    session = { user: userId, article: articleId, messages: [] };
  }
  return session;
};

/**
 * Send a message and get an AI response.
 * For now, uses a placeholder response since no AI API is configured.
 * Replace the placeholder with a real AI API call (e.g., Gemini, OpenAI) when ready.
 */
export const sendMessage = async (articleId, userId, body) => {
  const { message } = sendMessageSchema.parse(body);

  const article = await Article.findById(articleId).lean();
  if (!article) throw new AppError(404, 'Article not found');

  // Find or create the chat session (upsert)
  let session = await ChatSession.findOne({ user: userId, article: articleId });

  if (!session) {
    session = new ChatSession({ user: userId, article: articleId, messages: [] });
  }

  // Append user message
  session.messages.push({ role: 'user', text: message });

  // --- AI RESPONSE PLACEHOLDER ---
  // TODO: Replace with real AI API call (Gemini / OpenAI)
  // The AI should receive the article content + full conversation history
  const aiResponse = `This is a placeholder AI analysis response for the article "${article.title}". ` +
    `In production, this will be replaced by a real AI model analyzing your question: "${message}"`;

  session.messages.push({ role: 'assistant', text: aiResponse });
  // --- END PLACEHOLDER ---

  await session.save();
  return session;
};
