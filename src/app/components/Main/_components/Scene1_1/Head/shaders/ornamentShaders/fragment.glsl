uniform float uTime;

uniform vec3 uMouse;

uniform float uRadius;
uniform vec3 uCrackColor;
uniform float uMaskStrength;
uniform float uMaskFrequency;
uniform float uMaskSpeed;
uniform float uRevealProgress;

varying vec3 custom_vPosition;
varying vec3 vWorldPos;


uniform float progress; // Transition progress (0 to 1)


float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
    float noiseValue = noise(custom_vPosition.xy * uMaskFrequency + uTime * uMaskSpeed);
    noiseValue = pow(noiseValue, 3.0);
    noiseValue *= uMaskStrength;

    float distanceToCenter = .9 - vWorldPos.y;
    float revealProgress = (distanceToCenter) / 2.5 - uRevealProgress;

    if(revealProgress > 0.0) {
        discard;
    }

    float edgeStrength = 1.0 - clamp(abs(revealProgress * 10.0), 0.0, 1.0);
    edgeStrength = pow(edgeStrength, 3.0) * 6.0;


    vec3 endColor = mix(csm_DiffuseColor.rgb, vec3(0,0,0), edgeStrength );

  // Compute the inversion factor: starts at 0.0 when progress <= 0.5, ramps up to 1.0 as progress approaches 1.0
    float inversionFactor = smoothstep(0.0, 0.08, progress);

    // Interpolate between the original and inverted colors
    vec3 finalColor = mix(endColor, 1.0 - endColor, inversionFactor);

    csm_DiffuseColor = vec4(finalColor, 1.0);

}