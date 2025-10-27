import { lazy } from 'react'
export const Home = lazy(() => import('@/pages/home/home'))
export const Profile = lazy(() => import('@/pages/profile/profile'))
export const Orders = lazy(() => import('@/pages/orders/orders'))
export const Vehicles = lazy(() => import('@/pages/vehicles/vehicles'))
export const AddVehicle = lazy(() => import('@/pages/vehicles/add-vehicle'))
export const Auth = lazy(()=>import('@/pages/auth/sign-in/sign-in'))
export const VerifyPhone = lazy(() => import('@/pages/auth/verify-phone/verify-phone'))
export const SetupProfile = lazy(() => import('@/pages/auth/setup-profile/setup-profile'))