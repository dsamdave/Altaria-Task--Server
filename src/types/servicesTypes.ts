

export interface RegisterUserParams {
    email?: string;
    phoneNumber?: string;
    password: string;

  }
  export interface LoginUserParams {
    identifier: string;
    password: string;
  }

  export interface UserInfoParams {
    id: string;
  }
  export interface BookMarkParams {
    id: string;
    eventId: string;
  }


  export interface AddEventsParams {
    name: string 
    type: string 
    address: string 
    latitude: number 
    longitude: number 
    description: string 
    dateTime: string

  }
  export interface EventByLocationParams {
    latitude: string 
    longitude: string 
    radius: string

  }

  