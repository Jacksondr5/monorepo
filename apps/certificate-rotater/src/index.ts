import { convertToPKCS12, convertToPKCS12UsingOpenSSL } from "./devices/hp-mfp";

// convertToPKCS12(
//   "./certs/hp-mfp-tls.crt",
//   "./certs/hp-mfp-tls.key",
//   "./certs/hp-mfp-tls.p12",
//   "password",
//   "J5 HP-MFP TLS Certificate",
// );

convertToPKCS12UsingOpenSSL(
  "./certs/hp-mfp-tls.crt",
  "./certs/hp-mfp-tls.key",
  "./certs/hp-mfp-tls.p12",
  "cUp6WKpjizCqCB",
);
