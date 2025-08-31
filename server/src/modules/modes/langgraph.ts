import { StateGraph, END } from '@langchain/langgraph';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import {
  HumanMessage,
  BaseMessage,
  AIMessage,
  SystemMessage,
} from '@langchain/core/messages';

// 1. Define the state for our graph with scenario context
interface AgentState {
  messages: BaseMessage[];
  scenarioContext?: {
    name: string;
    prompt: string;
    description?: string;
    level?: string;
  };
  feedback?: {
    rating: number;
    grammar: string;
    fluency: string;
    pronunciation: string;
    vocabulary: string;
    notes: string;
    suggestions?: string[];
    confidence?: number;
  };
  error?: string;
}

// 2. Configuration constants
const AI_CONFIG = {
  modelName: 'gemini-1.5-flash',
  temperature: 0.7,
  maxOutputTokens: 1000,
  topP: 0.9,
  topK: 40,
} as const;

const FEEDBACK_CONFIG = {
  modelName: 'gemini-1.5-flash',
  temperature: 0.3, // Lower temperature for more consistent feedback
  maxOutputTokens: 800,
} as const;

// 3. Utility functions
function validateApiKey(): string {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_API_KEY environment variable is required');
  }
  return apiKey;
}

function createModel(config: typeof AI_CONFIG | typeof FEEDBACK_CONFIG) {
  return new ChatGoogleGenerativeAI({
    modelName: config.modelName,
    apiKey: validateApiKey(),
    temperature: config.temperature,
    maxOutputTokens: config.maxOutputTokens,
    topP: 'topP' in config ? config.topP : undefined,
    topK: 'topK' in config ? config.topK : undefined,
  });
}

// 4. Define the nodes with scenario-aware processing
async function callModel(state: AgentState): Promise<Partial<AgentState>> {
  try {
    const { messages, scenarioContext } = state;

    if (!messages || messages.length === 0) {
      throw new Error('No messages provided to AI model');
    }

    const model = createModel(AI_CONFIG);

    // Create scenario-specific system message
    let systemMessage: SystemMessage;

    if (scenarioContext) {
      systemMessage = new SystemMessage(
        `You are ${
          scenarioContext.name
        }, a character in an English learning scenario. 
        
Your Role: ${scenarioContext.prompt}
Level: ${scenarioContext.level || 'Intermediate'}

Instructions:
- Stay in character as ${scenarioContext.name}
- Respond naturally and conversationally
- Keep responses concise but engaging (1-3 sentences)
- Help the user practice English in a supportive way
- If the user makes grammar mistakes, respond naturally but model correct usage
- Ask follow-up questions to keep the conversation flowing
- Be encouraging and patient with language learners
- For the first message, give a brief, friendly greeting (1-2 sentences maximum)
- Do not repeat instructions or explain your role in the first message`,
      );
    } else {
      systemMessage = new SystemMessage(
        'You are a helpful English conversation partner. Respond naturally and conversationally, keeping responses concise but engaging. Help the user practice English in a supportive way.',
      );
    }

    // Add system message for better context if not present
    const messagesWithContext =
      messages.length > 0 && messages[0] instanceof SystemMessage
        ? messages
        : [systemMessage, ...messages];

    const response = await model.invoke(messagesWithContext);

    if (!response || !response.content) {
      throw new Error('AI model returned empty response');
    }

    return { messages: [...messages, response] };
  } catch (error) {
    console.error('Error in callModel:', error);
    return {
      error:
        error instanceof Error ? error.message : 'Unknown error in AI model',
      messages: state.messages,
    };
  }
}

