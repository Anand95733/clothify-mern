# Deployment Guide

You can deploy this backend to **Render** (recommended for persistent servers) or **Vercel** (serverless).

## Option 1: Deploy to Render (Recommended)

Since you have a monorepo (both `frontend` and `backend` in one repo):

1.  **Push your code to GitHub**.
    *   Ensure your repo structure is:
        ```
        my-repo/
        ├── backend/
        │   ├── package.json
        │   └── ...
        └── frontend/
        ```

2.  **Create a Web Service on Render**.
    *   Go to [dashboard.render.com](https://dashboard.render.com/).
    *   Click **New +** -> **Web Service**.
    *   Connect your GitHub repository.

3.  **Configure Settings**.
    *   **Root Directory**: `backend` (Important!)
    *   **Runtime**: Node
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`

4.  **Environment Variables**.
    *   Add the following variables in the "Environment" tab:
        *   `NODE_ENV`: `production`
        *   `MONGO_URI`: `mongodb+srv://goudanand19:Anand7416@clothify.dwnyr6e.mongodb.net/clothify?retryWrites=true&w=majority&appName=clothify`
        *   `JWT_SECRET`: `LEkWgBSZ+9ciOluRTvyJV1MiXk6wg3egCNqUoMul1bQ=` (Generated secure key)
        *   `SERVER_URL`: `https://your-app-name.onrender.com` (Update this after creation)

5.  **Deploy**.
    *   Click **Create Web Service**.

## Option 2: Deploy to Vercel

1.  **Install Vercel CLI** (optional) or use the dashboard.
    *   `npm i -g vercel`

2.  **Deploy from CLI**:
    *   Navigate to the backend folder: `cd backend`
    *   Run `vercel`
    *   Follow the prompts.

3.  **Deploy via Dashboard (Git Integration)**:
    *   Import the repository.
    *   **Edit Settings** > **Root Directory**: `backend`.
    *   Deploy.

4.  **Environment Variables**.
    *   Go to the Vercel dashboard for your project.
    *   Settings -> Environment Variables.
    *   Add `MONGO_URI`, `JWT_SECRET`, etc.

## Post-Deployment

*   **Swagger**: Visit `/api-docs` on your deployed URL to test the API.
*   **Frontend**: When deploying your frontend, update its API base URL to point to this deployed backend URL.
