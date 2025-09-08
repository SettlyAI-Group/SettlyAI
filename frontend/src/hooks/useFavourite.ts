import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
type UseFavouriteReturn = {
  isAuthed: boolean;
  isSaved: boolean;
  isLoading: boolean;
  isToggling: boolean;
  message: string | null;
  handlebuttonClick: () => void;
};
interface SingleResponse {
  isSaved: boolean;
  notes?: string;
  priority?: number;
}
interface ToggleResponse {
  isSaved: boolean;
}
export const useFavourite = (targetType: string, targetId: string | number): UseFavouriteReturn => {
  const [isAuthed, setIsAuthed] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isToggling, setIsToggling] = useState<boolean>(false);
  const navigate = useNavigate();
  const AUTH_TOKEN_KEY = 'token';
  const getTokenAndFetch = async <T>(
    endpoint: string,
    method: string = 'GET',
    body: object | null = null
  ): Promise<T> => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      navigate('/login');
      throw new Error('User not authenticated. Token not found.');
    }
    const response = await fetch(`http://localhost:5100/api/Favourite/${endpoint}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: body === null ? null : JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.statusText}`);
    }
    const data = await response.json();
    return data as T;
  };
  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    setIsAuthed(token !== null && token !== '');
  }, []);
  useEffect(() => {
    const fetchFavouriteStatus = async () => {
      if (isAuthed && targetId) {
        setIsLoading(true);
        try {
          const response = await getTokenAndFetch<SingleResponse>(
            `single?targetType=${targetType}&targetId=${targetId}`
          );
          setIsSaved(response.isSaved);
        } catch (error) {
          console.error('Error fetching favourite status:', error);
          setIsSaved(false);
        } finally {
          setIsLoading(false);
        }
      } else if (!isAuthed) {
        setIsSaved(false);
        setIsLoading(false);
      }
    };
    fetchFavouriteStatus();
  }, [isAuthed, targetId, targetType]);
  // avoid rapid toggling
  const ensureToggle = async () => {
    if (!isToggling) {
      setIsToggling(true);
      try {
        const endpoint = `toggle?userId=2`;
        const newStatus = await getTokenAndFetch<ToggleResponse>(endpoint, 'POST', { targetType, targetId });
        setIsSaved(newStatus.isSaved);
      } catch (error) {
        console.error('Error toggling favourite status:', error);
      } finally {
        setIsToggling(false);
      }
    }
  };
  // const ensureToggle = async () => {
  //   if (isToggling) return;
  //   setIsToggling(true);
  //   try {
  //     const id = typeof targetId === 'string' ? Number(targetId) : targetId;

  //     const endpoint = `toggle?userId=2`;

  //     const newStatus = await getTokenAndFetch<ToggleResponse>(
  //       endpoint,
  //       'POST',
  //       { targetType, targetId: id, notes: 'ui-test', priority: 1 }
  //     );
  //     setIsSaved(newStatus.isSaved);
  //   } catch (e) {
  //     console.error('Error toggling favourite status:', e);
  //     setMessage('Toggle failed. Please try again.');
  //   } finally {
  //     setIsToggling(false);
  //   }
  // };
  const handlebuttonClick = (): void => {
    setMessage(null);
    if (!isAuthed) {
      setMessage('Please log in.');
      setTimeout(() => navigate('/login'), 1000);
      return;
    }
    ensureToggle();
  };
  return {
    isAuthed,
    isSaved,
    isLoading,
    isToggling,
    message,
    handlebuttonClick,
  };
};
