# MoodTracker-vireystilapäiväkirja

MoodTracker on Expo-ympäristössä toteutettu React Native -sovellus vireystilan seuraamista varten.

Käyttöliittymässä on käytetty React Native Paper -kirjaston valmiita komponentteja, kuten Card, Button, TextInput, Portal ja Modal. Päivämäärien valinnat tehdään React Native Paper Dates -kirjaston Date Pickerillä.

Navigointiin näytöstä toiseen käytetään React Navigationin Stack-navigointia.

Käyttäjän syöttämät tiedot tallennetaan paikallisesti SQLite-tietokantaan Expo SQLite -kirjaston SQLiteProvideria ja useSQLiteContextia käyttäen.

