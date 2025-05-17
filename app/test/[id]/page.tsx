export default function TestPage({ params }: { params: { id: string } }) {
    return <div>Test page ID: {params.id}</div>
} 