import {
  CollectionReference,
  DocumentReference,
  Firestore,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { Nullable } from "../types/nullable";
import { DocumentID } from "../types/firestore";
import { EnvironmentAppModel, EnvironmentDBModel } from "./environment.storage";

export interface UserAppModel {
  document_id?: Nullable<DocumentID>;
  email?: Nullable<string>;
  active_env_id?: Nullable<DocumentID>;
}

export interface UserDBModel {
  email?: Nullable<string>;
  active_env_id?: Nullable<
    DocumentReference<EnvironmentAppModel, EnvironmentDBModel>
  >;
}

class UserConverter
  implements FirestoreDataConverter<UserAppModel, UserDBModel>
{
  private store: Firestore;

  constructor(store: Firestore) {
    this.store = store;
  }

  toFirestore(data: WithFieldValue<UserAppModel>): WithFieldValue<UserDBModel> {
    const envref = doc(this.store, `environments/${data.active_env_id}`);

    return {
      email: data.email,
      active_env_id:
        data.active_env_id === null || data.active_env_id === undefined
          ? data.active_env_id
          : envref,
    };
  }

  fromFirestore(
    snapshot: QueryDocumentSnapshot<UserDBModel>,
    options?: SnapshotOptions,
  ) {
    const data = snapshot.data(options);

    return {
      ...data,
      active_env_id: data.active_env_id?.id,
      document_id: snapshot.id,
    };
  }
}

export class UserStorage {
  private store: Firestore;
  private path = "users";

  private collectionRef: CollectionReference<
    UserAppModel,
    WithFieldValue<UserDBModel>
  >;

  constructor(store: Firestore) {
    this.store = store;
    this.collectionRef = collection(this.store, this.path).withConverter(
      new UserConverter(store),
    );
  }

  getDocumentRef(id: DocumentID) {
    return doc(this.store, this.path, id).withConverter(
      new UserConverter(this.store),
    );
  }

  async add(
    data: UserAppModel,
  ): Promise<[Nullable<UserAppModel>, Nullable<Error>]> {
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

  async get(
    id: DocumentID,
  ): Promise<[Nullable<UserAppModel>, Nullable<Error>]> {
    try {
      const documentSnapshot = await getDoc(this.getDocumentRef(id));

      if (!documentSnapshot.exists()) {
        return [null, new Error("user does not exist")];
      }

      return [documentSnapshot.data(), null];
    } catch (error) {
      return [null, new Error()];
    }
  }

  async set(data: UserAppModel): Promise<[Nullable<Error>]> {
    try {
      await setDoc(this.getDocumentRef(data.document_id!), data, {
        merge: true,
      });

      return [null];
    } catch (error) {
      return [new Error()];
    }
  }
}
