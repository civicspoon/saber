import React, { Suspense } from 'react';
import Head from 'next/head'; // Import Head from next/head
import ClientComponent from './ClientComponent';

export default function Page() {
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <ClientComponent />
            </Suspense>
        </>
    );
}
