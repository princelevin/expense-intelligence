import type { RawTransaction } from '../schemas/transaction.js';
import type { Categorizer, CategorizerResult } from './types.js';

interface CategoryRule {
  category: string;
  keywords: string[];
  merchantPatterns?: Array<{ pattern: RegExp; merchant: string }>;
}

const CATEGORY_RULES: CategoryRule[] = [
  {
    category: 'Food & Dining',
    keywords: ['swiggy', 'zomato', 'restaurant', 'cafe', 'food', 'pizza', 'burger', 'dominos', 'mcdonalds', 'kfc', 'biryani', 'hotel', 'dining', 'eat', 'meal', 'lunch', 'dinner', 'breakfast', 'barbeque'],
    merchantPatterns: [
      { pattern: /swiggy/i, merchant: 'Swiggy' },
      { pattern: /zomato/i, merchant: 'Zomato' },
      { pattern: /domino/i, merchant: "Domino's" },
      { pattern: /mcdonald/i, merchant: "McDonald's" },
      { pattern: /kfc/i, merchant: 'KFC' },
    ],
  },
  {
    category: 'Shopping',
    keywords: ['amazon', 'flipkart', 'myntra', 'ajio', 'shopping', 'mart', 'store', 'retail', 'mall', 'bazaar', 'big basket', 'bigbasket', 'dmart', 'reliance', 'nykaa', 'meesho'],
    merchantPatterns: [
      { pattern: /amazon/i, merchant: 'Amazon' },
      { pattern: /flipkart/i, merchant: 'Flipkart' },
      { pattern: /myntra/i, merchant: 'Myntra' },
      { pattern: /bigbasket|big basket/i, merchant: 'BigBasket' },
      { pattern: /dmart/i, merchant: 'DMart' },
    ],
  },
  {
    category: 'Transport',
    keywords: ['uber', 'ola', 'rapido', 'metro', 'irctc', 'petrol', 'diesel', 'fuel', 'parking', 'toll', 'cab', 'taxi', 'auto', 'train', 'flight', 'makemytrip', 'redbus'],
    merchantPatterns: [
      { pattern: /uber/i, merchant: 'Uber' },
      { pattern: /ola/i, merchant: 'Ola' },
      { pattern: /rapido/i, merchant: 'Rapido' },
      { pattern: /irctc/i, merchant: 'IRCTC' },
    ],
  },
  {
    category: 'Bills & Utilities',
    keywords: ['electricity', 'water', 'gas', 'broadband', 'internet', 'wifi', 'jio', 'airtel', 'vi ', 'bsnl', 'mobile recharge', 'recharge', 'dth', 'tata sky', 'bill pay', 'postpaid', 'prepaid'],
    merchantPatterns: [
      { pattern: /jio/i, merchant: 'Jio' },
      { pattern: /airtel/i, merchant: 'Airtel' },
    ],
  },
  {
    category: 'Entertainment',
    keywords: ['netflix', 'hotstar', 'spotify', 'prime video', 'youtube', 'movie', 'cinema', 'pvr', 'inox', 'bookmyshow', 'game', 'play store', 'apple', 'subscription'],
    merchantPatterns: [
      { pattern: /netflix/i, merchant: 'Netflix' },
      { pattern: /hotstar|disney/i, merchant: 'Disney+ Hotstar' },
      { pattern: /spotify/i, merchant: 'Spotify' },
      { pattern: /bookmyshow/i, merchant: 'BookMyShow' },
    ],
  },
  {
    category: 'Health & Medical',
    keywords: ['pharmacy', 'hospital', 'doctor', 'medical', 'health', 'pharma', 'medicine', 'clinic', 'apollo', 'medplus', 'netmeds', 'practo', 'diagnostic', 'lab', 'pathology'],
    merchantPatterns: [
      { pattern: /apollo/i, merchant: 'Apollo' },
      { pattern: /pharmeasy|pharma easy/i, merchant: 'PharmEasy' },
    ],
  },
  {
    category: 'Education',
    keywords: ['school', 'college', 'university', 'course', 'udemy', 'coursera', 'byju', 'unacademy', 'education', 'tuition', 'coaching', 'book', 'stationery'],
  },
  {
    category: 'Rent & Housing',
    keywords: ['rent', 'housing', 'maintenance', 'society', 'apartment', 'flat', 'property', 'broker'],
  },
  {
    category: 'Insurance',
    keywords: ['insurance', 'lic', 'policy', 'premium', 'hdfc life', 'icici lombard', 'star health'],
  },
  {
    category: 'Investments',
    keywords: ['mutual fund', 'sip', 'zerodha', 'groww', 'upstox', 'investment', 'stock', 'share', 'demat', 'nps', 'ppf', 'fd ', 'fixed deposit'],
    merchantPatterns: [
      { pattern: /zerodha/i, merchant: 'Zerodha' },
      { pattern: /groww/i, merchant: 'Groww' },
    ],
  },
  {
    category: 'Transfer',
    keywords: ['neft', 'imps', 'rtgs', 'upi', 'transfer', 'fund transfer', 'self transfer', 'ft-'],
  },
  {
    category: 'ATM Withdrawal',
    keywords: ['atm', 'cash withdrawal', 'cash deposit'],
  },
  {
    category: 'EMI & Loans',
    keywords: ['emi', 'loan', 'instalment', 'installment', 'bajaj finserv', 'personal loan', 'home loan'],
  },
];

class RuleCategorizer implements Categorizer {
  categorize(transaction: RawTransaction): CategorizerResult {
    const description = transaction.description.toLowerCase();

    for (const rule of CATEGORY_RULES) {
      const matched = rule.keywords.some(keyword => description.includes(keyword));
      if (matched) {
        let merchant = 'Unknown';
        if (rule.merchantPatterns) {
          for (const mp of rule.merchantPatterns) {
            if (mp.pattern.test(transaction.description)) {
              merchant = mp.merchant;
              break;
            }
          }
        }

        return {
          category: rule.category,
          confidence: 0.7,
          merchant,
        };
      }
    }

    return {
      category: 'Uncategorized',
      confidence: 0.0,
      merchant: 'Unknown',
    };
  }
}

export const ruleCategorizer = new RuleCategorizer();
