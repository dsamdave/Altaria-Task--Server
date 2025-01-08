import Users from "../../models/userModel";
import Events from "../../models/eventsModel";
import {
    AddEventsParams,
  BookMarkParams,
  EventByLocationParams,
} from "../../types/servicesTypes";

const eventService = {

    addEventService: async ({
        name, type, address, latitude, longitude, description, dateTime
      }: AddEventsParams) => {
        
        const event = new Events({
          name,
          type,
          address,
          coordinates: [longitude, latitude],
          description,
          dateTime
        });
      
        await event.save();
      
        return event;
      },

  eventsByLocation: async ({ latitude, longitude, radius }: EventByLocationParams) => {

    const events = await Events.find({
        'coordinates': {
          $near: {
            $geometry: { type: 'Point', coordinates: [parseFloat(longitude as string), parseFloat(latitude as string)] },
            $maxDistance: parseFloat(radius as string),
          },
        },
      });

    return events
  },


  bookMarkEventService: async ({ id, eventId }: BookMarkParams) => {
    
    const user = await Users.findById(id);
    if (!user) {

        throw new Error("User not found.");
    }

    if (user.bookmarkedEvents.includes(eventId)) {
      throw new Error("Event already bookmarked.");

    }
    
    user.bookmarkedEvents.push(eventId);
    await user.save();

    if (!user) {
      throw new Error("User account not found.");
    }

    return  user ;
  },
};

export default eventService;
