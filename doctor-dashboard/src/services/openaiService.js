// OpenAI API Service
class OpenAIService {
  static async generateMedicalSuggestion(vitalSigns, chiefComplaint, additionalNotes = '') {
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      if (!apiKey) {
        throw new Error('OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your environment variables.');
      }

      const prompt = this.buildMedicalPrompt(vitalSigns, chiefComplaint, additionalNotes);
      
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ 
            role: 'user', 
            content: prompt 
          }],
          temperature: 0.3, // Lower temperature for more consistent medical advice this is ai generatesd not real data
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return {
        success: true,
        suggestion: data.choices[0]?.message?.content || 'No suggestion available',
        usage: data.usage
      };
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return {
        success: false,
        error: error.message,
        suggestion: 'Unable to generate medical suggestion at this time.'
      };
    }
  }

  static buildMedicalPrompt(vitalSigns, chiefComplaint, additionalNotes) {
    const { heart_rate, blood_pressure, temperature, oxygen_saturation, respiratory_rate, pain_level } = vitalSigns;
    
    return `As a medical AI assistant, analyze these symptoms and vital signs to identify the most likely medical conditions.

PATIENT PRESENTATION:
Chief Complaint: ${chiefComplaint}

VITAL SIGNS:
- Heart Rate: ${heart_rate} bpm
- Blood Pressure: ${blood_pressure} mmHg  
- Temperature: ${temperature}°C
- Oxygen Saturation: ${oxygen_saturation}%
- Respiratory Rate: ${respiratory_rate} breaths/min
- Pain Level: ${pain_level}/10

Additional Notes: ${additionalNotes || 'None provided'}

Based on the symptoms and vital signs, provide ONLY the top 3 most likely medical conditions. For each condition, provide:
1. The specific medical condition name
2. Brief reason why it matches the symptoms (1-2 sentences)
3. Urgency level (High/Medium/Low)

Format your response as:
1. [Condition Name] - [Brief explanation] - [Urgency]
2. [Condition Name] - [Brief explanation] - [Urgency]  
3. [Condition Name] - [Brief explanation] - [Urgency]

Focus on specific, diagnosable conditions rather than general symptoms. Be concise and medical.`;
  }

  static async generateTriageNotes(patientData) {
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      if (!apiKey) {
        throw new Error('OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your environment variables.');
      }

      const prompt = `Generate professional triage notes for this patient:

Patient: ${patientData.first_name} ${patientData.last_name}
Chief Complaint: ${patientData.chief_complaint}
Arrival Time: ${patientData.arrival_time}
Priority: ${patientData.priority}

Vital Signs:
- Heart Rate: ${patientData.heart_rate} bpm
- Blood Pressure: ${patientData.blood_pressure} mmHg
- Temperature: ${patientData.temperature}°C
- Oxygen Saturation: ${patientData.oxygen_saturation}%
- Respiratory Rate: ${patientData.respiratory_rate} breaths/min
- Pain Level: ${patientData.pain_level}/10

Additional Notes: ${patientData.notes || 'None'}

Generate concise, professional triage notes suitable for medical records.`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ 
            role: 'user', 
            content: prompt 
          }],
          temperature: 0.2,
          max_tokens: 300
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return {
        success: true,
        notes: data.choices[0]?.message?.content || 'Unable to generate notes',
        usage: data.usage
      };
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return {
        success: false,
        error: error.message,
        notes: 'Unable to generate triage notes at this time.'
      };
    }
  }
}

export default OpenAIService;
