import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to our actual homepage in the (root) directory
  redirect('/');
}
