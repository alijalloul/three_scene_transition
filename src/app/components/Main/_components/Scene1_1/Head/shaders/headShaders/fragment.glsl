uniform float uTime;
uniform float _F_0;
uniform float _omega_0;
uniform float _omega_w;

uniform float _F_w;
uniform float _a;
uniform int Seed;
uniform vec3 uMouse;

uniform float uMinCrackWidth;
uniform float uMaxCrackWidth;
uniform float uCrackSpeed;
uniform float uCrackFrequency;
uniform float uRadius;
uniform vec3 uCrackColor;
uniform float uTargetBias;
uniform float uMaskStrength;
uniform float uMaskFrequency;
uniform float uMaskSpeed;
uniform float uRevealProgress;
uniform float uCracksOpacity;

varying vec3 custom_vPosition;
varying vec3 custom_vNormal;
varying vec3 vWorldPos;
varying vec2 vUv;

const int ImpPerKernel = 2;
const int MaxInt = 2147483647;
const float M_PI = 3.1415926535897932385;

uniform float progress; // Transition progress (0 to 1)

// Simple 2D noise function
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// 2D noise function based on random
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

float truncate = 0.01;
vec3 Vup = vec3(0.0, 0.0, 1.0);

float drand(int r, out int _r) {
    _r = r * 3039177861;
    return float(_r & MaxInt) / float(MaxInt);
}

float kernelRadius(float ka) {
    return (sqrt(-log(truncate) / M_PI) / float(ka));
}

float gaussian(vec2 uv, float a) {
    float lsq = dot(uv, uv);
    return exp(-M_PI * (a * a) * lsq);
}

int hash_linear(ivec4 ijkl) {
    return (ijkl.x + (ijkl.y << 10) + (ijkl.z << 20));
}

int hash(ivec2 ij) {
    return hash_linear(ij.xyxy);
}

int hash3(ivec3 ijk) {
    return hash_linear(ijk.xyzx);
}

vec2 sampleCellSrf(ivec3 ijk, vec3 uvw, vec3 wu, vec3 wv, vec3 wn, float f0, float o0, float ow, float a, float kr) {
    int h = 1 + hash3(ijk);
    int rnd = Seed + h;
    vec2 phasor = vec2(0.0);
    vec3 cellsz = vec3(2.0 * kr);

    for(int nIter = 0; nIter < ImpPerKernel; nIter++) {
        float rx = drand(rnd, rnd);
        float ry = drand(rnd, rnd);
        float rz = drand(rnd, rnd);
        vec3 ctr3 = vec3(rx, ry, rz);
        vec3 v = (uvw - ctr3) * cellsz;
        vec2 x_minus_x_i = vec2(dot(v, wu), dot(v, wv));

        float o_r = drand(rnd, rnd);
        float o1 = o0 - ow;
        float o2 = o0 + ow;
        float o = o1 + o_r * (o2 - o1);

        float f_r = drand(rnd, rnd);
        float f1 = f0 - _F_w;
        float f2 = f0 + _F_w;
        float f = f1 + f_r * (f2 - f1);

        if(dot(v, v) < kr * kr * 2.0) {
            vec2 u_i = vec2(cos(o), sin(o));
            float phase = 2.0 * M_PI * f * dot(u_i, x_minus_x_i);
            float z = max(0.0, 1.0 - abs(dot(v, wn) / kr));
            float i = z * gaussian(x_minus_x_i, a);
            phasor += i * vec2(cos(phase), sin(phase));
        }
    }
    return phasor;
}

