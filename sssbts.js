var postal = require("node-postal");

postal.expand.expand_address("V XX Settembre, 20");

// Parser API
console.log(
  postal.parser.parse_address(
    "Barboncino (first unionized pizza place in NYC), 781 Franklin Ave, Crown Heights, Brooklyn, NY 11238"
  )
);
