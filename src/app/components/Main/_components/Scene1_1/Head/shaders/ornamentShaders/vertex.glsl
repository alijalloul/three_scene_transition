uniform float uTime;

varying vec3 custom_vPosition;
varying vec3 custom_vNormal;
varying vec3 vWorldPos;
uniform float uRevealProgress;
varying vec2 vUv;

float random2D(vec2 value)
{
    return fract(sin(dot(value.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {

  custom_vPosition = position;
  custom_vNormal = normal;

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;

  vWorldPos = worldPos;
  vUv = uv;

  float distanceToCenter = .9 - worldPos.y;
  float revealProgress = (distanceToCenter) / 2.5 - uRevealProgress;

  float edgeStrength = 1.0 - clamp(abs(revealProgress * 10.0), 0.0, 1.0);
  edgeStrength = pow(edgeStrength, 1.0) * 3.0;

  modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * edgeStrength * 0.05;
  modelPosition.z += (random2D(modelPosition.zx + uTime) - 0.5) * edgeStrength * 0.05;
  modelPosition.y = csm_Position.y;

  csm_Position = modelPosition.xyz;

}