import { GoogleGenAI } from "@google/genai";
import { LessonContent, LessonSection, ContentBlock, Difficulty, ReviewQuestion, Example, EducationalLevel, VocabularyItem } from "../types.ts";

export class GeminiService {
  async defineTerm(term: string, context: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        config: { thinkingConfig: { thinkingBudget: 4000 } },
        contents: `Provide a simple, clear, and direct definition for "${term}" for a K-12 student. Avoid convoluted language. Context: "${context.substring(0, 500)}..."`,
      });
      return response.text || `Definition not found.`;
    } catch (error) {
       console.error(`Term lookup failed:`, error);
       throw error;
    }
  }

  async generateVisual(description: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `High-quality K-12 educational diagram: "${description}". Technical, professional, no text labels, clean textbook style.` }],
        },
        config: { imageConfig: { aspectRatio: "16:9" } },
      });
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
      return "";
    } catch (error) {
      console.error("Image generation failed:", error);
      return "";
    }
  }

  async fetchLesson(
    level: string, 
    track: string, 
    subject: string, 
    quarter: number, 
    week: string,
    melc: string,
    melcCode: string,
    focus?: string
  ): Promise<LessonContent> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const focusPrompt = focus ? `\n\nEMPHASIZE THIS TOPIC: ${focus}` : "";
    
    const isSPFL = track.includes('SPFL') || subject.includes('Language');
    const spflInstruction = isSPFL 
      ? `CRITICAL SPFL RULE: This is a Foreign Language lesson. ALL examples, vocabulary, and scenarios MUST be presented in the Target Language (Script/Character) followed by [Pronunciation/Pinyin] and (English Translation). E.g., "你好 [Nǐ hǎo] (Hello)".` 
      : "";

    const prompt = `You are a Senior K-12 Curriculum Specialist. Generate a 1500-word comprehensive review module.
    SUBJECT: ${subject}
    MELC: "${melc}" (${melcCode})
    LEVEL: ${level}
    QUARTER: ${quarter}, ${week}
    ${focusPrompt}

    ${spflInstruction}

    STRICT GUIDELINES:
    1. SIMPLE LANGUAGE: Use straightforward language.
    2. NARRATIVE PROSE: All sections must be detailed paragraphs.
    3. SCENARIO (:::): Use marker "::: Hard". Provide a context-rich, 400-word scenario.
    4. MASTERY (???): Use marker "???". Format: Question | Hint | Detailed Answer + RATIONALE.
    5. DICTIONARY: Strictly format as "Term | Pronunciation/Transliteration | Definition". If not SPFL, define key technical terms.
    6. STUDY TIPS: Exactly 3 unique strategies, separated by [SEP].

    STRUCTURE:
    # [Unit Title]
    [Intro - 150 words]

    ## Foundational Principles
    ## Strategic Discussion
    ## Real-World Nuance

    ::: Hard
    Problem: [The complex real-world dilemma]
    Solution: [The narrative step-by-step resolution]
    Reasoning: [The specific academic principle used]

    ## Mastery Synthesis
    ??? [Challenging Question] | [Conceptual Hint] | [Full Answer + RATIONALE: Pedagogical logic]

    DICTIONARY:
    [Term 1] | [Pronunciation/Type] | [Definition]
    [Term 2] | [Pronunciation/Type] | [Definition]
    [Term 3] | [Pronunciation/Type] | [Definition]
    [Term 4] | [Pronunciation/Type] | [Definition]
    [Term 5] | [Pronunciation/Type] | [Definition]

    KEY_TERMS: [Term 1, Term 2, Term 3, Term 4, Term 5]
    STUDY_TIPS: Tip 1 [SEP] Tip 2 [SEP] Tip 3
    VISUAL_PROMPT: [Diagram description]`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: { thinkingConfig: { thinkingBudget: 32768 } },
      });

      const rawText = (response.text || "").replace(/\$/g, '').replace(/\\/g, '');
      const lines = rawText.split('\n');
      
      const title = (lines.find(l => l.startsWith('# ')) || `# ${subject}`).replace('# ', '').trim();
      const keyTerms = (lines.find(l => l.includes('KEY_TERMS:')) || "").split(':')[1]?.split(',').map(t => t.trim().replace(/[\[\]]/g, '')).filter(Boolean) || [];
      
      const studyTipsLine = lines.find(l => l.includes('STUDY_TIPS:')) || "";
      const studyTips = studyTipsLine.split('STUDY_TIPS:')[1]?.split('[SEP]').map(t => t.trim().replace(/^\d+\.\s*/, '')).filter(Boolean) || [];
      
      const visualPrompt = (lines.find(l => l.includes('VISUAL_PROMPT:')) || "").split(':')[1]?.trim() || "";

      // Parse Dictionary
      const dictionary: VocabularyItem[] = [];
      let inDictionary = false;
      for (const line of lines) {
        if (line.trim().startsWith('DICTIONARY:')) {
          inDictionary = true;
          continue;
        }
        if (inDictionary) {
          if (line.trim() === '' || line.startsWith('KEY_TERMS:') || line.startsWith('STUDY_TIPS:') || line.startsWith('##')) {
            if (line.trim() !== '') inDictionary = false;
            if (line.startsWith('KEY_TERMS:') || line.startsWith('STUDY_TIPS:') || line.startsWith('##')) inDictionary = false;
          } else {
            const parts = line.split('|').map(p => p.trim());
            if (parts.length >= 3) {
              dictionary.push({ term: parts[0], pronunciation: parts[1], definition: parts[2] });
            }
          }
        }
      }

      const sections: LessonSection[] = [];
      let currentSection: LessonSection = { title: "Unit Overview", contentBlocks: [] };

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith('# ')) continue;
        
        // Skip metadata sections during content parsing
        if (line.startsWith('DICTIONARY:') || line.startsWith('KEY_TERMS:') || line.startsWith('STUDY_TIPS:') || line.startsWith('VISUAL_PROMPT:')) {
           // Skip ahead to avoid adding dictionary lines as paragraphs
           if (line.startsWith('DICTIONARY:')) {
             while(i < lines.length && !lines[i+1]?.startsWith('KEY_TERMS:') && !lines[i+1]?.startsWith('STUDY_TIPS:')) {
               i++;
             }
           }
           continue; 
        }

        if (line.match(/^##+\s/)) {
          if (currentSection.contentBlocks.length > 0) sections.push(currentSection);
          currentSection = { title: line.replace(/^##+\s/, '').trim(), contentBlocks: [] };
          if (sections.length === 1 && visualPrompt) currentSection.visualAidDescription = visualPrompt;
          continue;
        }

        if (line.startsWith(':::')) {
          const difficulty = (line.replace(':::', '').trim() || 'Moderate') as Difficulty;
          let problem = "", solution = "", reasoning = "";
          let j = i + 1;
          let target: 'p' | 's' | 'r' = 'p';

          while (j < lines.length && !lines[j].trim().startsWith('##') && !lines[j].trim().startsWith(':::') && !lines[j].trim().startsWith('???') && !lines[j].trim().includes('DICTIONARY:')) {
            const l = lines[j].trim();
            const cleanL = l.replace(/^\*\*|\*\*$/g, '');
            if (cleanL.toLowerCase().startsWith('problem:')) { target = 'p'; problem = cleanL.replace(/problem:/i, '').trim(); }
            else if (cleanL.toLowerCase().startsWith('solution:')) { target = 's'; solution = cleanL.replace(/solution:/i, '').trim(); }
            else if (cleanL.toLowerCase().startsWith('reasoning:')) { target = 'r'; reasoning = cleanL.replace(/reasoning:/i, '').trim(); }
            else if (l) {
              if (target === 'p') problem += (problem ? " " : "") + l;
              else if (target === 's') solution += (solution ? " " : "") + l;
              else if (target === 'r') reasoning += (reasoning ? " " : "") + l;
            }
            j++;
          }
          if (problem.length > 50) {
            currentSection.contentBlocks.push({ type: 'example', content: { difficulty, problem, solution: solution || "Logic summary pending", reasoning: reasoning || "Theoretical basis" } });
          }
          i = j - 1;
          continue;
        }

        if (line.startsWith('???')) {
          const parts = line.replace('???', '').split('|').map(p => p.trim());
          if (parts.length >= 3) {
            currentSection.contentBlocks.push({ type: 'question', content: { question: parts[0], hint: parts[1], answer: parts[2] } });
          }
          continue;
        }

        currentSection.contentBlocks.push({ type: 'paragraph', content: line });
      }
      if (currentSection.contentBlocks.length > 0) sections.push(currentSection);

      return {
        title,
        overview: sections[0]?.contentBlocks.find(b => b.type === 'paragraph' && (b.content as string).length > 20)?.content as string || "Curriculum Unit",
        sections,
        references: [{ title: 'DepEd Official Learning Materials', uri: 'https://lrmds.deped.gov.ph/' }],
        keyTerms,
        dictionary,
        studyTips
      };
    } catch (error) {
      console.error("Gemini Fetch Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();