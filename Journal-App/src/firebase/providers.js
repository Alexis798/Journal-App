import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { FirebaseAuth } from "./config";

const googleProvider = new GoogleAuthProvider()

//Este export es para loguearse desde google
export const singInWithGoogle = async () => {
    try {

        //Este es igual para todas las herramientas que uses para autenticacion, primero habilitada desde Firebase Console Authentication
        //Sirve para facebook, twitter y todas las opciones que ofrece google

        //La siguiente linea que esta comentada sirve para verificar que se esta cumpliendo la funcion, devuelve crendeciales
        //const credentials = GoogleAuthProvider.credentialFromResult( result );
        //console.log({credentials})

        const result = await signInWithPopup( FirebaseAuth, googleProvider );
        const { displayName, email, photoURL, uid } = result.user;

        return {
            ok: true,
            // User Info
            displayName, email, photoURL, uid
        }

    } catch (error) {

        const errorCode = error.code;
        const errorMessage = error.message;


        return {
            ok: false,
            errorMessage,
        }
    }
}

//este export es para registrarse desde google
export const registerUserWithEmailPassword = async({ email, password, displayName }) => {
    try {

        //En firebase primero creamos el email y password
        const resp = await createUserWithEmailAndPassword( FirebaseAuth, email, password );
        const { uid, photoURL } = resp.user;

        //Y luego actualizamos el perfil para registrar el nombre
        await updateProfile( FirebaseAuth.currentUser, { displayName })

        return { ok: true, uid, photoURL, email, displayName }

    } catch (error) {

        return { ok: false, errorMessage: error.message }
    }
}

//este export es para loguearte desde google con un correo no desde el boton google
export const loginWithEmailPassword = async({ email, password }) => {
    try {
        const resp = await signInWithEmailAndPassword( FirebaseAuth, email, password );
        const { uid, photoURL, displayName } = resp.user;

        return { ok: true, uid, photoURL, displayName}

    } catch (error) {
        return { ok: false, errorMessage: error.message }
    }
}

//Este export es para logout el usuario desde cualquier usuario, es decir correo, google, facebook, twitter,
export const logoutFirebase = async() => {

    return await FirebaseAuth.signOut();

}

