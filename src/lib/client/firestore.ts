import type { RequestRule } from "$lib/client/app_context.svelte";

import { db } from "$lib/client/firebase";
import { collection, deleteDoc, doc, getDocs, limit, orderBy, query, setDoc } from "@firebase/firestore";

export const storeExtensionEnabled = async (userId: string, enabled: boolean) => {
  if (!db) {
    return;
  }

  const docRef = doc(db, "users", userId);
  await setDoc(docRef, { isExtensionEnabled: enabled }, { merge: true });
};

export const updateRuleById = async (userId: string, ruleId: string, updatedRule: Partial<RequestRule>) => {
  if (!db) {
    return;
  }

  const docRef = doc(db, "users", userId, "rules", ruleId);
  await setDoc(docRef, updatedRule, { merge: true });
};

export const deleteRuleById = async (userId: string, ruleId: string) => {
  if (!db) {
    return;
  }

  const docRef = doc(db, "users", userId, "rules", ruleId);
  await deleteDoc(docRef);
};

export const insertRule = async (userId: string, newRule: RequestRule) => {
  if (!db) {
    return;
  }

  const docRef = doc(db, "users", userId, "rules", newRule.id);
  await setDoc(docRef, newRule, { merge: true });
};

export const getNextDNRId = async (userId: string): Promise<number> => {
  if (!db) {
    throw new Error("Firestore database is not initialized.");
  }

  const rulesCollectionRef = collection(db, "users", userId, "rules");
  const q = query(rulesCollectionRef, orderBy("dnrId", "desc"), limit(1));
  const snapshot = await getDocs(q);
  const existingDNRIds = snapshot.docs.map((doc) => (doc.data() as RequestRule).dnrId);
  const maxDNRId = existingDNRIds.length > 0 ? Math.max(...existingDNRIds) : 0;

  return maxDNRId + 1;
};
