# Blog Platform Client

This is the client-side (frontend) application for a full-stack blog platform. It allows users to create, edit, view, and manage blog posts, categories, tags, and comments. The project is built with React and TypeScript.

## Features

- User authentication (login, register, profile)
- Create, edit, and delete blog posts
- Rich text editing for post content
- Category and tag management
- Commenting system
- Featured posts and post listing
- Responsive design with modern UI components

## Tech Stack

- **React** with **TypeScript**
- **Zustand** for state management
- **React Router** for routing
- **Tailwind CSS** for styling
- **API**: Communicates with a RESTful backend

## Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/your-blog-client.git
   cd your-blog-client
   ```

2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

3. Configure environment variables:

   Create a `.env` file in the root directory and set the API base URL:
   ```
   VITE_API_BASE_URL=http://localhost:3000
   ```

### Running the App

```sh
npm run dev
# or
yarn dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) (or the port specified in your Vite config).

## Project Structure

```
src/
  components/      # Reusable UI components
  pages/           # Route-based pages (Profile, Posts, etc.)
  services/        # API service modules
  stores/          # Zustand state stores
  types/           # TypeScript types and interfaces
  App.tsx          # Main app component
```

## Customization

- Update API endpoints in `src/services/api.ts` if your backend URL or routes differ.
- Adjust theme and styles in `tailwind.config.js` and CSS files.

## License

[MIT](LICENSE)

---

**Note:**  
This project is the frontend only. For full functionality, you need to run the backend API server as well.