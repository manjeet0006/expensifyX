const formatINR = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    }).format(Number(amount.toFixed(2))); // Ensures 2 decimals only


export default formatINR