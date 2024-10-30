## 🔀 Devpad

Devpad is a real-time collaborative coding environment that allows developers to join virtual rooms and code together seamlessly.

### ⚙️ Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Express.js, Socket.IO

### Local Setup

#### Frontend

1. Clone the repository:

```bash
git clone https://github.com/aviralj02/devpad.git
cd devpad/client
```

2. Install dependencies:

```bash
yarn install
```

3. Create a `.env` file in the client directory with the following content:

```bash
NEXT_PUBLIC_BACKEND_URL=
```

4. Start the development server:

```bash
yarn dev
```

#### Backend

1. Navigate to the backend directory:

```bash
cd ../server
```

2. Install dependencies:

```bash
yarn install
```

3. Create a `.env` file in the server directory with the following content:

```bash
PORT=
```

4. Start the backend server:

```bash
yarn dev
```

### Deployment

- **Frontend**: [Vercel](https://vercel.com)
- **Backend**: [Render](https://render.com/)

### Production

Visit [https://devpad-inky.vercel.app](https://devpad-inky.vercel.app/) to see the live application.
