# SmartMeal AI - Recipe Sharing Platform

A modern, full-stack recipe sharing application with AI-powered recipe recommendations. Built with React frontend and Java REST API backend.

## 🎯 Project Overview

SmartMeal AI is a complete refactoring of a legacy JSP/Servlet application into a modern React + REST API architecture. The application allows users to:
- Create accounts and manage profiles
- Share and browse recipes
- Get AI-powered recipe recommendations based on available ingredients
- Comment on recipes and engage with the community
- Search for recipes by keywords

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Toastify** - Toast notifications

### Backend
- **Java 11** - Core language
- **Jakarta Servlet API** - REST API endpoints
- **Jackson** - JSON serialization/deserialization
- **JDBC** - Database connectivity
- **MySQL 8+** - Relational database
- **OpenAI API** - AI recipe recommendations (optional)

### Development Tools
- **Maven** - Dependency management and build
- **JUnit 5** - Unit testing
- **Apache Tomcat 10+** - Application server

## 📁 Project Structure

```
RecipeShare/
├── client/                    # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── LoadingSkeleton.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── contexts/         # React contexts
│   │   │   └── AuthContext.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Recipes.jsx
│   │   │   ├── RecipeDetail.jsx
│   │   │   ├── AddRecipe.jsx
│   │   │   ├── AIRecipeGenerator.jsx
│   │   │   └── Profile.jsx
│   │   ├── services/         # API service layer
│   │   │   └── api.js
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── src/                       # Java backend source
│   ├── model/                 # Data models (POJOs)
│   │   ├── User.java
│   │   ├── Recipe.java
│   │   └── Comment.java
│   ├── dao/                   # Data Access Objects
│   │   ├── UserDAO.java
│   │   ├── RecipeDAO.java
│   │   └── CommentDAO.java
│   ├── servlet/               # REST API servlets
│   │   ├── BaseServlet.java
│   │   ├── AuthServlet.java
│   │   ├── RecipeServlet.java
│   │   ├── UserServlet.java
│   │   ├── SearchServlet.java
│   │   └── AIRecommendServlet.java
│   ├── service/               # Business logic services
│   │   └── AIRecommendationService.java
│   ├── util/                  # Utility classes
│   │   ├── DBConnection.java
│   │   └── PasswordUtil.java
│   └── test/                  # Unit tests
│       ├── dao/
│       ├── service/
│       └── util/
├── WEB-INF/
│   └── web.xml                # Servlet configuration
├── database.sql               # Database schema and seed data
├── pom.xml                    # Maven configuration
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- **JDK 11+**
- **Node.js 16+** and **npm**
- **MySQL 8+**
- **Apache Tomcat 10+** (or compatible servlet container)
- **Maven 3.6+**

### Backend Setup

1. **Database Setup**
   ```sql
   mysql -u root -p
   SOURCE database.sql;
   ```

2. **Configuration**
   The OpenAI API key can be configured in three ways (in order of priority):
   
   **Option 1: Environment Variable (Recommended)**
   ```bash
   export OPENAI_API_KEY=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
   ```
   
   **Option 2: config.properties file**
   The API key is already configured in `config.properties` in the project root.
   
   **Option 3: System Property**
   ```bash
   java -DOPENAI_API_KEY=your_key_here -jar your-app.war
   ```
   
   **Database Configuration:**
   Set environment variables or update `src/util/DBConnection.java`:
   ```bash
   DB_URL=jdbc:mysql://localhost:3306/recipeshare?useSSL=false&serverTimezone=UTC
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```

3. **Build Backend**
   ```bash
   mvn clean package
   ```

4. **Deploy to Tomcat**
   - Copy the generated `RecipeShare.war` to Tomcat's `webapps/` directory
   - Or configure your IDE to deploy to Tomcat
   - Start Tomcat server

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd client
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:3000` with proxy to backend at `http://localhost:8080`

3. **Build for Production**
   ```bash
   npm run build
   ```
   The built files will be in `client/dist/` and can be served by Tomcat or any static file server.

