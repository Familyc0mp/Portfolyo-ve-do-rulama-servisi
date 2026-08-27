import QRCode from "qrcode";

const VERIFY_BASE_URL =
  process.env.NEXT_PUBLIC_VERIFY_BASE_URL ||
  process.env.NEXT_PUBLIC_APP_URL + "/verify" ||
  "http://localhost:3000/verify";

/**
 * Verilen token için doğrulama URL'ini oluşturur
 */
export function getVerifyUrl(token: string): string {
  return `${VERIFY_BASE_URL}/${token}`;
}

/**
 * QR kod PNG'si oluşturur (sunucu taraflı)
 * Ortasına yeşil onay ikonu çizer
 */
export async function generateQRCodeWithCheckmark(
  token: string
): Promise<string> {
  const url = getVerifyUrl(token);

  // QR kodu önce data URL olarak üret (yüksek hata düzeltmesiyle — ortaya logo için)
  const qrDataUrl = await QRCode.toDataURL(url, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 400,
    color: {
      dark: "#1a1a2e",
      light: "#ffffff",
    },
  });

  return qrDataUrl;
}

/**
 * QR kod SVG string üretir
 */
export async function generateQRCodeSVG(token: string): Promise<string> {
  const url = getVerifyUrl(token);
  return await QRCode.toString(url, {
    type: "svg",
    errorCorrectionLevel: "H",
    margin: 2,
    color: {
      dark: "#1a1a2e",
      light: "#ffffff",
    },
  });
}
