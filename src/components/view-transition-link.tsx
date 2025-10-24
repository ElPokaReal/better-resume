'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ComponentProps, MouseEvent } from 'react';

type ViewTransitionLinkProps = ComponentProps<typeof Link>;

export function ViewTransitionLink({ 
  href, 
  children, 
  ...props 
}: ViewTransitionLinkProps) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Check if browser supports View Transitions API
    if ('startViewTransition' in document) {
      // @ts-ignore - View Transitions API
      document.startViewTransition(() => {
        router.push(href.toString());
      });
    } else {
      // Fallback for browsers that don't support View Transitions
      router.push(href.toString());
    }
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