## 🔌 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST `/api/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST `/api/auth/logout`
Logout current user.

#### GET `/api/auth/me`
Get current authenticated user.

### Recipe Endpoints

#### GET `/api/recipes`
Get all recipes.

**Response:**
```json
{
  "success": true,
  "recipes": [
    {
      "id": 1,
      "title": "Classic Pancakes",
      "ingredients": "2 cups flour\n2 eggs\n1.5 cups milk",
      "steps": "Mix ingredients and cook on a skillet.",
      "image": null,
      "userId": 1,
      "createdAt": "2024-01-01T10:00:00",
      "author": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

#### GET `/api/recipes/{id}`
Get recipe by ID.

#### POST `/api/recipes`
Create a new recipe (requires authentication).

**Request Body:**
```json
{
  "title": "Chocolate Cake",
  "ingredients": "flour, sugar, cocoa, eggs",
  "steps": "Mix all ingredients. Bake at 350F for 30 minutes.",
  "image": "https://example.com/cake.jpg"
}
```

#### GET `/api/recipes/{id}/comments`
Get comments for a recipe.

#### POST `/api/recipes/{id}/comments`
Add a comment to a recipe (requires authentication).

**Request Body:**
```json
{
  "comment": "This recipe is amazing!"
}
```

### Search Endpoint

#### GET `/api/search?q={query}`
Search recipes by keyword.

### AI Recommendation Endpoint

#### POST `/api/ai/recommend`
Get AI-powered recipe recommendations.

**Request Body:**
```json
{
  "ingredients": ["tomato", "pasta", "garlic", "onion"]
}
```

**Response:**
```json
{
  "success": true,
  "recipes": [
    {
      "title": "Creative Tomato Pasta Recipe",
      "description": "A delicious recipe using tomato, pasta, garlic, onion",
      "ingredients": "tomato, pasta, garlic, onion, salt, pepper, olive oil",
      "steps": "1. Prepare all ingredients\n2. Heat a pan with olive oil\n..."
    }
  ]
}
```

### User Endpoints

#### GET `/api/users/profile`
Get user profile (requires authentication).

#### GET `/api/users/dashboard`
Get user dashboard stats (requires authentication).

## 🎨 Frontend Features

### Pages
- **Home** - Landing page with feature overview
- **Login/Register** - User authentication
- **Dashboard** - User dashboard with stats and quick actions
- **Recipes** - Browse and search recipes
- **Recipe Detail** - View recipe details and comments
- **Add Recipe** - Create new recipes
- **AI Recipe Generator** - Get AI-powered recipe suggestions
- **Profile** - User profile management

### Components
- **Navbar** - Navigation bar with authentication state
- **Footer** - Site footer
- **Button** - Reusable button component with variants
- **Card** - Card container with hover effects
- **LoadingSkeleton** - Loading state placeholder
- **ProtectedRoute** - Route guard for authenticated pages

### Animations
- Page transitions using Framer Motion
- Staggered card animations
- Smooth hover effects
- Button press animations

## 🔒 Security Features

- **Password Hashing** - SHA-256 password hashing
- **SQL Injection Prevention** - Prepared statements throughout
- **Session Management** - Secure session-based authentication
- **CORS Support** - Configured for cross-origin requests
- **Input Validation** - Server-side validation on all endpoints

## 🧪 Testing

### Running Tests

**Backend Tests:**
```bash
mvn test
```

**Frontend Tests:**
```bash
cd client
npm test
```

### Test Coverage
- Unit tests for DAOs
- Unit tests for services (AI recommendation)
- Unit tests for utilities (password hashing)
- Integration tests for REST endpoints (to be expanded)

## 📦 Migration from JSP → React

### What Changed

1. **Frontend Architecture**
   - Removed all JSP files
   - Created React SPA with client-side routing
   - Separated frontend and backend concerns

2. **Backend Architecture**
   - Converted servlets to REST API endpoints
   - All responses now return JSON instead of forwarding to JSP
   - Added CORS support for cross-origin requests
   - Maintained all existing DAO and business logic

3. **Authentication**
   - Switched from server-side redirects to JSON responses
   - Frontend handles routing based on authentication state
   - Session management remains server-side

4. **Database**
   - No changes to database schema
   - All existing SQL queries remain compatible

### Migration Benefits

- **Better Separation of Concerns** - Frontend and backend are now independent
- **Modern UI/UX** - React provides better user experience with animations
- **API-First Design** - Backend can now serve multiple clients (web, mobile, etc.)
- **Improved Developer Experience** - Hot reload, modern tooling
- **Better Performance** - Client-side routing, code splitting

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS headers are set (already configured in BaseServlet)
   - Check that frontend proxy is configured correctly in `vite.config.js`

2. **Database Connection Issues**
   - Verify MySQL is running
   - Check environment variables for DB credentials
   - Ensure database `recipeshare` exists

3. **OpenAI API Not Working**
   - The API key is already configured in `config.properties`
   - You can also set `OPENAI_API_KEY` environment variable (takes priority)
   - If neither is set, the app will use mock recipes (still functional)
   - Check server logs for API errors

4. **Port Conflicts**
   - Backend default: `8080`
   - Frontend default: `3000`
   - Update ports in configuration if needed

## 📝 Configuration

### OpenAI API Key

The OpenAI API key is already configured in `config.properties`. The service will check for the key in this order:

1. **Environment Variable** `OPENAI_API_KEY` (highest priority)
2. **System Property** `OPENAI_API_KEY`
3. **config.properties file** (already configured)
4. **Hardcoded default** (fallback)

### Database Configuration

Set environment variables or update `src/util/DBConnection.java`:

```bash
# Environment Variables
DB_URL=jdbc:mysql://localhost:3306/recipeshare?useSSL=false&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=your_password
```

Or update the constants in `DBConnection.java` directly.

## 🚀 Deployment on Render

### Prerequisites
- A [Render](https://render.com) account (free tier available)
- GitHub repository with your code
- MySQL database (can use Render's managed MySQL or external)

### Step 1: Prepare Your Repository

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/RecipeShare.git
   git push -u origin main
   ```

