import streamlit as st
import requests
import pandas as pd
import json
from datetime import datetime
import plotly.express as px
import plotly.graph_objects as go
from collections import Counter
import time
import google.generativeai as genai
import base64

# Set page config
st.set_page_config(
    page_title="GitHub Data Fetcher",
    page_icon="🐙",
    layout="wide"
)

class GitHubDataFetcher:
    def __init__(self, token, gemini_key=None):
        self.token = token
        self.gemini_key = gemini_key
        self.headers = {
            'Authorization': f'token {token}',
            'Accept': 'application/vnd.github.v3+json'
        }
        self.base_url = 'https://api.github.com'
        
        # Initialize Gemini if key provided
        if gemini_key:
            genai.configure(api_key=gemini_key)
            self.gemini_model = genai.GenerativeModel('gemini-2.0-flash-exp')
        else:
            self.gemini_model = None
    
    def make_request(self, url, params=None):
        """Make API request with error handling"""
        try:
            response = requests.get(url, headers=self.headers, params=params)
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 404:
                return None
            else:
                st.error(f"API Error: {response.status_code} - {response.text}")
                return None
        except Exception as e:
            st.error(f"Request failed: {str(e)}")
            return None
    
    def get_user_info(self, username):
        """Get user profile information"""
        url = f"{self.base_url}/users/{username}"
        return self.make_request(url)
    
    def get_user_repos(self, username, per_page=100):
        """Get all user repositories"""
        repos = []
        page = 1
        
        while True:
            url = f"{self.base_url}/users/{username}/repos"
            params = {'per_page': per_page, 'page': page, 'sort': 'updated'}
            data = self.make_request(url, params)
            
            if not data:
                break
            
            repos.extend(data)
            
            if len(data) < per_page:
                break
            
            page += 1
            time.sleep(0.1)  # Rate limiting
        
        return repos
    
    def get_repo_details(self, username, repo_name):
        """Get detailed repository information"""
        url = f"{self.base_url}/repos/{username}/{repo_name}"
        return self.make_request(url)
    
    def get_repo_commits(self, username, repo_name, per_page=100):
        """Get repository commits"""
        commits = []
        page = 1
        
        while page <= 5:  # Limit to 5 pages to avoid rate limits
            url = f"{self.base_url}/repos/{username}/{repo_name}/commits"
            params = {'per_page': per_page, 'page': page}
            data = self.make_request(url, params)
            
            if not data:
                break
            
            commits.extend(data)
            
            if len(data) < per_page:
                break
            
            page += 1
            time.sleep(0.1)
        
        return commits
    
    def get_repo_issues(self, username, repo_name, state='all'):
        """Get repository issues"""
        url = f"{self.base_url}/repos/{username}/{repo_name}/issues"
        params = {'state': state, 'per_page': 100}
        return self.make_request(url, params) or []
    
    def get_repo_languages(self, username, repo_name):
        """Get repository languages"""
        url = f"{self.base_url}/repos/{username}/{repo_name}/languages"
        return self.make_request(url)
    
    def get_user_followers(self, username):
        """Get user followers"""
        url = f"{self.base_url}/users/{username}/followers"
        return self.make_request(url) or []
    
    def get_user_following(self, username):
        """Get users that user is following"""
        url = f"{self.base_url}/users/{username}/following"
        return self.make_request(url) or []
    
    def get_user_events(self, username):
        """Get user recent events"""
        url = f"{self.base_url}/users/{username}/events"
        return self.make_request(url) or []
    
    def get_repo_readme(self, username, repo_name):
        """Get repository README content"""
        url = f"{self.base_url}/repos/{username}/{repo_name}/readme"
        return self.make_request(url)
    
    def get_repo_contributors(self, username, repo_name):
        """Get repository contributors"""
        url = f"{self.base_url}/repos/{username}/{repo_name}/contributors"
        return self.make_request(url) or []
    
    def get_repo_releases(self, username, repo_name):
        """Get repository releases"""
        url = f"{self.base_url}/repos/{username}/{repo_name}/releases"
        return self.make_request(url) or []
    
    def get_repo_topics(self, username, repo_name):
        """Get repository topics"""
        url = f"{self.base_url}/repos/{username}/{repo_name}/topics"
        headers = {**self.headers, 'Accept': 'application/vnd.github.mercy-preview+json'}
        try:
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                return response.json().get('names', [])
        except:
            pass
        return []
    
    def get_repo_tree(self, username, repo_name, branch='main'):
        """Get repository file tree"""
        url = f"{self.base_url}/repos/{username}/{repo_name}/git/trees/{branch}?recursive=1"
        return self.make_request(url)
    
    def get_file_content(self, username, repo_name, file_path):
        """Get specific file content"""
        url = f"{self.base_url}/repos/{username}/{repo_name}/contents/{file_path}"
        return self.make_request(url)
    
    def analyze_repo_with_gemini(self, username, repo_name, repo_data):
        """Analyze repository using Gemini AI"""
        if not self.gemini_model:
            return "Gemini AI not configured"
        
        try:
            # Gather repository information
            repo_info = {
                'name': repo_data.get('name', ''),
                'description': repo_data.get('description', ''),
                'language': repo_data.get('language', ''),
                'topics': self.get_repo_topics(username, repo_name),
                'size': repo_data.get('size', 0),
                'stars': repo_data.get('stargazers_count', 0),
                'forks': repo_data.get('forks_count', 0)
            }
            
            # Get file structure
            tree = self.get_repo_tree(username, repo_name)
            file_structure = []
            if tree and 'tree' in tree:
                for item in tree['tree'][:20]:  # First 20 files
                    if item['type'] == 'blob':
                        file_structure.append(item['path'])
            
            # Get key files content
            key_files = ['package.json', 'requirements.txt', 'pom.xml', 'build.gradle', 'Cargo.toml', 'go.mod']
            file_contents = {}
            for file in key_files:
                content = self.get_file_content(username, repo_name, file)
                if content and content.get('content'):
                    try:
                        decoded = base64.b64decode(content['content']).decode('utf-8')
                        file_contents[file] = decoded[:500]  # First 500 chars
                    except:
                        pass
            
            # Create prompt for Gemini
            prompt = f"""
            Analyze this GitHub repository and provide a comprehensive summary:
            
            **Repository Details:**
            - Name: {repo_info['name']}
            - Description: {repo_info['description'] or 'No description'}
            - Primary Language: {repo_info['language'] or 'Not specified'}
            - Topics: {', '.join(repo_info['topics']) if repo_info['topics'] else 'None'}
            - Size: {repo_info['size']} KB
            - Stars: {repo_info['stars']}, Forks: {repo_info['forks']}
            
            **File Structure (sample):**
            {chr(10).join(file_structure[:15])}
            
            **Key Configuration Files:**
            {json.dumps(file_contents, indent=2) if file_contents else 'None found'}
            
            Please provide:
            1. **Project Purpose**: What this project does (2-3 sentences)
            2. **Technology Stack**: Technologies, frameworks, and tools used
            3. **Project Category**: Type of project (web app, library, tool, etc.)
            4. **Key Features**: Main functionality and capabilities
            5. **Development Status**: Assessment of project maturity and activity
            6. **Use Cases**: Who would use this and why
            
            Keep the response concise but informative, suitable for a developer portfolio summary.
            """
            
            response = self.gemini_model.generate_content(prompt)
            return response.text
            
        except Exception as e:
            return f"AI Analysis failed: {str(e)}"

