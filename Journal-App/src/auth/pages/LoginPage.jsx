import { useMemo } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Google } from "@mui/icons-material"
import { Grid, Typography, TextField, Button, Link, Alert } from "@mui/material"
import { AuthLayout } from '../layout/AuthLayout'
import { useForm } from '../../hooks'
import { useDispatch, useSelector } from 'react-redux'
import { startGoogleSignIn, startLoginWithEmailPassword } from '../../store/auth/thunks'

//Es necesario hacer esto ya que al agregar el useEffect para que se refresquen las notas si esto queda dentro del useForm se quedara disparando constantemente el useEffect
const formData = {
    email: '',
    password: ''  
}


export const LoginPage = () => {
    //El sx es style pero te permite acceder a las propiedades que definiste con el AppTheme

    //Funcion que te permite verificar los status
    const { status, errorMessage } = useSelector( state => state.auth )

    const dispatch = useDispatch();
    const { email, password, onInputChange } = useForm(formData);

    const isAuthenticated = useMemo( () => status === 'checking', [status])

    const onSubmit = ( event ) => {
        event.preventDefault();

        dispatch( startLoginWithEmailPassword({ email, password }) );
    }

    const onGoogleSignIn = () => {
        console.log('OnGoogleSignIn')
        dispatch( startGoogleSignIn() );
    }

    return (
        <AuthLayout title="Login">
            <form onSubmit={ onSubmit } className="animate__animated animate__fadeIn animate__faster" >
                <Grid container>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <TextField label="Correo" type="email" placeholder="correo@gmail.com" fullWidth name="email" value={ email } onChange={ onInputChange } />
                    </Grid>

                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <TextField label="Contraseña" type="password" placeholder="Contraseña" fullWidth name="password" value={ password } onChange={ onInputChange } />
                    </Grid>

                    <Grid item xs={12} sx={{ mt: 2 }} display={ !!errorMessage ? '' : 'none' }>
                        <Alert severity='error'>{ errorMessage }</Alert>
                    </Grid>

                    <Grid container spacing={ 2 } sx={{ mb: 2, mt: 1 }}>
                        <Grid item xs={12} sm={ 6 }>
                            <Button disabled={ isAuthenticated } type="submit" variant="contained" fullWidth>
                                Login
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={ 6 }>
                            <Button disabled={ isAuthenticated } variant="contained" fullWidth onClick={ onGoogleSignIn }>
                                <Google />
                                <Typography sx={{ ml : 1 }}>Google</Typography>
                            </Button>
                        </Grid>
                    </Grid>

                    <Grid container direction="row" justifyContent='end'>
                        <Link component={ RouterLink } color="inherit" to="/auth/register">
                            Crear una cuenta
                        </Link>
                    </Grid>
                </Grid>
            </form>
        </AuthLayout>
    )
}