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
});
