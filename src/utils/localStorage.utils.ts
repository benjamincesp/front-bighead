export const setLocalStorage = (itemName: string, data: any) => {
  localStorage.setItem(itemName, JSON.stringify(data));
  // Emite un evento personalizado para notificar a otros microfrontends
  const evento = new Event("localstorage-crom-actualizado");
  window.dispatchEvent(evento);
};

export const setRoutingPathStorage = (itemName: string, data: any) => {
  localStorage.setItem(itemName, JSON.stringify(data));
  // Emite un evento personalizado para notificar a otros microfrontends
  const evento = new Event("routing-path-crom-routes");
  window.dispatchEvent(evento);
};
export const getLocalStorage = (itemName: string) => {
  return JSON.parse(localStorage.getItem(itemName) || "{}");
}; /*
export const removeLocalStorage = () => {
  localStorage.removeItem("data");
}; */
