import { DokuPayment } from "./doku-payment";

export interface GeneratedPaymentVANumber {
  expired_date: Date
  va_number: string
}

export enum PaymentMethod {
  VA_BCA = 'VA_BCA',
  VA_Mandiri = 'VA_Mandiri',
  VA_BNI = 'VA_BNI',
  VA_Permata = 'VA_Permata',
  VA_BRI = 'VA_BRI',
  VA_BSI = 'VA_BSI',
  VA_Danamon = 'VA_Danamon'
}

export interface VAPayload {
  amount_rp: number
  payment_method: PaymentMethod
  invoice_number: string
  email: string
  title: string
}

export async function getVirtualAccountNumber(payload: VAPayload): Promise<GeneratedPaymentVANumber> {
  const doku_payment = new DokuPayment();
  const title = payload.title;
  switch (payload.payment_method) {
    case PaymentMethod.VA_BCA:
      const res_bca_va = await doku_payment.generateVirtAccBCA({
        invoice_number: payload.invoice_number,
        amount: payload.amount_rp,
        title,
        email: payload.email
      });
      
      return {
        va_number: res_bca_va.data.virtual_account_info.virtual_account_number,
        expired_date: new Date(res_bca_va.data.virtual_account_info.expired_date_utc)
      };
    case PaymentMethod.VA_Mandiri:
      const res_mandiri_va = await doku_payment.generateVirtAccMandiri({
        invoice_number: payload.invoice_number,
        amount: payload.amount_rp,
        title,
        email: payload.email
      });
      
      return {
        va_number: res_mandiri_va.data.virtual_account_info.virtual_account_number,
        expired_date: new Date(res_mandiri_va.data.virtual_account_info.expired_date_utc)
      };

    case PaymentMethod.VA_BNI:
      const res_bni_va = await doku_payment.generateVirtAccBNI({
        invoice_number: payload.invoice_number,
        amount: payload.amount_rp,
        title,
        email: payload.email
      });

      return {
        va_number: res_bni_va.data.virtual_account_info.virtual_account_number,
        expired_date: new Date(res_bni_va.data.virtual_account_info.expired_date_utc)
      };

    case PaymentMethod.VA_Permata:
      const res_permata_va = await doku_payment.generateVirtAccGeneral({
        invoice_number: payload.invoice_number,
        amount: payload.amount_rp,
        title,
        email: payload.email
      }, '/permata-virtual-account/v2/payment-code');

      return {
        va_number: res_permata_va.data.virtual_account_info.virtual_account_number,
        expired_date: new Date(res_permata_va.data.virtual_account_info.expired_date_utc)
      };

    case PaymentMethod.VA_BRI:
      const res_bri_va = await doku_payment.generateVirtAccGeneral({
        invoice_number: payload.invoice_number,
        amount: payload.amount_rp,
        title,
        email: payload.email
      }, '/bri-virtual-account/v2/payment-code');

      return {
        va_number: res_bri_va.data.virtual_account_info.virtual_account_number,
        expired_date: new Date(res_bri_va.data.virtual_account_info.expired_date_utc)
      };

    case PaymentMethod.VA_BSI:
      const res_bsm_va = await doku_payment.generateVirtAccGeneral({
        invoice_number: payload.invoice_number,
        amount: payload.amount_rp,
        title,
        email: payload.email
      }, '/bsm-virtual-account/v2/payment-code');

      return {
        va_number: res_bsm_va.data.virtual_account_info.virtual_account_number,
        expired_date: new Date(res_bsm_va.data.virtual_account_info.expired_date_utc)
      };

    case PaymentMethod.VA_Danamon:
      const res_danamon_va = await doku_payment.generateVirtAccDanamon({
        invoice_number: payload.invoice_number,
        amount: payload.amount_rp,
        title,
        email: payload.email
      });

      return {
        va_number: res_danamon_va.data.virtual_account_info.virtual_account_number,
        expired_date: new Date(res_danamon_va.data.virtual_account_info.expired_date_utc),
      };
    default:
      throw new Error(`400: payment method unrecognized`);
  };
}