async function generateFeedback(
  state: AgentState,
): Promise<Partial<AgentState>> {
  try {
    const { messages, error, scenarioContext } = state;

    // If there was an error in the previous step, don't generate feedback
    if (error) {
      return {
        feedback: {
          rating: 3,
          grammar: 'Unable to analyze due to system error',
          fluency: 'Unable to analyze due to system error',
          pronunciation: 'Unable to analyze due to system error',
          vocabulary: 'Unable to analyze due to system error',
          notes: 'Please try again later',
          confidence: 0,
        },
      };
    }

    // Get the last user message for feedback analysis
    const userMessages = messages.filter((msg) => msg instanceof HumanMessage);
    const lastUserMessage = userMessages[userMessages.length - 1];

    if (!lastUserMessage || !lastUserMessage.content) {
      return {
        feedback: {
          rating: 3,
          grammar: 'No message to analyze',
          fluency: 'No message to analyze',
          pronunciation: 'No message to analyze',
          vocabulary: 'No message to analyze',
          notes: 'Please send a message to receive feedback',
          confidence: 0,
        },
      };
    }

    const feedbackModel = createModel(FEEDBACK_CONFIG);

    // Create scenario-aware feedback prompt
    const scenarioContextText = scenarioContext
      ? `Context: This conversation is part of the "${
          scenarioContext.name
        }" scenario (${scenarioContext.level || 'Intermediate'} level). `
      : '';

    const feedbackPrompt = `Analyze the following English message and provide comprehensive, constructive feedback for language learning. 

${scenarioContextText}Message: "${lastUserMessage.content}"

Please provide detailed analysis in JSON format with the following structure:
{
  "rating": number (1-5, where 1=poor, 3=average, 5=excellent),
  "grammar": "detailed feedback on grammar usage, specific corrections if needed",
  "fluency": "assessment of sentence flow, naturalness, and coherence",
  "pronunciation": "pronunciation guidance based on text patterns and word choice",
  "vocabulary": "vocabulary usage assessment, suggestions for improvement",
  "notes": "encouraging general feedback and specific next steps for improvement",
  "suggestions": ["specific improvement suggestion 1", "specific improvement suggestion 2"],
  "confidence": number (0-1, indicating confidence in the analysis)
}

Focus on being constructive and encouraging while providing specific, actionable feedback. Consider the scenario context when appropriate.`;

    const feedbackResponse = await feedbackModel.invoke([
      new HumanMessage(feedbackPrompt),
    ]);

    const feedbackText = feedbackResponse.content as string;

    if (!feedbackText) {
      throw new Error('Feedback model returned empty response');
    }

    // Parse the JSON response with error handling
    let feedbackData: any;
    try {
      feedbackData = JSON.parse(feedbackText);
    } catch (parseError) {
      console.error('Error parsing feedback JSON:', parseError);
      throw new Error('Invalid feedback response format');
    }

    // Validate and sanitize feedback data
    const rating = Math.max(1, Math.min(5, Number(feedbackData.rating) || 3));
    const confidence = Math.max(
      0,
      Math.min(1, Number(feedbackData.confidence) || 0.7),
    );

    return {
      feedback: {
        rating,
        grammar: feedbackData.grammar || 'Grammar analysis not available',
        fluency: feedbackData.fluency || 'Fluency analysis not available',
        pronunciation:
          feedbackData.pronunciation || 'Pronunciation guidance not available',
        vocabulary:
          feedbackData.vocabulary || 'Vocabulary assessment not available',
        notes: feedbackData.notes || 'Keep practicing!',
        suggestions: Array.isArray(feedbackData.suggestions)
          ? feedbackData.suggestions
          : [],
        confidence,
      },
    };
  } catch (error) {
    console.error('Error generating feedback:', error);

    // Fallback to basic feedback if AI analysis fails
    return {
      feedback: {
        rating: 3,
        grammar: 'Unable to analyze grammar at this time. Keep practicing!',
        fluency:
          'Continue practicing natural expression and conversation flow.',
        pronunciation: 'Focus on clear pronunciation and word stress.',
        vocabulary:
          'Continue building your vocabulary through regular practice.',
        notes:
          "Keep practicing! Every conversation helps you improve. Try to speak naturally and don't worry about making mistakes.",
        suggestions: [
          'Practice speaking regularly with native speakers or AI partners',
          'Listen to English podcasts or videos to improve natural flow',
          'Keep a vocabulary journal for new words you learn',
        ],
        confidence: 0.3,
      },
    };
  }
}

// 5. Define the graph with improved channel configuration
const workflow = new StateGraph<AgentState>({
  channels: {
    messages: {
      reducer: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
      default: () => [],
    },
    feedback: {
      reducer: (x: any, y: any) => y,
      default: () => undefined,
    },
    scenarioContext: {
      reducer: (x: any, y: any) => y || x,
      default: () => undefined,
    },
    error: {
      reducer: (x: string | undefined, y: string | undefined) => y || x,
      default: () => undefined,
    },
  },
});

// 6. Add nodes and edges
workflow.addNode('agent', callModel);
workflow.addNode('feedbackGenerator', generateFeedback);

workflow.setEntryPoint('agent' as any);
workflow.addEdge('agent' as any, 'feedbackGenerator' as any);
workflow.addEdge('feedbackGenerator' as any, END);

// 7. Compile the graph
const app = workflow.compile();

// 8. Helper function to create scenario-aware app instance
export function createScenarioApp(scenarioContext: {
  name: string;
  prompt: string;
  description?: string;
  level?: string;
}) {
  return (messages: BaseMessage[]) =>
    app.invoke({
      messages,
      scenarioContext,
    });
}

export { app, type AgentState };
