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

export interface EnvVar {
  name: string;
  value: string;
}

export const NewEnvVar = (envVar?: Partial<EnvVar>) => {
  return {
    name: envVar?.name || "",
    value: envVar?.value || "",
  };
};

export const getVarsKV = (vars: EnvVar[] = []) => {
  return vars.reduce((a, b) => {
    return {
      ...a,
      [b.name]: b.value,
    };
  }, {});
};

export interface EnvironmentAppModel {
  document_id?: Nullable<DocumentID>;
  user_id: DocumentID;
  name: string;
  vars?: EnvVar[];
}

export interface EnvironmentDBModel {
  user_id: DocumentReference<UserAppModel, UserDBModel>;
  name: string;
  vars?: EnvVar[];
}

class EnvironmentConverter
  implements FirestoreDataConverter<EnvironmentAppModel, EnvironmentDBModel>
{
  private store: Firestore;

  constructor(store: Firestore) {
    this.store = store;
  }

  toFirestore(
    data: WithFieldValue<EnvironmentAppModel>,
  ): WithFieldValue<EnvironmentDBModel> {
    const userref = doc(this.store, `users/${data.user_id}`);

    return {
      ...data,
      user_id: userref,
    };
  }

  fromFirestore(
    snapshot: QueryDocumentSnapshot<EnvironmentDBModel>,
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

export class EnvironmentStorage {
  private store: Firestore;
  private path = "environments";

  private collectionRef: CollectionReference<
    EnvironmentAppModel,
    WithFieldValue<EnvironmentDBModel>
  >;

  constructor(store: Firestore) {
    this.store = store;
    this.collectionRef = collection(this.store, this.path).withConverter(
      new EnvironmentConverter(store),
    );
  }

  getDocumentRef(id: DocumentID) {
    return doc(this.store, this.path, id).withConverter(
      new EnvironmentConverter(this.store),
    );
  }

  async add(
    data: EnvironmentAppModel,
  ): Promise<[Nullable<EnvironmentAppModel>, Nullable<Error>]> {
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

  async set(data: EnvironmentAppModel): Promise<[Nullable<Error>]> {
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
  ): Promise<[Nullable<EnvironmentAppModel>, Nullable<Error>]> {
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
  ): Promise<[Nullable<EnvironmentAppModel[]>, Nullable<Error>]> {
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
