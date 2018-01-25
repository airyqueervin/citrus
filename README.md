# citrus
This service will perform unit conversion to SI from their “widely used” counterparts.

## Description:
This service will handle multiplication and division of units. It can also handle individual conversions.

## Example:
GET "/units/si?units=degree/minute" <br />
-> <br />
{ “unit_name”: "rad/s", “multiplication_factor”: 0.00029088820867 }

### List of search parameter values allowed. More will be added later.
[
    "minute",
    "min",
    "hour",
    "h",
    "day",
    "d",
    "degree",
    "°",
    "'",
    "second",
    "\"",
    "hectare",
    "ha",
    "litre",
    "L",
    "tonne",
    "t"
]

### Enjoy!
