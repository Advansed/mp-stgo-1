declare module 'qrcode' {
  interface QRCodeStatic {
    toDataURL(text: string, options?: { margin?: number; width?: number }): Promise<string>;
  }
  const QRCode: QRCodeStatic;
  export default QRCode;
}
