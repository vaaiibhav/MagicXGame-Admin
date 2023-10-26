const preventMinus = (e) => {
  const eventCode = e.code.toLowerCase();
  if (
    !(
      e.code !== null &&
      (eventCode.includes("arrow") ||
        eventCode.includes("home") ||
        eventCode.includes("end") ||
        eventCode.includes("backspace") ||
        eventCode.includes("numpad")) &&
      !(eventCode.includes("minus") || eventCode.includes("numpadsubtract"))
    )
  ) {
    e.preventDefault();
  }
};
export default preventMinus;
