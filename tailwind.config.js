// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      // tus extends (animaciones, keyframes…)
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    // elige el tema “light” para no meterte en modo oscuro “night”
    themes: ["light"],
    // si aún quieres desactivar el reset de daisyUI
    // base: false,
  },
};
