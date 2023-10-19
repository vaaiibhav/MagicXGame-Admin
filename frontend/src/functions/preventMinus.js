const preventMinus = (e) => {
  const eventCode = e.code.toLowerCase();
  if (
    !(
      e.code !== null &&
      (eventCode.includes("digit") ||
        eventCode.includes("arrow") ||
        eventCode.includes("home") ||
        eventCode.includes("end") ||
        eventCode.includes("backspace") ||
        eventCode.includes("NumpadSubtract") ||
        eventCode.includes("Minus") ||
        (eventCode.includes("numpad") && eventCode.length === 7))
    )
  ) {
    e.preventDefault();
  }
};
export default preventMinus;
