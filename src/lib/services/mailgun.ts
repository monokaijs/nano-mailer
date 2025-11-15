import Mailgun from "mailgun.js";

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY!,
});

class MailgunService {
  async sendEmail(to: string, subject: string, text: string) {
    await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: "noreply@domain.com",
      to,
      subject,
      text,
    });
  }
  async bindWebhook(domain: string, url: string) {
    await mg.routes.create({
      priority: 0,
      description: "Route for " + domain,
      expression: `match_recipient("@" + ${domain})`,
      action: ["forward(\"" + url + "\")"],
    });
  }
  async unbindWebhook(id: string) {
    await mg.routes.destroy(id);
  }
}

export const mailgunService = new MailgunService();
