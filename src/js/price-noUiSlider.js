const nonLinearSlider = document.getElementById("nonlinear");

noUiSlider.create(nonLinearSlider, {
  connect: true,
  behaviour: "tap",
  start: [500, 5500000],
  range: {
    // Starting at 500, step the value by 500,
    // until 4000 is reached. From there, step by 1000.
    min: [0],
    "10%": [500, 10000],
    "50%": [100000, 5000],
    "80%": [500000, 10000],
    max: [10000000],
  },
  format: {
    to: (value) => {
      return new Intl.NumberFormat("fr-CA", {
        style: "currency",
        currency: "CAD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    },
    from: (value) => {
      return value;
    },
  },
});

const nodes = [
  document.getElementById("lower-value"), // 0
  document.getElementById("upper-value"), // 1
];

const inputs = [
  document.getElementById("lower-input"), // 0
  document.getElementById("upper-input"), // 1
];

// Display the slider value and how far the handle moved
// from the left edge of the slider.
nonLinearSlider.noUiSlider.on("update", function (
  values,
  handle,
  unencoded,
  isTap,
  positions
) {
  nodes[handle].innerHTML = values[handle];
  inputs[handle].value = parseInt(unencoded[handle]);
});
