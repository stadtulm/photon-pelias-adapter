photon-pelias-adapter is a small API proxy to replace pelias geocoder with [photon](https://photon.komoot.de/).
We use this to replace pelias with photon in [digitransit-ui](https://github.com/HSLdevcom/digitransit-ui/)

Supported pelias APIs:

* `/geocoding/v1/search`
* `/geocoding/v1/reverse`

Supported pelias paramters:
* for `search`
	* `text`
	* `boundary.rect`
	* `lang`
	* returns empty results, if `sources` contains `gtfs`.
* for `reverse`
	* `point.lat` and `point.lon`
	* `lang`

Configuration:

* Set port via `PORT` environment variable. Default `8080`.
* Set Photon endpoint via environment variable `PHOTON_URL`. Default `http://photon.komoot.de/`.