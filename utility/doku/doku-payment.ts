import crypto from 'crypto';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export interface DokuPaymentRequest {
  invoice_number: string
  amount: number
  title: string
  email: string
}

export interface DokuPaymentResponse {
  payment_id: string
  data: {
    order: {
      invoice_number: string
    }
    virtual_account_info: {
      virtual_account_number: string
      how_to_pay_page: string
      how_to_pay_api: string
      created_date: string
      expired_date: string
      created_date_utc: string
      expired_date_utc: string
    }
  }
}

export class DokuPayment {
  private DOKU_CLIENT_ID = process.env.DOKU_CLIENT_ID ?? '';
  private DOKU_SECRET_KEY = process.env.DOKU_SECRET_KEY ?? '';
  private DOKU_ENDPOINT = process.env.DOKU_ENDPOINT ?? 'https://api-sandbox.doku.com';

  private createSignature(request_id: string, target: string, body: any, iso_timestamp: string) {
    const raw_string_data = [
      `Client-Id:${this.DOKU_CLIENT_ID}`,
      `Request-Id:${request_id}`,
      `Request-Timestamp:${iso_timestamp}`,
      `Request-Target:${target}`,
      `Digest:${crypto.createHash('sha256').update(JSON.stringify(body)).digest('base64')}`
    ];
    const signature = crypto.createHmac('sha256', this.DOKU_SECRET_KEY).update(raw_string_data.join('\n')).digest('base64');
    console.log('signature=', signature);

    return `HMACSHA256=${signature}`;
  }

  public async generateVirtAccBCA(data: DokuPaymentRequest): Promise<DokuPaymentResponse> {
    const payment_id = uuidv4();
    const iso_ts = new Date().toISOString().slice(0, 19) + 'Z'; // <-- ??
    const target_url = '/bca-virtual-account/v2/payment-code';

    const payment_data = {
      order: {
        invoice_number: data.invoice_number,
        amount: data.amount
      },
      virtual_account_info: {
        billing_type: "FIX_BILL",
        expired_time: 60,
        reusable_status: false,
        info1: data.title.replace(/[^a-z0-9\ ]/gi, ''),
        info2: "Thank you for purchasing",
        info3: "on Graf Research"
      },
      customer: {
        name: data.title.replace(/[^a-z0-9\ ]/gi, ''),
        email: "info@graf-research.com"
      }
    };

    try {
      const response = await axios({
        url: `${this.DOKU_ENDPOINT}${target_url}`,
        method: 'POST',
        data: payment_data,
        headers: {
          'Content-Type': 'application/json',
          'Client-Id': this.DOKU_CLIENT_ID,
          'Request-Id': payment_id,
          'Request-Timestamp': iso_ts,
          'Signature': this.createSignature(payment_id, target_url, payment_data, iso_ts)
        },
      });
      return {
        payment_id,
        data: response.data
      };
    } catch (err: any) {
      if (err?.response?.data) {
        console.log(err.response.data);
      } else {
        console.log(err);
      }
      throw err;
    }
  }

  public async generateVirtAccMandiri(data: DokuPaymentRequest): Promise<DokuPaymentResponse> {
    const payment_id = uuidv4();
    const iso_ts = new Date().toISOString().slice(0, 19) + 'Z'; // <-- ??
    const target_url = '/mandiri-virtual-account/v2/payment-code';

    const payment_data = {
      order: {
        invoice_number: data.invoice_number,
        amount: data.amount
      },
      virtual_account_info: {
        billing_type: "FIX_BILL",
        expired_time: 60,
        reusable_status: false,
        info1: data.title.replace(/[^a-z0-9\ ]/gi, ''),
        info2: "Thank you for purchasing",
        info3: "on Graf Research"
      },
      customer: {
        name: data.title.replace(/[^a-z0-9\ ]/gi, ''),
        email: "info@graf-research.com"
      }
    };

    try {
      const response = await axios({
        url: `${this.DOKU_ENDPOINT}${target_url}`,
        method: 'POST',
        data: payment_data,
        headers: {
          'Content-Type': 'application/json',
          'Client-Id': this.DOKU_CLIENT_ID,
          'Request-Id': payment_id,
          'Request-Timestamp': iso_ts,
          'Signature': this.createSignature(payment_id, target_url, payment_data, iso_ts)
        },
      });
      return {
        payment_id,
        data: response.data
      };
    } catch (err: any) {
      if (err?.response?.data) {
        console.log(err.response.data);
      } else {
        console.log(err);
      }
      throw err;
    }
  }

