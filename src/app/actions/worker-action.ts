'use server';
export async function translateDocument(
  documentData: string,
  targetLang: string
) {
  try {
    // Use either the configured backend URL or default to the current origin
    const backendUrl = process.env.NEXT_PUBLIC_WORKER_BACKEND_URL || 
      (typeof window !== 'undefined' ? window.location.origin : '');
    
    if (!backendUrl) {
      console.error('Could not determine API URL');
      return "AI backend is not configured properly. Please check your environment setup.";
    }
    
    const response = await fetch(
      `${backendUrl}/api/translateDocument`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({ documentData, targetLang }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}):`, errorText);
      throw new Error(`Translation failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error translating document:', error);
    return "Sorry, I couldn't translate the document. Please check that the AI backend service is running.";
  }
}

export async function chatToDocument(documentData: any, question: string) {
  try {
    // Use either the configured backend URL or default to the current origin
    const backendUrl = process.env.NEXT_PUBLIC_WORKER_BACKEND_URL || 
      (typeof window !== 'undefined' ? window.location.origin : '');
    
    if (!backendUrl) {
      console.error('Could not determine API URL');
      return "AI backend is not configured properly. Please check your environment setup.";
    }
    
    const response = await fetch(
      `${backendUrl}/api/chatToDocument`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          documentData,
          question,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}):`, errorText);
      throw new Error(`Failed to fetch AI response: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error fetching AI response:', error);
    return "Sorry, I couldn't process your request. Please check that the AI backend service is running.";
  }
}

export async function generateContent(prompt: string, documentData: string) {
  try {
    // Use either the configured backend URL or default to the current origin
    const backendUrl = process.env.NEXT_PUBLIC_WORKER_BACKEND_URL || 
      (typeof window !== 'undefined' ? window.location.origin : '');
    
    // Ensure we have a URL for the API
    if (!backendUrl) {
      console.error('Could not determine API URL');
      return "AI backend is not configured properly. Please check your environment setup.";
    }
    
    console.log('Calling API at:', `${backendUrl}/api/generateContent`);
    
    const response = await fetch(
      `${backendUrl}/api/generateContent`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ prompt, documentData }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}):`, errorText);
      throw new Error(`Failed to generate content: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error generating content:', error);
    return "Sorry, I couldn't generate content. Please check that the AI backend service is running.";
  }
}

export async function summarizeDocument(documentData: string) {
  try {
    // Use either the configured backend URL or default to the current origin
    const backendUrl = process.env.NEXT_PUBLIC_WORKER_BACKEND_URL || 
      (typeof window !== 'undefined' ? window.location.origin : '');
    
    if (!backendUrl) {
      console.error('Could not determine API URL');
      return "AI backend is not configured properly. Please check your environment setup.";
    }
    
    const response = await fetch(
      `${backendUrl}/api/summarizeDocument`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({ documentData }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}):`, errorText);
      throw new Error(`Failed to summarize document: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error summarizing document:', error);
    return "Sorry, I couldn't summarize the document. Please check that the AI backend service is running.";
  }
}
