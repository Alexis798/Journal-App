import { useEffect, useMemo, useState } from 'react';

export const useForm = ( initialForm = {}, formValidations = {} ) => {
  
    const [ formState, setFormState ] = useState( initialForm );
    const [ formValidation, setFormValidation ] = useState({})

    useEffect(() => {
        createValidators()
    }, [ formState ])

    //Ya con este effect pasa de ser un input general a ser uno especializado para esta application
    //ya que va a cambiar cuando las notas cambien
    useEffect(() => {
        setFormState( initialForm );
    }, [ initialForm ])

    const isFormValid = useMemo( () => {
        
        //Barre los objetos del formValidation
       for (const formValue of Object.keys( formValidation )) {
            if ( formValidation[formValue] !== null ) return false;
       }

       return true

    }, [ formValidation ])

    const onInputChange = ({ target }) => {
        const { name, value } = target;
        setFormState({
            ...formState,
            [ name ]: value
        });
    }

    const onResetForm = () => {
        setFormState( initialForm );
    }

    //Esta funcion se ejecuta cada vez que el usuario interactua con el formulario
    const createValidators = () => {

        const formCheckedValue = {};

        //For que barre todos los objetos recibidos por el formValidations
        for (const formField of Object.keys( formValidations )) {

            //constante que captura el fn (barrido de cada objeto en for), errorMessage de los campos
            const [ fn, errorMessage ] = formValidations[ formField ];

            //creamos una variable computada que se llame con el nombre y Valid y ahora evaluamos si cumple la condicion y devolver el errorMessage en caso de ser necesario
            formCheckedValue[`${ formField }Valid`] = fn( formState[formField] ) ? null : errorMessage
        }

        setFormValidation( formCheckedValue );

    }

    return {
        ...formState,
        formState,
        onInputChange,
        onResetForm,

        ...formValidation,
        isFormValid,
    }
}