import React, { createContext, useReducer, useEffect } from 'react';
import { saveData, loadData } from '../utils/storage';
import notifee, { AndroidImportance, TimestampTrigger, TriggerType } from '@notifee/react-native';
import { AppState } from 'react-native';

export const TimerContext = createContext();

const initialState = {
  timers: [],
  history: [],
};

function timerReducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;

    case 'ADD_TIMER':
      return { ...state, timers: [...state.timers, action.payload] };

    case 'UPDATE_TIMER':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.id === action.payload.id ? { ...timer, ...action.payload } : timer
        ),
      };

    case 'RESET_TIMERS_BY_CATEGORY':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.category === action.payload
            ? { ...timer, remaining: timer.duration, status: 'Paused', startTimestamp: null }
            : timer
        ),
      };

    case 'RESET_ALL':
      return initialState;

    case 'TICK': {
      const now = Date.now();
      const updatedTimers = state.timers.map(timer => {
        if (timer.status === 'Running' && timer.startTimestamp) {
          const elapsed = Math.floor((now - timer.startTimestamp) / 1000);
          const remaining = Math.max(timer.duration - elapsed, 0);
          return {
            ...timer,
            remaining,
            status: remaining === 0 ? 'Completed' : 'Running',
          };
        }
        return timer;
      });

      const completedTimers = updatedTimers.filter(t => t.status === 'Completed');
      const newHistory = [...state.history];
      completedTimers.forEach(t => {
        if (!state.history.find(h => h.id === t.id)) {
          newHistory.push({ ...t, completedAt: new Date().toISOString() });
        }
      });

      return {
        ...state,
        timers: updatedTimers.filter(t => t.status !== 'Completed'),
        history: newHistory,
      };
    }

    default:
      return state;
  }
}

export const TimerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  useEffect(() => {
    (async () => {
      const savedState = await loadData('timer-state');
      if (savedState) {
        dispatch({ type: 'LOAD_STATE', payload: savedState });
      }
    })();
  }, []);

  useEffect(() => {
    saveData('timer-state', state);
  }, [state]);

  useEffect(() => {
    (async () => {
      await notifee.requestPermission();
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
    })();
  }, []);

  // Poll every second to keep UI updated
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addTimer = (timer) => dispatch({ type: 'ADD_TIMER', payload: timer });

  const startTimer = async (id) => {
    const timer = state.timers.find(t => t.id === id);
    if (timer) {
      const startTimestamp = Date.now();
      const endTimestamp = startTimestamp + timer.remaining * 1000;

      await notifee.createTriggerNotification(
        {
          title: 'Timer Completed',
          body: `${timer.name} (${timer.category}) is done!`,
          android: {
            channelId: 'default',
            smallIcon: 'ic_launcher',
          },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: endTimestamp,
          alarmManager: {
            allowWhileIdle: true,
          },
        }
      );

      dispatch({ type: 'UPDATE_TIMER', payload: { id, status: 'Running', startTimestamp } });
    }
  };

  const pauseTimer = async (id) => {
    const timer = state.timers.find(t => t.id === id);
    if (timer && timer.status === 'Running') {
      const elapsed = Math.floor((Date.now() - timer.startTimestamp) / 1000);
      const newRemaining = timer.remaining - elapsed;
      dispatch({
        type: 'UPDATE_TIMER',
        payload: { id, remaining: Math.max(newRemaining, 0), status: 'Paused', startTimestamp: null },
      });
      await notifee.cancelAllNotifications();
    }
  };

  const resetTimer = async (id) => {
    const timer = state.timers.find(t => t.id === id);
    if (timer) {
      dispatch({
        type: 'UPDATE_TIMER',
        payload: { id, remaining: timer.duration, status: 'Paused', startTimestamp: null },
      });
      await notifee.cancelAllNotifications();
    }
  };

  const startAllInCategory = (category) => {
    state.timers
      .filter(t => t.category === category)
      .forEach(t => startTimer(t.id));
  };

  const pauseAllInCategory = (category) => {
    state.timers
      .filter(t => t.category === category)
      .forEach(t => pauseTimer(t.id));
  };

  const resetAllInCategory = (category) => {
    state.timers
      .filter(t => t.category === category)
      .forEach(t => resetTimer(t.id));
  };

  return (
    <TimerContext.Provider
      value={{
        timers: state.timers,
        history: state.history,
        addTimer,
        startTimer,
        pauseTimer,
        resetTimer,
        startAllInCategory,
        pauseAllInCategory,
        resetAllInCategory,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
