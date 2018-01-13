# Froogle | Personal finance tracker

## Description

This web application tracks your monthly spending and income.

Set up categories for spending (e.g. #groceries, #rent, #recreation) and income (e.g. #income, #work, #sidehustle, #gifts), and then estimate monthly targets to complete your budget.

Enter transactions easily in a single text field, and see your progress as time passes. Check how you did at the end of the month, add new categories or adjust your targets, and browse past months at any time.

## Basic functionality

- **Done**: Input a transaction via a simple string
  - Auto-recognize transaction data:
    - Date
    - Amount
    - Description
    - Category
- **Done**: List the transactions in reverse chronological order
- **Done**: Display the total amount spent

## Enhancements

- Allow editing of transactions
- Optionally accept a target amount for each category
  - Show progress towards target by category
- Create a monthly budget from all categories and their targets
  - Show progress towards monthly budget
- Preserve a full history by month
  - Every new month, categories and targets from last month are preserved and actual spending/income resets to 0
  - View and edit past months
- Do math while entering transactions
- Track money owed to or from others
  - Log while entering a transaction (e.g. Split dinner with a friend - I spent 1/2 on #restaurants and they owe me the other half)
  - Coudld be a shared category between users
- Export all data as CSV

## Credits

This project used [HackerYou's React Boilerplate](https://github.com/HackerYou/react-boilerplate) as a starting point.