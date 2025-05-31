import streamlit as st
import json
import PyPDF2
import io
from groq import Groq
import re
from datetime import datetime
import os
import time
import traceback
import logging
from typing import Dict, Any, Optional, Tuple, List
import pytesseract
from pdf2image import convert_from_bytes
from PIL import Image
import base64
import fitz  # PyMuPDF for link extraction
import urllib.parse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("resume_extractor.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Constants
MAX_RETRIES = 5
TIMEOUT_SECONDS = 30
MAX_FILE_SIZE_MB = 50

# Initialize session state
if 'extracted_data' not in st.session_state:
    st.session_state.extracted_data = None
if 'processing' not in st.session_state:
    st.session_state.processing = False

@st.cache_resource
def init_groq_client(api_key: str) -> Optional[Groq]:
    """Initialize and validate Groq client with API key"""
    try:
        client = Groq(api_key=api_key)
        # Test the API key with a simple request
        client.models.list()  # This will raise an exception if API key is invalid
        return client
    except Exception as e:
        logger.error(f"Failed to initialize Groq client: {str(e)}")
        st.error(f"❌ Failed to initialize Groq client: {str(e)}")
        return None

def extract_links_from_pdf(pdf_file) -> Dict[str, List[str]]:
    """
    Extract hyperlinks from PDF using PyMuPDF
    Returns categorized links (linkedin, github, other)
    """
    links = {
        'linkedin': [],
        'github': [],
        'other': []
    }
    
    try:
        # Reset file pointer
        pdf_file.seek(0)
        pdf_bytes = pdf_file.getvalue()
        
        # Open PDF with PyMuPDF
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            
            # Get all links from the page
            link_list = page.get_links()
            
            for link in link_list:
                if 'uri' in link and link['uri']:
                    url = link['uri'].strip()
                    
                    # Normalize URL
                    if not url.startswith(('http://', 'https://')):
                        if url.startswith('www.'):
                            url = 'https://' + url
                        elif not url.startswith('mailto:'):
                            url = 'https://' + url
                    
                    # Categorize URLs
                    url_lower = url.lower()
                    if 'linkedin.com' in url_lower:
                        if url not in links['linkedin']:
                            links['linkedin'].append(url)
                            logger.info(f"Found LinkedIn URL: {url}")
                    elif 'github.com' in url_lower:
                        if url not in links['github']:
                            links['github'].append(url)
                            logger.info(f"Found GitHub URL: {url}")
                    elif not url.startswith('mailto:'):
                        if url not in links['other']:
                            links['other'].append(url)
        
        doc.close()
        logger.info(f"Link extraction completed: LinkedIn: {len(links['linkedin'])}, GitHub: {len(links['github'])}, Other: {len(links['other'])}")
        
    except Exception as e:
        logger.warning(f"Failed to extract links with PyMuPDF: {str(e)}")
    
    return links

def extract_urls_from_text(text: str) -> Dict[str, List[str]]:
    """
    Extract URLs from plain text using regex patterns
    Fallback method when hyperlinks aren't available
    """
    links = {
        'linkedin': [],
        'github': [],
        'other': []
    }
    
    # Enhanced URL patterns
    url_patterns = [
        # Standard URLs
        r'https?://(?:[-\w.])+(?:[:\d]+)?(?:/(?:[\w/_.])*(?:\?(?:[\w&=%.])*)?(?:#(?:[\w.])*)?)?',
        # URLs without protocol
        r'(?:www\.)?(?:linkedin\.com|github\.com)(?:/[\w\-._~:/?#[\]@!$&\'()*+,;=]*)?',
        # LinkedIn specific patterns
        r'linkedin\.com/in/[\w\-]+/?',
        r'linkedin\.com/profile/view\?id=[\w\-]+',
        # GitHub specific patterns
        r'github\.com/[\w\-]+/?',
        # Social media handles (as backup)
        r'@[\w\-]+(?:\s+(?:on\s+)?(?:linkedin|github))?',
    ]
    
    for pattern in url_patterns:
        matches = re.finditer(pattern, text, re.IGNORECASE)
        for match in matches:
            url = match.group(0).strip()
            
            # Clean up the URL
            url = url.rstrip('.,;:!?)')
            
            # Add protocol if missing
            if not url.startswith(('http://', 'https://', '@')):
                if 'linkedin.com' in url.lower() or 'github.com' in url.lower():
                    url = 'https://' + url
            
            # Categorize
            url_lower = url.lower()
            if 'linkedin.com' in url_lower and url not in links['linkedin']:
                links['linkedin'].append(url)
            elif 'github.com' in url_lower and url not in links['github']:
                links['github'].append(url)
            elif url.startswith('@'):
                # Handle social media handles
                handle = url[1:]  # Remove @
                context_window = text[max(0, match.start()-50):match.end()+50].lower()
                if 'linkedin' in context_window:
                    linkedin_url = f"https://linkedin.com/in/{handle}"
                    if linkedin_url not in links['linkedin']:
                        links['linkedin'].append(linkedin_url)
                elif 'github' in context_window:
                    github_url = f"https://github.com/{handle}"
                    if github_url not in links['github']:
                        links['github'].append(github_url)
            elif url.startswith('http') and url not in links['other']:
                links['other'].append(url)
    
    return links

def merge_link_dictionaries(dict1: Dict[str, List[str]], dict2: Dict[str, List[str]]) -> Dict[str, List[str]]:
    """Merge two link dictionaries, avoiding duplicates"""
    merged = {
        'linkedin': list(set(dict1.get('linkedin', []) + dict2.get('linkedin', []))),
        'github': list(set(dict1.get('github', []) + dict2.get('github', []))),
        'other': list(set(dict1.get('other', []) + dict2.get('other', [])))
    }
    return merged

def extract_text_from_pdf(pdf_file) -> Tuple[Optional[str], Optional[dict], Dict[str, List[str]]]:
    """
    Extract text and links from uploaded PDF file with multiple fallback methods
    Returns tuple of (extracted_text, metadata, links)
    """
    metadata = {
        'pages_processed': 0,
        'pages_with_errors': 0,
        'ocr_used': False,
        'extraction_method': 'PyPDF2',
        'links_extracted': 0
    }
    
    # Extract hyperlinks first
    extracted_links = extract_links_from_pdf(pdf_file)
    
    try:
        # Reset file pointer to beginning
        pdf_file.seek(0)
        
        # First try with PyPDF2
        try:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            if len(pdf_reader.pages) == 0:
                logger.warning("PDF file appears to be empty or corrupted")
                return None, metadata, extracted_links
                
            text = ""
            for page_num, page in enumerate(pdf_reader.pages):
                try:
                    page_text = page.extract_text()
                    if page_text.strip():
                        text += f"\n--- Page {page_num + 1} ---\n"
                        text += page_text + "\n"
                        metadata['pages_processed'] += 1
                    else:
                        metadata['pages_with_errors'] += 1
                except Exception as e:
                    logger.warning(f"Could not extract text from page {page_num + 1}: {str(e)}")
                    metadata['pages_with_errors'] += 1
                    continue
            
            if text.strip():
                # Extract URLs from text as fallback/supplement
                text_links = extract_urls_from_text(text)
                extracted_links = merge_link_dictionaries(extracted_links, text_links)
                
                metadata['links_extracted'] = sum(len(urls) for urls in extracted_links.values())
                logger.info(f"Successfully extracted text from {metadata['pages_processed']} pages and {metadata['links_extracted']} links")
                return text.strip(), metadata, extracted_links
                
        except Exception as e:
            logger.warning(f"PyPDF2 extraction failed: {str(e)}")
        
        # Fallback to OCR if PyPDF2 fails
        try:
            logger.info("Attempting OCR fallback...")
            metadata['extraction_method'] = 'OCR'
            metadata['ocr_used'] = True
            
            # Convert PDF to images
            images = convert_from_bytes(pdf_file.getvalue())
            text = ""
            
            for i, image in enumerate(images):
                try:
                    page_text = pytesseract.image_to_string(image)
                    if page_text.strip():
                        text += f"\n--- Page {i + 1} ---\n"
                        text += page_text + "\n"
                        metadata['pages_processed'] += 1
                    else:
                        metadata['pages_with_errors'] += 1
                except Exception as e:
                    logger.warning(f"OCR failed for page {i + 1}: {str(e)}")
                    metadata['pages_with_errors'] += 1
                    continue
            
            if text.strip():
                # Extract URLs from OCR text
                text_links = extract_urls_from_text(text)
                extracted_links = merge_link_dictionaries(extracted_links, text_links)
                
                metadata['links_extracted'] = sum(len(urls) for urls in extracted_links.values())
                logger.info(f"OCR extracted text from {metadata['pages_processed']} pages and {metadata['links_extracted']} links")
                return text.strip(), metadata, extracted_links
            else:
                logger.error("OCR failed to extract any text")
                return None, metadata, extracted_links
                
        except Exception as e:
            logger.error(f"OCR extraction failed: {str(e)}")
            return None, metadata, extracted_links
            
    except Exception as e:
        logger.error(f"Error reading PDF: {str(e)}")
        return None, metadata, extracted_links

def clean_json_response(response_text: str) -> str:
    """Enhanced JSON response cleaning with better error recovery"""
    if not response_text:
        return ""
    
    # Remove markdown code blocks
    response_text = re.sub(r'```json\s*', '', response_text, flags=re.IGNORECASE)
    response_text = re.sub(r'```\s*$', '', response_text, flags=re.MULTILINE)
    response_text = re.sub(r'^```\s*', '', response_text, flags=re.MULTILINE)
    
    # Remove any leading/trailing whitespace
    response_text = response_text.strip()
    
    # Handle cases where JSON is wrapped in other text
    start_idx = response_text.find('{')
    end_idx = response_text.rfind('}')
    
    if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
        response_text = response_text[start_idx:end_idx + 1]
    
    # Fix common JSON issues
    response_text = response_text.replace('\\"', '"')  # Unescape quotes
    response_text = re.sub(r',\s*]', ']', response_text)  # Remove trailing commas in arrays
    response_text = re.sub(r',\s*}', '}', response_text)  # Remove trailing commas in objects
    
    return response_text

def create_extraction_prompt(resume_text: str, extracted_links: Dict[str, List[str]]) -> str:
    """Create a detailed prompt for resume data extraction with link information"""
    
    # Format extracted links for the prompt
    link_info = ""
    if extracted_links['linkedin']:
        link_info += f"\nLinkedIn URLs found: {', '.join(extracted_links['linkedin'])}"
    if extracted_links['github']:
        link_info += f"\nGitHub URLs found: {', '.join(extracted_links['github'])}"
    if extracted_links['other']:
        link_info += f"\nOther URLs found: {', '.join(extracted_links['other'][:5])}..."  # Limit to first 5
    
    return f"""You are an expert resume parser that can handle all resume formats. Extract information from the resume text and return ONLY a valid JSON object.

RESUME TEXT:
{resume_text}

EXTRACTED HYPERLINKS:
{link_info if link_info else "No hyperlinks found"}

INSTRUCTIONS:
1. Return ONLY valid JSON - no explanations, no markdown, no additional text
2. Use the exact schema structure provided below
3. If information is not available, use null or empty arrays/strings
4. Be extremely thorough in extracting all available information
5. Handle all resume formats (chronological, functional, combination, etc.)
6. Extract skills from all sections, not just dedicated skills sections
7. Normalize dates to YYYY-MM or YYYY-MM-DD format when possible
8. Extract key achievements from experience descriptions
9. Handle abbreviations and acronyms appropriately (e.g., "B.S." -> "Bachelor of Science")
10. **IMPORTANT**: Use the extracted hyperlinks above to populate LinkedIn and GitHub fields accurately
11. Prioritize extracted hyperlinks over any URLs found in the text

JSON SCHEMA (return exactly this structure):
{{
    "candidate_name": "string or null",
    "contact_information": {{
        "email": "string or null",
        "phone": "string or null", 
        "location": "string or null",
        "linkedin": "string or null",
        "github": "string or null",
        "portfolio": "string or null",
        "other_links": []
    }},
    "candidate_description": "string or null",
    "education": [
        {{
            "degree": "string",
            "institution": "string", 
            "location": "string or null",
            "duration": "string or null",
            "gpa_cgpa": "string or null",
            "additional_info": "string or null",
            "coursework": []
        }}
    ],
    "experience": [
        {{
            "position": "string",
            "company": "string",
            "location": "string or null", 
            "duration": "string or null",
            "description": "string or null",
            "type": "string or null",
            "key_achievements": [],
            "technologies_used": []
        }}
    ],
    "projects": [
        {{
            "name": "string",
            "description": "string or null",
            "technologies": [],
            "links": {{
                "demo": "string or null",
                "github": "string or null", 
                "other": "string or null"
            }},
            "achievements": "string or null",
            "duration": "string or null"
        }}
    ],
    "skills": {{
        "technical_skills": {{
            "programming_languages": [],
            "frameworks_libraries": [],
            "databases": [],
            "tools_software": [],
            "cloud_platforms": [],
            "devops": [],
            "data_science": [],
            "other_technical": []
        }},
        "soft_skills": [],
        "industry_knowledge": []
    }},
    "achievements": [
        {{
            "title": "string",
            "description": "string or null",
            "date": "string or null", 
            "organization": "string or null",
            "prize_amount": "string or null"
        }}
    ],
    "certifications": [
        {{
            "name": "string",
            "issuing_organization": "string or null",
            "date": "string or null",
            "expiry_date": "string or null",
            "credential_id": "string or null"
        }}
    ],
    "publications": [
        {{
            "title": "string",
            "journal_conference": "string or null", 
            "date": "string or null",
            "authors": [],
            "description": "string or null"
        }}
    ],
    "additional_information": {{
        "volunteering": [],
        "hobbies": [],
        "awards": [],
        "other": []
    }},
    "extraction_metadata": {{
        "extraction_date": "string",
        "model_used": "string",
        "extraction_method": "string",
        "pages_processed": "number",
        "ocr_used": "boolean",
        "links_extracted": "number"
    }}
}}

Return ONLY the JSON object, nothing else. Ensure all fields are included even if empty."""

def extract_resume_data_with_retry(client, resume_text: str, extracted_links: Dict[str, List[str]], max_retries: int = MAX_RETRIES) -> Optional[Dict[Any, Any]]:
    """Enhanced data extraction with retry mechanism and link integration"""
    if not resume_text or not isinstance(resume_text, str):
        logger.error("Invalid resume text provided for extraction")
        return None
    
    for attempt in range(max_retries):
        try:
            logger.info(f"Attempt {attempt + 1}/{max_retries}: Processing with Llama 3 8B...")
            
            prompt = create_extraction_prompt(resume_text, extracted_links)
            
            # Adjust parameters for better JSON generation
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a precise resume parser that returns only valid JSON objects. Never include explanations or markdown. Ensure all fields from the schema are present. Pay special attention to LinkedIn and GitHub URLs provided in the extracted hyperlinks section."
                    },
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ],
                model="llama3-8b-8192",
                temperature=0.1,
                max_tokens=8192,
                top_p=0.9,
                stream=False,
                response_format={"type": "json_object"}
            )
            
            response_text = chat_completion.choices[0].message.content
            
            if not response_text or response_text.strip() == "":
                logger.warning(f"Attempt {attempt + 1}: Received empty response")
                time.sleep(2 ** attempt)  # Exponential backoff
                continue
            
            # Clean and extract JSON
            cleaned_response = clean_json_response(response_text)
            
            if not cleaned_response:
                logger.warning(f"Attempt {attempt + 1}: Could not find JSON in response")
                continue
            
            # Try to parse JSON with validation
            try:
                extracted_data = json.loads(cleaned_response)
                
                # Validate that we have a proper structure
                if not isinstance(extracted_data, dict):
                    raise ValueError("Response is not a JSON object")
                
                # Check for required fields
                if 'candidate_name' not in extracted_data or 'experience' not in extracted_data:
                    raise ValueError("Missing required fields in response")
                
                # Post-process to ensure links are properly populated
                extracted_data = post_process_links(extracted_data, extracted_links)
                
                logger.info(f"Successfully extracted data on attempt {attempt + 1}")
                return extracted_data
                
            except json.JSONDecodeError as e:
                logger.warning(f"Attempt {attempt + 1}: JSON parsing failed - {str(e)}")
                if attempt == max_retries - 1:  # Last attempt
                    logger.error("Raw response that failed to parse:")
                    logger.error(cleaned_response[:1000] + "..." if len(cleaned_response) > 1000 else cleaned_response)
                time.sleep(2 ** attempt)  # Exponential backoff
                continue
                
        except Exception as e:
            logger.error(f"Attempt {attempt + 1}: API call failed - {str(e)}")
            if attempt == max_retries - 1:
                logger.error("Full error details:")
                logger.error(traceback.format_exc())
            time.sleep(2 ** attempt)  # Exponential backoff
            continue
    
    return None

