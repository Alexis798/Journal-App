import { async } from '@firebase/util';
import { collection, deleteDoc, doc, setDoc } from 'firebase/firestore/lite'
import { FirebaseDB } from '../../firebase/config';
import { fileUpload, loadNotes } from '../../helpers';
import { addNewEmptyNote, deleteNoteById, savingNewNote, setActiveNote, setNotes, setPhotosToActiveNote, setSaving, updateNote } from './journalSlice';

export const startNewNote = () => {
    //Vamos a usar getState para capturar el id del usuario, esto se puede hacer sin
    //pasar los argumentos por la funcion porque ambos estan en el mismo store y tienen acceso
    //a sus estados.
    return async ( dispatch, getState ) => {

        dispatch( savingNewNote() )

        const { uid } = getState().auth;

        const newNote = {
            title: '',
            body: '',
            date: new Date().getTime(),
            imageUrls: [],
        }

        //configuracion para acceder a la base de datos de Firebase, Firestore y le idicamos la ruta dentro de la base de datos,
        //se puede escribir como una ruta pues esta base de datos es noSql
        const newDoc = doc( collection( FirebaseDB, `${ uid }/journal/notes` ));

        //aca para insertar pide la referencia es decir la ruta en la que va a almacenarlo y el objeto que va a almacenar
        const setDocResp = await setDoc( newDoc, newNote );

        //Pasamos el id
        newNote.id = newDoc.id

        dispatch( addNewEmptyNote( newNote ) );
        dispatch( setActiveNote( newNote ) );

    }
}

export const startLoadingNotes = () => {
    return async( dispatch, getState ) => {
        
        const { uid } = getState().auth;
        if( !uid ) throw new Error('El UID del usuario no existe');

        const notes = await loadNotes( uid );
        dispatch( setNotes( notes ) );
    }
}

export const startSaveNote = () => {
    return async( dispatch, getState ) => {

        dispatch( setSaving() );
        
        const { uid } = getState().auth;
        const { active:note } = getState().journal

        const noteToFireStore = { ...note };
        //esto no es una propiedad de firestore, solo necesitamos eliminar el id para crear correctamente la ruta
        delete noteToFireStore.id

        const docRef = doc( FirebaseDB, `${ uid }/journal/notes/${ note.id }`);
        await setDoc( docRef, noteToFireStore, { merge: true } );

        dispatch( updateNote( note ) );
    }
}

export const startUploadingFiles = ( files = [] ) => {
    return async( dispatch ) => {
        dispatch( setSaving() );

        //esta funcion permite subir un solo archivo
        //await fileUpload( files[0] );

        //ahora esta funcion permite subir cuanta cantidad de archivo el usuario haya pasado
        //de manera simultanea no en secuencia y cuando esta lista devuelve la respuesta
        const fileUploadPromises = [];
        for ( const file of files ) {
            fileUploadPromises.push(fileUpload( file ))
        }

        const photosUrls = await Promise.all( fileUploadPromises );

        dispatch( setPhotosToActiveNote( photosUrls ) );


    }
}

export const startDeletingNote = () => {
    return async( dispatch, getState ) => {
        
        
        const { uid } = getState().auth;
        const { active: note } = getState().journal

        //Esta es la funcion para borrar en la base de datos de Firebase
        const docRef = doc( FirebaseDB, `${ uid }/journal/notes/${ note.id }`)
        await deleteDoc( docRef );

        dispatch( deleteNoteById(note.id) );
        
    }
}