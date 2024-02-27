import {
  CollectionReference,
  Firestore,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { Nullable } from "../types/nullable";
import { DocumentReference } from "firebase/firestore/lite";
import { UserAppModel, UserDBModel } from "./user.storage";
import { DocumentID } from "../types/firestore";

export enum HeaderOperation {
  APPEND = "append",
  SET = "set",
  REMOVE = "remove",
}

export enum RuleActionType {
  BLOCK = "block",
  REDIRECT = "redirect",
  ALLOW = "allow",
  UPGRADE_SCHEME = "upgradeScheme",
  MODIFY_HEADERS = "modifyHeaders",
  ALLOW_ALL_REQUESTS = "allowAllRequests",
}

export enum ResourceType {
  MAIN_FRAME = "main_frame",
  SUB_FRAME = "sub_frame",
  STYLESHEET = "stylesheet",
  SCRIPT = "script",
  IMAGE = "image",
  FONT = "font",
  OBJECT = "object",
  XMLHTTPREQUEST = "xmlhttprequest",
  PING = "ping",
  CSP_REPORT = "csp_report",
  MEDIA = "media",
  WEBSOCKET = "websocket",
  OTHER = "other",
}

interface NetRequestModifyHeaderInfo
  extends chrome.declarativeNetRequest.ModifyHeaderInfo {
  active: boolean;
  value: string;
}

export const NewNetRequestModifyHeaderInfo = (): NetRequestModifyHeaderInfo => {
  return {
    active: true,
    header: "",
    value: "",
    operation: HeaderOperation.SET,
  };
};

interface NetRequestRuleAction extends chrome.declarativeNetRequest.RuleAction {
  requestHeaders: NetRequestModifyHeaderInfo[];

  responseHeaders: NetRequestModifyHeaderInfo[];
}

interface NetRequestRule extends chrome.declarativeNetRequest.Rule {
  action: NetRequestRuleAction;
}

export interface RuleAppModel {
  document_id?: Nullable<DocumentID>;
  user_id: DocumentID;
  name: string;
  active: boolean;
  rule: NetRequestRule;
}

export interface RuleDBModel {
  user_id: DocumentReference<UserAppModel, UserDBModel>;
  name: string;
  active: boolean;
  rule: NetRequestRule;
}

class RuleConverter
  implements FirestoreDataConverter<RuleAppModel, RuleDBModel>
{
  private store: Firestore;

  constructor(store: Firestore) {
    this.store = store;
  }

  toFirestore(data: WithFieldValue<RuleAppModel>): WithFieldValue<RuleDBModel> {
    const userref = doc(this.store, `users/${data.user_id}`);

    return {
      ...data,
      user_id: userref,
    };
  }

  fromFirestore(
    snapshot: QueryDocumentSnapshot<RuleDBModel>,
    options?: SnapshotOptions,
  ) {
    const data = snapshot.data(options);

    return {
      ...data,
      document_id: snapshot.id,
      user_id: data.user_id.id,
    };
  }
}

export class RuleStorage {
  private store: Firestore;
  private path = "rules";

  private collectionRef: CollectionReference<
    RuleAppModel,
    WithFieldValue<RuleDBModel>
  >;

  constructor(store: Firestore) {
    this.store = store;
    this.collectionRef = collection(this.store, this.path).withConverter(
      new RuleConverter(store),
    );
  }

  getDocumentRef(id: DocumentID) {
    return doc(this.store, this.path, id).withConverter(
      new RuleConverter(this.store),
    );
  }

  async add(
    data: RuleAppModel,
  ): Promise<[Nullable<RuleAppModel>, Nullable<Error>]> {
    try {
      const docRef = await addDoc(this.collectionRef, data);

      return [
        {
          ...data,
          document_id: docRef.id,
        },
        null,
      ];
    } catch (error) {
      return [null, new Error()];
    }
  }

  async set(data: RuleAppModel): Promise<[Nullable<Error>]> {
    try {
      await setDoc(this.getDocumentRef(data.document_id!), data, {
        merge: true,
      });

      return [null];
    } catch (error) {
      return [new Error()];
    }
  }

  async get(
    id: DocumentID,
  ): Promise<[Nullable<RuleAppModel>, Nullable<Error>]> {
    try {
      const documentSnapshot = await getDoc(this.getDocumentRef(id));

      if (!documentSnapshot.exists()) {
        return [null, new Error("cannot find data")];
      }

      return [documentSnapshot.data(), null];
    } catch (error) {
      return [null, new Error()];
    }
  }

  async delete(id: DocumentID): Promise<[Nullable<Error>]> {
    try {
      await deleteDoc(this.getDocumentRef(id));

      return [null];
    } catch (error) {
      return [new Error("could not delete data")];
    }
  }

  async getAllByUserId(
    user_id: DocumentID,
  ): Promise<[Nullable<RuleAppModel[]>, Nullable<Error>]> {
    try {
      const userref = doc(this.store, `users/${user_id}`);
      const q = query(this.collectionRef, where("user_id", "==", userref));
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((doc) => doc.data());

      return [data, null];
    } catch (error) {
      return [null, new Error()];
    }
  }
}
