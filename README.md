# citrus
This service will perform unit conversion to SI from their “widely used” counterparts.

## Description:
It can handle multiplication and divion as well as infix operations.

## Example:
GET "/units/si?units=degree/minute"
->
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
