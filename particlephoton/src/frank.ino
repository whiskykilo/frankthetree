/*
 * Project frankthetree
 * Description: Moisture level sensor that reports to Librato for graphing and then alerts via Slack.
 * Author: @whiskykilo
 * Date: 6/22/2017
 */

 #define SOIL_MOISTURE_PIN A0
 #define THIRTY_SECONDS 30
 #define DRY_LEVEL 2600 //Found experimentally, 3200 should keep it watered most of the day

 int moistureLevel;              //Moisture value, 0-4096, 2800-3300 typical

 void setup()
 {
   Serial.begin(9600);
 }


 void loop()
 {
     int offTime = THIRTY_SECONDS;

     moistureLevel = analogRead(SOIL_MOISTURE_PIN);
     // Right now the moisture level performs the same thing, but I wrote it in a way that allows you to do different things if it reports as too dry.
     if((moistureLevel < DRY_LEVEL))
     {
       Particle.publish("librato_frankthetree", String(moistureLevel), 60, PRIVATE); //Report moisture level to Librato
     }
     else
     {
       Particle.publish("librato_frankthetree", String(moistureLevel), 60, PRIVATE);
     }

     Serial.println(moistureLevel);
     delay(offTime*1000); //offTime is stored as seconds, delay() requires milliseconds
 }
