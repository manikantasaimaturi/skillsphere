
import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;
let activeApiKey = '';

function getConfiguredApiKey(): string {
  return (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '')
    .trim()
    .replace(/^['"]|['"]$/g, '');
}

function getAiClient(): GoogleGenAI | null {
  const apiKey = getConfiguredApiKey();

  if (
    !apiKey ||
    /PASTE_YOUR|MY_GEMINI_API_KEY|YOUR_API_KEY/i.test(apiKey)
  ) {
    return null;
  }

  if (!aiClient || activeApiKey !== apiKey) {
    activeApiKey = apiKey;
    aiClient = new GoogleGenAI({ apiKey });
  }

  return aiClient;
}

// Check Gemini API configuration
export function getAiConfigurationStatus() {
  const key = getConfiguredApiKey();

  const configured =
    Boolean(key) &&
    !/PASTE_YOUR|MY_GEMINI_API_KEY|YOUR_API_KEY/i.test(key);

  return {
    configured,
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    message: configured
      ? 'Gemini API key is present.'
      : 'Add a valid GEMINI_API_KEY to your project .env file.'
  };
}

// Primary Gemini model
function getAiModel(): string {
  return process.env.GEMINI_MODEL || 'gemini-2.5-flash';
}

// Fallback Gemini models
function getFallbackModels(): string[] {
  const configuredModels =
    process.env.GEMINI_FALLBACK_MODELS
      ?.split(',')
      .map(model => model.trim())
      .filter(Boolean) || [];

  return [
    ...new Set([
      getAiModel(),
      ...configuredModels,
      'gemini-2.5-flash-lite'
    ])
  ];
}

// Wait helper
function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Detect temporary Gemini errors
function isTemporaryGeminiError(err: any): boolean {
  const message = String(err?.message || err);

  return /503|UNAVAILABLE|overloaded|high demand|429|RESOURCE_EXHAUSTED|rate.?limit|500|INTERNAL/i.test(
    message
  );
}

// Detect unavailable models
function isModelUnavailableError(err: any): boolean {
  const message = String(err?.message || err);

  return /model.*not found|not supported|404/i.test(message);
}

// Generate text with retry and fallback
async function generateTextWithFallback(
  ai: GoogleGenAI,
  contents: any,
  config?: any
): Promise<string> {
  let lastError: any;

  const models = getFallbackModels();

  for (const model of models) {
    console.log(`Trying Gemini model: ${model}`);

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config
        });

        const result = response.text?.trim();

        if (result) {
          console.log(`Gemini response received from ${model}`);
          return result;
        }

        throw new Error('Gemini returned an empty response.');
      } catch (err: any) {
        lastError = err;

        console.error(
          `Gemini error: ${model}, attempt ${attempt}:`,
          err.message
        );

        // Move to next model if current model is unavailable
        if (isModelUnavailableError(err)) {
          break;
        }

        // Retry temporary errors
        if (isTemporaryGeminiError(err)) {
          if (attempt < 3) {
            const delay = 2000 * Math.pow(2, attempt - 1);

            console.log(`Retrying after ${delay}ms...`);

            await wait(delay);
            continue;
          }

          break;
        }

        // Stop for invalid key and other permanent errors
        throw err;
      }
    }
  }

  throw lastError || new Error(
    'All Gemini models are currently unavailable. Please try again later.'
  );
}

// Format API errors for the user
function formatGeminiError(err: any): string {
  const message = String(
    err?.message || 'The Gemini API request failed.'
  );

  if (
    /API_KEY_INVALID|api key not valid|invalid api key|unauthorized|permission denied/i.test(
      message
    )
  ) {
    return 'Gemini rejected your API key. Generate a valid key at https://aistudio.google.com/apikey and update GEMINI_API_KEY in your project-root .env file. Restart the server afterward.';
  }

  if (/429|quota|RESOURCE_EXHAUSTED/i.test(message)) {
    return 'Gemini API quota or rate limit reached. Check your Google AI Studio quota and try again later.';
  }

  if (
    /503|UNAVAILABLE|overloaded|high demand/i.test(message)
  ) {
    return 'Gemini servers are currently experiencing high demand. All configured models failed. Please wait a few minutes and try again.';
  }

  if (
    /model.*not found|not supported|404/i.test(message)
  ) {
    return 'The configured Gemini model is unavailable. Check GEMINI_MODEL in your .env file and select a model available to your API key.';
  }

  return `Gemini request failed: ${message}`;
}