def extract_username_from_url(url_or_username):
    """Extract username from GitHub URL or return username as is"""
    if url_or_username.startswith('https://github.com/'):
        return url_or_username.split('/')[-1]
    return url_or_username

def display_user_profile(user_info):
    """Display user profile information"""
    col1, col2 = st.columns([1, 2])
    
    with col1:
        if user_info.get('avatar_url'):
            st.image(user_info['avatar_url'], width=200)
    
    with col2:
        st.title(f"{user_info['name'] or user_info['login']}")
        st.write(f"**Username:** @{user_info['login']}")
        
        if user_info.get('bio'):
            st.write(f"**Bio:** {user_info['bio']}")
        
        if user_info.get('location'):
            st.write(f"**Location:** {user_info['location']}")
        
        if user_info.get('company'):
            st.write(f"**Company:** {user_info['company']}")
        
        if user_info.get('blog'):
            st.write(f"**Website:** {user_info['blog']}")
        
        col2_1, col2_2, col2_3 = st.columns(3)
        with col2_1:
            st.metric("Followers", user_info['followers'])
        with col2_2:
            st.metric("Following", user_info['following'])
        with col2_3:
            st.metric("Public Repos", user_info['public_repos'])

def generate_project_summary(fetcher, username, repo):
    """Generate comprehensive summary for a project"""
    repo_name = repo['name']
    
    # Get additional repository data
    readme = fetcher.get_repo_readme(username, repo_name)
    contributors = fetcher.get_repo_contributors(username, repo_name)
    releases = fetcher.get_repo_releases(username, repo_name)
    topics = fetcher.get_repo_topics(username, repo_name)
    languages = fetcher.get_repo_languages(username, repo_name)
    commits = fetcher.get_repo_commits(username, repo_name, per_page=30)
    issues = fetcher.get_repo_issues(username, repo_name)
    
    # Calculate project metrics
    total_contributors = len(contributors) if contributors else 0
    total_releases = len(releases) if releases else 0
    open_issues = len([i for i in issues if i.get('state') == 'open']) if issues else 0
    closed_issues = len([i for i in issues if i.get('state') == 'closed']) if issues else 0
    
    # Get primary language and percentage
    primary_language = repo.get('language', 'Not specified')
    language_info = ""
    if languages:
        total_bytes = sum(languages.values())
        if total_bytes > 0:
            lang_percentages = [(lang, (bytes_count / total_bytes) * 100) 
                              for lang, bytes_count in languages.items()]
            lang_percentages.sort(key=lambda x: x[1], reverse=True)
            top_3_langs = lang_percentages[:3]
            language_info = ", ".join([f"{lang} ({perc:.1f}%)" for lang, perc in top_3_langs])
    
    # Get recent activity
    recent_commits = len(commits) if commits else 0
    last_commit = None
    if commits:
        last_commit = commits[0]['commit']['author']['date'][:10]
    
    # Get latest release info
    latest_release = None
    if releases:
        latest_release = releases[0]['tag_name']
    
    # README excerpt
    readme_excerpt = ""
    ai_analysis = ""
    
    if readme and readme.get('content'):
        try:
            decoded_content = base64.b64decode(readme['content']).decode('utf-8')
            # Extract first meaningful paragraph (skip title and empty lines)
            lines = decoded_content.split('\n')
            for line in lines:
                clean_line = line.strip()
                if clean_line and not clean_line.startswith('#') and len(clean_line) > 50:
                    readme_excerpt = clean_line[:200] + "..." if len(clean_line) > 200 else clean_line
                    break
        except:
            readme_excerpt = "Unable to parse README"
    
    # If no README or poor README, use AI analysis
    if not readme_excerpt or len(readme_excerpt) < 50:
        if fetcher.gemini_model:
            ai_analysis = fetcher.analyze_repo_with_gemini(username, repo_name, repo)
            if ai_analysis and "AI Analysis failed" not in ai_analysis:
                readme_excerpt = "AI-Generated Summary Available"
    
    # Calculate project health score
    health_score = 0
    if repo['stargazers_count'] > 0: health_score += 10
    if repo['forks_count'] > 0: health_score += 10
    if total_contributors > 1: health_score += 15
    if recent_commits > 0: health_score += 20
    if repo.get('description'): health_score += 10
    if readme or ai_analysis: health_score += 15
    if latest_release: health_score += 10
    if topics: health_score += 10
    
    # Project category based on topics and language
    category = "General"
    if topics:
        web_topics = ['web', 'frontend', 'backend', 'react', 'vue', 'angular', 'html', 'css']
        mobile_topics = ['mobile', 'android', 'ios', 'react-native', 'flutter']
        data_topics = ['data-science', 'machine-learning', 'ai', 'analytics', 'python']
        dev_topics = ['cli', 'tool', 'devops', 'automation', 'library']
        
        if any(topic in web_topics for topic in topics):
            category = "Web Development"
        elif any(topic in mobile_topics for topic in topics):
            category = "Mobile Development"
        elif any(topic in data_topics for topic in topics):
            category = "Data Science/AI"
        elif any(topic in dev_topics for topic in topics):
            category = "Developer Tools"
    
    return {
        'name': repo_name,
        'description': repo.get('description', 'No description available'),
        'primary_language': primary_language,
        'language_breakdown': language_info,
        'stars': repo['stargazers_count'],
        'forks': repo['forks_count'],
        'watchers': repo['watchers_count'],
        'contributors': total_contributors,
        'releases': total_releases,
        'latest_release': latest_release,
        'open_issues': open_issues,
        'closed_issues': closed_issues,
        'recent_commits': recent_commits,
        'last_commit': last_commit,
        'topics': topics,
        'category': category,
        'readme_excerpt': readme_excerpt,
        'ai_analysis': ai_analysis,
        'health_score': health_score,
        'created_at': repo['created_at'][:10],
        'updated_at': repo['updated_at'][:10],
        'size_kb': repo.get('size', 0),
        'default_branch': repo.get('default_branch', 'main'),
        'is_fork': repo.get('fork', False),
        'html_url': repo['html_url']
    }

