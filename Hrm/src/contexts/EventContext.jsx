import React, { createContext, useReducer, useEffect } from 'react';
import { firestore } from '../services/firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { eventReducer ,initialState} from '../reducer/EventReducer';

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [state, dispatch] = useReducer(eventReducer, initialState);

  useEffect(() => {
    const eventsCollectionRef = collection(firestore, 'events');
    const unsubscribe = onSnapshot(eventsCollectionRef, (snapshot) => {
      const eventData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      // console.log('Fetched Events:', eventData); // Log fetched data
      dispatch({ type: 'SET_EVENTS', payload: eventData });
    });

    return () => unsubscribe();
  }, []);

  const addEvent = async (event) => {
    try {
      const eventsCollectionRef = collection(firestore, 'events');
      await addDoc(eventsCollectionRef, event);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const deleteEvent = async (id) => {
    try {
      const eventDoc = doc(firestore, 'events', id);
      await deleteDoc(eventDoc);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <EventContext.Provider value={{ state, addEvent, deleteEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export default EventContext;
