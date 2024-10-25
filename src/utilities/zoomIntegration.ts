import axios from "axios";
import ZoomVariables  from "../models/appointment/ZoomVariablesModel";

export const getZoomMeetingLink = async ( meetingTitle: string,
    startTime: string, meetingAgenda: string ) => {
    try {
      const zoomVariables = await ZoomVariables.findOne();
  
      if (zoomVariables && zoomVariables.zoomRefreshToken) {
        const refresh_token = zoomVariables.zoomRefreshToken;
  
        const response = await axios.post("https://zoom.us/oauth/token", null, {
          params: {
            grant_type: "refresh_token",
            refresh_token,
          },
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
            ).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
  
  
        zoomVariables.zoomRefreshToken = refresh_token
        await zoomVariables.save()
  
  
        const accessToken =  response.data.access_token
  
        const formattedStartTime = new Date(startTime).toISOString()
  
        const zoomMeeting = await axios.post(
          "https://api.zoom.us/v2/users/me/meetings",
          {
            topic: `${meetingTitle}`,
            type: 2,
            timezone: "UTC",
            start_time: `${formattedStartTime}`, 
            duration: 30,
            agenda: `${meetingAgenda}`,
  
            settings: {
              host_video: true,
              participant_video: true,
              join_before_host: true,
              mute_upon_entry: true,
              watermark: false,
              use_pmi: false,
              approval_type: 0,
              audio: "both",
              auto_recording: "none",
            },
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
    
        const zoomMeetingLink = zoomMeeting.data.join_url;
    
        return  zoomMeetingLink ;
  
  
      }
    } catch (error) {
      console.error("Error getting Zoom meeting link:", error);
      throw error;
    }
  };