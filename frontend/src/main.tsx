import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './app.tsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
<<<<<<< HEAD
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider> 
||||||| parent of bbe4021 (setup react query)
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
=======
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
>>>>>>> bbe4021 (setup react query)
  </StrictMode>
);
