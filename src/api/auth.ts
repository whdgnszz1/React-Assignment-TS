import { auth, db } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { RegisterUserReqDTO } from './dtos/authDTO';
import { UserDTO } from '@/types/authType';

export const registerUserAPI = async ({
  email,
  password,
  name,
}: RegisterUserReqDTO): Promise<UserDTO> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  await updateProfile(user, { displayName: name });

  await setDoc(doc(db, 'users', user.uid), {
    name,
    email,
  });

  return {
    uid: user.uid,
    email: user.email!,
    displayName: name,
  };
};
