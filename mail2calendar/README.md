# mail2calendar

Create and delete events based on mail.

## mail2calendar_one_mail_per_day.js
- If one mail per day, we can use `label`, not `star`.
- This creates event date based on `message.getDate`.

## mail2calendar_several_mails_per_day.js
- If several mails per day, we need to use `star` because `label` and `archive` are added to `thread`.
- This creates event date based on `message.getPlainBody`.
