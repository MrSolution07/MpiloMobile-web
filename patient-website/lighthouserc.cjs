/** @type {import('lhci').LighthouseCiConfig} */
module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run preview -- --host 127.0.0.1 --port 4173 --strictPort",
      startServerReadyPattern: "Local:",
      url: ["http://127.0.0.1:4173/", "http://127.0.0.1:4173/gallery"],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.5 }],
        "categories:accessibility": ["warn", { minScore: 0.85 }],
        "first-contentful-paint": "off",
        "largest-contentful-paint": "off",
      },
    },
    upload: {
      target: "filesystem",
      outputDir: ".lighthouseci",
    },
  },
};