// Chat message interface
export interface ChatMessageInput {
  role: 'user' | 'model' | 'system';
  content: string;
}

// Student context interface
export interface AiStudentContext {
  studentName?: string;
  college?: string;
  branch?: string;
  targetRole?: string;
  weakSubjects?: string[];
  recentQuizScore?: number;
  solvedProblemsCount?: number;
}

// ========================================
// AI MENTOR
// ========================================

export async function askAiMentor(
  prompt: string,
  history: ChatMessageInput[] = [],
  studentContext?: AiStudentContext
): Promise<string> {
  const ai = getAiClient();

  let contextInstruction = `You are "SkillSphere AI Mentor", an expert computer science professor, competitive programming coach, and senior technology placement advisor.

Your mission is to help CSE students:
- Learn computer science fundamentals.
- Master data structures and algorithms.
- Prepare for technical and HR interviews.
- Build real-world software projects.

Be encouraging, structured, technically accurate, and beginner-friendly.

Provide concrete code examples whenever explaining programming concepts.

Format responses using Markdown with headings, bullet points, and syntax-highlighted code blocks.`;

  if (studentContext) {
    contextInstruction += `

Student Profile:
- Name: ${studentContext.studentName || 'Student'}
- College: ${studentContext.college || 'Engineering College'}
- Branch: ${studentContext.branch || 'Computer Science & Engineering'}
- Target Career Role: ${studentContext.targetRole || 'Full Stack Software Engineer'}
- Identified Weak Areas: ${studentContext.weakSubjects?.join(', ') || 'None identified yet'}
- Recent Quiz Score: ${studentContext.recentQuizScore ?? 'Not available'}
- Solved Coding Problems: ${studentContext.solvedProblemsCount ?? 0}

Tailor your teaching style, difficulty level, and practice recommendations to this student's profile.`;
  }

  if (!ai) {
    return `### SkillSphere AI Mentor (Setup Required)

Hello ${studentContext?.studentName || 'there'}!

To enable live Gemini responses:

1. Generate an API key at https://aistudio.google.com/apikey
2. Add it to GEMINI_API_KEY in your project-root .env file.
3. Restart the server using npm run dev.

Please configure your API key to start using the AI Mentor.`;
  }

  try {
    const formattedHistory = history
      .filter(message => message.role !== 'system')
      .slice(-8)
      .map(message => ({
        role: message.role === 'model' ? 'model' as const : 'user' as const,
        parts: [{ text: message.content }]
      }));

    formattedHistory.push({
      role: 'user' as const,
      parts: [{ text: prompt }]
    });

    const result = await generateTextWithFallback(
      ai,
      formattedHistory,
      {
        systemInstruction: contextInstruction
      }
    );

    return result;
  } catch (err: any) {
    console.error('Gemini API Error in askAiMentor:', err);

    return `### AI Mentor Notice

${formatGeminiError(err)}`;
  }
}

// ========================================
// AI RESUME BUILDER
// ========================================

export async function improveResumeWithAi(
  section: string,
  currentContent: string,
  targetRole: string = 'Software Development Engineer'
): Promise<string> {
  const ai = getAiClient();

  if (!ai) {
    return currentContent;
  }

  try {
    const prompt = `Act as an expert technology resume strategist and hiring manager.

Improve the following resume content for the "${section}" section targeted at the role of "${targetRole}".

Requirements:

1. Use the XYZ formula: Accomplished X as measured by Y, by doing Z.
2. Begin bullet points with strong action verbs.
3. Include relevant ATS keywords for ${targetRole}.
4. Keep the content professional, concise, and realistic.
5. Never invent achievements, percentages, or experience not present in the original content.
6. Return ONLY the improved text or bullet points.

Current content:
${currentContent}`;

    const result = await generateTextWithFallback(
      ai,
      prompt,
      {
        systemInstruction:
          'You are an expert resume consultant specializing in software engineering and technology placement resumes.'
      }
    );

    return result;
  } catch (err: any) {
    console.error('Gemini Resume API Error:', err);
    return currentContent;
  }
}
