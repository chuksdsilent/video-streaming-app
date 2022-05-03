import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { ReactElement } from 'react'
import Homepage from '../layout/Homepage'
import styles from '../styles/Home.module.css'

const Home = () => {
  return (
    <div className={styles.container}>
       return <div className={styles.container}></div>

    </div>
  )
}

Home.getLayout = function (page: ReactElement){
  return <Homepage>{page}</Homepage>
}

export default Home