def display_top_projects_summary(fetcher, username, repos):
    """Display comprehensive summary of top 10 projects"""
    if not repos:
        st.warning("No repositories found")
        return
    
    st.header("🏆 Top 10 Projects Summary")
    
    # Sort repositories by a combination of stars and activity
    def calculate_project_score(repo):
        stars = repo['stargazers_count']
        forks = repo['forks_count']
        watchers = repo['watchers_count']
        # Recent activity bonus (updated within last year)
        from datetime import datetime, timedelta
        updated = datetime.strptime(repo['updated_at'], '%Y-%m-%dT%H:%M:%SZ')
        recent_bonus = 10 if updated > datetime.now() - timedelta(days=365) else 0
        
        return (stars * 3) + (forks * 2) + watchers + recent_bonus
    
    top_repos = sorted(repos, key=calculate_project_score, reverse=True)[:10]
    
    # Generate summaries for top projects
    project_summaries = []
    
    progress_bar = st.progress(0)
    status_text = st.empty()
    
    for i, repo in enumerate(top_repos):
        status_text.text(f"Analyzing project {i+1}/10: {repo['name']}")
        progress_bar.progress((i + 1) / len(top_repos))
        
        summary = generate_project_summary(fetcher, username, repo)
        project_summaries.append(summary)
        
        time.sleep(0.2)  # Rate limiting
    
    progress_bar.empty()
    status_text.empty()
    
    # Display summary statistics
    col1, col2, col3, col4 = st.columns(4)
    
    total_stars = sum(p['stars'] for p in project_summaries)
    total_forks = sum(p['forks'] for p in project_summaries)
    total_contributors = sum(p['contributors'] for p in project_summaries)
    avg_health_score = sum(p['health_score'] for p in project_summaries) / len(project_summaries)
    
    with col1:
        st.metric("Total Stars (Top 10)", total_stars)
    with col2:
        st.metric("Total Forks (Top 10)", total_forks)
    with col3:
        st.metric("Total Contributors", total_contributors)
    with col4:
        st.metric("Avg Health Score", f"{avg_health_score:.1f}/100")
    
    # Project categories overview
    categories = [p['category'] for p in project_summaries]
    if categories:
        category_counts = Counter(categories)
        
        col1, col2 = st.columns(2)
        
        with col1:
            fig = px.pie(
                values=list(category_counts.values()),
                names=list(category_counts.keys()),
                title="Project Categories Distribution"
            )
            st.plotly_chart(fig, use_container_width=True)
        
        with col2:
            # Language distribution across top projects
            all_languages = []
            for summary in project_summaries:
                if summary['primary_language'] and summary['primary_language'] != 'Not specified':
                    all_languages.append(summary['primary_language'])
            
            if all_languages:
                lang_counts = Counter(all_languages)
                fig = px.bar(
                    x=list(lang_counts.keys()),
                    y=list(lang_counts.values()),
                    title="Primary Languages in Top 10 Projects",
                    labels={'x': 'Language', 'y': 'Number of Projects'}
                )
                st.plotly_chart(fig, use_container_width=True)
    
    # Individual project summaries
    st.subheader("📋 Detailed Project Summaries")
    
    for i, summary in enumerate(project_summaries, 1):
        with st.expander(f"#{i} {summary['name']} - {summary['stars']} ⭐ | Health Score: {summary['health_score']}/100"):
            
            # Project header info
            col1, col2, col3 = st.columns(3)
            
            with col1:
                st.write(f"**Category:** {summary['category']}")
                st.write(f"**Primary Language:** {summary['primary_language']}")
                st.write(f"**Created:** {summary['created_at']}")
                st.write(f"**Last Updated:** {summary['updated_at']}")
                
            with col2:
                st.write(f"**Stars:** {summary['stars']}")
                st.write(f"**Forks:** {summary['forks']}")
                st.write(f"**Watchers:** {summary['watchers']}")
                st.write(f"**Contributors:** {summary['contributors']}")
                
            with col3:
                st.write(f"**Open Issues:** {summary['open_issues']}")
                st.write(f"**Closed Issues:** {summary['closed_issues']}")
                st.write(f"**Releases:** {summary['releases']}")
                if summary['latest_release']:
                    st.write(f"**Latest Release:** {summary['latest_release']}")
            
            # Description and README excerpt
            if summary['description']:
                st.write(f"**Description:** {summary['description']}")
            
            if summary['readme_excerpt']:
                st.write(f"**README Excerpt:** {summary['readme_excerpt']}")
            
            # AI Analysis if available
            if summary['ai_analysis'] and summary['ai_analysis'] != "Gemini AI not configured":
                st.subheader("🤖 AI-Powered Project Analysis")
                st.markdown(summary['ai_analysis'])
            
            # Technical details
            if summary['language_breakdown']:
                st.write(f"**Language Breakdown:** {summary['language_breakdown']}")
            
            if summary['topics']:
                topics_str = ", ".join(summary['topics'][:10])  # Show first 10 topics
                st.write(f"**Topics:** {topics_str}")
            
            # Activity and health metrics
            activity_col1, activity_col2 = st.columns(2)
            
            with activity_col1:
                st.write(f"**Recent Commits:** {summary['recent_commits']}")
                if summary['last_commit']:
                    st.write(f"**Last Commit:** {summary['last_commit']}")
                st.write(f"**Repository Size:** {summary['size_kb']} KB")
                
            with activity_col2:
                # Health score breakdown
                health_color = "🟢" if summary['health_score'] >= 70 else "🟡" if summary['health_score'] >= 40 else "🔴"
                st.write(f"**Health Score:** {health_color} {summary['health_score']}/100")
                st.write(f"**Default Branch:** {summary['default_branch']}")
                if summary['is_fork']:
                    st.write("**Type:** Fork")
                else:
                    st.write("**Type:** Original Repository")
            
            # Quick link to repository
            st.markdown(f"[🔗 View on GitHub]({summary['html_url']})")
    
    # Export top projects summary
    st.subheader("💾 Export Top 10 Summary")
    
    col1, col2 = st.columns(2)
    
    with col1:
        if st.button("📊 Export Summary as JSON"):
            summary_data = {
                'generated_at': datetime.now().isoformat(),
                'username': username,
                'total_projects_analyzed': len(project_summaries),
                'summary_statistics': {
                    'total_stars': total_stars,
                    'total_forks': total_forks,
                    'total_contributors': total_contributors,
                    'average_health_score': avg_health_score
                },
                'projects': project_summaries
            }
            
            st.download_button(
                label="Download JSON Summary",
                data=json.dumps(summary_data, indent=2),
                file_name=f"{username}_top10_projects_summary.json",
                mime="application/json"
            )
    
    with col2:
        if st.button("📋 Export Summary as CSV"):
            # Create a flattened DataFrame for CSV export
            csv_data = []
            for summary in project_summaries:
                csv_data.append({
                    'Project Name': summary['name'],
                    'Description': summary['description'],
                    'Category': summary['category'],
                    'Primary Language': summary['primary_language'],
                    'Stars': summary['stars'],
                    'Forks': summary['forks'],
                    'Contributors': summary['contributors'],
                    'Health Score': summary['health_score'],
                    'Open Issues': summary['open_issues'],
                    'Releases': summary['releases'],
                    'Last Updated': summary['updated_at'],
                    'GitHub URL': summary['html_url']
                })
            
            df = pd.DataFrame(csv_data)
            csv = df.to_csv(index=False)
            
            st.download_button(
                label="Download CSV Summary",
                data=csv,
                file_name=f"{username}_top10_projects_summary.csv",
                mime="text/csv"
            )

