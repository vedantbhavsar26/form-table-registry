import Image from 'next/image';
import { registryUi } from '@/src/registry/registry-ui';
import Link from 'next/link';

export default function Home() {
  return (
    <div className={'grid gap-4'}>
      {registryUi.map((e) => (
        <Link href={`/r/${e.name}.json`} key={e.name}>
          {e.title}
        </Link>
      ))}
    </div>
  );
}
