const preventMinus = (event) => {
  const dontAllow = ["-", "+", "e", "*", "/", "`", "!", "E"];
  if (dontAllow.includes(event)) {
    return event.preventDefault();
  }
};
export default preventMinus;
