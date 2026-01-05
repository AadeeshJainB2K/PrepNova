import { GoogleGenerativeAI } from "@google/generative-ai";
import { OllamaProvider } from "@/lib/ai/ollama";
import { db } from "@/lib/db";
import { messages, conversations, messageAttachments } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { auth } from "@/auth";
import { searchProducts } from "@/lib/marketplace/actions";

export const maxDuration = 30;
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  console.log("=== Chat API Called ===");
  
  try {
    const body = await req.json();
    const { messages: newMessages, conversationId, model, provider, attachments } = body;
    const session = await auth();

    if (!conversationId || !session?.user?.id) {
      return new Response("Invalid request", { status: 400 });
    }

    const lastMessage = newMessages[newMessages.length - 1];
    const userPrompt = lastMessage.content;

    console.log("User prompt:", userPrompt, "Model:", model, "Provider:", provider, "Attachments:", attachments?.length || 0);

    // Search for products mentioned in the message
    const productMatches = await searchProducts(userPrompt);
    
    console.log("Product search results:", productMatches.length, "products found");
    if (productMatches.length > 0) {
      console.log("First product:", {
        id: productMatches[0].id,
        name: productMatches[0].name,
        price: productMatches[0].price
      });
    }
    
    // Build product context for AI
    let productContext = "";
    if (productMatches.length > 0) {
      productContext = "\n\nAVAILABLE PRODUCTS IN OUR MARKETPLACE:\n";
      productMatches.forEach((product: any) => {
        productContext += `- ${product.name}: ₹${parseFloat(product.price).toLocaleString()} (${product.stock > 0 ? 'In Stock' : 'Out of Stock'})\n`;
        productContext += `  Description: ${product.description}\n`;
        productContext += `  Product ID: ${product.id}\n`;
        productContext += `  Link: /dashboard/marketplace/${product.id}\n\n`;
      });
      console.log("Product context being sent to AI:", productContext.substring(0, 500));
    }

    // Separate attachments by type
    const imageAttachments = attachments?.filter((a: any) => a.fileType === 'image') || [];
    const documentAttachments = attachments?.filter((a: any) => a.fileType === 'document') || [];
    
    console.log("Image attachments:", imageAttachments.length);
    console.log("Document attachments:", documentAttachments.length);

    // Database operations with error handling
    let conversationHistory: any[] = [];
    
    try {
      // Check if conversation exists
      const existingConv = await db.query.conversations.findFirst({
        where: eq(conversations.id, conversationId),
      });

      if (!existingConv) {
        await db.insert(conversations).values({
          id: conversationId,
          userId: session.user.id,
          title: userPrompt.substring(0, 50),
        });
        console.log("New conversation created");
      }

      // Load conversation history with attachments
      const historyMessages = await db.query.messages.findMany({
        where: eq(messages.conversationId, conversationId),
        orderBy: [asc(messages.createdAt)],
        with: {
          attachments: true,
        },
      });

      conversationHistory = historyMessages;
      console.log("Loaded history:", conversationHistory.length, "messages");

      // Save user message
      const userMessageId = crypto.randomUUID();
      await db.insert(messages).values({
        id: userMessageId,
        conversationId,
        role: "user",
        content: userPrompt,
      });

      // Save attachments if any
      if (attachments && attachments.length > 0) {
        console.log("Saving", attachments.length, "attachments to database");
        
        for (const attachment of attachments) {
          await db.insert(messageAttachments).values({
            id: crypto.randomUUID(),
            messageId: userMessageId,
            fileName: attachment.fileName,
            fileType: attachment.fileType,
            mimeType: attachment.mimeType,
            fileSize: attachment.fileSize,
            fileUrl: attachment.fileUrl, // Base64 data URL
          });
        }
        
        console.log("Attachments saved successfully");
      }
    } catch (dbError) {
      console.error("Database error:", dbError);
    }

    const encoder = new TextEncoder();
    let fullResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Route to appropriate AI provider
          if (provider === 'ollama' && model) {
            console.log("Using Ollama provider with model:", model);
            
            // Ollama only supports images, not documents
            if (documentAttachments.length > 0) {
              const errorMsg = "Ollama models don't support PDF/document analysis. Please use a Gemini model for documents.";
              controller.enqueue(encoder.encode(errorMsg));
              controller.close();
              return;
            }
            
            // Use Ollama for local models
            const ollama = new OllamaProvider();
            
            // Build history for Ollama
            const history = conversationHistory.slice(-20).map(m => ({
              role: m.role,
              content: m.content,
            }));

            // Add marketplace context to the prompt if products found
            const enhancedPrompt = productContext 
              ? `${productContext}\n\nIMPORTANT: When mentioning products, you MUST use the EXACT Product ID shown above. Do NOT make up or shorten product IDs. Use the complete UUID exactly as provided in the \"Product ID:\" field.\n\nCRITICAL: Use ONLY relative paths - NEVER include domain names like hackboiler.com or any other domain. Links must start with /dashboard/marketplace/ only.\n\nUser Question: ${userPrompt}\n\nPlease answer the user's question. If relevant products are available in our marketplace (listed above), mention them with their exact Product IDs in markdown links like: [Product Name](/dashboard/marketplace/EXACT_PRODUCT_ID)`
              : userPrompt;

            // Stream from Ollama (with images if available)
            for await (const chunk of ollama.generateStream(enhancedPrompt, history, model, imageAttachments)) {
              fullResponse += chunk;
              controller.enqueue(encoder.encode(chunk));
            }
          } else {
            console.log("Using Gemini provider with model:", model || "gemini-2.5-flash");
            
            // Use Gemini for Google models
            const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
            
            // Build marketplace-aware system prompt
            const marketplaceSystemPrompt = `You are a helpful AI assistant for our platform with an integrated marketplace.

Your responsibilities:
1. Answer user questions helpfully and accurately
2. When users ask about products, inform them about availability in our marketplace
3. If products are available, mention them with pricing and provide direct links
4. Be conversational and friendly

IMPORTANT: Never mention \"HackBoiler\" or any specific platform brand name in your responses. Always refer to the platform generically as \"our platform\" or \"our marketplace\".

${productContext}

CRITICAL INSTRUCTIONS FOR PRODUCT LINKS:
- You MUST use the EXACT Product ID provided above for each product
- Do NOT make up or simplify product IDs
- Do NOT use shortened IDs like \"101\" or \"p_2024002\"
- Use the FULL UUID exactly as shown in \"Product ID:\" field
- Link format: [Product Name](/dashboard/marketplace/EXACT_PRODUCT_ID_HERE)
- Example: If Product ID is \"f30377e2-3799-4c47-ac74-20e884ad482b\", use that EXACT string
- NEVER include domain names (like hackboiler.com or any other domain) in links
- ALWAYS use ONLY relative paths starting with /dashboard/marketplace/
- DO NOT generate full URLs - only relative paths

When mentioning products:
- Include the product name, price, and stock status
- Copy the EXACT Product ID from the list above
- Create clickable markdown links using the exact format shown
- Be natural and enthusiastic when recommending products
- Use ONLY relative paths, never full URLs with domains

Remember: ALWAYS use the complete Product ID exactly as provided - never abbreviate or modify it! NEVER include domain names in your links!`;

            const geminiModel = genAI.getGenerativeModel({ 
              model: model || "gemini-2.5-flash",
              systemInstruction: marketplaceSystemPrompt,
            });

            // Build chat history in Gemini's format
            const history = conversationHistory.slice(-20).map(m => ({
              role: m.role === 'user' ? 'user' : 'model',
              parts: [{ text: m.content }],
            }));

            // If we have attachments (images or documents), use generateContentStream
            if (imageAttachments.length > 0 || documentAttachments.length > 0) {
              console.log("Using Gemini with attachments:", imageAttachments.length, "images,", documentAttachments.length, "documents");
              
              const parts: any[] = [{ text: userPrompt }];
              
              // Add image parts
              if (imageAttachments.length > 0) {
                const imageParts = imageAttachments.map((img: any) => ({
                  inlineData: {
                    data: img.fileUrl.split(',')[1], // Remove data:image/jpeg;base64, prefix
                    mimeType: img.mimeType
                  }
                }));
                parts.push(...imageParts);
              }
              
              // Add document parts (PDFs, text files)
              if (documentAttachments.length > 0) {
                const docParts = documentAttachments.map((doc: any) => ({
                  inlineData: {
                    data: doc.fileUrl.split(',')[1], // Remove data:application/pdf;base64, prefix
                    mimeType: doc.mimeType
                  }
                }));
                parts.push(...docParts);
              }

              const result = await geminiModel.generateContentStream({ contents: [{ role: 'user', parts }] });

              // Stream from Gemini
              for await (const chunk of result.stream) {
                const text = chunk.text();
                fullResponse += text;
                controller.enqueue(encoder.encode(text));
              }
            } else {
              // No attachments, use regular chat
              const chat = geminiModel.startChat({ history });
              const result = await chat.sendMessageStream(userPrompt);

              // Stream from Gemini
              for await (const chunk of result.stream) {
                const text = chunk.text();
                fullResponse += text;
                controller.enqueue(encoder.encode(text));
              }
            }
          }

          console.log("Stream complete. Response length:", fullResponse.length);

          // Save to database after streaming is complete
          try {
            await db.insert(messages).values({
              conversationId,
              role: "assistant",
              content: fullResponse,
            });
            console.log("Response saved to database");

            // Generate AI title for new conversations
            const conv = await db.query.conversations.findFirst({
              where: eq(conversations.id, conversationId),
            });

            if (conv && !conv.summary) {
              // Generate title in background after 5 seconds to avoid rate limits
              setTimeout(async () => {
                try {
                  console.log("Starting background title generation for:", conversationId);
                  
                  const systemPrompt = `You are a helpful AI assistant for our platform with an integrated marketplace.

Your responsibilities:
1. Answer user questions helpfully and accurately
2. When users ask about products (like "what is an iPad", "tell me about servers", etc.), inform them about availability in our marketplace
3. If products are available, mention them naturally with pricing and provide direct links
4. Be conversational and friendly
5. Help users navigate the platform

${productContext}

When mentioning products:
- Include the product name, price, and stock status
- Provide a direct link in markdown format: [Product Name](/dashboard/marketplace/PRODUCT_ID)
- Be natural - only mention products when relevant to the conversation
- If user asks about a product and we have it, enthusiastically let them know!

Remember: You have access to our marketplace inventory. Use it to help users discover what they need!`;

              const titleMessages = [
                {
                  role: "user",
                  content: `Generate a very short, concise title (max 5 words) for the conversation. Respond with ONLY the title, no other text.
Title: ${userPrompt.substring(0, 100)}
`,
                },
              ];
                  let title = "";

                  if (provider === 'ollama') {
                    // Use Ollama llama3.2:3b for title generation
                    console.log("Using Ollama llama3.2:3b for title generation");
                    const ollama = new OllamaProvider();
                    
                    let titleResponse = "";
                    for await (const chunk of ollama.generateStream(titleMessages[0].content, [], 'llama3.2:3b')) {
                      titleResponse += chunk;
                    }
                    title = titleResponse.trim().replace(/['"]/g, '');
                  } else {
                    // Use Gemini lite model for title generation
                    console.log("Using Gemini lite for title generation");
                    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
                    const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
                    
                    const titleResult = await geminiModel.generateContent(titleMessages[0].content);
                    title = titleResult.response.text().trim().replace(/['\"]/g, '');
                  }
                  
                  await db.update(conversations)
                    .set({ summary: title })
                    .where(eq(conversations.id, conversationId));
                  
                  console.log("Generated title in background:", title);
                } catch (titleError) {
                  console.error("Background title generation failed:", titleError);
                  // Fallback: use first 40 chars of user prompt
                  const fallbackTitle = userPrompt.substring(0, 40).trim() + (userPrompt.length > 40 ? '...' : '');
                  try {
                    await db.update(conversations)
                      .set({ summary: fallbackTitle })
                      .where(eq(conversations.id, conversationId));
                    console.log("Used fallback title:", fallbackTitle);
                  } catch (fallbackError) {
                    console.error("Fallback title update failed:", fallbackError);
                  }
                }
              }, 5000); // 5 second delay
            }
          } catch (dbError) {
            console.error("Save error:", dbError);
          }

          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      error instanceof Error ? error.message : "Unknown error",
      { status: 500 }
    );
  }
}
