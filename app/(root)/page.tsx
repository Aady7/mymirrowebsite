import { redirect } from 'next/navigation';
import Homepage from './homepage/page';

export const metadata = {
    title: 'MyMirro - Fashion Styling',
    description: 'Personalised fashion styling and outfit recommendations'
};

export default function RootPage() {
    // This is a workaround to fix build issues
    // Instead of redirecting, we render the homepage component directly
    return <Homepage />;
}
