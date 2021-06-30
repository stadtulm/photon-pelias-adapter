const CONFIDENCE_BOOST_STATION = 4;
const CONFIDENCE_BOOST_STOP = 2;

const getLabel = properties => {
  const { name, street, housenumber, postalcode, city } = properties;
  const result = [];
  if (name) {
    result.push(name);
  }
  if (street) {
    const num = housenumber || "";
    result.push(`${street} ${num}`.trim());
  }
  if (city) {
    const pc = postalcode || "";
    result.push(`${pc} ${city}`);
  }
  return result.join(", ");
};

// if we already have a name, we keep it.
// exact addresses (with house numbers) don't have a name
// so we will use the label instead.
const getName = properties => {
  const { name, label } = properties;
  if (name) {
    return name;
  } else return label;
};

exports.translateResults = (photonResult, gtfsDataset = "") => {
  let peliasResponse = {
    features: []
  };
  photonResult.features.forEach((feature, idx) => {
    if (feature.properties.state) {
      feature.properties.region = feature.properties.state;
      delete feature.properties.state;
    }
    if (feature.properties.postcode) {
      feature.properties.postalcode = feature.properties.postcode;
      delete feature.properties.postcode;
    }
    if (feature.properties.city) {
      feature.properties.locality = feature.properties.city;
    }

    // in digitransit name is displayed in the first line and label in the second one
    feature.properties.label = getLabel(feature.properties);
    feature.properties.name = getName(feature.properties);

    if (feature.properties.osm_value == "bus_stop" || feature.properties.osm_value == "tram_stop") {
      feature.properties.layer = "stop";
    } else if (
      feature.properties.osm_key == "railway" &&
      (feature.properties.osm_value == "station" || feature.properties.osm_value == "halt")
    ) {
      feature.properties.layer = "station";
    } else {
      // `venue` is also applied to addresses but for the purpose of digitransit it does
      // not matter: https://github.com/mfdz/digitransit-ui/blob/master/app/util/suggestionUtils.js#L54
      feature.properties.layer = "venue";
    }

    if (feature.properties.extra && feature.properties.extra["ref:IFOPT"]) {
      // TODO supply dataset name (now fixed to hbg) as param to translateResults
      let ifoptid = feature.properties.extra["ref:IFOPT"];
      parentId = /^\w*:\w*:\w*/.exec(ifoptid);
      if (parentId) {
        ifoptid = parentId[0];
      }
      feature.properties.id = "GTFS:" + gtfsDataset + ":" + ifoptid;
    }

    feature.properties.confidence = 100 - idx;
    if (feature.properties.layer == "stop") {
      feature.properties.confidence += CONFIDENCE_BOOST_STOP;
    } else if (feature.properties.layer == "station") {
      feature.properties.confidence += CONFIDENCE_BOOST_STATION;
    }

    feature.properties.source = "openstreetmap";

    peliasResponse.features.push(feature);
  });
  return peliasResponse;
};