def post_process_links(extracted_data: Dict[Any, Any], extracted_links: Dict[str, List[str]]) -> Dict[Any, Any]:
    """Post-process extracted data to ensure links are properly populated"""
    try:
        contact_info = extracted_data.get('contact_information', {})
        
        # Ensure LinkedIn is populated
        if not contact_info.get('linkedin') and extracted_links.get('linkedin'):
            contact_info['linkedin'] = extracted_links['linkedin'][0]
            logger.info(f"Post-processed LinkedIn URL: {contact_info['linkedin']}")
        
        # Ensure GitHub is populated
        if not contact_info.get('github') and extracted_links.get('github'):
            contact_info['github'] = extracted_links['github'][0]
            logger.info(f"Post-processed GitHub URL: {contact_info['github']}")
        
        # Add other links to other_links array if not already present
        if extracted_links.get('other'):
            existing_other_links = contact_info.get('other_links', [])
            for link in extracted_links['other']:
                if link not in existing_other_links:
                    existing_other_links.append(link)
            contact_info['other_links'] = existing_other_links
        
        extracted_data['contact_information'] = contact_info
        
    except Exception as e:
        logger.warning(f"Error in post-processing links: {str(e)}")
    
    return extracted_data

def validate_extracted_data(data: Dict[Any, Any]) -> bool:
    """Validate extracted data structure"""
    if not data or not isinstance(data, dict):
        logger.error("No data provided for validation")
        return False
    
    required_keys = [
        'candidate_name', 'contact_information', 'education',
        'experience', 'skills'
    ]
    
    validation_errors = []
    
    for key in required_keys:
        if key not in data:
            validation_errors.append(f"Missing required field: {key}")
    
    if validation_errors:
        logger.warning(f"Validation errors found: {', '.join(validation_errors)}")
        return False
    
    return True

