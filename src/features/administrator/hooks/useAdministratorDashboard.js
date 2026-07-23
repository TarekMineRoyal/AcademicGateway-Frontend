import { useState, useEffect } from 'react';
import { getAdministratorDashboardData } from '../administratorApi';

/**
 * Custom hook encapsulating Administrator dashboard state and base data fetching logic.
 */
export function useAdministratorDashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getAdministratorDashboardData()
      .then((result) => {
        if (isMounted) {
          setData(result);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    data,
    isLoading,
    error,
  };
}