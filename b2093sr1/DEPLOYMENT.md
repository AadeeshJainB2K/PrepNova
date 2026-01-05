# Deployment Guide for HackBoiler to Vercel

Follow these steps to deploy the application to Vercel.

## Prerequisites
1. **GitHub Account**: The code should be pushed to a GitHub repository.
2. **Vercel Account**: Account on [vercel.com](https://vercel.com).
3. **Neon Database**: A PostgreSQL database on [neon.tech](https://neon.tech).
4. **Google Cloud Console**: For Google Auth and Gemini API keys.
5. **Verified Domain (Optional)**: If you aren't using the default `.vercel.app` domain.

## Step 1: Database Setup

Before deploying the app, ensure your production database has the correct schema.

1. Obtain your **Production Database Connection String** from Neon.
   - It usually looks like: `postgresql://neondb_owner:password@ep-something.aws.neon.tech/neondb?sslmode=require`

2. Run the migration from your local machine targeting the production database:
   ```bash
   # Replace with your ACTUAL production connection string
   DATABASE_URL='YOUR_PRODUCTION_NEON_DB_URL' npm run db:push
   ```
   *This command pushes the local schema structure to your remote database.*

3. (Optional) set yourself as admin if needed:
   ```bash
   # Replace with your ACTUAL production connection string
   DATABASE_URL='YOUR_PRODUCTION_NEON_DB_URL' npx tsx scripts/set-admin.ts
   ```

## Step 2: Configure Environment Variables

Collect the following values. You will need to enter these in Vercel.

| Variable Name | Description | Example / Instructions |
|h--- |--- |--- |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID | From Google Cloud Console |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret | From Google Cloud Console |
| `AUTH_SECRET` | Secret for NextAuth encryption | Generate with `npx auth secret` or internal usage |
| `NEXTAUTH_URL` | The URL of your deployed app | e.g., `https://your-project-name.vercel.app` |
| `NEXTAUTH_SECRET` | Same as `AUTH_SECRET` | Ensure this matches `AUTH_SECRET` |
| `DATABASE_URL` | Neon Database Connection String | `postgresql://...@...neon.tech/neondb?sslmode=require` |
| `GOOGLE_GENERATIVE_AI_API_KEY` | API Key for Gemini AI | From Google AI Studio |

## Step 3: Deploy on Vercel

1. **Log in to Vercel** and go to your Dashboard.
2. Click **"Add New..."** -> **"Project"**.
3. **Import** the GitHub repository containing this project.
4. In the **"Configure Project"** screen:
   - **Framework Preset**: standard `Next.js` is usually automatically detected.
   - **Root Directory**: `./` (default).
   - **Build Command**: `next build` (default).
   - **Install Command**: `npm install` (default).
5. **Environment Variables**:
   - Expand the "Environment Variables" section.
   - Add all the variables listed in Step 2.
6. Click **"Deploy"**.

## Step 4: Post-Deployment

1. Wait for Vercel to build and start the application.
2. Once deployed, visit the URL (e.g., `https://your-project.vercel.app`).
3. **Important**: You must update the **Authorized redirect URIs** in your **Google Cloud Console** (OAuth configuration) to include your new Vercel domain:
   - Add: `https://your-project.vercel.app/api/auth/callback/google`

## Alternative: Deploy via CLI

If you prefer using the command line instead of the Vercel Dashboard, follow these steps:

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Initialize and Deploy (Preview)**:
   Run the deploy command from the project root:
   ```bash
   vercel
   ```
   - Follow the prompts (Select scope, Link to existing project? [No], Project Name, etc.).
   - This will deploy a **Preview** version.

4. **Set Environment Variables via CLI**:
   You can set environment variables using the CLI:
   ```bash
   vercel env add <VARIABLE_NAME>
   ```
   *You will be prompted to enter the value and select the environment (Production, Preview, Development).*
   
   Repeat this for all variables listed in Step 2.

   *Alternatively, you can just go to the Vercel Dashboard for the newly created project and add them in Settings > Environment Variables, which is often easier.*

5. **Deploy to Production**:
   Once verified, deploy to production:
   ```bash
   vercel --prod
   ```

## Troubleshooting
- **Google Sign-in Error**: Check if `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` are correct and if the redirect URI is added in Google Console.
- **Database Error**: Ensure `DATABASE_URL` is correct and the IP/access settings on Neon allow connections (Neon usually allows all by default).
- **AI Not Responding**: Verify `GOOGLE_GENERATIVE_AI_API_KEY`.
