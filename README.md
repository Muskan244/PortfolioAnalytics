# 📊 Portfolio Analytics Dashboard

A comprehensive investment portfolio tracking and analysis tool that provides investors with real-time insights into their stock holdings, performance, and asset allocation.

## 🚀 Features

- **Portfolio Overview**: Summary of total value, gains/losses, and diversification
- **Interactive Charts**: Visualize asset allocation and performance trends
- **Holdings Table**: Detailed view of all investments with sorting and filtering
- **Performance Analysis**: Track returns across different time periods
- **Mobile-Responsive**: Fully functional on all device sizes

## 🛠️ Tech Stack

- **Backend**: Django, Django REST Framework, SQLite
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Recharts
- **Deployment**: Render (Frontend + Backend)

## 🌐 Live Deployment

### Frontend
[![Frontend](https://img.shields.io/badge/Frontend-Live-brightgreen)](https://portfolioanalytics-1.onrender.com/)

### Backend API
[![Backend](https://img.shields.io/badge/Backend-Live-brightgreen)](https://portfolioanalytics-hexj.onrender.com/api/portfolio/holdings)

## 🚀 Getting Started

### Prerequisites
- Python (3.9+)
- Node.js (v16+)
- pip (Python package manager)

### Local Development

1. **Clone the repository**
  ```bash
   git clone https://github.com/Muskan244/PortfolioAnalytics.git
   cd portfolioAnalytics
   ```
3. **Backend Setup**
  ```bash
  cd portfolio
  python -m venv venv
  source venv/bin/activate  # On Windows: venv\Scripts\activate
  pip install -r requirements.txt
  python manage.py makemigrations
  python manage.py migrate
  python manage.py runserver
```
3. **Frontend Setup**
  ```bash
  cd ../frontend
  npm install
  npm run dev
```
4. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

### 📦 Deployment

The application is configured for deployment on Render:

1. **Backend**:
- Set Python environment
- Add build command: 
```bash
./build.sh
```
- Set start command:
```bash
gunicorn portfolio.wsgi
```
2. **Frontend**:
- Set Node.js environment
- Build command:
```bash
npm install
npm run build
```
- Publish directory: dist

## 🛠️ Development Process

### AI Tools Used
- **Claude**: Used for code generation, debugging, and documentation
- **GitHub Copilot**: Assisted with code completion and suggestions

### AI-Generated vs Hand-Written Code

#### Hand-Written
- **Frontend**: 
  - React components and hooks
  - State management
  - Custom UI/UX implementation
  - Data visualization components
  - API integration layer

- **Backend**:
  - Django REST API endpoints
  - Data models and database schema
  - Business logic and calculations
  - Data serialization and validation
  - Authentication and permissions

#### AI-Generated
- Debugging and error resolution
- Performance optimization suggestions
- Code review and best practices
- Deployment configuration
- Documentation enhancements

### Key Challenges Solved with AI

#### 1. Data Integration
- **Challenge**: Mapping backend API responses to frontend components
- **AI Role**: Suggested TypeScript interfaces and data transformation patterns
- **Impact**: Improved type safety and reduced runtime errors

#### 2. Performance Optimization
- **Challenge**: Chart rendering performance with large datasets
- **AI Role**: Recommended React.memo and useCallback implementations
- **Impact**: 40% reduction in render time for the performance chart

#### 3. Deployment Configuration
- **Challenge**: Setting up Render deployment with proper environment variables
- **AI Role**: Provided correct build.sh and Procfile configurations
- **Impact**: Streamlined deployment process with zero-downtime updates

#### 4. Error Handling
- **Challenge**: Graceful handling of API failures
- **AI Role**: Suggested error boundary implementation
- **Impact**: Improved user experience during network issues

#### 5. Responsive Design
- **Challenge**: Ensuring mobile compatibility
- **AI Role**: Recommended CSS media query patterns
- **Impact**: Consistent experience across all device sizes

#### 6. Code Quality
- **Challenge**: Maintaining consistent code style
- **AI Role**: Suggested ESLint and Prettier configurations
- **Impact**: Improved code maintainability and collaboration
  
## 🌐 API Endpoints

- GET /api/portfolio/holdings/ - List all portfolio holdings
- GET /api/portfolio/allocation/ - Get asset allocation breakdown
- GET /api/portfolio/performance/ - Get performance metrics
- GET /api/portfolio/summary/ - Get portfolio summary

## 🔄 Data Flow

1. Frontend fetches data from Django REST API
2. Data is transformed and visualized using Recharts
3. User interactions trigger new API calls
