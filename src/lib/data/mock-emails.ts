import { Email } from '@/lib/types/email'

export const mockEmails: Email[] = [
  {
    id: '1',
    messageId: 'msg-1',
    threadId: 'thread-1',
    from: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      avatar: 'SJ'
    },
    to: [{ name: 'Me', email: 'me@example.com' }],
    subject: 'Q4 Marketing Strategy Review',
    body: `Hi team,

I hope this email finds you well. I wanted to share some thoughts on our Q4 marketing strategy and get your feedback.

Our current campaigns have shown promising results, with a 23% increase in engagement compared to Q3. However, I believe we can do better by focusing on the following areas:

1. Social media presence - We need to increase our posting frequency
2. Content marketing - More blog posts and case studies
3. Email campaigns - Better segmentation and personalization

Let me know your thoughts on this. I'd love to schedule a meeting next week to discuss further.

Best regards,
Sarah`,
    bodyPlain: `Hi team,

I hope this email finds you well. I wanted to share some thoughts on our Q4 marketing strategy and get your feedback.

Our current campaigns have shown promising results, with a 23% increase in engagement compared to Q3. However, I believe we can do better by focusing on the following areas:

1. Social media presence - We need to increase our posting frequency
2. Content marketing - More blog posts and case studies
3. Email campaigns - Better segmentation and personalization

Let me know your thoughts on this. I'd love to schedule a meeting next week to discuss further.

Best regards,
Sarah`,
    preview: 'Hi team, I hope this email finds you well. I wanted to share some thoughts on our Q4 marketing strategy...',
    timestamp: new Date('2024-01-15T10:30:00'),
    read: false,
    starred: true,
    folder: 'inbox',
    labels: ['work', 'important']
  },
  {
    id: '2',
    messageId: 'msg-2',
    threadId: 'thread-2',
    from: {
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      avatar: 'MC'
    },
    to: [{ name: 'Me', email: 'me@example.com' }],
    subject: 'Project Timeline Update',
    body: `Hello,

Just a quick update on the project timeline. We're making good progress and should be on track for the February deadline.

Current status:
- Design phase: 100% complete
- Development: 75% complete
- Testing: 30% complete

I'll send a more detailed report by end of week.

Thanks,
Michael`,
    bodyPlain: `Hello,

Just a quick update on the project timeline. We're making good progress and should be on track for the February deadline.

Current status:
- Design phase: 100% complete
- Development: 75% complete
- Testing: 30% complete

I'll send a more detailed report by end of week.

Thanks,
Michael`,
    preview: 'Just a quick update on the project timeline. We\'re making good progress and should be on track...',
    timestamp: new Date('2024-01-15T09:15:00'),
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['work']
  },
  {
    id: '3',
    messageId: 'msg-3',
    threadId: 'thread-3',
    from: {
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@example.com',
      avatar: 'ER'
    },
    to: [{ name: 'Me', email: 'me@example.com' }],
    cc: [{ name: 'Team', email: 'team@example.com' }],
    subject: 'Team Building Event - Save the Date',
    body: `Hi everyone,

I'm excited to announce our upcoming team building event! 

Date: February 20th, 2024
Time: 2:00 PM - 6:00 PM
Location: Riverside Park

We'll have various activities including:
- Team challenges
- BBQ dinner
- Games and prizes

Please RSVP by February 10th so we can finalize the headcount.

Looking forward to seeing everyone there!

Emily`,
    bodyPlain: `Hi everyone,

I'm excited to announce our upcoming team building event!

Date: February 20th, 2024
Time: 2:00 PM - 6:00 PM
Location: Riverside Park

We'll have various activities including:
- Team challenges
- BBQ dinner
- Games and prizes

Please RSVP by February 10th so we can finalize the headcount.

Looking forward to seeing everyone there!

Emily`,
    preview: 'I\'m excited to announce our upcoming team building event! Date: February 20th, 2024...',
    timestamp: new Date('2024-01-14T16:45:00'),
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['social']
  },
  {
    id: '4',
    messageId: 'msg-4',
    threadId: 'thread-4',
    from: {
      name: 'David Park',
      email: 'david.park@example.com',
      avatar: 'DP'
    },
    to: [{ name: 'Me', email: 'me@example.com' }],
    subject: 'Code Review Request',
    body: `Hey,

Could you review my PR when you get a chance? It's for the new authentication feature.

PR #234: https://github.com/example/repo/pull/234

Main changes:
- Added OAuth2 support
- Improved session management
- Updated security policies

Let me know if you have any questions or concerns.

Thanks!
David`,
    bodyPlain: `Hey,

Could you review my PR when you get a chance? It's for the new authentication feature.

PR #234: https://github.com/example/repo/pull/234

Main changes:
- Added OAuth2 support
- Improved session management
- Updated security policies

Let me know if you have any questions or concerns.

Thanks!
David`,
    preview: 'Could you review my PR when you get a chance? It\'s for the new authentication feature...',
    timestamp: new Date('2024-01-14T14:20:00'),
    read: false,
    starred: true,
    folder: 'inbox',
    labels: ['work', 'urgent']
  },
  {
    id: '5',
    messageId: 'msg-5',
    threadId: 'thread-5',
    from: {
      name: 'Lisa Anderson',
      email: 'lisa.anderson@example.com',
      avatar: 'LA'
    },
    to: [{ name: 'Me', email: 'me@example.com' }],
    subject: 'Meeting Notes - Product Roadmap',
    body: `Hi,

Here are the notes from today's product roadmap meeting:

Key Decisions:
1. Prioritize mobile app development for Q1
2. Delay analytics dashboard to Q2
3. Focus on performance improvements

Action Items:
- Sarah: Create mobile app wireframes (Due: Jan 20)
- Michael: Research mobile frameworks (Due: Jan 18)
- You: Review current performance metrics (Due: Jan 17)

Next meeting: January 22nd at 10 AM

Best,
Lisa`,
    bodyPlain: `Hi,

Here are the notes from today's product roadmap meeting:

Key Decisions:
1. Prioritize mobile app development for Q1
2. Delay analytics dashboard to Q2
3. Focus on performance improvements

Action Items:
- Sarah: Create mobile app wireframes (Due: Jan 20)
- Michael: Research mobile frameworks (Due: Jan 18)
- You: Review current performance metrics (Due: Jan 17)

Next meeting: January 22nd at 10 AM

Best,
Lisa`,
    preview: 'Here are the notes from today\'s product roadmap meeting: Key Decisions: 1. Prioritize mobile...',
    timestamp: new Date('2024-01-13T11:30:00'),
    read: true,
    starred: false,
    folder: 'inbox'
  },
  {
    id: '6',
    messageId: 'msg-6',
    threadId: 'thread-6',
    from: {
      name: 'Me',
      email: 'me@example.com'
    },
    to: [{ name: 'John Smith', email: 'john.smith@example.com' }],
    subject: 'Re: Budget Approval',
    body: `Hi John,

Thanks for your email. I've reviewed the budget proposal and it looks good to me.

I've approved the request and forwarded it to finance for final processing.

Best regards`,
    bodyPlain: `Hi John,

Thanks for your email. I've reviewed the budget proposal and it looks good to me.

I've approved the request and forwarded it to finance for final processing.

Best regards`,
    preview: 'Thanks for your email. I\'ve reviewed the budget proposal and it looks good to me...',
    timestamp: new Date('2024-01-12T15:00:00'),
    read: true,
    starred: false,
    folder: 'sent'
  },
  {
    id: '7',
    messageId: 'msg-7',
    threadId: 'thread-7',
    from: {
      name: 'Me',
      email: 'me@example.com'
    },
    to: [{ name: 'Team', email: 'team@example.com' }],
    subject: 'Weekly Update',
    body: `Team,

Here's a quick update on what I've been working on this week:

Completed:
- Finished user authentication module
- Fixed critical bugs in payment system
- Updated documentation

In Progress:
- Email notification system
- Performance optimization

Blockers:
- Waiting for API keys from third-party service

Let me know if you have any questions.`,
    bodyPlain: `Team,

Here's a quick update on what I've been working on this week:

Completed:
- Finished user authentication module
- Fixed critical bugs in payment system
- Updated documentation

In Progress:
- Email notification system
- Performance optimization

Blockers:
- Waiting for API keys from third-party service

Let me know if you have any questions.`,
    preview: 'Here\'s a quick update on what I\'ve been working on this week: Completed: - Finished user...',
    timestamp: new Date('2024-01-11T17:30:00'),
    read: true,
    starred: false,
    folder: 'sent'
  },
  {
    id: '8',
    messageId: 'msg-8',
    threadId: 'thread-8',
    from: {
      name: 'Me',
      email: 'me@example.com'
    },
    to: [{ name: 'Draft', email: '' }],
    subject: 'Quarterly Report Draft',
    body: `[Draft in progress]

Q4 2023 Performance Summary

Revenue: 
- Total: $X.XX million
- Growth: XX% YoY

Key Achievements:
- 

Challenges:
- 

Q1 2024 Goals:
- `,
    bodyPlain: `[Draft in progress]

Q4 2023 Performance Summary

Revenue:
- Total: $X.XX million
- Growth: XX% YoY

Key Achievements:
-

Challenges:
-

Q1 2024 Goals:
- `,
    preview: '[Draft in progress] Q4 2023 Performance Summary Revenue: - Total: $X.XX million...',
    timestamp: new Date('2024-01-10T09:00:00'),
    read: true,
    starred: false,
    folder: 'drafts'
  },
  {
    id: '9',
    messageId: 'msg-9',
    threadId: 'thread-9',
    from: {
      name: 'Spam Sender',
      email: 'spam@spam.com',
      avatar: 'SS'
    },
    to: [{ name: 'Me', email: 'me@example.com' }],
    subject: 'You won a prize!',
    body: 'Congratulations! Click here to claim your prize...',
    bodyPlain: 'Congratulations! Click here to claim your prize...',
    preview: 'Congratulations! Click here to claim your prize...',
    timestamp: new Date('2024-01-09T08:00:00'),
    read: true,
    starred: false,
    folder: 'trash'
  },
  {
    id: '10',
    messageId: 'msg-10',
    threadId: 'thread-10',
    from: {
      name: 'Robert Taylor',
      email: 'robert.taylor@example.com',
      avatar: 'RT'
    },
    to: [{ name: 'Me', email: 'me@example.com' }],
    subject: 'Invoice #2024-001',
    body: `Dear Customer,

Please find attached the invoice for services rendered in January 2024.

Invoice Number: 2024-001
Amount Due: $2,500.00
Due Date: February 1, 2024

Payment can be made via bank transfer or credit card.

Thank you for your business!

Best regards,
Robert Taylor
Accounting Department`,
    bodyPlain: `Dear Customer,

Please find attached the invoice for services rendered in January 2024.

Invoice Number: 2024-001
Amount Due: $2,500.00
Due Date: February 1, 2024

Payment can be made via bank transfer or credit card.

Thank you for your business!

Best regards,
Robert Taylor
Accounting Department`,
    preview: 'Please find attached the invoice for services rendered in January 2024. Invoice Number: 2024-001...',
    timestamp: new Date('2024-01-15T08:00:00'),
    read: false,
    starred: false,
    folder: 'inbox',
    attachments: [
      {
        id: 'att1',
        filename: 'invoice-2024-001.pdf',
        name: 'invoice-2024-001.pdf',
        size: 245000,
        contentType: 'application/pdf',
        type: 'application/pdf',
        storageKey: 'att1.pdf'
      }
    ]
  }
]

