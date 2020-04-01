const getLabel = properties => {
  const { name, street, housenumber, postalcode, city } = properties;
  const result = [properties.name];
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

    feature.properties.label = getLabel(feature.properties);
    feature.properties.layer = "venue";

    peliasResponse.features.push(feature);
  });
  return peliasResponse;
};
