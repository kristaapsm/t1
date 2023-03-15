import * as React from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Dialog from "react-native-dialog";
import { StyleSheet, Text, View, Animated,  Modal,AppRegistry } from 'react-native';
import { Button } from 'react-native-paper';
import { API_KEY } from './utils/WeatherAPIKey';

export default class App extends React.Component {

  state = {
    
    isLoading: false,
    temperature: 0,
    weatherCondition: null,
    error: null,
    name: null,
    Lat : null,
    Long : null,
    Temp: null,
    Pressure : null,
    Humidity: null,
    Description: null,
    dialog : false
  };

 closeDialog(){
  this.setState({
    dialog: false
  })
 }


 
  fetchWeather(lat = 25, lon = 25) {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${57.55}&lon=${25.4}&APPID=${API_KEY}&units=metric`
    )
      .then(res => res.json())
      .then(json => {
        
        console.log(json);
        this.setState({
          temperature: json.main.temp,
          weatherCondition: json.weather[0].main,
          name: json.name,
          Long: json.coord.lon,
          Lat : json.coord.lat,
          Pressure: json.main.pressure,
          Humidity : json.main.humidity,
          Description : json.weather[0].description,
          isLoading: false,
          dialog: true
        });
      });

  }

  render() {
    const { isLoading } = this.state;
    return (
        <View style={styles.container}>
        
        <View>
          <Dialog.Container visible={this.state.dialog}>
            <Dialog.Title>Weather info</Dialog.Title>
            <Dialog.Description>
            Place = {this.state.name},
            Temprature = {this.state.temperature},
            Long = {this.state.Long},
            Lat = {this.state.Lat},
            Pressure = {this.state.Pressure},
            Humidity = {this.state.Humidity},
            Description = {this.state.Description},
            </Dialog.Description>
            <Dialog.Button label="Close" onPress={() => this.closeDialog()}  />
          </Dialog.Container>
        </View>

     
          <MapView
          style={{ flex: 1 }} 
          provider={PROVIDER_GOOGLE} 
          showsUserLocation
          initialRegion={{
          latitude: 57.55,
          longitude: 25.4,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421}}
          />
          <View
          style={{
          position: 'absolute',//use absolute position to show button on top of the map
          top: '10%',
          right: `5%`, //for center align
          alignSelf: 'flex-end' //for align to right
          }}
          >
          <Button
          style={{borderRadius:1}}
          mode="contained"
          buttonColor= "#019ced"
          onPress={() => this.fetchWeather()}
          >Show weather</Button>
        </View>


          
          
        </View>
    );
  }
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