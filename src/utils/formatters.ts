export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatShortDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const getTransactionCategories = () => [
  'Salary', 'Freelance', 'Investment', 'Food', 'Transport',
  'Entertainment', 'Shopping', 'Bills', 'Health', 'Education', 'Other',
];

export const getInvestmentTypes = () => [
  'Stocks', 'Bonds', 'Crypto', 'Real Estate', 'Mutual Funds', 'ETF', 'Other',
];
