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

exports.translateResults = photonResult => {
  let peliasResponse = {
    features: []
  };
  photonResult.features.forEach(feature => {
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
    // `venue` is also applied to addresses but for the purpose of digitransit it does
    // not matter: https://github.com/mfdz/digitransit-ui/blob/master/app/util/suggestionUtils.js#L54
    feature.properties.layer = "venue";

    peliasResponse.features.push(feature);
  });
  return peliasResponse;
};
