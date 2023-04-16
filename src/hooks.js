import { useEffect, useState, useRef } from "react";


export function useFirestoreQuery(query) {
  const [docs, setDocs] = useState([]);

  const queryRef = useRef(query);

  useEffect(() => {
    // 현재 쿼리로 동기화
    if (!queryRef?.current?.isEqual(query)){
      queryRef.current = query;
    }
  });

  // queryRef 바뀔때만 실행
  useEffect(() => {
    if (!queryRef.current) {
      return null;
    }

    const unsubscribe = queryRef.current.onSnapshot((querySnapshot) => {

      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setDocs(data);
    })
    return unsubscribe;
  }, [queryRef])
  return docs;
}


export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      // 해당 key값에 이미 있으면 있는값, 없으면 전달된 인수
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch(error) {
      console.log(error);
    }
  }
  return [storedValue, setValue];
}


export function useAuthState(auth) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(() => auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(false);
      }
      if (initializing) {
        setInitializing(false);
      }
    });

    // Cleanup subscription
    return unsubscribe;
  }, [auth, initializing]);

  return { user, initializing };
}
