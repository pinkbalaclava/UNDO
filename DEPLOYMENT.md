# UNDO Health App - Deployment Guide

This guide will help you deploy your UNDO health app to various platforms, with a focus on GitHub + Netlify for the best development workflow.

## 🚀 Quick Deploy to Netlify (Recommended)

### **Why Netlify?**
- ✅ **Free hosting** for personal projects
- ✅ **Automatic deployments** from GitHub
- ✅ **Custom domains** support
- ✅ **HTTPS** included automatically
- ✅ **Preview deployments** for testing
- ✅ **Form handling** for contact features

### **Step-by-Step Deployment**

#### 1. **Prepare Your Repository**
```bash
# Ensure your code is committed and pushed to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 2. **Connect to Netlify**
1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click **"New site from Git"**
3. Choose **"GitHub"** as your Git provider
4. Select your **UNDO repository**
5. Configure build settings:
   - **Branch to deploy**: `main`
   - **Build command**: `pnpm run build`
   - **Publish directory**: `dist`

#### 3. **Deploy Settings**
```yaml
# netlify.toml (optional - for advanced configuration)
[build]
  command = "pnpm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 4. **Environment Variables** (if using real Garmin API)
In Netlify dashboard → Site settings → Environment variables:
```bash
VITE_GARMIN_CLIENT_ID=your_client_id
VITE_GARMIN_CLIENT_SECRET=your_client_secret
VITE_API_BASE_URL=https://apis.garmin.com
```

#### 5. **Custom Domain** (Optional)
1. In Netlify dashboard → Domain settings
2. Add your custom domain
3. Configure DNS records as instructed
4. SSL certificate will be automatically provisioned

### **Result**
Your app will be live at: `https://your-site-name.netlify.app`

---

## 🔄 Alternative Deployment Options

### **Vercel**
Perfect for React applications with excellent performance:

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel auto-detects React/Vite settings

2. **Build Configuration**
   ```json
   {
     "buildCommand": "pnpm run build",
     "outputDirectory": "dist",
     "framework": "vite"
   }
   ```

3. **Deploy**
   - Automatic deployment on every push
   - Preview URLs for pull requests
   - Custom domains supported

### **GitHub Pages**
Free hosting directly from your GitHub repository:

1. **Build for Production**
   ```bash
   pnpm run build
   ```

2. **Deploy to gh-pages**
   ```bash
   # Install gh-pages
   npm install -g gh-pages
   
   # Deploy dist folder
   gh-pages -d dist
   ```

