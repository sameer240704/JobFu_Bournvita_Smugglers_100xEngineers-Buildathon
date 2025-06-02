import streamlit as st
import requests
import json

def extract_linkedin_id(linkedin_url):
    """Extract LinkedIn profile ID from URL"""
    try:
        if '/in/' in linkedin_url:
            profile_id = linkedin_url.split('/in/')[-1].rstrip('/')
        elif '/pub/' in linkedin_url:
            profile_id = linkedin_url.split('/pub/')[-1].rstrip('/')
        else:
            profile_id = linkedin_url.split('/')[-1] if linkedin_url.split('/')[-1] else linkedin_url.split('/')[-2]
        
        profile_id = profile_id.split('?')[0]
        return profile_id
    except:
        return None

def scrape_linkedin_profile(api_key, linkedin_url):
    """Scrape LinkedIn profile using ScrapingDog API"""
    link_id = extract_linkedin_id(linkedin_url)
    if not link_id:
        return None, "Invalid LinkedIn URL format"
    
    url = "https://api.scrapingdog.com/linkedin"
    params = {
        "api_key": api_key,
        "type": "profile",
        "linkId": link_id,
        "private": "false"
    }
    
    try:
        response = requests.get(url, params=params, timeout=30)
        if response.status_code == 200:
            return response.json(), None
        else:
            return None, f"Request failed with status code: {response.status_code}"
    except Exception as e:
        return None, f"Error: {str(e)}"

# Streamlit App
st.title("LinkedIn Profile Scraper")
st.write("Enter a LinkedIn profile URL to scrape profile information.")

# Input section
api_key = st.text_input("API Key", value="68397e6a6bc6d2779908691f", type="password")
linkedin_url = st.text_input("LinkedIn Profile URL", placeholder="https://www.linkedin.com/in/profile-name/")

if st.button("Scrape Profile"):
    if not api_key:
        st.error("Please provide an API key")
    elif not linkedin_url:
        st.error("Please provide a LinkedIn URL")
    elif 'linkedin.com' not in linkedin_url.lower():
        st.error("Please provide a valid LinkedIn URL")
    else:
        with st.spinner("Scraping profile..."):
            data, error = scrape_linkedin_profile(api_key, linkedin_url)
        
        if error:
            st.error(f"Error: {error}")
        elif data:
            st.success("Profile scraped successfully!")
            
            # Display basic info
            if 'name' in data:
                st.subheader(f"Name: {data['name']}")
            if 'headline' in data:
                st.write(f"**Headline:** {data['headline']}")
            if 'location' in data:
                st.write(f"**Location:** {data['location']}")
            if 'summary' in data:
                st.write(f"**Summary:** {data['summary']}")
            
            # Show raw data
            st.subheader("Raw Data:")
            st.json(data)
            
            # Download option
            st.download_button(
                label="Download JSON",
                data=json.dumps(data, indent=2),
                file_name="linkedin_profile.json",
                mime="application/json"
            )
        else:
            st.error("No data received")

st.write("---")
st.write("Note: Make sure you have a valid ScrapingDog API key")