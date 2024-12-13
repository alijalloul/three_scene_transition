varying vec2 vUv;
varying vec3 custom_worldPos;
uniform float uTime;
uniform float uRevealProgress;

void main() {
    float distanceToCenter = length(custom_worldPos - vec3(0.0, -0.9, 0.0));
    float revealProgress = (distanceToCenter) / 2.5 - uRevealProgress;

    if(revealProgress > 0.0) {
        discard;
    }

    float edgeStrength = 1.0 - clamp(abs(revealProgress * 10.0), 0.0, 1.0);
    edgeStrength = pow(edgeStrength, 3.0) * 6.0;

    vec3 endColor = mix(csm_DiffuseColor.rgb, vec3(0.0, 0.0, 0.0), edgeStrength);

    endColor = mix(endColor, vec3(0.2, 0.2, 0.2), edgeStrength);

    csm_DiffuseColor = vec4(endColor, clamp(1.0 - edgeStrength, 1.0, 1.0));
}
