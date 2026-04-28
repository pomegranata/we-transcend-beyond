const webhookUrl = ""; // insert webhook url here
const discordUserId = ""; // insert discord id here

function sendEventReminder() {
  // --- CONFIGURATION ---
  const calendarId = "primary"; 
  
  // --- TIME WINDOW SETUP ---
  const now = new Date();
  
  // We will look for events starting exactly between 60 minutes and 75 minutes from now.
  // Because we will set the script to run every 15 minutes, this ensures it catches
  // every event exactly once, giving you a ~1 hour warning.
  const windowStart = new Date(now.getTime() + (15 * 60 * 1000)); // 30 mins from now
  const windowEnd = new Date(now.getTime() + (45 * 60 * 1000));   // 60 mins from now

  const events = CalendarApp.getCalendarById(calendarId).getEvents(windowStart, windowEnd);

  // --- CHECK EVENTS & SEND PING ---
  events.forEach(event => {
    const eventStart = event.getStartTime();
    
    // This strict check prevents the bot from pinging you for "All Day" events 
    // or events that started hours ago and are just overlapping with our time window.
    if (eventStart >= windowStart && eventStart < windowEnd) {
      
      const title = event.getTitle();
      const timeString = eventStart.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

      // Determining the time of day, afternoon, evening, and night greetings
      const currentHour = now.getHours(); // gets the hour from 0 to 23
      let greeting = []; 

      // --- MORNING MESSAGES (Midnight to 11:59 AM) ---
      if (currentHour > 3 && currentHour < 12) {
        messageOptions = [
          `Morning, lass. The bloody is rising. <@${discordUserId}>, you fancy a cuppa before **${title}** at ${timeString}?`,
          `Wakey wakey <@${discordUserId}>. Time to get sorted. **${title}** starts at ${timeString}.`,
          `Good morning. <@${discordUserId}> Reminder: **${title}** will start at ${timeString}`
        ];
      } 
      
      // --- AFTERNOON MESSAGES (12:00 PM to 4:59 PM) ---
      else if (currentHour > 12 && currentHour < 17) {
        messageOptions = [
          `Good afternoon, <@${discordUserId}>. The sun is hot, innit? Don't you lose the plot. **${title}** is at ${timeString}.`,
          `Halfway through the day. <@${discordUserId}>, keep your eyes peeled for **${title}** at ${timeString}.`,
          `Sun's high on the horizon.  <@${discordUserId}> stay hidrated. Reminder: **${title}** will start at ${timeString}!`
        ];
      } 
      
      // --- EVENING/NIGHT MESSAGES (5:00 PM to 11:59 PM) ---
      else {
        messageOptions = [
          `Good evening <@${discordUserId}>. The day is winding down, but don't forget **${title}** at ${timeString}.`,
          `Night is falling, <@${discordUserId}>. Grab a jumper and prep for **${title}** at ${timeString}.`
        ];
      }

      // Pick a random number based on how many messages are in the list
      const randomIndex = Math.floor(Math.random() * messageOptions.length);

      // Select the random message
      const randomMessage = messageOptions[randomIndex];
      
      const payload = { "content": randomMessage };
      const options = {
        "method": "post",
        "contentType": "application/json",
        "payload": JSON.stringify(payload)
      };
      
      UrlFetchApp.fetch(webhookUrl, options);
    }
  });
}
