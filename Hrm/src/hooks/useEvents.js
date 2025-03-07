import { useContext } from 'react';
import EventContext from '../contexts/EventContext';

export const useEvents = () => {
  const { state, addEvent, deleteEvent } = useContext(EventContext);

  return {
    events: state.events,
    loading: state.loading,
    error: state.error,
    addEvent,
    deleteEvent,
  };
};
