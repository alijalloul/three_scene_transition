uniform float uTime;
uniform sampler2D uTexture;
uniform float uRevealProgress;
uniform float uRevealProgressAfter;
uniform vec3 uLogoColor;

varying vec2 vUv;

void main() {

  // Define the center of the UV space
  vec2 center = vec2(vUv.x, 0);

  // Calculate the distance from the UV coordinate to the center
  float distanceToCenter = length(vUv - center);
  float distanceToCenterAfter = length(vUv - vec2(vUv.x, 1));
  float revealProgress = (distanceToCenter) - uRevealProgress;
  float revealProgressAfter = (distanceToCenterAfter) - uRevealProgressAfter;

  if(revealProgress > 0.0) {
    discard;
  }

  if(revealProgressAfter > 0.0) {
    discard;
  }

  float textureValue = texture2D(uTexture, vUv).r;
  textureValue = step(0.5, textureValue);

  float edgeStrength = 1.0 - clamp(abs(revealProgress * 10.0), 0.0, 1.0);
  edgeStrength = pow(edgeStrength, 3.0) * 6.0;

  float edgeStrengthAfter = 1.0 - clamp(abs(revealProgressAfter * 10.0), 0.0, 1.0);
  edgeStrengthAfter = pow(edgeStrengthAfter, 3.0) * 6.0;

  vec3 endColor = mix(uLogoColor, vec3(0.0, 0.0, 0.0), edgeStrength);

  vec3 endColorAfter = mix(uLogoColor, vec3(0.0, 0.0, 0.0), edgeStrengthAfter);

  endColor = mix(endColor, vec3(0.2, 0.2, 0.2), edgeStrength);

  endColorAfter = mix(endColorAfter, vec3(0.2, 0.2, 0.2), edgeStrengthAfter);

  if(uRevealProgress > 0.99) {
    endColor = endColorAfter;
  }

  // Output the final color with an alpha based on edge strength for smooth blending
  gl_FragColor = vec4(endColor, textureValue);
}
