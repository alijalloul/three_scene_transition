uniform float time;
uniform float progress; 
uniform sampler2D uTexture1; 
uniform sampler2D uTexture2;
uniform sampler2D uTexture3; 
varying vec2 vUv; 

const float PI = 3.141592653589793;
const float strength = 2.0;

float Linear_ease(float begin, float change, float duration, float time) {
    return change * time / duration + begin;
}

float Exponential_easeInOut(float begin, float change, float duration, float time) {
    if(time == 0.0)
        return begin;
    else if(time == duration)
        return begin + change;
    time = time / (duration / 2.0);
    if(time < 1.0)
        return change / 2.0 * pow(2.0, 10.0 * (time - 1.0)) + begin;
    return change / 2.0 * (-pow(2.0, -10.0 * (time - 1.0)) + 2.0) + begin;
}

float Sinusoidal_easeInOut(float begin, float change, float duration, float time) {
    return -change / 2.0 * (cos(PI * time / duration) - 1.0) + begin;
}

float random(vec3 scale, float seed) {
    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
}

vec3 crossFade(vec2 uv, float dissolve, sampler2D firstTexture, sampler2D secondTexture ) {
    return mix(texture2D(firstTexture, uv).rgb, texture2D(secondTexture, uv).rgb, dissolve);
}


void main() {
    vec2 uv = vUv;
    
    float screenHeightProgress = progress * 6.0; 
    
    vec3 color;
    if (screenHeightProgress <= 1.0) {
        float easedProgress = Sinusoidal_easeInOut(0.0, 1.0, 1.0, screenHeightProgress);
        vec2 center = vec2(Linear_ease(0.5, 0.0, 1.0, easedProgress), 0.5);
        float dissolve = Exponential_easeInOut(0.0, 1.0, 1.0, easedProgress);
        float currentStrength = Sinusoidal_easeInOut(0.0, strength, 0.5, easedProgress);
        
        vec3 tempColor = vec3(0.0);
        float total = 0.0;
        vec2 toCenter = center - uv;

        float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0) * 0.5;

        for (float t = 0.0; t <= 20.0; t++) {
            float percent = (t + offset) / 20.0;
            float weight = 1.0 * (percent - percent * percent);
            tempColor += crossFade(uv + toCenter * percent * currentStrength, dissolve, uTexture1, uTexture2) * weight;
            total += weight;
        }
        color = tempColor / total;

    } else if(screenHeightProgress > 1.0 && screenHeightProgress < 5.0){
        color = texture2D(uTexture2, uv).rgb;
    } else if (screenHeightProgress >= 5.0) { 
        float easedProgress = Sinusoidal_easeInOut(0.0, 1.0, 1.0, screenHeightProgress - 5.0); 
        vec2 center = vec2(Linear_ease(0.5, 0.0, 1.0, easedProgress), 0.5);
        float dissolve = Exponential_easeInOut(0.0, 1.0, 1.0, easedProgress);
        float currentStrength = Sinusoidal_easeInOut(0.0, strength, 0.5, easedProgress);

        vec3 tempColor = vec3(0.0);
        float total = 0.0;
        vec2 toCenter = center - uv;

        float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0) * 0.5;

        for (float t = 0.0; t <= 20.0; t++) {
            float percent = (t + offset) / 20.0;
            float weight = 1.0 * (percent - percent * percent);
            tempColor += crossFade(uv + toCenter * percent * currentStrength, dissolve, uTexture2, uTexture3) * weight;
            total += weight;
        }
        color = tempColor / total;
    }
    
    gl_FragColor = vec4(color, 1.0);
}
