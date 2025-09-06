// import { Injectable } from '@nestjs/common';
// import axios from 'axios';

// @Injectable()
// export class AiService {
// //   private HF_API = 'https://api-inference.huggingface.co/models/gpt2'; // Switch to your model
// private HF_API = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';

//   private HF_TOKEN = process.env.HUGGING_FACE_API_KEY;

//   async askQuestion(question: string): Promise<string> {
//     try {
//       const response = await axios.post(
//         this.HF_API,
//         { inputs: question },
//         { headers: { Authorization: `Bearer ${this.HF_TOKEN}` } }
//       );

//       console.log("here is the response: ", response)

//       const answer = response.data[0]?.generated_text || "I couldn't generate a response.";
//       return answer;
//     } catch (error) {
//       console.error('AI Service Error:', error.response?.data || error.message);
//       return "Sorry, I couldn't process your question.";
//     }
//   }
// }

// src/modules/ai/ai.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AiService {
  // Local Python AI server endpoint
  private LOCAL_AI_API = 'http://localhost:5000/ask'; // make sure ai_server.py runs on this URL

  async askQuestion(question: string): Promise<string> {
    try {
      const response = await axios.post(
        this.LOCAL_AI_API,
        { question },
        { timeout: 15000 }, // 15 seconds timeout
      );

      // The Python server should return { answer: "..." }
      const answer = response.data?.answer || "Sorry, I couldn't generate a response.";
      return answer;
    } catch (error: any) {
      console.error('AI Service Error:', error.response?.data || error.message);
      return "Sorry, I couldn't process your question.";
    }
  }
}