def get_download_link(data: Dict[Any, Any], filename: str) -> str:
    """Generate a download link for JSON data"""
    json_str = json.dumps(data, indent=2, ensure_ascii=False)
    b64 = base64.b64encode(json_str.encode()).decode()
    return f'<a href="data:application/json;base64,{b64}" download="{filename}">Download JSON</a>'

def main():
    st.set_page_config(
        page_title="Enhanced Resume Data Extractor",
        page_icon="📄",
        layout="centered"
    )
    
    st.title("📄 Enhanced Resume Data Extractor")
    st.markdown("Upload a resume PDF to extract structured data as JSON with robust LinkedIn & GitHub URL extraction")
    
    # API Key input
    api_key = st.text_input(
        "Groq API Key:",
        type="password",
        help="Get your API key from https://console.groq.com/",
        value=os.environ.get("GROQ_API_KEY", "")
    )
    
    if not api_key:
        st.error("Please enter your Groq API key to continue")
        st.stop()
    
    # Initialize Groq client
    client = init_groq_client(api_key)
    if not client:
        st.stop()
    
    # File upload
    uploaded_file = st.file_uploader(
        "Choose a resume PDF file",
        type=["pdf"],
        help="Upload a resume in PDF format (supports hyperlink extraction)",
        accept_multiple_files=False
    )
    
    if uploaded_file is not None:
        # Check file size
        file_size = len(uploaded_file.getvalue()) / 1024 / 1024  # MB
        if file_size > MAX_FILE_SIZE_MB:
            st.error(f"File too large. Maximum size is {MAX_FILE_SIZE_MB}MB")
            st.stop()
        
        # Extract text and links
        with st.spinner("Extracting text and hyperlinks from resume..."):
            resume_text, metadata, extracted_links = extract_text_from_pdf(uploaded_file)
        
        if not resume_text:
            st.error("Could not extract text from PDF. Please try another file.")
            st.stop()
        
        # Display extracted links info
        if any(extracted_links.values()):
            st.success(f"📊 Extraction Summary: {metadata['pages_processed']} pages processed, {metadata['links_extracted']} links found")
            
            with st.expander("🔗 View Extracted Links"):
                if extracted_links['linkedin']:
                    st.write("**LinkedIn URLs:**")
                    for url in extracted_links['linkedin']:
                        st.write(f"- {url}")
                
                if extracted_links['github']:
                    st.write("**GitHub URLs:**")
                    for url in extracted_links['github']:
                        st.write(f"- {url}")
                
                if extracted_links['other']:
                    st.write("**Other URLs:**")
                    for url in extracted_links['other'][:5]:  # Show first 5
                        st.write(f"- {url}")
                    if len(extracted_links['other']) > 5:
                        st.write(f"... and {len(extracted_links['other']) - 5} more")
        else:
            st.info(f"📊 Extraction Summary: {metadata['pages_processed']} pages processed, no clickable links found")
        
        # Process with AI
        if st.button("🚀 Extract Data", type="primary"):
            st.session_state.processing = True
            st.session_state.extracted_data = None
            
            with st.spinner("Processing with AI..."):
                extracted_data = extract_resume_data_with_retry(client, resume_text, extracted_links)
            
            st.session_state.processing = False
            
            if extracted_data and validate_extracted_data(extracted_data):
                st.session_state.extracted_data = extracted_data
                
                # Add extraction metadata
                st.session_state.extracted_data["extraction_metadata"] = {
                    "extraction_date": datetime.now().isoformat(),
                    "model_used": "llama3-8b-8192",
                    **metadata
                }
                
                st.success("✅ Data extraction completed successfully!")
                
                # Show key extracted info
                contact_info = st.session_state.extracted_data.get('contact_information', {})
                if contact_info.get('linkedin') or contact_info.get('github'):
                    st.info("🔗 Successfully extracted social profiles:")
                    if contact_info.get('linkedin'):
                        st.write(f"**LinkedIn:** {contact_info['linkedin']}")
                    if contact_info.get('github'):
                        st.write(f"**GitHub:** {contact_info['github']}")
                
                # Generate download link
                candidate_name = st.session_state.extracted_data.get('candidate_name', 'resume')
                safe_filename = re.sub(r'[^\w\-_]', '_', candidate_name) if candidate_name else 'resume'
                filename = f"{safe_filename}_data.json"
                
                st.markdown(get_download_link(st.session_state.extracted_data, filename), unsafe_allow_html=True)
                
                # Show raw JSON in expander
                with st.expander("📋 View JSON Data"):
                    st.json(st.session_state.extracted_data)
            else:
                st.error("❌ Failed to extract valid data. Please try again.")

if __name__ == "__main__":
    main()