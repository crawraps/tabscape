### Tabscape

# App structure

App consists of three parts. Background, widgets and settings

## Background

There are three different types of background:

1. Depending on weather
2. From the api (unsplash, pexels, etc.)
3. Uploaded by user

Background changing can be configured by time of changing and user may change current background (next, previous).

### 1. Weather background

### Weather support

Background image depends on current local weather getting from the api [https://open-meteo.com/](https://open-meteo.com/). Api receive one call at our and stores data in local storage. Local storage contains an array of weather data and corresponding link to the background image.

Background images stores in google cloud. There will be collections of images corresponding type of the weather. Collection of images divided by the topics (ex. games, photos, etc.). Every topic has a collection of images. For example, games topic has collections of Skyrim images and Minecraft images.

Images collection divided into folders where each folder has a weather type corresponding name. Every folder contains one or more images. Each image has an ID.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/fe572747-01dd-4728-b8f2-282c73aea275/Untitled.png)

### Time of day support

Images collection may have a Time Of Day support. It means that background image depends on weather type and time of the day. If the collection has an TOD support, then its folder will have a .TOD postfix and folders inside of it separated by TOD type.

### Internal structure

Background image info contained into the user’s local storage.

Local storage have a field for weather and for weather background. They contain information about weather, image URL, and image data (author, topic, etc.) two hours ahead. Info updates every hour if weather background selected in user settings. Weather object has got an “hourly” array. The first item of the array is current hour. The second array item needs to lazy load data.

```json
"weather": {
  "latitude": "55.75",
  "longtitude": "37.625",
  "hourly_units": {
    "time": "iso8601",
    "temperature": "C",
    "precipitation": "mm"
  },
  "hourly": [
    {
      "time": "2022-07-19T12:00",
      "temperature": "18.9",
      "weathercode": "4"
    },
    {
      "time": "2022-07-19T13:00",
      "temperature": "19.4",
      "weathercode": "4"
    }
  ]
},
"backgroundImages": [
  [
    {
      "url": "https://cloud.google.com/path/to/image",
      "author": "Lorens Martins Jr."
    },
    {
      "url": "https://cloud.google.com/path/to/another/image",
      "author": "Matthew Uranber"
    }
  ],
  [
    {
      "url": "https://cloud.google.com/path/to/next/hour/image",
      "author": "Jeremy Yeger"
    }
  ]
]
```

Every page loading will trigger the checker. Firstly, it checks background type. If it is weather background, then it checks the current user’s time and compare it with the weather/hourly time in local storage. If the system time between hourly[0] and hourly[1], then do nothing. If the system time more than hourly[1] but less than hourly[1] + 1, then it should be updated one hour ahead and load new data. If the system time more than hourly[1] + 1, then all the data should be updated. The weather data should be corresponding to the weather code.

If there are more than one image, then images changing every N minutes.

### 2. API background

User may choose an api background. It should load images from the api and load it lazy.

### Unsplash

Background images load from [unsplash](https://unsplash.com/developers) api. It can be loaded by several ways

1. Random
2. Topic
3. Search
4. Collection ID

### Internal structure

Internal structure of the API background, same as weather background structure. Images contained in the ‘background images’ field, but there is one item in the top level array.

```json
"backgroundImages": [
  [
    {
      "url": "https://cloud.google.com/path/to/image",
      "author": "Lorens Martins Jr."
    },
    {
      "url": "https://cloud.google.com/path/to/another/image",
      "author": "Matthew Uranber"
    }
  ]
]
```

Image updates after N minutes.

### 3. Custom background

Custom background image is the image uploaded by user. Image stores in user’s local storage as base64 encoded string. User can add topic, collection and author name additionally. Custom image stores in separate field.

```json
"customImage": {
  "image": "base64encryptedcode",
  "topic": "Photo",
  "collection": "Landscape",
  "author": null
}
```

# Global structure

This chapter is telling about internal app structure.

## Global storage

Application's global storage stores all the data that needs to the application. Application storage collects all user’s data and saves it when page close. When page open firstly app storage fetch data from localstorage.

## Modular system

The application uses a modular system supported by vuex. Each widget should have a corresponding module to store its data.

### Synchro module