def display_repositories_analysis(repos):
    """Display repository analysis"""
    if not repos:
        st.warning("No repositories found")
        return
    
    # Create DataFrame
    df = pd.DataFrame(repos)
    
    # Basic stats
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("Total Repositories", len(repos))
    with col2:
        total_stars = sum(repo['stargazers_count'] for repo in repos)
        st.metric("Total Stars", total_stars)
    with col3:
        total_forks = sum(repo['forks_count'] for repo in repos)
        st.metric("Total Forks", total_forks)
    with col4:
        total_watchers = sum(repo['watchers_count'] for repo in repos)
        st.metric("Total Watchers", total_watchers)
    
    # Top repositories by stars
    st.subheader("🌟 Top Repositories by Stars")
    top_repos = sorted(repos, key=lambda x: x['stargazers_count'], reverse=True)[:10]
    
    repo_data = []
    for repo in top_repos:
        repo_data.append({
            'Name': repo['name'],
            'Stars': repo['stargazers_count'],
            'Forks': repo['forks_count'],
            'Language': repo['language'] or 'Unknown',
            'Updated': repo['updated_at'][:10],
            'Description': repo['description'] or 'No description'
        })
    
    st.dataframe(pd.DataFrame(repo_data), use_container_width=True)
    
    # Language distribution
    languages = [repo['language'] for repo in repos if repo['language']]
    if languages:
        lang_counts = Counter(languages)
        
        fig = px.pie(
            values=list(lang_counts.values()),
            names=list(lang_counts.keys()),
            title="Programming Languages Distribution"
        )
        st.plotly_chart(fig, use_container_width=True)
    
    # Repository activity timeline
    df['created_at'] = pd.to_datetime(df['created_at'])
    df['year_month'] = df['created_at'].dt.to_period('M')
    
    activity = df.groupby('year_month').size().reset_index(name='count')
    activity['year_month'] = activity['year_month'].astype(str)
    
    fig = px.line(
        activity, x='year_month', y='count',
        title='Repository Creation Timeline',
        labels={'year_month': 'Month', 'count': 'Repositories Created'}
    )
    st.plotly_chart(fig, use_container_width=True)