3. **Configure Repository**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages`

### **Traditional Web Hosting**
For shared hosting or VPS:

1. **Build the Application**
   ```bash
   pnpm run build
   ```

2. **Upload Files**
   - Upload entire `dist` folder contents
   - Ensure server supports SPA routing
   - Configure `.htaccess` for Apache:
   ```apache
   RewriteEngine On
   RewriteBase /
   RewriteRule ^index\.html$ - [L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```

---

## 🔧 Production Configuration

### **Environment Setup**
Create production environment variables:

```bash
# .env.production
VITE_APP_ENV=production
VITE_API_BASE_URL=https://your-api-domain.com
VITE_GARMIN_CLIENT_ID=your_production_client_id
```

### **Build Optimization**
The app is already optimized for production:

- ✅ **Code splitting** - Automatic chunk splitting
- ✅ **Tree shaking** - Unused code removal
- ✅ **Asset optimization** - Image and CSS minification
- ✅ **Bundle analysis** - Use `pnpm run build --analyze`

### **Performance Monitoring**
Add performance monitoring (optional):

```javascript
// src/lib/analytics.js
export const trackPageView = (page) => {
  // Add your analytics service
  // Google Analytics, Mixpanel, etc.
}
```

---

## 🔐 Security Considerations

### **API Keys**
- ✅ **Never commit** API keys to repository
- ✅ **Use environment variables** for all secrets
- ✅ **Rotate keys regularly** in production
- ✅ **Restrict API domains** in Garmin developer console

### **HTTPS**
- ✅ **Always use HTTPS** in production
- ✅ **Netlify/Vercel** provide automatic SSL
- ✅ **Custom domains** get free SSL certificates

### **Content Security Policy**
Add CSP headers for enhanced security:

```html
<!-- In index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;">
```

---

## 📊 Monitoring & Analytics

### **Health Checks**
Monitor your deployed app:

```javascript
// src/lib/healthCheck.js
export const checkAppHealth = async () => {
  try {
    // Check API connectivity
    // Verify core features
    return { status: 'healthy' }
  } catch (error) {
    return { status: 'error', error: error.message }
  }
}
```

### **Error Tracking**
Consider adding error tracking:

- **Sentry** - Comprehensive error monitoring
- **LogRocket** - Session replay and debugging
- **Bugsnag** - Error reporting and alerting

### **Performance Metrics**
Track Core Web Vitals:

```javascript
// src/lib/performance.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)
```

---

## 🔄 CI/CD Pipeline

### **GitHub Actions** (Advanced)
Automate testing and deployment:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Netlify

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'pnpm'
    
    - name: Install dependencies
      run: pnpm install
    
    - name: Run tests
      run: pnpm run test
    
    - name: Build application
      run: pnpm run build
    
    - name: Deploy to Netlify
      uses: netlify/actions/cli@master
      with:
        args: deploy --prod --dir=dist
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## 🚨 Troubleshooting

### **Common Issues**

#### **Build Failures**
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Check Node.js version
node --version  # Should be 18+
```

#### **Routing Issues**
Ensure your hosting platform supports SPA routing:
- **Netlify**: Automatic with `_redirects` file
- **Vercel**: Automatic detection
- **Apache**: Requires `.htaccess` configuration

#### **Environment Variables**
```bash
# Check if variables are loaded
console.log(import.meta.env.VITE_API_BASE_URL)

# Ensure variables start with VITE_
VITE_MY_VARIABLE=value  # ✅ Accessible
MY_VARIABLE=value       # ❌ Not accessible
```

#### **Asset Loading**
```javascript
// Use relative paths for assets
import logo from './assets/logo.png'  // ✅ Correct
import logo from '/assets/logo.png'   // ❌ May fail in subdirectories
```

### **Performance Issues**
```bash
# Analyze bundle size
pnpm run build --analyze

# Check for large dependencies
npx bundle-analyzer dist/assets/*.js
```

---

## 📈 Scaling Considerations

### **CDN Integration**
For global performance:
- **Netlify CDN** - Included automatically
- **Cloudflare** - Additional caching layer
- **AWS CloudFront** - Enterprise-grade CDN

### **Database Integration**
When ready to add backend:
- **Supabase** - PostgreSQL with real-time features
- **Firebase** - Google's backend-as-a-service
- **PlanetScale** - Serverless MySQL platform

### **API Gateway**
For production API management:
- **Netlify Functions** - Serverless functions
- **Vercel Functions** - Edge computing
- **AWS API Gateway** - Enterprise API management

---

## ✅ Deployment Checklist

### **Pre-Deployment**
- [ ] All features tested locally
- [ ] Environment variables configured
- [ ] Build process successful
- [ ] No console errors or warnings
- [ ] Responsive design verified
- [ ] Accessibility tested

### **Post-Deployment**
- [ ] App loads correctly on live URL
- [ ] All navigation works
- [ ] Forms submit properly
- [ ] Images and assets load
- [ ] Mobile experience tested
- [ ] Performance metrics checked

### **Production Monitoring**
- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Uptime monitoring setup
- [ ] SSL certificate valid
- [ ] Custom domain configured (if applicable)

---

## 🎯 Next Steps

After successful deployment:

1. **Share your app** - Get feedback from users
2. **Monitor performance** - Track Core Web Vitals
3. **Iterate based on feedback** - Continuous improvement
4. **Scale as needed** - Add backend services
5. **Consider mobile app** - React Native or native development

Your UNDO health app is now ready for the world! 🚀

---

**Need Help?** 
- Check the [troubleshooting section](#-troubleshooting)
- Review [Netlify documentation](https://docs.netlify.com/)
- Open an issue in the GitHub repository

