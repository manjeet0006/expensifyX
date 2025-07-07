export const defaultCategories = [
  // Income Categories
  {
    id: "salary",
    name: "Salary",
    type: "INCOME",
    color: "#22c55e",
    icon: "Wallet",
  },
  {
    id: "freelance",
    name: "Freelance",
    type: "INCOME",
    color: "#06b6d4",
    icon: "Laptop",
  },
  {
    id: "investments",
    name: "Investments",
    type: "INCOME",
    color: "#6366f1",
    icon: "TrendingUp",
  },
  {
    id: "business",
    name: "Business",
    type: "INCOME",
    color: "#ec4899",
    icon: "Building",
  },
  {
    id: "rental",
    name: "Rental",
    type: "INCOME",
    color: "#f59e0b",
    icon: "Home",
  },
  {
    id: "cashback",
    name: "Cashback & Rewards",
    type: "INCOME",
    color: "#22d3ee", // cyan-400
    icon: "Gift",
  },
  {
    id: "gifts-income",
    name: "Gift Received",
    type: "INCOME",
    color: "#e879f9", // fuchsia-400
    icon: "Smile",
  },
  {
    id: "refunds",
    name: "Refunds & Reimbursements",
    type: "INCOME",
    color: "#4ade80", // green-400
    icon: "RotateCcw",
  },
  {
    id: "other-income",
    name: "Other Income",
    type: "INCOME",
    color: "#64748b",
    icon: "Plus",
  },

  // EXPENSE Categories
  {
    id: "housing",
    name: "Housing",
    type: "EXPENSE",
    color: "#ef4444",
    icon: "Home",
    subcategories: ["Rent", "Mortgage", "Property Tax", "Maintenance"],
  },
  {
    id: "transportation",
    name: "Transportation",
    type: "EXPENSE",
    color: "#f97316",
    icon: "Car",
    subcategories: ["Fuel", "Public Transport", "Maintenance", "Parking"],
  },
  {
    id: "groceries",
    name: "Groceries",
    type: "EXPENSE",
    color: "#84cc16",
    icon: "Shopping",
  },
  {
    id: "utilities",
    name: "Utilities",
    type: "EXPENSE",
    color: "#06b6d4",
    icon: "Zap",
    subcategories: ["Electricity", "Water", "Gas", "Internet", "Phone"],
  },
  {
    id: "subscriptions",
    name: "Subscriptions",
    type: "EXPENSE",
    color: "#3b82f6",
    icon: "Repeat",
    subcategories: ["Netflix", "Spotify", "Cloud Storage", "Apps"],
  },
  {
    id: "entertainment",
    name: "Entertainment",
    type: "EXPENSE",
    color: "#8b5cf6",
    icon: "Film",
    subcategories: ["Movies", "Games", "Streaming Services"],
  },
  {
    id: "food",
    name: "Food",
    type: "EXPENSE",
    color: "#f43f5e",
    icon: "UtensilsCrossed",
  },
  {
    id: "shopping",
    name: "Shopping",
    type: "EXPENSE",
    color: "#ec4899",
    icon: "ShoppingBag",
    subcategories: ["Clothing", "Electronics", "Home Goods"],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    type: "EXPENSE",
    color: "#14b8a6",
    icon: "HeartPulse",
    subcategories: ["Medical", "Dental", "Pharmacy", "Insurance"],
  },
  {
    id: "education",
    name: "Education",
    type: "EXPENSE",
    color: "#6366f1",
    icon: "GraduationCap",
    subcategories: ["Tuition", "Books", "Courses"],
  },
  {
    id: "personal",
    name: "Personal Care",
    type: "EXPENSE",
    color: "#d946ef",
    icon: "Smile",
    subcategories: ["Haircut", "Gym", "Beauty"],
  },
  {
    id: "travel",
    name: "Travel",
    type: "EXPENSE",
    color: "#0ea5e9",
    icon: "Plane",
  },
  {
    id: "insurance",
    name: "Insurance",
    type: "EXPENSE",
    color: "#64748b",
    icon: "Shield",
    subcategories: ["Life", "Home", "Vehicle"],
  },
  {
    id: "gifts",
    name: "Gifts & Donations",
    type: "EXPENSE",
    color: "#f472b6",
    icon: "Gift",
  },
  {
    id: "bills",
    name: "Bills & Fees",
    type: "EXPENSE",
    color: "#fb7185",
    icon: "Receipt",
    subcategories: ["Bank Fees", "Late Fees", "Service Charges"],
  },
  {
    id: "kids",
    name: "Children",
    type: "EXPENSE",
    color: "#fcd34d", // yellow-300
    icon: "Baby",
    subcategories: ["School Fees", "Toys", "Childcare", "Clothing"],
  },
  {
    id: "pets",
    name: "Pets",
    type: "EXPENSE",
    color: "#f87171", // red-400
    icon: "PawPrint",
    subcategories: ["Food", "Vet", "Grooming", "Toys"],
  },
  {
    id: "loan-payments",
    name: "Loans & EMIs",
    type: "EXPENSE",
    color: "#a855f7", // purple-500
    icon: "IndianRupee",
    subcategories: ["Personal Loan", "Car Loan", "Education Loan"],
  },
  {
    id: "savings",
    name: "Savings & Investments",
    type: "EXPENSE",
    color: "#10b981", // emerald-500
    icon: "Banknote",
    subcategories: ["Emergency Fund", "Retirement", "FDs"],
  },
  {
    id: "taxes",
    name: "Taxes",
    type: "EXPENSE",
    color: "#f59e0b", // amber-500
    icon: "FileText",
    subcategories: ["Income Tax", "GST", "Other Taxes"],
  },
  {
    id: "legal",
    name: "Legal & Professional",
    type: "EXPENSE",
    color: "#f87171",
    icon: "Gavel",
    subcategories: ["Lawyer", "Consulting", "CA Fees"],
  },
  {
    id: "household",
    name: "Household Supplies",
    type: "EXPENSE",
    color: "#60a5fa", // blue-400
    icon: "Broom",
    subcategories: ["Cleaning", "Laundry", "Paper Goods"],
  },
  {
    id: "banking",
    name: "Banking Charges",
    type: "EXPENSE",
    color: "#94a3b8", // slate-400
    icon: "CreditCard",
    subcategories: ["ATM Fees", "Maintenance Fees"],
  },
  {
    id: "other-EXPENSE",
    name: "Other EXPENSEs",
    type: "EXPENSE",
    color: "#94a3b8",
    icon: "MoreHorizontal",
  },
];

export const categoryColors = defaultCategories.reduce((acc, category) => {
  acc[category.id] = category.color;
  return acc;
}, {});