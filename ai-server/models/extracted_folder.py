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
import fitz  # PyMuPDF for link extraction
import urllib.parse
from pathlib import Path
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("batch_resume_extractor.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Constants
MAX_RETRIES = 5
TIMEOUT_SECONDS = 30
MAX_FILE_SIZE_MB = 50

class BatchResumeProcessor:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.client = self.init_groq_client()
        self.data_folder = Path("data")
        self.output_folder = Path("data2")
        self.processed_count = 0
        self.failed_count = 0
        self.skipped_count = 0
        
        # Create output directory if it doesn't exist
        self.output_folder.mkdir(exist_ok=True)
        
        if not self.data_folder.exists():
            logger.error(f"Data folder '{self.data_folder}' does not exist!")
            raise FileNotFoundError(f"Data folder '{self.data_folder}' does not exist!")

    def init_groq_client(self) -> Optional[Groq]:
        """Initialize and validate Groq client with API key"""
        try:
            client = Groq(api_key=self.api_key)
            # Test the API key with a simple request
            client.models.list()
            logger.info("✅ Groq client initialized successfully")
            return client
        except Exception as e:
            logger.error(f"❌ Failed to initialize Groq client: {str(e)}")
            return None

    def extract_links_from_pdf(self, pdf_path: Path) -> Dict[str, List[str]]:
        """Extract hyperlinks from PDF using PyMuPDF"""
        links = {
            'linkedin': [],
            'github': [],
            'other': []
        }
        
        try:
            doc = fitz.open(pdf_path)
            
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
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
                        elif 'github.com' in url_lower:
                            if url not in links['github']:
                                links['github'].append(url)
                        elif not url.startswith('mailto:'):
                            if url not in links['other']:
                                links['other'].append(url)
            
            doc.close()
            
        except Exception as e:
            logger.warning(f"Failed to extract links from {pdf_path.name}: {str(e)}")
        
        return links

    def extract_urls_from_text(self, text: str) -> Dict[str, List[str]]:
        """Extract URLs from plain text using regex patterns"""
        links = {
            'linkedin': [],
            'github': [],
            'other': []
        }
        
        url_patterns = [
            r'https?://(?:[-\w.])+(?:[:\d]+)?(?:/(?:[\w/_.])*(?:\?(?:[\w&=%.])*)?(?:#(?:[\w.])*)?)?',
            r'(?:www\.)?(?:linkedin\.com|github\.com)(?:/[\w\-._~:/?#[\]@!$&\'()*+,;=]*)?',
            r'linkedin\.com/in/[\w\-]+/?',
            r'linkedin\.com/profile/view\?id=[\w\-]+',
            r'github\.com/[\w\-]+/?',
            r'@[\w\-]+(?:\s+(?:on\s+)?(?:linkedin|github))?',
        ]
        
        for pattern in url_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                url = match.group(0).strip()
                url = url.rstrip('.,;:!?)')
                
                if not url.startswith(('http://', 'https://', '@')):
                    if 'linkedin.com' in url.lower() or 'github.com' in url.lower():
                        url = 'https://' + url
                
                url_lower = url.lower()
                if 'linkedin.com' in url_lower and url not in links['linkedin']:
                    links['linkedin'].append(url)
                elif 'github.com' in url_lower and url not in links['github']:
                    links['github'].append(url)
                elif url.startswith('@'):
                    handle = url[1:]
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

    def merge_link_dictionaries(self, dict1: Dict[str, List[str]], dict2: Dict[str, List[str]]) -> Dict[str, List[str]]:
        """Merge two link dictionaries, avoiding duplicates"""
        merged = {
            'linkedin': list(set(dict1.get('linkedin', []) + dict2.get('linkedin', []))),
            'github': list(set(dict1.get('github', []) + dict2.get('github', []))),
            'other': list(set(dict1.get('other', []) + dict2.get('other', [])))
        }
        return merged

    def extract_text_from_pdf(self, pdf_path: Path) -> Tuple[Optional[str], Optional[dict], Dict[str, List[str]]]:
        """Extract text and links from PDF file"""
        metadata = {
            'pages_processed': 0,
            'pages_with_errors': 0,
            'ocr_used': False,
            'extraction_method': 'PyPDF2',
            'links_extracted': 0,
            'file_size_mb': round(pdf_path.stat().st_size / 1024 / 1024, 2)
        }
        
        # Check file size
        if metadata['file_size_mb'] > MAX_FILE_SIZE_MB:
            logger.warning(f"File {pdf_path.name} is too large ({metadata['file_size_mb']}MB)")
            return None, metadata, {}
        
        # Extract hyperlinks first
        extracted_links = self.extract_links_from_pdf(pdf_path)
        
        try:
            # First try with PyPDF2
            try:
                with open(pdf_path, 'rb') as file:
                    pdf_reader = PyPDF2.PdfReader(file)
                    
                    if len(pdf_reader.pages) == 0:
                        logger.warning(f"PDF file {pdf_path.name} appears to be empty")
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
                            logger.warning(f"Could not extract text from page {page_num + 1} of {pdf_path.name}: {str(e)}")
                            metadata['pages_with_errors'] += 1
                            continue
                    
                    if text.strip():
                        text_links = self.extract_urls_from_text(text)
                        extracted_links = self.merge_link_dictionaries(extracted_links, text_links)
                        metadata['links_extracted'] = sum(len(urls) for urls in extracted_links.values())
                        return text.strip(), metadata, extracted_links
                        
            except Exception as e:
                logger.warning(f"PyPDF2 extraction failed for {pdf_path.name}: {str(e)}")
            
            # Fallback to OCR
            try:
                logger.info(f"Attempting OCR fallback for {pdf_path.name}...")
                metadata['extraction_method'] = 'OCR'
                metadata['ocr_used'] = True
                
                with open(pdf_path, 'rb') as file:
                    images = convert_from_bytes(file.read())
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
                            logger.warning(f"OCR failed for page {i + 1} of {pdf_path.name}: {str(e)}")
                            metadata['pages_with_errors'] += 1
                            continue
                    
                    if text.strip():
                        text_links = self.extract_urls_from_text(text)
                        extracted_links = self.merge_link_dictionaries(extracted_links, text_links)
                        metadata['links_extracted'] = sum(len(urls) for urls in extracted_links.values())
                        return text.strip(), metadata, extracted_links
                    else:
                        logger.error(f"OCR failed to extract any text from {pdf_path.name}")
                        return None, metadata, extracted_links
                        
            except Exception as e:
                logger.error(f"OCR extraction failed for {pdf_path.name}: {str(e)}")
                return None, metadata, extracted_links
                
        except Exception as e:
            logger.error(f"Error reading PDF {pdf_path.name}: {str(e)}")
            return None, metadata, extracted_links

    def clean_json_response(self, response_text: str) -> str:
        """Enhanced JSON response cleaning"""
        if not response_text:
            return ""
        
        response_text = re.sub(r'```json\s*', '', response_text, flags=re.IGNORECASE)
        response_text = re.sub(r'```\s*$', '', response_text, flags=re.MULTILINE)
        response_text = re.sub(r'^```\s*', '', response_text, flags=re.MULTILINE)
        response_text = response_text.strip()
        
        start_idx = response_text.find('{')
        end_idx = response_text.rfind('}')
        
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            response_text = response_text[start_idx:end_idx + 1]
        
        response_text = response_text.replace('\\"', '"')
        response_text = re.sub(r',\s*]', ']', response_text)
        response_text = re.sub(r',\s*}', '}', response_text)
        
        return response_text

    def create_extraction_prompt(self, resume_text: str, extracted_links: Dict[str, List[str]]) -> str:
        """Create extraction prompt with link information"""
        link_info = ""
        if extracted_links['linkedin']:
            link_info += f"\nLinkedIn URLs found: {', '.join(extracted_links['linkedin'])}"
        if extracted_links['github']:
            link_info += f"\nGitHub URLs found: {', '.join(extracted_links['github'])}"
        if extracted_links['other']:
            link_info += f"\nOther URLs found: {', '.join(extracted_links['other'][:5])}..."
        
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

    def extract_resume_data_with_retry(self, resume_text: str, extracted_links: Dict[str, List[str]], filename: str, max_retries: int = MAX_RETRIES) -> Optional[Dict[Any, Any]]:
        """Enhanced data extraction with retry mechanism"""
        if not resume_text or not isinstance(resume_text, str):
            logger.error(f"Invalid resume text provided for {filename}")
            return None
        
        for attempt in range(max_retries):
            try:
                logger.info(f"Processing {filename} - Attempt {attempt + 1}/{max_retries}")
                
                prompt = self.create_extraction_prompt(resume_text, extracted_links)
                
                chat_completion = self.client.chat.completions.create(
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
                    logger.warning(f"Empty response for {filename} - Attempt {attempt + 1}")
                    time.sleep(2 ** attempt)
                    continue
                
                cleaned_response = self.clean_json_response(response_text)
                
                if not cleaned_response:
                    logger.warning(f"Could not find JSON in response for {filename} - Attempt {attempt + 1}")
                    continue
                
                try:
                    extracted_data = json.loads(cleaned_response)
                    
                    if not isinstance(extracted_data, dict):
                        raise ValueError("Response is not a JSON object")
                    
                    if 'candidate_name' not in extracted_data or 'experience' not in extracted_data:
                        raise ValueError("Missing required fields in response")
                    
                    extracted_data = self.post_process_links(extracted_data, extracted_links)
                    logger.info(f"Successfully extracted data for {filename} on attempt {attempt + 1}")
                    return extracted_data
                    
                except json.JSONDecodeError as e:
                    logger.warning(f"JSON parsing failed for {filename} - Attempt {attempt + 1}: {str(e)}")
                    if attempt == max_retries - 1:
                        logger.error(f"Final attempt failed for {filename}. Raw response:")
                        logger.error(cleaned_response[:1000] + "..." if len(cleaned_response) > 1000 else cleaned_response)
                    time.sleep(2 ** attempt)
                    continue
                    
            except Exception as e:
                logger.error(f"API call failed for {filename} - Attempt {attempt + 1}: {str(e)}")
                if attempt == max_retries - 1:
                    logger.error(f"All attempts failed for {filename}")
                time.sleep(2 ** attempt)
                continue
        
        return None

    def post_process_links(self, extracted_data: Dict[Any, Any], extracted_links: Dict[str, List[str]]) -> Dict[Any, Any]:
        """Post-process extracted data to ensure links are properly populated"""
        try:
            contact_info = extracted_data.get('contact_information', {})
            
            if not contact_info.get('linkedin') and extracted_links.get('linkedin'):
                contact_info['linkedin'] = extracted_links['linkedin'][0]
            
            if not contact_info.get('github') and extracted_links.get('github'):
                contact_info['github'] = extracted_links['github'][0]
            
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

    def validate_extracted_data(self, data: Dict[Any, Any]) -> bool:
        """Validate extracted data structure"""
        if not data or not isinstance(data, dict):
            return False
        
        required_keys = ['candidate_name', 'contact_information', 'education', 'experience', 'skills']
        
        for key in required_keys:
            if key not in data:
                return False
        
        return True

    def process_single_pdf(self, pdf_path: Path) -> bool:
        """Process a single PDF file"""
        try:
            logger.info(f"🔄 Processing: {pdf_path.name}")
            
            # Generate output filename
            output_filename = pdf_path.stem + "_extracted.json"
            output_path = self.output_folder / output_filename
            
            # Skip if already processed
            if output_path.exists():
                logger.info(f"⏭️  Skipping {pdf_path.name} - already processed")
                self.skipped_count += 1
                return True
            
            # Extract text and links
            resume_text, metadata, extracted_links = self.extract_text_from_pdf(pdf_path)
            
            if not resume_text:
                logger.error(f"❌ Could not extract text from {pdf_path.name}")
                self.failed_count += 1
                return False
            
            # Process with AI
            extracted_data = self.extract_resume_data_with_retry(resume_text, extracted_links, pdf_path.name)
            
            if extracted_data and self.validate_extracted_data(extracted_data):
                # Add extraction metadata
                extracted_data["extraction_metadata"] = {
                    "extraction_date": datetime.now().isoformat(),
                    "model_used": "llama3-8b-8192",
                    "source_file": pdf_path.name,
                    **metadata
                }
                
                # Save to JSON file
                with open(output_path, 'w', encoding='utf-8') as f:
                    json.dump(extracted_data, f, indent=2, ensure_ascii=False)
                
                # Log success with key info
                contact_info = extracted_data.get('contact_information', {})
                candidate_name = extracted_data.get('candidate_name', 'Unknown')
                linkedin = contact_info.get('linkedin', 'Not found')
                github = contact_info.get('github', 'Not found')
                
                logger.info(f"✅ Successfully processed: {pdf_path.name}")
                logger.info(f"   👤 Candidate: {candidate_name}")
                logger.info(f"   🔗 LinkedIn: {linkedin}")
                logger.info(f"   🐙 GitHub: {github}")
                logger.info(f"   💾 Saved to: {output_filename}")
                
                self.processed_count += 1
                return True
            else:
                logger.error(f"❌ Failed to extract valid data from {pdf_path.name}")
                self.failed_count += 1
                return False
                
        except Exception as e:
            logger.error(f"❌ Error processing {pdf_path.name}: {str(e)}")
            logger.error(traceback.format_exc())
            self.failed_count += 1
            return False

    def process_all_pdfs(self):
        """Process all PDF files in the data folder"""
        pdf_files = list(self.data_folder.glob("*.pdf"))
        
        if not pdf_files:
            logger.warning(f"⚠️  No PDF files found in '{self.data_folder}' folder")
            return
        
        logger.info(f"🚀 Starting batch processing of {len(pdf_files)} PDF files")
        logger.info(f"📁 Input folder: {self.data_folder.absolute()}")
        logger.info(f"📁 Output folder: {self.output_folder.absolute()}")
        
        start_time = time.time()
        
        for i, pdf_path in enumerate(pdf_files, 1):
            logger.info(f"\n📄 File {i}/{len(pdf_files)}: {pdf_path.name}")
            self.process_single_pdf(pdf_path)
            
            # Small delay to avoid rate limiting
            time.sleep(1)
        
        end_time = time.time()
        total_time = end_time - start_time
        
        # Final summary
        logger.info("\n" + "="*60)
        logger.info("📊 BATCH PROCESSING COMPLETE")
        logger.info("="*60)
        logger.info(f"✅ Successfully processed: {self.processed_count}")
        logger.info(f"⏭️  Skipped (already exists): {self.skipped_count}")
        logger.info(f"❌ Failed: {self.failed_count}")
        logger.info(f"📄 Total files: {len(pdf_files)}")
        logger.info(f"⏱️  Total time: {total_time:.2f} seconds")
        logger.info(f"⚡ Average time per file: {total_time/len(pdf_files):.2f} seconds")
        logger.info("="*60)

def main():
    """Main function to run the batch processor"""
    print("🚀 Resume Data Extractor - Batch Processing Mode")
    print("="*60)
    
    # Get API key
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        api_key = input("Enter your Groq API Key: ").strip()
        if not api_key:
            print("❌ API key is required!")
            sys.exit(1)
    
    try:
        # Initialize processor
        processor = BatchResumeProcessor(api_key)
        
        if not processor.client:
            print("❌ Failed to initialize Groq client!")
            sys.exit(1)
        
        # Process all PDFs
        processor.process_all_pdfs()
        
    except KeyboardInterrupt:
        print("\n⏹️  Processing interrupted by user")
        sys.exit(1)
    except Exception as e:
        logger.error(f"❌ Fatal error: {str(e)}")
        logger.error(traceback.format_exc())
        sys.exit(1)

if __name__ == "__main__":
    main()