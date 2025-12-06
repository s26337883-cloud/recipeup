# Deployment Guide for Render

This guide provides step-by-step instructions for deploying SmartMeal AI on Render.

## Quick Start

1. Push your code to GitHub
2. Connect repository to Render
3. Deploy backend service
4. Deploy frontend service
5. Configure environment variables
6. Set up database

## Detailed Steps

### 1. Prepare Your Code

Ensure all files are committed and pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Deploy Backend Service

#### Option A: Using Render Dashboard

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `recipeshare-api`
   - **Environment**: `Java`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave empty (root)
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: 
     ```bash
     java -jar target/RecipeShare.war
     ```
     **Note**: If this doesn't work, Render may auto-detect and use an embedded server. Check build logs.

5. **Add Environment Variables**:
   - `DB_URL`: `jdbc:mysql://your-db-host:3306/recipeshare?useSSL=true&serverTimezone=UTC`
   - `DB_USERNAME`: Your database username
   - `DB_PASSWORD`: Your database password
   - `OPENAI_API_KEY`: `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`

6. Click **Create Web Service**

7. **Note the service URL** (e.g., `https://recipeshare-api.onrender.com`)

#### Option B: Using render.yaml (Blueprint)

1. Ensure `render.yaml` is in your repository root
2. Go to Render Dashboard → **New** → **Blueprint**
3. Connect your repository
4. Render will auto-detect `render.yaml` and create services
5. Add environment variables manually in each service

### 3. Set Up Database

#### Option A: Render Managed Database

1. Go to Render Dashboard → **New** → **PostgreSQL** (or MySQL if available)
2. Configure:
   - **Name**: `recipeshare-db`
   - **Database**: `recipeshare`
   - **User**: Auto-generated
   - **Password**: Auto-generated
   - **Plan**: Free (or paid)

3. **Get Connection Details**:
   - Internal Database URL (for Render services)
   - External Database URL (for local access)

4. **Update Backend Environment Variables**:
   - Use the Internal Database URL for `DB_URL`
   - Use provided username and password

5. **Initialize Database**:
   - Go to database dashboard → **Connect** → **Shell**
   - Or use external MySQL client
   - Run `database.sql` to create tables

#### Option B: External MySQL Database

Use any MySQL provider:
- AWS RDS
- PlanetScale
- DigitalOcean Managed Database
- etc.

Update `DB_URL` with your connection string.

### 4. Deploy Frontend Service

1. Go to Render Dashboard → **New** → **Static Site**

2. Configure:
   - **Name**: `recipeshare-frontend`
   - **Repository**: Same GitHub repository
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/dist`

3. **Add Environment Variable**:
   - `VITE_API_URL`: `https://your-backend-url.onrender.com/api`
   - Replace `your-backend-url` with your actual backend service URL

4. Click **Create Static Site**

5. **Note the frontend URL** (e.g., `https://recipeshare-frontend.onrender.com`)

### 5. Update CORS (if needed)

If you encounter CORS errors:

1. Update `src/servlet/BaseServlet.java`:
   ```java
   resp.setHeader("Access-Control-Allow-Origin", "https://your-frontend-url.onrender.com");
   ```

2. Or temporarily use `*` for development (not recommended for production)

3. Redeploy backend service

### 6. Verify Deployment

1. **Backend Health Check**:
   ```
   https://your-backend-url.onrender.com/api/auth/me
   ```
   Should return JSON (may show "Not authenticated" - that's fine)

2. **Frontend**:
   - Visit your frontend URL
   - Try registering a new account
   - Test recipe creation
   - Test AI recipe generator

## Troubleshooting

### Backend Issues

**Build Fails:**
- Check build logs in Render dashboard
- Ensure Java 11+ is available
- Verify Maven dependencies in `pom.xml`

**WAR File Not Starting:**
- Render may need embedded servlet container
- Consider using Spring Boot wrapper (future enhancement)
- Check start command in service settings

**Database Connection Fails:**
- Verify database is accessible from Render
- Check connection string format
- Ensure `useSSL=true` for external databases
- Check firewall rules

### Frontend Issues

**Can't Connect to Backend:**
- Verify `VITE_API_URL` is set correctly
- Check backend service is running
- Verify CORS headers

**Build Fails:**
- Check Node.js version (Render auto-detects)
- Verify `package.json` dependencies
- Check build logs

### Service Sleeps (Free Tier)

- Free tier services sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- Consider upgrading to paid plan for always-on

## Environment Variables Reference

### Backend Service

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_URL` | MySQL connection string | `jdbc:mysql://host:3306/recipeshare?useSSL=true` |
| `DB_USERNAME` | Database username | `admin` |
| `DB_PASSWORD` | Database password | `secure_password` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-proj-...` |

### Frontend Service

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://recipeshare-api.onrender.com/api` |

## Custom Domain Setup

1. Go to service settings → **Custom Domains**
2. Add your domain
3. Update DNS records as instructed
4. SSL certificate is auto-provisioned

## Auto-Deploy

By default, Render auto-deploys on every git push to the connected branch.

To disable:
- Go to service settings → **Auto-Deploy** → Disable

## Monitoring

- **Logs**: Available in service dashboard
- **Metrics**: Available on paid plans
- **Alerts**: Configure in service settings

## Cost Optimization

**Free Tier:**
- Backend: Free (sleeps after inactivity)
- Frontend: Free (always on)
- Database: Free PostgreSQL available

**Paid Tier:**
- Backend: $7/month (always on)
- Database: $7/month (managed MySQL)
- Better performance and no sleep

## Security Best Practices

1. **Never commit** `.env` files or `config.properties` with real keys
2. Use Render's environment variables for secrets
3. Enable SSL (automatic on Render)
4. Use strong database passwords
5. Regularly rotate API keys
6. Monitor service logs for suspicious activity

## Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- Check service logs for detailed error messages


