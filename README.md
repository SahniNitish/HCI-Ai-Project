# SmartSpendAI - AI-Powered Expense Tracker

A modern, intelligent expense tracking application built for the HCI (Human-Computer Interaction) course. This project demonstrates effective UI/UX principles while leveraging Google's Gemini AI to provide smart financial insights and automated expense categorization.

## Overview

SmartSpendAI helps users track their daily expenses, visualize spending patterns, and receive personalized financial advice powered by AI. The application features an intuitive interface with real-time visualizations, intelligent expense categorization, and an AI advisor that adapts its tone to user preferences.

## Features

### Core Functionality
- **Expense Tracking**: Add, view, and delete expenses with descriptions, amounts, categories, and dates
- **Budget Management**: Set monthly budgets and track spending progress
- **Visual Dashboard**: Interactive charts showing spending by category and trends over time
- **Local Persistence**: All data is stored locally in the browser using localStorage

### AI-Powered Features (Google Gemini)
- **Smart Categorization**: Automatically categorizes expenses based on description and amount using Gemini AI
- **Personalized AI Advisor**: Get financial advice with customizable tones (serious or funny)
- **Intelligent Insights**: Context-aware recommendations based on spending patterns and budget status

### User Interface Highlights
- **Responsive Design**: Fully optimized for both desktop and mobile devices
- **Modern UI**: Clean, professional interface with smooth transitions and animations
- **Mobile-First Navigation**: Bottom navigation bar on mobile, sidebar on desktop
- **Accessibility**: High contrast, readable fonts, and intuitive interactions

## Technology Stack

### Frontend Framework
- **React 19.2.0**: Latest React with hooks for state management
- **TypeScript 5.8.2**: Type-safe development
- **Vite 6.2.0**: Fast build tool and development server

### AI Integration
- **Google Gemini API**: Powered by `@google/genai` package (v1.30.0)
- **Model**: Uses `gemini-2.5-flash` for fast, cost-effective AI responses
- **Features Used**:
  - Content generation for expense categorization
  - Structured JSON output for financial advice
  - Response schema validation

### UI Components & Visualization
- **Recharts 3.5.1**: Beautiful, responsive charts for data visualization
- **Lucide React 0.555.0**: Modern icon library
- **Tailwind CSS**: Utility-first CSS (via inline classes)

## Project Structure

```
HCI-Ai-Project/
├── components/
│   ├── Dashboard.tsx          # Main dashboard with charts and budget overview
│   ├── ExpenseForm.tsx        # Modal form for adding expenses
│   ├── ExpenseList.tsx        # Transaction history view
│   └── AIAdvisor.tsx          # AI-powered financial advisor interface
├── services/
│   └── geminiService.ts       # Google Gemini API integration
├── App.tsx                    # Main app component with routing
├── index.tsx                  # Application entry point
├── types.ts                   # TypeScript type definitions
├── .env.local                 # Environment variables (not in git)
└── package.json               # Dependencies and scripts
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google AI Studio API key (Gemini API)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd HCI-Ai-Project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Google Gemini API**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Create a [.env.local](.env.local) file in the project root
   - Add your API key:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   - Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## How It Works

### Google Gemini Integration

The application uses Google's Gemini API in two main ways:

1. **Expense Categorization** ([services/geminiService.ts](services/geminiService.ts)):
   - When users add an expense, the AI analyzes the description and amount
   - Returns the most appropriate category from predefined options
   - Fallback to "Other" if uncertain

2. **Financial Advice** ([components/AIAdvisor.tsx](components/AIAdvisor.tsx)):
   - Analyzes total spending, budget status, and category breakdown
   - Generates personalized advice with customizable tone (serious/funny)
   - Uses structured JSON output for consistent formatting

### Data Flow
1. User inputs expense details
2. Gemini AI categorizes the expense
3. Data is saved to localStorage
4. Dashboard updates with new visualizations
5. AI Advisor can provide insights on demand

## HCI Design Principles Applied

### Usability
- **Learnability**: Intuitive navigation with clear labels and icons
- **Efficiency**: Quick expense entry with smart categorization
- **Memorability**: Consistent UI patterns throughout the app
- **Error Prevention**: Form validation and confirmation dialogs

### Visual Design
- **Contrast**: High contrast text for readability
- **Hierarchy**: Clear visual hierarchy with sizing and spacing
- **Consistency**: Unified color scheme and component styles
- **Feedback**: Loading states, hover effects, and success messages

### Interaction Design
- **Responsiveness**: Adapts to screen sizes (mobile/desktop)
- **Affordance**: Buttons and interactive elements are clearly clickable
- **Feedback**: Immediate visual response to user actions
- **Progressive Disclosure**: Information revealed as needed

## Future Enhancements

- [ ] Multi-currency support
- [ ] Export data to CSV/PDF
- [ ] Recurring expense tracking
- [ ] Budget alerts and notifications
- [ ] Dark mode theme
- [ ] Data synchronization across devices
- [ ] More detailed spending analytics

## Course Information

**Course**: Human-Computer Interaction (HCI)
**Project Type**: AI-Enhanced Web Application
**Focus Areas**: User Interface Design, AI Integration, Responsive Design

## License

This project is created for educational purposes as part of an HCI course assignment.

## Acknowledgments

- Google AI Studio for providing the Gemini API
- React and Vite communities for excellent documentation
- Recharts for data visualization components
