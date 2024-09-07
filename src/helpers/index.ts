export const validatePhone = (phone: string) => {
  var re = /^(0[9|3|7|8|5]([0-9]{8}))$/i;
  return re.test(phone);
};
