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
    keywords: ['swiggy', 'zomato', 'restaurant', 'cafe', 'food', 'pizza', 'burger', 'dominos', 'mcdonalds', 'kfc', 'biryani', 'hotel', 'dining', 'eat', 'meal', 'lunch', 'dinner', 'breakfast', 'barbeque', 'hungerbox', 'munchmar', 'zepto', 'blinkit', 'grofers'],
    merchantPatterns: [
      { pattern: /swiggy/i, merchant: 'Swiggy' },
      { pattern: /zomato/i, merchant: 'Zomato' },
      { pattern: /domino/i, merchant: "Domino's" },
      { pattern: /mcdonald/i, merchant: "McDonald's" },
      { pattern: /kfc/i, merchant: 'KFC' },
      { pattern: /hungerbox/i, merchant: 'HungerBox' },
      { pattern: /munchmar/i, merchant: 'MunchMar' },
      { pattern: /zepto/i, merchant: 'Zepto' },
      { pattern: /blinkit/i, merchant: 'Blinkit' },
    ],
  },
  {
    category: 'Shopping',
    keywords: ['amazon', 'flipkart', 'myntra', 'ajio', 'shopping', 'mart', 'store', 'retail', 'mall', 'bazaar', 'dmart', 'reliance', 'nykaa', 'meesho', 'decathlon'],
    merchantPatterns: [
      { pattern: /amazon/i, merchant: 'Amazon' },
      { pattern: /flipkart/i, merchant: 'Flipkart' },
      { pattern: /myntra/i, merchant: 'Myntra' },
      { pattern: /dmart/i, merchant: 'DMart' },
      { pattern: /decathlon/i, merchant: 'Decathlon' },
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
      { pattern: /redbus/i, merchant: 'RedBus' },
      { pattern: /makemytrip/i, merchant: 'MakeMyTrip' },
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
    category: 'Salary',
    keywords: ['salary', 'sal credit', 'payroll'],
    merchantPatterns: [
      { pattern: /microsoft/i, merchant: 'Microsoft India' },
      { pattern: /tcs|tata consultancy/i, merchant: 'TCS' },
      { pattern: /infosys/i, merchant: 'Infosys' },
      { pattern: /wipro/i, merchant: 'Wipro' },
      { pattern: /cognizant/i, merchant: 'Cognizant' },
      { pattern: /accenture/i, merchant: 'Accenture' },
      { pattern: /google/i, merchant: 'Google' },
    ],
  },
  {
    category: 'Transfer',
    keywords: ['imps', 'upi', 'transfer', 'fund transfer', 'self transfer', 'ft-'],
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

    // Special case: NEFT/RTGS credits from companies are likely salary
    if (transaction.type === 'credit' && (description.includes('neft') || description.includes('rtgs'))) {
      const salaryRule = CATEGORY_RULES.find(r => r.category === 'Salary');
      if (salaryRule?.merchantPatterns) {
        for (const mp of salaryRule.merchantPatterns) {
          if (mp.pattern.test(transaction.description)) {
            return { category: 'Salary', confidence: 0.85, merchant: mp.merchant };
          }
        }
      }
    }

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
