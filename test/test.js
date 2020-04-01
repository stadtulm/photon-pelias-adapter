const assert = require("assert");
const { translateResults } = require("../translate.js");

it("correctly set a label", function() {
  const input = require("./postbank.json");
  const result = translateResults(input);
  assert.equal(result.features[0].properties.name, "Postbank");
  assert.equal(result.features[0].properties.label, "Postbank, 45128 Essen");
  assert.equal(result.features[0].properties.layer, "venue");

  assert.equal(result.features[10].properties.name, "Postbank");
  assert.equal(result.features[10].properties.label, "Postbank, Dudenstraße, 10965 Berlin");
});

it("correctly set a label for Grundschule", function() {
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
});
