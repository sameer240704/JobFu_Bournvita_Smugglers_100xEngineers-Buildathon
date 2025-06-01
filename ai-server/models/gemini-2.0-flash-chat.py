import streamlit as st
import google.generativeai as genai

# Configure the Gemini API
API_KEY = "AIzaSyCIbY035a87TwQ2exw_9BXEehTX1Wexw00"
genai.configure(api_key=API_KEY)

# Set up the model
generation_config = {
    "temperature": 0.7,
    "top_p": 1,
    "top_k": 1,
    "max_output_tokens": 2048,
}

safety_settings = [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
]

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
    safety_settings=safety_settings
)

# Initialize chat history
if "messages" not in st.session_state:
    st.session_state.messages = [
        {
            "role": "assistant",
            "content": "Hello! I'm your HR Hiring Assistant. I can help with:\n\n"
                       "- Recruitment processes\n"
                       "- Interview preparation\n"
                       "- Job descriptions\n"
                       "- Hiring best practices\n"
                       "- Onboarding procedures\n\n"
                       "How can I help you with your hiring needs today?"
        }
    ]

# Set up the Streamlit app
st.set_page_config(page_title="HR Hiring Assistant", page_icon="🤖")
st.title("HR Hiring Assistant 🤖")
st.caption("Powered by Gemini Flash - Your AI-powered hiring consultant")

# Display chat messages
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Chat input
if prompt := st.chat_input("Ask me about hiring..."):
    # Add user message to chat history
    st.session_state.messages.append({"role": "user", "content": prompt})
    # Display user message in chat message container
    with st.chat_message("user"):
        st.markdown(prompt)
    
    # Display assistant response in chat message container
    with st.chat_message("assistant"):
        message_placeholder = st.empty()
        full_response = ""
        
        # Combine previous messages for context
        chat_history = "\n".join([f"{msg['role']}: {msg['content']}" for msg in st.session_state.messages])
        
        # Generate response
        try:
            response = model.generate_content(
                f"You are an expert HR Hiring Assistant. Provide helpful, professional advice about hiring processes, recruitment, and HR best practices. Be concise but thorough in your answers. Here's the conversation history:\n{chat_history}\n\nCurrent question: {prompt}"
            )
            full_response = response.text
        except Exception as e:
            full_response = f"Sorry, I encountered an error: {str(e)}"
        
        message_placeholder.markdown(full_response)
    
    # Add assistant response to chat history
    st.session_state.messages.append({"role": "assistant", "content": full_response})