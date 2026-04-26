const BASE_URL = 'https://graph.facebook.com/v19.0'

export class WhatsAppService {
  private isDev = process.env.ENVIRONMENT === 'dev'
  private readonly phoneNumberId: string
  private readonly accessToken: string

  constructor() {
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID!
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN!
  }

  async sendText(to: string, text: string): Promise<void> {
    await this.send(to, {
      type: 'text',
      text: { body: text },
    })
  }

  async sendButtons(to: string, body: string, buttons: { id: string; title: string }[]): Promise<void> {
    await this.send(to, {
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { text: body },
        action: {
          buttons: buttons.map(b => ({
            type: 'reply',
            reply: { id: b.id, title: b.title },
          })),
        },
      },
    })
  }

  async sendList(
    to: string,
    body: string,
    buttonLabel: string,
    sections: { title: string; rows: { id: string; title: string; description?: string }[] }[],
  ): Promise<void> {
    await this.send(to, {
      type: 'interactive',
      interactive: {
        type: 'list',
        body: { text: body },
        action: {
          button: buttonLabel,
          sections,
        },
      },
    })
  }

  private async send(to: string, payload: object): Promise<void> {

    if(this.isDev){
      await fetch('http://localhost:3000/simulator/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, body: payload }),
      })
      return
    }

    const response = await fetch(`${BASE_URL}/${this.phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        ...payload,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`WhatsApp API error: ${JSON.stringify(error)}`)
    }
  }
}
