export function computeEMI(principal, annualRate, months) {
  if (
    ![principal, annualRate, months].every(Number.isFinite) ||
    principal < 0 ||
    annualRate < 0 ||
    !Number.isInteger(months) ||
    months < 1
  )
    throw new RangeError("Enter a valid loan amount, rate and tenure.");
  const rate = annualRate / 1200;
  const emi =
    rate === 0
      ? principal / months
      : (principal * rate) / (1 - Math.pow(1 + rate, -months));
  const total_payment = emi * months;
  return {
    principal,
    emi,
    total_payment,
    total_interest: Math.max(0, total_payment - principal),
    tenure_months: months,
  };
}
export function validEMIResponse(data, principal, months) {
  return Boolean(
    data &&
      [data.emi, data.total_payment, data.total_interest, data.principal].every(
        (x) => Number.isFinite(x) && x >= 0,
      ) &&
      data.principal === principal &&
      data.tenure_months === months,
  );
}
