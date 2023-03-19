import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Dialog from "react-native-dialog";
import { StyleSheet, Text, View } from 'react-native';
import { Button, List } from 'react-native-paper';
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

  const handleCancel = () => {
    setDialogVisible(false);
  };


  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      setLatitude(location.coords.latitude.toFixed(2))
      setLongitude(location.coords.longitude.toFixed(2));
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
          <Dialog.Container visible={dialogVisible} onBackdropPress={handleCancel}>
            <Dialog.Title>Weather info</Dialog.Title>
            <Dialog.Description>
            • Place: {name}
            </Dialog.Description>

            <Dialog.Description>
            • Long: {longitude}
            </Dialog.Description>

            <Dialog.Description>
            • Lat: {latitude}
            </Dialog.Description>

            <Dialog.Description>
            • Pressure: {pressure}
            </Dialog.Description>

            <Dialog.Description>
            • Humidity: {humidity}
            </Dialog.Description>

            <Dialog.Description>
            • Temprature: {temperature}
            </Dialog.Description>

            <Dialog.Description>
            • Description: {description} 
            </Dialog.Description>           

          </Dialog.Container>
        </View>
        {waitingText && <Text style={{
   fontSize: 20,
   alignSelf: 'center',
   justifyContent:"flex-start",
   alignItems: 'center',
   position:"absolute",
   top:300}}>Getting your position, hang tight!</Text>}
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