  public async generateVirtAccBNI(data: DokuPaymentRequest): Promise<DokuPaymentResponse> {
    const payment_id = uuidv4();
    const iso_ts = new Date().toISOString().slice(0, 19) + 'Z'; // <-- ??
    const target_url = '/bni-virtual-account/v2/payment-code';

    const payment_data = {
      order: {
        invoice_number: data.invoice_number,
        amount: data.amount
      },
      virtual_account_info: {
        billing_type: "FIX_BILL",
        expired_time: 60,
        reusable_status: false,
        merchant_unique_reference: payment_id.slice(0, 12)
      },
      customer: {
        name: data.title.replace(/[^a-z0-9\ ]/gi, ''),
        email: "info@graf-research.com"
      }
    };

    try {
      const response = await axios({
        url: `${this.DOKU_ENDPOINT}${target_url}`,
        method: 'POST',
        data: payment_data,
        headers: {
          'Content-Type': 'application/json',
          'Client-Id': this.DOKU_CLIENT_ID,
          'Request-Id': payment_id,
          'Request-Timestamp': iso_ts,
          'Signature': this.createSignature(payment_id, target_url, payment_data, iso_ts)
        },
      });
      return {
        payment_id,
        data: response.data
      };
    } catch (err: any) {
      if (err?.response?.data) {
        console.log(err.response.data);
      } else {
        console.log(err);
      }
      throw err;
    }
  }

  public async generateVirtAccDanamon(data: DokuPaymentRequest): Promise<DokuPaymentResponse> {
    const payment_id = uuidv4();
    const iso_ts = new Date().toISOString().slice(0, 19) + 'Z'; // <-- ??
    const target_url = '/danamon-virtual-account/v2/payment-code';

    const payment_data = {
      order: {
        invoice_number: data.invoice_number,
        amount: data.amount
      },
      virtual_account_info: {
        billing_type: "FULL_PAYMENT",
        expired_time: 60,
        reusable_status: false
      },
      customer: {
        name: data.title.replace(/[^a-z0-9\ ]/gi, ''),
        email: "info@graf-research.com"
      }
    };

    try {
      const response = await axios({
        url: `${this.DOKU_ENDPOINT}${target_url}`,
        method: 'POST',
        data: payment_data,
        headers: {
          'Content-Type': 'application/json',
          'Client-Id': this.DOKU_CLIENT_ID,
          'Request-Id': payment_id,
          'Request-Timestamp': iso_ts,
          'Signature': this.createSignature(payment_id, target_url, payment_data, iso_ts)
        },
      });
      return {
        payment_id,
        data: response.data
      };
    } catch (err: any) {
      if (err?.response?.data) {
        console.log(err.response.data);
      } else {
        console.log(err);
      }
      throw err;
    }
  }

  public async generateVirtAccGeneral(data: DokuPaymentRequest, target_url: string): Promise<DokuPaymentResponse> {
    const payment_id = uuidv4();
    const iso_ts = new Date().toISOString().slice(0, 19) + 'Z'; // <-- ??

    const payment_data = {
      order: {
        invoice_number: data.invoice_number,
        amount: data.amount
      },
      virtual_account_info: {
        billing_type: "FIX_BILL",
        expired_time: 60,
        reusable_status: false
      },
      customer: {
        name: data.title.replace(/[^a-z0-9\ ]/gi, ''),
        email: "info@graf-research.com"
      }
    };

    try {
      const response = await axios({
        url: `${this.DOKU_ENDPOINT}${target_url}`,
        method: 'POST',
        data: payment_data,
        headers: {
          'Content-Type': 'application/json',
          'Client-Id': this.DOKU_CLIENT_ID,
          'Request-Id': payment_id,
          'Request-Timestamp': iso_ts,
          'Signature': this.createSignature(payment_id, target_url, payment_data, iso_ts)
        },
      });
      return {
        payment_id,
        data: response.data
      };
    } catch (err: any) {
      if (err?.response?.data) {
        console.log(err.response.data);
      } else {
        console.log(err);
      }
      throw err;
    }
  }
}