2. **The `render.yaml` file is already configured** in the project root for easy deployment.

### Step 2: Deploy Backend (Java API)

1. **Go to Render Dashboard** → New → Web Service

2. **Connect your GitHub repository**

3. **Configure the service:**
   - **Name**: `recipeshare-api` (or your preferred name)
   - **Environment**: `Java`
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: 
     ```bash
     java -jar target/RecipeShare.war
     ```
     **Note**: If WAR deployment doesn't work, Render may auto-detect and use an embedded server. Alternatively, you can:
     - Leave Start Command empty and let Render auto-detect
     - Or use an embedded servlet container (see DEPLOYMENT.md for details)
   - **Instance Type**: Free (or paid for better performance)

4. **Add Environment Variables:**
   - `DB_URL`: Your MySQL connection string
     ```
     jdbc:mysql://your-db-host:3306/recipeshare?useSSL=true&serverTimezone=UTC
     ```
   - `DB_USERNAME`: Your database username
   - `DB_PASSWORD`: Your database password
   - `OPENAI_API_KEY`: Your OpenAI API key
     ```
     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
     ```

5. **Note the service URL** (e.g., `https://recipeshare-api.onrender.com`)

### Step 3: Set Up Database

**Option A: Render Managed MySQL (Recommended)**

1. **Go to Render Dashboard** → New → PostgreSQL (or MySQL if available)
2. **Create Database:**
   - Name: `recipeshare-db`
   - Plan: Free (or paid)
3. **Get connection details** from the database dashboard
4. **Run the schema:**
   - Use Render's database shell or connect via MySQL client
   - Run `database.sql` to create tables

**Option B: External MySQL Database**

