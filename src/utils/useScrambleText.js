export const useScrambleText = (element, targetText, duration) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]|:;<>,.?/";
  const length = targetText.length;

  let scrambledText = Array(length)
    .fill("")
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join("");

  let startTime = null;

  const update = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;

    const progress = Math.min(elapsed / (duration * 1000), 1);
    const visibleChars = Math.floor(progress * length);

    scrambledText = scrambledText
      .split("")
      .map((char, i) =>
        i < visibleChars
          ? targetText[i]
          : chars[Math.floor(Math.random() * chars.length)]
      )
      .join("");

    element.textContent = scrambledText;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = targetText;
    }
  };

  requestAnimationFrame(update);
};
