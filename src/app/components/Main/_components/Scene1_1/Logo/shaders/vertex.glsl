varying vec2 vUv;
uniform float uRevealProgress;
uniform float uRevealProgressAfter;
uniform float uTime;
varying vec3 custom_worldPos;

float random2D(vec2 value)
{
    return fract(sin(dot(value.xy, vec2(12.9898,78.233))) * 43758.5453123);
}
void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  custom_worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  vec2 center = vec2(uv.x, 0);

  float distanceToCenter = length(uv - center);
  float revealProgress = (distanceToCenter) - uRevealProgress;

  float distanceToCenterAfter = length(uv - vec2(uv.x, 1.));
  float revealProgressAfter = (distanceToCenterAfter) - uRevealProgressAfter;

  float edgeStrength = 1.0 - clamp(abs(revealProgress * 10.0), 0.0, 1.0);
  edgeStrength = pow(edgeStrength, 3.0) * 6.0;

  float edgeStrengthAfter = 1.0 - clamp(abs(revealProgressAfter * 10.0), 0.0, 1.0);
  edgeStrengthAfter = pow(edgeStrengthAfter, 3.0) * 6.0;

  // modelPosition.x += (random2D(modelPosition.xz) - 0.5) * edgeStrength * 0.01;
  // modelPosition.z += (random2D(modelPosition.zx) - 0.5) * edgeStrength * 0.01;
  // modelPosition.y = modelPosition.y;

  modelPosition.x += (random2D(modelPosition.xz) - 0.5) * edgeStrengthAfter * 0.01;
  modelPosition.z += (random2D(modelPosition.zx) - 0.5) * edgeStrengthAfter * 0.01;
  modelPosition.y = modelPosition.y;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;
  gl_Position = projectionPosition;
  vUv = uv;

}