vec2 makeNoiseSrf(vec3 tuv, vec3 wu, vec3 wv, vec3 nrm) {
    vec2 phasor = vec2(0.0);
    float kr = kernelRadius(_a);
    vec3 cellsz = vec3(2.0 * kr);
    vec3 _ijk = tuv / cellsz;
    ivec3 ijk = ivec3(round(_ijk));
    vec3 fijk = _ijk - vec3(ijk);

    ivec3 nd = ivec3((fijk.x > 0.5) ? 1 : -1, (fijk.y > 0.5) ? 1 : -1, (fijk.z > 0.5) ? 1 : -1);

    for(int k = 0; k < 2; k++) {
        for(int j = 0; j < 2; j++) {
            for(int i = 0; i < 2; i++) {
                phasor += sampleCellSrf(ijk + ivec3(i, j, k) * nd, fijk - vec3(i, j, k) * vec3(nd), wu, wv, nrm, _F_0, _omega_0, _omega_w, _a, kr);
            }
        }
    }
    return phasor;
}

vec2 phasorNoiseSrf(vec3 point, vec3 normal) {
    vec3 tuv = point;
    vec3 nrm = normalize(normal);
    vec3 wu = normalize(cross(nrm, Vup));
    vec3 wv = cross(wu, nrm);
    return makeNoiseSrf(tuv, wu, wv, nrm);
}

float max2(vec2 v) {
    return max(v.x, v.y);
}

// Simple random function based on pixel position and time

// Noise function based on time for faster and random oscillations
float timeNoise(float time) {
    return fract(sin(time * 43758.5453123) * 12345.6789);
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

    vec3 toTarget = normalize(uMouse - vec3(0.0, 0.0, 0.7));

    vec2 phasor = phasorNoiseSrf((custom_vPosition * uCrackFrequency + vec3(sin(uTime * 0.01 * uCrackSpeed), cos(uTime * 0.01 * uCrackSpeed), sin(uTime * 0.01 * uCrackSpeed))) * 2.0, custom_vNormal);
    float u = abs(0.5 - fract(atan(phasor.y, phasor.x) / (2.0 * M_PI)));

    vec2 phasor2 = phasorNoiseSrf((custom_vPosition * uCrackFrequency + vec3(sin(uTime * 0.01 * uCrackSpeed), cos(uTime * 0.01 * uCrackSpeed), sin(uTime * 0.01 * uCrackSpeed))) * 1.0, custom_vNormal);
    float v = abs(0.5 - fract(atan(phasor2.y, phasor2.x) / (2.0 * M_PI)));

    float w = max(uMinCrackWidth, uMaxCrackWidth * (1.0 - 0.5 * cos(uTime * 2.0) - 0.3 * sin(uTime * 3.1) - 0.2 * cos(uTime * 7.7)) - 0.02);

    float edgeStrength = 1.0 - clamp(abs(revealProgress * 10.0), 0.0, 1.0);
    edgeStrength = pow(edgeStrength, 3.0) * 6.0;

    float crackPattern = step(0.5, 1.0 - clamp((max2(abs(vec2(u, v) - vec2(0.5, 0.5))) - (0.5 - w)) / w, 0.0, 1.0));
    vec3 color = vec3(crackPattern) * edgeStrength * 10.0;

    float distanceToMouse = length(vWorldPos - uMouse);

    distanceToMouse += (noiseValue - 0.5) * uRadius * 0.2;

    float threshold = 0.1 * uRadius;
    float visibility = 1.0 - smoothstep(0.0, threshold, distanceToMouse);
    visibility *= uCracksOpacity;

    vec3 cracksColor = uCrackColor * 2.5;

    vec3 endColor = mix(csm_DiffuseColor.rgb, cracksColor, 1.0 - crackPattern);

    endColor = mix(csm_DiffuseColor.rgb, endColor, edgeStrength + visibility);

    // if (progress <= -0.2) {
    //     endColor = 1.0 - endColor;
    // }



    // Compute the inversion factor: starts at 0.0 when progress <= 0.5, ramps up to 1.0 as progress approaches 1.0
    float inversionFactor = smoothstep(0.0, 0.08, progress);

    // Interpolate between the original and inverted colors
    vec3 finalColor = mix(endColor, 1.0 - endColor, inversionFactor);

    csm_DiffuseColor = vec4(finalColor, 1.0);

    //   csm_Metalness = 1.0 - visibility;
}