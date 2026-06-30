import manifest from './project-map.json' assert { type: 'json' };

export function getArchitecture() {
  return {
    builds: manifest.builds,
    layers: manifest.layers,
    engineInfo: manifest.engineInfo,
  };
}
