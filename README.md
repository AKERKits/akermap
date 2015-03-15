# [![Build Status](https://travis-ci.org/AKERKits/akermap.svg)](https://travis-ci.org/AKERKits/akermap) The AKER map

## What is this?
The AKER map is an ongoing open source project which aims to create a global database of agricultural resources, which is powered by the AKER community and easily searchable on any device.

The live version can be found on [map.aker.me](http://map.aker.me).

### Screenshots
#### Map view
![aker_overview](https://cloud.githubusercontent.com/assets/188038/6657603/7a4c1a76-cb51-11e4-94b5-894a6989894a.png)
#### Menu view
![aker_menu](https://cloud.githubusercontent.com/assets/188038/6657604/7e8b4094-cb51-11e4-831e-0231cb94bb7d.png)


## Quickstart

### Windows
1. `setup.bat`
2. `npm install`
3. `dev.bat`
4. open [http://localhost:8080/webpack-dev-server/](http://localhost:8080/webpack-dev-server/).

### *nix
1. `./setup`
2. `npm install`
3. `./dev`
4. open [http://localhost:8080/webpack-dev-server/](http://localhost:8080/webpack-dev-server/).


## Development tips
* If you need the website without the Frame of Webpack around it, you can open [http://localhost:8080](http://localhost:8080) directly.
* Disallow geolocation detection - this does not only make your reload cycle faster, but also centers the map to Denver with 4 pre-defined pins right on the map.

This is work in progress, if you like to contribute, have a look at the issues and/or collaborate [in the aker community](http://community.aker.me/t/aker-map-development/).
