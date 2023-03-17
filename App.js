import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Dialog from "react-native-dialog";
import { StyleSheet, Text, View, Animated,  Modal,AppRegistry } from 'react-native';
import { Button } from 'react-native-paper';
import { API_KEY } from './utils/WeatherAPIKey';


export default function App() {
  const [showButton, setShowButton] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [waitingText, showWaitingText] = useState(true);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [temperature, setTemperature] = useState(0);
  const [weatherCondition, setWeatherCondition] = useState(null);
  const [error, setError] = useState(null);
  const [name, setName] = useState(null);
  const [pressure, setPressure] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [description, setDescription] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude)
      setLongitude(location.coords.longitude);
      setLocation(location.coords);
      setShowButton(true)
      setShowMap(true)
      showWaitingText(false)
    })();
  }, []);

  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  function fetchWeather() {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`
    )
      .then(res => res.json())
      .then(json => {
        setTemperature(json.main.temp)
        setWeatherCondition(json.weather[0].main,)
        setName(json.name)
        setPressure(json.main.pressure)
        setHumidity(json.main.humidity)
        setDescription(json.weather[0].description)     
      });
      setDialogVisible(true)
  }

  function closeDialog(){
    setDialogVisible(false)
   }

  return (
    <View style={styles.container}>
      <View>
          <Dialog.Container visible={dialogVisible}>
            <Dialog.Title>Weather info</Dialog.Title>
            <Dialog.Description>
            Place = {name},
            Temprature = {temperature},
            Long = {longitude},
            Lat = {latitude},
            Pressure = {pressure},
            Humidity = {humidity},
            Description = {description},
            </Dialog.Description>
            <Dialog.Button label="Close" onPress={closeDialog}  />
          </Dialog.Container>
        </View>
        {waitingText && <Text>Getting your position, hang tight!</Text>}
      {showMap && <MapView
          style={{ flex: 1 }} 
          provider={PROVIDER_GOOGLE} 
          showsUserLocation
          initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421}}
          />}
          <View
          style={{
          position: 'absolute',//use absolute position to show button on top of the map
          top: '10%',
          right: `5%`, //for center align
          alignSelf: 'flex-end' //for align to right
          }}
          >  
          {showButton && <Button
          style={{borderRadius:1}}
          mode="contained"
          buttonColor= "#019ced"
          onPress={fetchWeather}
          >Show weather</Button>}
           </View>

  </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex:1
  },
  map: {
    width: '50%',
    height: '50%',
  },

});
