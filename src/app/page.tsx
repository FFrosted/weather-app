"use client"

import Map from "@/components/shared/Map";
import { createContext, useState } from "react";
import axios from "axios";
import ThemeChanger from "@/components/shared/ThemeChanger";
import { useTheme } from "next-themes";

export default function Page() {

  const { theme, setTheme }  = useTheme()
  const [marker, setMarker] = useState<google.maps.LatLngLiteral>({lat: 0, lng: 0})
  const [weather, setWeather] = useState(null)
  const [searchResult, setSearchResult] = useState(null)

  const clickHandler = async (click: any) => {
    setMarker({lat: click.latLng.lat(), lng: click.latLng.lng()})
    const response = axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${marker.lat}&lon=${marker.lng}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=imperial`)
    setWeather((await response).data)
  }

  const placeHandler = async () => {
    if (searchResult !== null) {
      const place = searchResult.getPlace();
      console.log(place)
      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()
      console.log(({lat, lng}))


      setMarker({lat, lng})

      const response = axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${marker.lat}&lon=${marker.lng}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=imperial`)

      setWeather((await response).data)
      
    } else {
      console.log('Autocomplete not loaded yet')
    }
  }

  console.log(weather)


  return (
    <div className="w-full">
      <ThemeChanger/>
      <div className="items-center mt-10 flex">
        <Map marker={marker} clickHandler={clickHandler} setSearchResult={setSearchResult} placeHandler={placeHandler}/>
        {weather ? (
            <>
              <h2>{weather.weather[0].description}</h2>
              <h2>{weather.main.temp}</h2>
            </>
          ) : (
            <h2>No location selected.</h2>
          )}
      </div>
    </div>
  );
}