- Use any MySQL provider (AWS RDS, PlanetScale, etc.)
- Update `DB_URL` with your connection string

### Step 4: Deploy Frontend (React App)

1. **Update API URL in frontend:**
   
   Create/update `client/.env.production`:
   ```bash
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

2. **Go to Render Dashboard** → New → Static Site

3. **Configure the service:**
   - **Name**: `recipeshare-frontend`
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/dist`
   - **Environment Variables**:
     - `VITE_API_URL`: `https://your-backend-url.onrender.com/api`

4. **Deploy**

### Step 5: Update CORS Settings (if needed)

If you encounter CORS issues, ensure your backend's `BaseServlet.java` allows your frontend domain:

```java
resp.setHeader("Access-Control-Allow-Origin", "https://your-frontend-url.onrender.com");
```

Or use `*` for development (not recommended for production).

### Step 6: Verify Deployment

1. **Backend Health Check:**
   - Visit: `https://your-backend-url.onrender.com/api/auth/me`
   - Should return JSON (may show "Not authenticated" which is fine)

2. **Frontend:**
   - Visit your frontend URL
   - Try logging in/registering
   - Test recipe creation and AI generator

### Using render.yaml (Alternative Method)

If you prefer using the `render.yaml` file:

1. **Push `render.yaml` to your repository** (already included)

2. **Go to Render Dashboard** → New → Blueprint

3. **Connect your repository**

4. **Render will automatically:**
   - Detect `render.yaml`
   - Create both services
   - Set up environment variables (you'll need to add sensitive ones manually)

5. **Add Environment Variables** in Render dashboard for both services

### Troubleshooting Render Deployment

1. **Build Failures:**
   - Check build logs in Render dashboard
   - Ensure Java 11+ is available (Render auto-detects)
   - Verify Maven dependencies are correct

2. **Database Connection Issues:**
   - Verify database is accessible from Render
   - Check firewall rules if using external database
   - Ensure connection string uses SSL: `useSSL=true`

3. **Frontend Can't Connect to Backend:**
   - Verify `VITE_API_URL` is set correctly
   - Check CORS headers in backend
   - Ensure backend service is running

4. **Service Goes to Sleep (Free Tier):**
   - Free tier services sleep after 15 minutes of inactivity
   - First request after sleep takes ~30 seconds
   - Consider upgrading to paid plan for always-on service

5. **Environment Variables Not Working:**
   - Restart service after adding variables
   - Check variable names match exactly (case-sensitive)
   - Verify variables are set in correct service

### Render-Specific Configuration Files

The project includes:
- `render.yaml` - Blueprint configuration for automatic setup

### Cost Estimation

**Free Tier:**
- Backend: Free (sleeps after inactivity)
- Frontend: Free (always on)
- Database: Free PostgreSQL available (or use external MySQL)

**Paid Tier (Recommended for Production):**
- Backend: $7/month (always on)
- Frontend: Free
- Database: $7/month (managed MySQL)

### Additional Notes

- **Custom Domain**: You can add custom domains in Render dashboard
- **SSL**: Automatically provided by Render
- **Logs**: Access logs in Render dashboard
- **Auto-Deploy**: Automatically deploys on git push (can be disabled)

### Quick Reference

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

**Important Files:**
- `render.yaml` - Render blueprint configuration
- `client/.env.production` - Frontend production environment variables
- `config.properties` - Backend configuration (API key included)

## 🚧 Future Enhancements

- [ ] Image upload functionality
- [ ] Recipe favorites/bookmarks
- [ ] User ratings and reviews
- [ ] Recipe categories and tags
- [ ] Advanced search filters
- [ ] Recipe sharing via social media
- [ ] Email notifications
- [ ] Admin panel for recipe moderation

## 📄 License

This project is open source and available for educational purposes.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- OpenAI for AI recipe recommendations
- React and Vite communities
- All open-source contributors

---

**Enjoy cooking with SmartMeal AI! 👨‍🍳**
