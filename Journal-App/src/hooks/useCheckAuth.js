import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FirebaseAuth } from "../firebase/config";
import { login, logout } from "../store/auth/authSlice";
import { startLoadingNotes } from "../store/journal";

export const useCheckAuth = () => {
  //Asi verificamos si esta checkeando el usuario y mostramos un loading
  const { status } = useSelector( state => state.auth );
  const dispatch = useDispatch()

  useEffect(() => {
      onAuthStateChanged( FirebaseAuth, async (user) => {
          if (!user) return dispatch( logout() );

          const { uid, email, displayName, photoURL } = user;
          dispatch( login({ uid, email, displayName, photoURL }) );
          dispatch( startLoadingNotes() );
      })
  }, [])

  return {
    status
  }
}
