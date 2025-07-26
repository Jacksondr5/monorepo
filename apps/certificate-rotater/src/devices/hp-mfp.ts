import fs from "fs";
import crypto from "crypto";
import path from "path";
import forge from "node-forge";
import { execSync } from "child_process";

/**
 * Converts a certificate and private key to PKCS12 format
 *
 * @param {string} certPath - Path to the certificate file (.crt)
 * @param {string} keyPath - Path to the private key file (.key)
 * @param {string} outputPath - Path where the PKCS12 file will be saved
 * @param {string} password - Password to protect the PKCS12 file
 * @param {string} [friendlyName=''] - Optional friendly name for the certificate
 */
export function convertToPKCS12(
  certPath: string,
  keyPath: string,
  outputPath: string,
  password: string,
  friendlyName = "",
) {
  try {
    // Read certificate and key files
    // const certChain = fs
    //   .readFileSync(certPath)
    //   .toString()
    //   .split("-----END CERTIFICATE-----")
    //   .map((x) => {
    //     console.log(x);
    //     return forge.pki.certificateFromPem(
    //       x.concat("-----END CERTIFICATE-----"),
    //     );
    //   }
    const cert = forge.pki.certificateFromPem(
      fs.readFileSync(certPath).toString(),
    );
    const key = forge.pki.privateKeyFromPem(
      fs.readFileSync(keyPath).toString(),
    );

    // Create PKCS12 data
    const pkcs12 = forge.pkcs12.toPkcs12Asn1(key, cert, password, {
      friendlyName: friendlyName,
    });

    // Write the PKCS12 file
    fs.writeFileSync(outputPath, forge.asn1.toDer(pkcs12).getBytes());

    console.log(`PKCS12 file created successfully at: ${outputPath}`);
    return true;
  } catch (error) {
    console.error("Error creating PKCS12 file:", error);
    return false;
  }
}

export function convertToPKCS12UsingOpenSSL(
  certPath: string,
  keyPath: string,
  outputPath: string,
  password: string,
) {
  try {
    const command = `openssl pkcs12 -export -out ${outputPath} -inkey ${keyPath} -in ${certPath} -passout pass:${password}`;
    execSync(command);
    console.log(`PKCS12 file created successfully at: ${outputPath}`);
    return true;
  } catch (error) {
    console.error("Error creating PKCS12 file:", error);
    return false;
  }
}
