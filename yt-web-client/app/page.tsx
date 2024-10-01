import Image from 'next/image';
import Link from 'next/link';
import { getVideos } from './firebase/functions';
import styles from './page.module.css'


export default async function Home() {
  const videos = await getVideos();

  return (
    <main>
      {
        videos.map((video) => (
          <div key={video.id}>
            <Link href={`/watch?v=${video.filename}`}>
              <Image src={'/thumbnail.png'} alt='video' width={120} height={80}
                className={styles.thumbnail}/>
            </Link>
            <h3>{video.title || 'Untitled Video'}</h3>
            <p>
              {video.description ? 
                (video.description.length > 100 ? 
                  video.description.substring(0, 97) + '...' : 
                  video.description
                ) : 
                'No description'
              }
            </p>
          </div>
        ))
      }
    </main>
  )
}
export const revalidate = 30;