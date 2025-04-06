import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt, documentData } = await request.json();
    
    // Log the incoming request
    console.log('Received generateContent request with prompt:', prompt?.substring(0, 50) + '...');

    // Check if we have data to work with
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Create a simple response if external AI service isn't available
    const responseMessage = `This is a placeholder response for your prompt: "${prompt.substring(0, 30)}..."
    
In a production environment, this would connect to an AI service to generate content based on your document and prompt.

Current document length: ${documentData?.length || 0} characters.`;

    return NextResponse.json({ message: responseMessage });
  } catch (error) {
    console.error('Error in generateContent API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 