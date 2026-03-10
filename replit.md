# Growth Lane - Ebook Hosting Platform

Growth Lane is a full-stack production-ready website for hosting free downloadable ebooks.

## How to Access the Admin Dashboard

1. Navigate to `/login` manually in the browser (this page is hidden from the main navigation).
2. Use your admin credentials:
   - **Username**: `Archus`
   - **Password**: `Archus32727`
3. After logging in, you will be redirected to the Admin Dashboard (`/admin`).

## How to Add New Ebooks

1. Log in to the Admin Dashboard (see above).
2. Navigate to the **Admin Dashboard** (`/admin`).
3. Fill out the "Upload New Ebook" form with the ebook's Title, Description, Cover Image, and PDF File.
4. Click "Upload Ebook". The ebook will immediately be available in the Ebook Library and its files will be stored on the server.

## How to Edit the Site Later

- **Adding new features**: You can add new tables to `shared/schema.ts` and their corresponding API routes in `server/routes.ts` and `shared/routes.ts`. 
- **Modifying the UI**: The frontend code is built using React and TailwindCSS. You can modify pages under `client/src/pages/` and components under `client/src/components/`. 
- **Styling**: Open `client/src/index.css` to change the global color scheme (it uses HSL variables for easy theming).
- **Database**: Run `npm run db:push` to sync any schema changes you make to the PostgreSQL database.

*Note: The platform tracks page views and ebook downloads automatically. You can view these analytics within the Admin Dashboard.*
