export const initialState = {
    events: [],
    loading: true,
    error: null,
  };
  
  export const eventReducer = (state, action) => {
    switch (action.type) {
      case 'SET_EVENTS':
        return { ...state, events: action.payload, loading: false };
      case 'ADD_EVENT':
        return { ...state, events: [...state.events, action.payload] };
      case 'DELETE_EVENT':
        return {
          ...state,
          events: state.events.filter((event) => event.id !== action.payload),
        };
      case 'SET_ERROR':
        return { ...state, error: action.payload, loading: false };
      default:
        return state;
    }
  };
  