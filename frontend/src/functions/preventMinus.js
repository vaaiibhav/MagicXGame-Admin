const preventMinus = (event) => {
  const dontAllow = ["-", "+", "e", "*", "/"];
  if (dontAllow.includes(event.key)) {
    return event.preventDefault();
  }
};
export default preventMinus;