def display_detailed_repo_info(fetcher, username, selected_repo):
    """Display detailed information for selected repository"""
    st.subheader(f"📁 Detailed Analysis: {selected_repo}")
    
    # Get repository details
    repo_details = fetcher.get_repo_details(username, selected_repo)
    if not repo_details:
        st.error("Could not fetch repository details")
        return
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.write(f"**Description:** {repo_details.get('description', 'No description')}")
        st.write(f"**Language:** {repo_details.get('language', 'Unknown')}")
        st.write(f"**Size:** {repo_details.get('size', 0)} KB")
        st.write(f"**Default Branch:** {repo_details.get('default_branch', 'main')}")
        
    with col2:
        st.metric("Stars", repo_details.get('stargazers_count', 0))
        st.metric("Forks", repo_details.get('forks_count', 0))
        st.metric("Issues", repo_details.get('open_issues_count', 0))
        st.metric("Watchers", repo_details.get('watchers_count', 0))
    
    # Get repository languages
    languages = fetcher.get_repo_languages(username, selected_repo)
    if languages:
        st.subheader("Languages Used")
        total_bytes = sum(languages.values())
        lang_percentages = {lang: (bytes_count / total_bytes) * 100 
                           for lang, bytes_count in languages.items()}
        
        fig = px.bar(
            x=list(lang_percentages.keys()),
            y=list(lang_percentages.values()),
            title="Language Distribution (%)",
            labels={'x': 'Language', 'y': 'Percentage'}
        )
        st.plotly_chart(fig, use_container_width=True)
    
    # Get recent commits
    st.subheader("Recent Commits")
    commits = fetcher.get_repo_commits(username, selected_repo)
    
    if commits:
        commit_data = []
        for commit in commits[:20]:  # Show last 20 commits
            commit_data.append({
                'Date': commit['commit']['author']['date'][:10],
                'Author': commit['commit']['author']['name'],
                'Message': commit['commit']['message'][:100] + '...' if len(commit['commit']['message']) > 100 else commit['commit']['message'],
                'SHA': commit['sha'][:8]
            })
        
        st.dataframe(pd.DataFrame(commit_data), use_container_width=True)
        
        # Commit activity by author
        authors = [commit['commit']['author']['name'] for commit in commits]
        author_counts = Counter(authors)
        
        if len(author_counts) > 1:
            fig = px.bar(
                x=list(author_counts.keys()),
                y=list(author_counts.values()),
                title="Commit Activity by Author",
                labels={'x': 'Author', 'y': 'Number of Commits'}
            )
            st.plotly_chart(fig, use_container_width=True)
    
    # Get repository issues
    st.subheader("Issues")
    issues = fetcher.get_repo_issues(username, selected_repo)
    
    if issues:
        issue_data = []
        for issue in issues[:20]:  # Show last 20 issues
            issue_data.append({
                'Title': issue['title'],
                'State': issue['state'],
                'Created': issue['created_at'][:10],
                'Author': issue['user']['login'],
                'Comments': issue['comments']
            })
        
        st.dataframe(pd.DataFrame(issue_data), use_container_width=True)

