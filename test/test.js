const assert = require("assert");
const { translateResults } = require("../translate.js");

it("correctly set a label and name for Postbank", function() {
  const input = require("./postbank.json");
  const result = translateResults(input);
  assert.equal(result.features[0].properties.name, "Postbank");
  assert.equal(result.features[0].properties.label, "Postbank, 45128 Essen");
  assert.equal(result.features[0].properties.layer, "venue");

  assert.equal(result.features[10].properties.name, "Postbank");
  assert.equal(result.features[10].properties.label, "Postbank, Dudenstraße, 10965 Berlin");
});

it("correctly set a label and name for Grundschule", function() {
  const input = require("./grundschule.json");
  const result = translateResults(input);
  assert.equal(result.features[0].properties.name, "Grundschule");
  assert.equal(result.features[0].properties.label, "Grundschule, Schulstraße, 63933 Mönchberg");
  const names = result.features.map(x => x.properties.name);

  assert.deepEqual(
    [
      "Grundschule",
      "Grundschule",
      "Grundschule",
      "Grundschule",
      "Grundschule Mönchsbergschule",
      "Grundschule Mönchzell",
      "Grundschule Kayh",
      "Grundschule Gölshausen",
      "Mönchhof-Grundschule"
    ],
    names
  );

  const labels = result.features.map(x => x.properties.label);

  assert.deepEqual(
    [
      "Grundschule, Schulstraße, 63933 Mönchberg",
      "Grundschule, Schulstraße, 63933 Mönchberg",
      "Grundschule, Waldstraße 1, 71083 Herrenberg",
      "Grundschule, Innerdorf 9, 78087 Mönchweiler",
      "Grundschule Mönchsbergschule, Schulstraße, 68789 St. Leon-Rot",
      "Grundschule Mönchzell, Hauptstraße 102, 74909 Meckesheim",
      "Grundschule Kayh, Mönchberger Straße 3, 71083 Herrenberg",
      "Grundschule Gölshausen, Mönchsstraße 3, 75015 Bretten",
      "Mönchhof-Grundschule, Mönchhofstraße 18, 69120 Heidelberg"
    ],
    labels
  );

  const c = result.features.map(x => x.properties.confidence);
  assert.deepEqual([100, 99, 98, 97, 96, 95, 94, 93, 92], c);
});

it("correctly set a label and name for Dresdener Straße", function() {
  const input = require("./dresdener-str.json");
  const result = translateResults(input);

  const names = result.features.map(x => x.properties.name);

  assert.deepEqual(
    [
      "Gewerbegebiet Dresdener Landstraße",
      "Dresdener Straße",
      "Dresdener Straße",
      "Dresdener Straße",
      "Dresdener Straße",
      "Dresdener Straße",
      "Dresdener Straße",
      "Dresdener Straße",
      "Dresdener Straße",
      "Dresdener Straße",
      "Dresdener Straße",
      "Dresdener Straße",
      "Dresdener Straße",
      "Dresdener Straße",
      "Dresdener Straße"
    ],
    names
  );

  const labels = result.features.map(x => x.properties.label);

  assert.deepEqual(
    [
      "Gewerbegebiet Dresdener Landstraße, 04451 Borsdorf",
      "Dresdener Straße, 97437 Haßfurt",
      "Dresdener Straße, 04746 Hartha",
      "Dresdener Straße, 04932 Röderland",
      "Dresdener Straße, 04736 Waldheim",
      "Dresdener Straße, 02681 Wilthen",
      "Dresdener Straße, 01454 Radeberg",
      "Dresdener Straße, 01904 Neukirch/Lausitz",
      "Dresdener Straße, 01877 Schmölln-Putzkau",
      "Dresdener Straße, 01454 Wachau",
      "Dresdener Straße, 01877 Schmölln-Putzkau",
      "Dresdener Straße, 02689 Sohland an der Spree",
      "Dresdener Straße, 02681 Wilthen",
      "Dresdener Straße, 03119 Welzow",
      "Dresdener Straße, 03119 Welzow"
    ],
    labels
  );
});

it("set a label and name for an exact address with house number", function() {
  const input = require("./address-with-housenumber.json");
  const { features } = translateResults(input);

  const labels = features.map(x => x.properties.label);

  assert.deepEqual(
    ["Bahnhofstraße 5, 71139 Ehningen", "Bahnhofstraße 5/1, 71116 Gärtringen", "Bahnhofstraße 5, 71116 Gärtringen"],
    labels
  );

  const names = features.map(x => x.properties.name);
  assert.deepEqual(
    ["Bahnhofstraße 5, 71139 Ehningen", "Bahnhofstraße 5/1, 71116 Gärtringen", "Bahnhofstraße 5, 71116 Gärtringen"],
    names
  );
});

it("returns bus_stop in layer stop with ifopt as gtfs id", function() {
  const input = require("./bus-stop.json");
  const result = translateResults(input, "mydataset");
  assert.equal(result.features[0].properties.name, "Fanny-Leicht-Straße");
  assert.equal(result.features[0].properties.id, "GTFS:mydataset:de:08111:6012");
  assert.equal(result.features[0].properties.layer, "stop");
});
