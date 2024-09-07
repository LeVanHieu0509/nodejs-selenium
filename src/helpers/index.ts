export const validatePhone = (phone: string) => {
  var re = /^(0[9|3|7|8|5]([0-9]{8}))$/i;
  return re.test(phone);
};

export const formatNumber = (num: number | string, round?: boolean, minimumFractionDigits = 0) => {
  if (round) {
    return !isNaN(+num)
      ? Math.round(+num)?.toLocaleString("de-DE", { minimumFractionDigits: minimumFractionDigits })
      : "0";
  } else {
    return !isNaN(+num) ? (+num)?.toLocaleString("de-DE", { minimumFractionDigits: minimumFractionDigits }) : "0";
  }
};