def main():
    st.title("🐙 GitHub Data Fetcher")
    st.write("Fetch comprehensive GitHub data using username/URL and access token")
    
    # Sidebar for inputs
    with st.sidebar:
        st.header("Configuration")
        
        # Access token input
        access_token = st.text_input(
            "GitHub Access Token",
            type="password",
            help="Your GitHub personal access token"
        )
        
        # Gemini API key input
        gemini_key = st.text_input(
            "Gemini API Key (Optional)",
            type="password",
            help="For AI-powered repository analysis",
            value="AIzaSyAyuc_g9ChpTvFeijYhdn6gDWdcTD8w2I8"
        )
        
        # Username/URL input
        username_input = st.text_input(
            "GitHub Username or URL",
            placeholder="e.g., octocat or https://github.com/octocat"
        )
        
        # Extract username
        if username_input:
            username = extract_username_from_url(username_input)
            st.write(f"Username: {username}")
        
        fetch_data = st.button("Fetch GitHub Data", type="primary")
    
    # Main content
    if fetch_data and access_token and username_input:
        username = extract_username_from_url(username_input)
        fetcher = GitHubDataFetcher(access_token, gemini_key)
        
        with st.spinner("Fetching GitHub data..."):
            # Get user information
            user_info = fetcher.get_user_info(username)
            
            if not user_info:
                st.error("User not found or invalid access token")
                return
            
            # Display user profile
            st.header("👤 User Profile")
            display_user_profile(user_info)
            
            # Get repositories
            st.header("📚 Repositories Analysis")
            repos = fetcher.get_user_repos(username)
            display_repositories_analysis(repos)
            
            # Top 10 Projects Summary
            if repos:
                display_top_projects_summary(fetcher, username, repos)
            
            # Repository selection for detailed analysis
            if repos:
                st.header("🔍 Detailed Repository Analysis")
                repo_names = [repo['name'] for repo in repos]
                selected_repo = st.selectbox("Select a repository for detailed analysis:", repo_names)
                
                if selected_repo:
                    display_detailed_repo_info(fetcher, username, selected_repo)
            
            # User activity and social data
            st.header("🌐 Social & Activity Data")
            
            col1, col2 = st.columns(2)
            
            with col1:
                st.subheader("Recent Activity")
                events = fetcher.get_user_events(username)
                if events:
                    event_data = []
                    for event in events[:10]:
                        event_data.append({
                            'Type': event['type'],
                            'Repository': event.get('repo', {}).get('name', 'N/A'),
                            'Date': event['created_at'][:10]
                        })
                    st.dataframe(pd.DataFrame(event_data), use_container_width=True)
            
            with col2:
                st.subheader("Followers & Following")
                followers = fetcher.get_user_followers(username)
                following = fetcher.get_user_following(username)
                
                if followers:
                    st.write(f"**Top Followers ({len(followers)} total):**")
                    for follower in followers[:5]:
                        st.write(f"- @{follower['login']}")
                
                if following:
                    st.write(f"**Following ({len(following)} total):**")
                    for follow in following[:5]:
                        st.write(f"- @{follow['login']}")
            
            # Export functionality
            st.header("💾 Export Data")
            col1, col2, col3 = st.columns(3)
            
            with col1:
                if st.button("Export User Data as JSON"):
                    user_data = {
                        'profile': user_info,
                        'repositories': repos,
                        'followers': followers if 'followers' in locals() else [],
                        'following': following if 'following' in locals() else []
                    }
                    st.download_button(
                        label="Download JSON",
                        data=json.dumps(user_data, indent=2),
                        file_name=f"{username}_github_data.json",
                        mime="application/json"
                    )
            
            with col2:
                if repos and st.button("Export Repositories as CSV"):
                    repo_df = pd.DataFrame(repos)
                    csv = repo_df.to_csv(index=False)
                    st.download_button(
                        label="Download CSV",
                        data=csv,
                        file_name=f"{username}_repositories.csv",
                        mime="text/csv"
                    )
    
    elif fetch_data:
        st.warning("Please provide both GitHub access token and username/URL")
    
    # Instructions
    with st.expander("ℹ️ Setup Instructions"):
        st.write("""
        **GitHub Access Token:**
        1. Go to GitHub Settings → Developer settings → Personal access tokens
        2. Click "Generate new token"
        3. Select appropriate scopes (repo, user, etc.)
        4. Copy the generated token
        
        **Gemini API Key (Optional):**
        1. Go to Google AI Studio (https://makersuite.google.com/app/apikey)
        2. Create a new API key
        3. Copy the key for AI-powered repository analysis
        
        **Note:** Keep your tokens secure and never share them publicly!
        """)
    
    with st.expander("📊 Available Data"):
        st.write("""
        This app fetches the following GitHub data:
        
        **User Profile:**
        - Basic profile information (name, bio, location, etc.)
        - Follower/following counts
        - Repository statistics
        
        **Repositories:**
        - All public repositories
        - Repository statistics (stars, forks, language)
        - Commit history and activity
        - Issues and pull requests
        - Language distribution
        
        **Activity:**
        - Recent events and activity
        - Commit patterns and trends
        - Social connections (followers/following)
        """)

if __name__ == "__main__":
    main()