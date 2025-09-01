import { registryUi } from '@/src/registry/registry-ui';
import Link from 'next/link';
import { buttonVariants } from '@/components/form-field/ui/button';

export default function Home() {
  return (
    <div className={'grid gap-4 container mx-auto py-20 '}>
      <h2>List</h2>
      {registryUi.map((e) => (
        <Link
          href={`/r/${e.name}.json`}
          className={buttonVariants({ variant: 'default' })}
          key={e.name}
        >
          {e.title}
        </Link>
      ))}

      <Link href={'/form-field'} className={buttonVariants({ variant: 'default' })}>
        Form Field Example
      </Link>
    </div>
  );
}
