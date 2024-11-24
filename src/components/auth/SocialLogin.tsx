import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../../lib/firebase';

export default function SocialLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);

      if (result?.user) {
        const userRef = doc(db, 'users', result.user.uid);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
          await setDoc(userRef, {
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
            provider: 'google',
            settings: {
              isPublic: true,
              emailNotifications: true,
              pushNotifications: true
            }
          });
        } else {
          await setDoc(userRef, {
            lastLoginAt: serverTimestamp()
          }, { merge: true });
        }

        toast.success('Connexion réussie !');
        navigate('/');
      }
    } catch (error) {
      console.error('Erreur de connexion Google:', error);
      if (error.code === 'auth/popup-blocked') {
        toast.error('Veuillez autoriser les popups pour ce site');
      } else if (error.code === 'auth/unauthorized-domain') {
        toast.error('Ce domaine n\'est pas autorisé pour la connexion Google');
      } else {
        toast.error('Échec de la connexion avec Google');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <img
          src="https://www.google.com/favicon.ico"
          alt="Google"
          className="h-5 w-5 mr-2"
        />
        {isLoading ? 'Connexion en cours...' : 'Continuer avec Google'}
      </button>
    </div>
  );
}