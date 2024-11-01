'use client'

import React, { useState, useContext, createContext } from 'react'
import { Autocomplete, GoogleMap, Marker, MarkerClusterer, MarkerF, useJsApiLoader } from '@react-google-maps/api'
import { Button } from '../ui/button'
import Image from 'next/image'
import { Input } from '../ui/input'
import { Library } from '@googlemaps/js-api-loader'
import centericon2 from '@/app/images/centericon2.svg'
import centericon from '@/app/images/centericon.svg'
import { useTheme } from 'next-themes'

const libs: Library[] = ['places']

export default function Map({marker, clickHandler, setSearchResult, placeHandler} : {marker: any, clickHandler: any, setSearchResult: any, placeHandler: any}) {
    const { theme, setTheme } = useTheme()
    const styles = theme === 'dark' ? ([
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#263c3f" }],
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#6b9a76" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#38414e" }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#212a37" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9ca5b3" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#746855" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#1f2835" }],
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: "#f3d19c" }],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#2f3948" }],
        },
        {
          featureType: "transit.station",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#17263c" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#515c6d" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#17263c" }],
        },
      ]) : []
    const containerStyle = {
        width: '800px',
        height: '400px',
    }
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
        libraries: libs
    })
    
    const [map, setMap] = React.useState<google.maps.Map | null>(null)
    const onUnmount = React.useCallback(function callback(map: any) {
        setMap(null)
    }, [])

    function createKey(location: any) {
        return location.lat + location.lng
    }
    
    

    
   

    return (
        <div>
            <div className='flex h-full'>
                <div className='w-[750px]'>
                    {isLoaded ? (
                        <Autocomplete 
                            onLoad={(autocomplete) => {
                                setSearchResult(autocomplete)
                            }}
                            onPlaceChanged={placeHandler}
                        >
                            <Input type='text' placeholder='Location' className='max-h-20 h-full text-2xl'/>
                        </Autocomplete>
                    ) : (
                        <h2>Loading...</h2>
                    )}
                </div>
                <div className='w-[100px]'>
                    <Button variant="ghost" className="w-3/4"
                        onClick={() => map?.panTo(marker)}
                    >
                        <Image
                        src={theme === 'dark' ? (
                            centericon2
                        ) : (
                            centericon
                        )}
                        alt="center"
                        width={20}
                        height={20}
                        />
                    </Button>
                </div>
            </div>
            <div className='mt-5'>
                {isLoaded ? (
                    <GoogleMap 
                        mapContainerStyle={containerStyle}
                        center={marker}
                        zoom={2}
                        onLoad={(map : google.maps.Map) => setMap(map)}
                        onUnmount={onUnmount}
                        options={{
                            streetViewControl: false,
                            fullscreenControl: false,
                            styles: styles
                        }}
                        onClick={(click) => {
                            clickHandler(click)
                        }}
                    >
                        <MarkerF
                            key={createKey(marker)}
                            position={{lat: marker.lat, lng: marker.lng}}
                        />
                    </GoogleMap>
                ) : (
                    <h2>Map loading...</h2>
                )}
            </div>
            
            
        </div>
    )
}
