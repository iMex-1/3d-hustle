import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './styles/design-system.css';

function App() {
  return <RouterProvider router={router} fallbackElement={<AppFallback />} />;
}

function AppFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading application...</p>
      </div>
    </div>
  );
}

export default App;
