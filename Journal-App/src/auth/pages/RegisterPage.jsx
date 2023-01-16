import { Link as RouterLink } from 'react-router-dom'
import { Grid, Typography, TextField, Button, Link, Alert } from "@mui/material"
import { AuthLayout } from '../layout/AuthLayout'
import { useForm } from '../../hooks'
import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { startCreatingUserWithEmailPassword } from '../../store/auth/thunks'

//esta es otra forma de pasarle los valores iniciales al useForm
const formData = {
    email: '',
    password: '',
    displayName: '',
}

//Esto es para hacer validaciones dinamicas y devuelve un mensaje de error personalizado para cada campo segun lo requiera.
//Esta constante es pasada al useForm que a traves de un useEffect evalua y devuelve si existe error, sino devolvera null
const formValidations = {
    email: [ (value) => value.includes('@'), 'El correo debe tener un @'],
    password: [ (value) => value.length >= 6, 'El password debe tener mas de 6 letras.'],
    displayName: [ (value) => value.length >= 1, 'El nombre es obligatorio.'],
}

export const RegisterPage = () => {
    //El sx es style pero te permite acceder a las propiedades que definiste con el AppTheme

    const dispatch = useDispatch();
    const [formSubmitted, setFormSubmitted] = useState(false);

    const { status, errorMessage } = useSelector( state => state.auth );
    const isCheckingAuthentication = useMemo( () => status === 'checking', [status]);

    const { displayName, email, password, onInputChange, formState, isFormValid, displayNameValid, emailValid, passwordValid} = useForm(formData, formValidations);

    const onSubmit = ( event ) => {
        event.preventDefault();
        setFormSubmitted(true)

        if ( !isFormValid ) return;

        dispatch( startCreatingUserWithEmailPassword(formState) )
    }

    return (
        <AuthLayout title="Registro">

            <form onSubmit={ onSubmit } className="animate__animated animate__fadeIn animate__faster" >
                <Grid container>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <TextField label="Nombre Completo" type="text" placeholder="Tu Nombre" fullWidth name="displayName" value={ displayName } onChange={ onInputChange } error={ !!displayNameValid && formSubmitted } helperText={ displayNameValid} />
                    </Grid>

                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <TextField label="Correo" type="email" placeholder="correo@gmail.com" fullWidth name="email" value={ email } onChange={ onInputChange } error={ !!emailValid && formSubmitted } helperText={ emailValid} />
                    </Grid>

                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <TextField label="Contraseña" type="password" placeholder="Contraseña" fullWidth name="password" value={ password } onChange={ onInputChange } error={ !!passwordValid && formSubmitted } helperText={ passwordValid} />
                    </Grid>

                    
                    <Grid item xs={12} sx={{ mt: 2 }} display={ !!errorMessage ? '' : 'none' }>
                        <Alert severity='error'>{ errorMessage }</Alert>
                    </Grid>
                   

                    <Grid container spacing={ 2 } sx={{ mb: 2, mt: 1 }}>
                        <Grid item xs={12}>
                            <Button disabled={ isCheckingAuthentication } type="submit" variant="contained" fullWidth>
                                Crear Cuenta
                            </Button>
                        </Grid>
                    </Grid>

                    <Grid container direction="row" justifyContent='end'>
                        <Typography sx={{ mr: 1 }}>Ya tienes cuenta?</Typography>
                        <Link component={ RouterLink } color="inherit" to="/auth/login">
                            Ingresar
                        </Link>
                    </Grid>
                </Grid>
            </form>
        </AuthLayout>
    )
}