import google.generativeai as genai
import os
import json
from django.conf import settings

# Configure Gemini
# In a real app, this would be in an environment variable
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "your-api-key-here")
genai.configure(api_key=GEMINI_API_KEY)

def analyze_email_thread(email_body, subject):
    """
    Uses Gemini 1.5 Flash to extract logistics context, 
    generate a summary, and identify key shipment/payment data.
    """
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    prompt = f"""
    You are an AI logistics assistant for the platform XYZ. 
    Analyze the following email and extract the requested information in JSON format.
    
    Subject: {subject}
    Body: {email_body}
    
    Return the following JSON structure:
    {{
        "context": "BOOKING" | "PAYMENT" | "DELAY" | "UNCERTAIN",
        "priority": "HIGH" | "MEDIUM" | "LOW",
        "summary": "A concise 1-sentence summary of what happened and what is pending.",
        "shipment_data": {{
            "container_number": "...",
            "bl_number": "...",
            "eta": "YYYY-MM-DD"
        }},
        "payment_data": {{
            "invoice_number": "...",
            "amount": float,
            "is_paid": bool,
            "due_date": "YYYY-MM-DD"
        }}
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        # Parse JSON from response
        # Removing potential markdown blocks
        clean_text = response.text.replace('```json', '').replace('```', '').strip()
        data = json.loads(clean_text)
        return data
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        return None

def generate_live_summary(messages_list):
    """
    Generates a live summary for the entire case thread.
    """
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    full_thread = "\n---\n".join([f"From: {m.sender}\nBody: {m.body}" for m in messages_list])
    
    prompt = f"""
    Based on the following email thread, provide a brief, professional 'Live Summary' 
    for a logistics dashboard. Focus on 'What happened' and 'What is pending'.
    
    {full_thread}
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error generating summary: {e}")
        return "Analysis pending..."
