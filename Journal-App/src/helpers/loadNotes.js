import { collection, getDocs } from "firebase/firestore/lite";
import { FirebaseDB } from "../firebase/config";

export const loadNotes = async( uid = '' ) => {
    if( !uid ) throw new Error('El UID del usuario no existe');

    //Aca comenzaremos a pedir los documentos, hacer el Select si estuvieramos en sql
    const collectionRef = collection( FirebaseDB, `${ uid }/journal/notes` );
    const docs = await getDocs(collectionRef);

    //asi podemos crear el array con la informacion que nos trae, el doc.data() es la funcion que necesitamos
    //para traer la data que nosotros hemos creado y almacenado en la base de datos de firestore
    // hacemos ...doc.data() para traer toda la informacion sin necesidad de escribir cada objeto
    const notes = [];
    docs.forEach( doc => {
        notes.push({ id: doc.id, ...doc.data()})
    })

    console.log(notes)
    return notes;
}