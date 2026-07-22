import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

function buildApp(): App {
  // Preferred: paste the whole downloaded service-account JSON file as one
  // env var. Far less error-prone than splitting the private key into its
  // own variable, where copy/paste tends to mangle the escaped newlines.
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (serviceAccountJson) {
    let parsed: { project_id?: string; client_email?: string; private_key?: string };
    try {
      parsed = JSON.parse(serviceAccountJson);
    } catch {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON. Paste the whole downloaded file as-is.");
    }
    if (!parsed.project_id || !parsed.client_email || !parsed.private_key) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is missing project_id, client_email or private_key.");
    }
    return initializeApp({
      credential: cert({
        projectId: parsed.project_id,
        clientEmail: parsed.client_email,
        privateKey: parsed.private_key,
      }),
    });
  }

  // Fallback: three separate variables.
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase admin credentials. Set FIREBASE_SERVICE_ACCOUNT_JSON (recommended), or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY."
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

let cachedDb: Firestore | null = null;

/** Lazily initializes Firebase Admin on first real use, not at module load —
 * keeps Next.js's build-time route analysis working without env vars present. */
export function getDb(): Firestore {
  if (!cachedDb) {
    const app = getApps().length ? getApps()[0] : buildApp();
    cachedDb = getFirestore(app);
  }
  return cachedDb;
}
