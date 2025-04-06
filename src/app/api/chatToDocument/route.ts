import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { documentData, question } = await request.json();
    
    // Log the incoming request
    console.log('Received chatToDocument request with question:', question?.substring(0, 50) + '...');

    // Check if we have data to work with
    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    // Create a simple response if external AI service isn't available
    const responseMessage = `This is a placeholder response for your question: "${question.substring(0, 30)}..."
    
In a production environment, this would connect to an AI service to answer questions about your document.

Current document length: ${documentData?.length || 0} characters.`;

    return NextResponse.json({ message: responseMessage });
  } catch (error) {
    console.error('Error in chatToDocument API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 