import { GetStaticPaths, GetStaticProps } from "next"
import Link from 'next/link';
import Head from "next/head";
import { RichText } from "prismic-dom";
import { getPrismicClient } from "../../../services/prismic";

import styles from '../post.module.scss';
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
}

export default function PostPreview({post}:PostPreviewProps) {

  const [session] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push(`/posts/${post.slug}`);
    }
  }, [session])

  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          {/* prismic impede a injeção de scripts então a div com o
          atributo abaixo se torna seguro de usar  */}
          <div
            className={`${styles.postContent} ${styles.previewContent}`} 
            dangerouslySetInnerHTML={{__html: post.content}} 
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a href="">Subscribe now 🤗</a>
            </Link>  
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    //  paths: quais posts precisam ser gerados de forma estática durante a build
    paths: [
      // { params: { slug: 'Mapas com React usando Leaflet' } }
    ],

    /* fallback: true → quando a página é requisitada mas ainda não foi gerada estaticamente 
    então ela é carregada no browser.

    fallback: false →  quando a página é requisitada mas ainda não foi gerada estaticamente 
    então  é retornado um erro no browser (error 404).

    fallback: blocking →  quando a página é requisitada mas ainda não foi gerada estaticamente 
    então ela é carregada no servidor node do nextJs pela função getStaticProps */

    fallback: 'blocking' // true, false and blocking
  }
}

export const getStaticProps: GetStaticProps = async ({params}) => {

  const {slug} = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('publication', String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0,3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })

  }

  return {
    props: {
      post
    },
    revalidate: 60 * 30, // 30 minutes
  }
}