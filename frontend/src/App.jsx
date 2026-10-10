import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import { OrganizerAuthProvider } from './context/OrganizerAuthContext';

function App() {
  return (
    <OrganizerAuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #334155'
          }
        }}
      />
      <AppRoutes />
    </OrganizerAuthProvider>
  );
}

export default App;
