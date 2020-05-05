import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StatusBar,
  Image,
  StyleSheet,
  Button,
  Alert
} from 'react-native'
import {
  GoogleSigninButton,
  GoogleSignin,
  statusCodes
} from '@react-native-community/google-signin'
import { WEB_CLIENT_ID } from '../utils/keys'



function configureGoogleSign() {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      offlineAccess: false
    })
  }

  useEffect(() => {
    configureGoogleSign()
  }, [])


  async function signIn() {
    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()
      setUserInfo(userInfo)
      setError(null)
      setIsLoggedIn(true)
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // when user cancels sign in process,
        Alert.alert('Process Cancelled')
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // when in progress already
        Alert.alert('Process in progress')
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // when play services not available
        Alert.alert('Play services are not available')
      } else {
        // some other error
        Alert.alert('Something else went wrong... ', error.toString())
        setError(error)
      }
    }
  }

  async function getCurrentUserInfo() {
    try {
      const userInfo = await GoogleSignin.signInSilently()
      setUserInfo(userInfo)
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // when user hasn't signed in yet
        Alert.alert('Please Sign in')
        setIsLoggedIn(false)
      } else {
        Alert.alert('Something else went wrong... ', error.toString())
        setIsLoggedIn(false)
      }
    }
  }

  async function signOut() {
    try {
      await GoogleSignin.revokeAccess()
      await GoogleSignin.signOut()
      setIsLoggedIn(false)
    } catch (error) {
      Alert.alert('Something else went wrong... ', error.toString())
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    signInButton: {
      width: 192,
      height: 48
    }
  })

const Login = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userInfo, setUserInfo] = useState(null)
    const [error, setError] = useState(null)
    return (
        <>
          <StatusBar barStyle='dark-content' />
          <View style={styles.container}>
            <GoogleSigninButton
              style={styles.signInButton}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={() => signIn()}
            />
          </View>
        </>
      )
    
  }

  export default Login;


