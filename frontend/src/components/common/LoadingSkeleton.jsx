export function LoadingSkeleton({ count = 1, className }) {
    return (
        <>
            {Array(count).fill(0).map((_, i) => (
                <div key={i} className={`animate-pulse bg-gray-200 rounded ${className}`} />
            ))}
        </>
    );
}
