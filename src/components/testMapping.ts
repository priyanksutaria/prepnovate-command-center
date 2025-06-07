// testMapping.ts
export const TEST_ID_MAPPING = {
  'Level I': {
    'Ethics & Professional Standards': {
      'Ethics and Trust in the Investment Profession': '1-1-1',
      'Code of Ethics and Standards of Professional Conduct': '1-1-2',
      'Guidance for Standards I-VII': '1-1-3',
      'Introduction to the Global Investment Performance': '1-1-4',
      'Ethics Application': '1-1-5'
    },
    'Financial Statement Analysis': {
      'Introduction to Financial Statement Analysis': '1-2-1',
      'Analyzing Income Statements': '1-2-2',
      'Analyzing Balance Sheets': '1-2-3',
      'Analyzing Statements of Cash Flows I': '1-2-4',
      'Analyzing Statements of Cash Flows II': '1-2-5',
      'Analysis of Inventories': '1-2-6',
      'Analysis of Long-Term Assets': '1-2-7',
      'Topics in Long-Term Liabilities and Equity': '1-2-8',
      'Analysis of Income Taxes': '1-2-9',
      'Financial Reporting Quality': '1-2-10',
      'Financial Analysis Techniques': '1-2-11',
      'Introduction to Financial Statement Modeling': '1-2-12'
    },
    'Alternative Investments': {
      'Alternative Investment Features, Methods, and Structures': '1-3-1',
      'Alternative Investment Performance and Returns': '1-3-2',
      'Investment in Private Capital: Equity and Debt': '1-3-3',
      'Real Estate and Infrastructure': '1-3-4',
      'Natural Resources': '1-3-5',
      'Hedge Funds': '1-3-6',
      'Introduction to Digital Assets': '1-3-7'
    },
    'Derivatives': {
      'Derivative Instrument and Derivative Market Features': '1-4-1',
      'Forward Commitment and Contingent Claim Features and Instruments': '1-4-2',
      'Derivative Benefits, Risks, and Issuer and Investor Uses': '1-4-3',
      'Arbitrage, Replication, and the Cost of Carry in Pricing Derivatives': '1-4-4',
      'Pricing and Valuation of Forward Contracts and for an Underlying with Varying Maturities': '1-4-5',
      'Pricing and Valuation of Futures Contracts': '1-4-6',
      'Pricing and Valuation of Interest Rates and Other Swaps': '1-4-7',
      'Pricing and Valuation of Options': '1-4-8',
      'Option Replication Using Put-Call Parity': '1-4-9',
      'Valuing a Derivative Using a One-Period Binomial Model': '1-4-10'
    },
    'Quantitative Methods': {
      'Rates and Returns': '1-5-1',
      'The Time Value of Money in Finance': '1-5-2',
      'Statistical Measures of Asset Returns': '1-5-3',
      'Probability Trees': '1-5-4',
      'Portfolio Mathematics': '1-5-5',
      'Simulation Methods': '1-5-6',
      'Estimation and Inference': '1-5-7',
      'Hypothesis Testing': '1-5-8',
      'Parametric and Non-Parametric Tests of Independence': '1-5-9',
      'Simple Linear Regression': '1-5-10',
      'Introduction to Big Data Techniques': '1-5-11'
    },
    'Economics': {
      'Firms and Market Structures': '1-6-1',
      'Understanding Business Cycles': '1-6-2',
      'Fiscal Policy': '1-6-3',
      'Monetary Policy': '1-6-4',
      'Introduction to Geopolitics': '1-6-5',
      'International Trade': '1-6-6',
      'Capital Flows and the FX Market': '1-6-7',
      'Exchange Rate Calculations': '1-6-8'
    },
    'Corporate Issuers': {
      'Organizational Forms, Corporate Issuer Features, and Ownership': '1-7-1',
      'Investors and Other Stakeholders': '1-7-2',
      'Corporate Governance: Conflicts, Mechanisms, Risks': '1-7-3',
      'Working Capital and Liquidity': '1-7-4',
      'Capital Investments and Capital Allocation': '1-7-5',
      'Capital Structure': '1-7-6',
      'Business Models': '1-7-7'
    },
    'Equity': {
      'Market Organization and Structure': '1-8-1',
      'Security Market Indexes': '1-8-2',
      'Market Efficiency': '1-8-3',
      'Overview of Equity Securities': '1-8-4',
      'Company Analysis: Past and Present': '1-8-5',
      'Industry and Competitive Analysis': '1-8-6',
      'Company Analysis: Forecasting': '1-8-7',
      'Equity Valuation: Concepts and Basic Tools': '1-8-8'
    },
    'Fixed Income': {
      'Fixed-Income Instrument Features': '1-9-1',
      'Fixed-Income Cash Flows and Types': '1-9-2',
      'Fixed-Income Issuance and Trading': '1-9-3',
      'Fixed-Income Markets for Corporate Issuers': '1-9-4',
      'Fixed-Income Markets for Government Issuers': '1-9-5',
      'Fixed-Income Bond Valuation: Prices and Yields': '1-9-6',
      'Yield and Yield Spread Measures for Fixed Rate Bonds': '1-9-7',
      'Yield and Yield Spread Measures for Floating-Rate Instruments': '1-9-8',
      'The Term Structure of Interest Rates: Spot, Par, and Forward Curve': '1-9-9',
      'Interest Rate Risk and Return': '1-9-10',
      'Yield-Based Bond Duration Measures and Properties': '1-9-11',
      'Yield-Based Bond Convexity and Portfolio Properties': '1-9-12',
      'Curve-Based and Empirical Fixed-Income Risk Measures': '1-9-13',
      'Credit Risk': '1-9-14',
      'Credit Analysis for Government Issuers': '1-9-15',
      'Credit Analysis for Corporate Issuers': '1-9-16',
      'Fixed-Income Securitization': '1-9-17',
      'Asset-Backed Security (ABS) Instrument and Market Features': '1-9-18',
      'Mortgage-Backed Security (MBS) Instrument and Market Features': '1-9-19'
    },
    'Portfolio Management': {
      'Portfolio Risk and Return: Part I': '1-10-1',
      'Portfolio Risk and Return: Part II': '1-10-2',
      'Portfolio Management: An Overview': '1-10-3',
      'Basics of Portfolio Planning and Construction': '1-10-4',
      'The Behavioral Biases of Individuals': '1-10-5',
      'Introduction to Risk Management': '1-10-6'
    }
  },
  'Level II': { /* Add details for Level II */ },
  'Level III': { /* Add details for Level III */ }
};

export type TestLevel = keyof typeof TEST_ID_MAPPING;
export type TestSubject = keyof typeof TEST_ID_MAPPING['Level I'];
export type TestChapter = keyof typeof TEST_ID_MAPPING['Level I']['Ethics & Professional Standards'];