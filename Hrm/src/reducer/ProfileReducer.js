export const initialState = {
    profileData: {
      role:'',
      personalInfo: {
        firstName: '',
        lastName: '',
        DOB: '',
        gender: '',
        email: '',
        phone: '',
        address: {
          street: '',
          city: '',
          state: '',
          pincode: '',
          photo: ''
        },
        
      },
      professionalInfo: {
        bio: '',
        jobTitle: '',
        joiningDate: '',
        salary: '',
        department: ''
      }
    },
    loading: true,
    error: null,
  };
  
    
    export const profileReducer = (state, action) => {
      switch (action.type) {
        case "SET_PROFILE_DATA":
          return { ...state, profileData: action.payload, loading: false };
          case "SET_LOADING":
            return { ...state, loading: action.payload };
          case "SET_ERROR":
            return { ...state, error: action.payload, loading: false };
          case "SET_PROFILE_IMAGE":
            return { 
              ...state, 
              profileData: {
                ...state.profileData,
                personalInfo: {
                  ...state.profileData.personalInfo,
                  photo: action.payload
                }
              }
            };
      }
    };
    