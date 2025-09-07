# 📚 Vocabulary Frequency Analyzer

A powerful web application that analyzes vocabulary frequency in EPUB books and text to boost language learning comprehension. Perfect for language learners who want to identify the most important words in any text before diving into reading.

![Vocabulary Frequency Analyzer](https://img.shields.io/badge/Status-Live-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)
![Python](https://img.shields.io/badge/Python-3.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.x-38B2AC)

## ✨ Features

### 🎯 Core Functionality
- **EPUB File Processing**: Upload and analyze entire EPUB books
- **Text Input**: Paste any text directly for analysis
- **Intelligent Lemmatization**: Uses spaCy's Spanish model to find word roots and forms
- **Frequency Analysis**: Get comprehensive word frequency statistics
- **Comprehension Tracking**: See cumulative comprehension percentages

### 🎨 User Experience
- **Dark/Light Mode**: Toggle between themes with persistent preferences
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Real-time Processing**: Fast analysis with loading indicators
- **Progressive Display**: Show results in batches for better performance

### 📊 Export & Sharing
- **CSV Export**: Download complete results as a spreadsheet
- **Copy to Clipboard**: Instantly copy all results for sharing
- **Detailed Statistics**: Rank, frequency, percentage, and cumulative data

## 🚀 Live Demo

[**Try it now on Vercel**](https://your-app-name.vercel.app) *(Update with your actual Vercel URL)*

## 🛠️ Technology Stack

### Frontend
- **Next.js 15.3.3** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4.x** - Modern utility-first styling
- **JSZip** - EPUB file parsing
- **React Context** - Theme management

### Backend
- **Python 3.x** - Core analysis engine
- **Flask** - Lightweight web framework
- **spaCy** - Advanced NLP and lemmatization
- **Flask-CORS** - Cross-origin resource sharing

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/epub-to-frequency-list.git
cd epub-to-frequency-list
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install flask flask-cors spacy

# Download Spanish language model
python -m spacy download es_core_news_md

# Start the backend server
python main.py
```

The backend will run on `http://localhost:5001`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🎯 How It Works

### 1. Input Processing
- **EPUB Files**: Extracts text from all chapters in reading order
- **Text Input**: Processes raw text directly
- **Text Cleaning**: Removes punctuation, numbers, and normalizes whitespace

### 2. Analysis Pipeline
- **Tokenization**: Breaks text into individual words
- **Lemmatization**: Converts words to their base forms (e.g., "running" → "run")
- **Stop Word Removal**: Filters out common words like "the", "and", "is"
- **Frequency Counting**: Counts occurrences of each lemma

### 3. Results Generation
- **Ranking**: Orders words by frequency (most common first)
- **Statistics**: Calculates percentages and cumulative comprehension
- **Export Options**: Provides CSV download and clipboard copy

## 📊 Understanding the Results

| Column | Description |
|--------|-------------|
| **Rank** | Position in frequency list (1 = most common) |
| **Word (Lemma)** | Base form of the word |
| **Frequency** | Number of times the word appears |
| **Text %** | Percentage of total words this represents |
| **Cumulative Comprehension %** | Total text coverage if you knew all words up to this point |

### Example Interpretation
If the top 100 words give you 60% cumulative comprehension, learning just those 100 words will help you understand 60% of the text!

## 🎨 Customization

### Adding New Languages
To support other languages, modify the backend:

```python
# In backend/main.py, change the spaCy model
nlp = spacy.load("en_core_web_sm")  # For English
nlp = spacy.load("fr_core_news_sm")  # For French
```

### Styling Changes
The app uses Tailwind CSS with a custom dark mode implementation. Modify `frontend/src/app/globals.css` and component classes as needed.

## 🚀 Deployment

### Vercel (Frontend)
1. Connect your GitHub repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/.next`
4. Deploy!

### Backend Deployment
For production, consider deploying the Python backend to:
- **Heroku** - Easy Python deployment
- **Railway** - Modern platform with good Python support
- **DigitalOcean App Platform** - Scalable and reliable
- **AWS/GCP** - For enterprise needs

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **spaCy** - For excellent NLP capabilities
- **Next.js Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **JSZip** - For EPUB file handling

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/epub-to-frequency-list/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/epub-to-frequency-list/discussions)
- **Email**: your.email@example.com

---

**Made with ❤️ for language learners everywhere**

*Star this repository if you find it helpful!*