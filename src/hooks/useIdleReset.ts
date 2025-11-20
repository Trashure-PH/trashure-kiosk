import { useIdleTimer } from 'react-idle-timer';
import { useNavigate, useLocation } from 'react-router-dom';

export const useIdleReset = (timeout = 60000) => {
    const navigate = useNavigate();
    const location = useLocation();

    const onIdle = () => {
        // Only reset if not already on the home/attract screen
        if (location.pathname !== '/') {
            console.log('User is idle, resetting to Attract Screen');
            navigate('/');
            // Ideally, we would also reset any global state here (e.g., cart, points)
        }
    };

    return useIdleTimer({
        onIdle,
        timeout,
        throttle: 500
    });
};
