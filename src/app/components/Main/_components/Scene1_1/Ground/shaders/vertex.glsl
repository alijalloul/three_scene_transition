uniform float uTime;
uniform float uRevealProgress;
varying vec2 vUv;

varying vec3 custom_worldPos;

float random2D(vec2 value)
{
    return fract(sin(dot(value.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
     vUv = uv;

     custom_worldPos = (modelMatrix * vec4(position, 1.0)).xyz;

     float distanceToCenter = length(custom_worldPos - vec3(0.0, -0.9, 0.0));
     float revealProgress = (distanceToCenter) / 2.5 - uRevealProgress;

     float edgeStrength = 1.0 - clamp(abs(revealProgress * 10.0), 0.0, 1.0);
     edgeStrength = pow(edgeStrength, 3.0) * 6.0;

     csm_Position.x += (random2D(csm_Position.xz) - 0.5) * edgeStrength * 0.01;
     csm_Position.z += (random2D(csm_Position.zx) - 0.5) * edgeStrength * 0.01;
     csm_Position.y = csm_Position.y;

     csm_Position = csm_Position.xyz;

}